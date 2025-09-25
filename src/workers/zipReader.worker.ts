/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */

//
// src/workers/zipReader.worker.ts
//
// Refactor: introduce a generic async BytesProvider abstraction so we can
// plug in different backing sources (Buffer, Blob/File, HTTP→buffer, future
// SendSafely, IndexedDB, etc.) without changing ZIP logic.
//
// Public API kept as before (minus readFile, per your request):
//  - postMessage({ type: 'initialize', id, buffer? | file? | url? })
//  - postMessage({ type: 'getEntries', id })
//  - postMessage({ type: 'readFileChunked', id, path, chunkSize? })
//
// Responses:
//  - { type: 'initializeComplete', id }
//  - { type: 'getEntriesComplete', id, entries }
//  - { type: 'readFileChunk', id, path, bytes, done }
//  - { type: 'error', id, error }
//
// Modern browsers only (uses DecompressionStream('deflate-raw')).
//

// -------------------- BytesProvider Abstraction --------------------

/**
 * Minimal async random-access interface for reading file bytes.
 * All offsets and lengths are in bytes.
 */
interface BytesProvider {
  readonly kind: 'buffer' | 'blob' | 'http-buffer' | 'custom';
  size(): number;
  read(start: number, length: number): Promise<Uint8Array>;
}

/** Backed by a Uint8Array already in memory. */
class BufferProvider implements BytesProvider {
  readonly kind = 'buffer' as const;
  private buf: Uint8Array;
  constructor(buf: Uint8Array) {
    this.buf = buf;
  }
  size(): number {
    return this.buf.byteLength;
  }
  async read(start: number, length: number): Promise<Uint8Array> {
    const end = Math.min(start + length, this.buf.byteLength);
    if (start < 0 || start >= end) return new Uint8Array(0);
    return this.buf.subarray(start, end);
  }
}

/** Backed by a Blob/File; uses Blob#slice + arrayBuffer(). */
class BlobProvider implements BytesProvider {
  readonly kind = 'blob' as const;
  private blob: Blob;
  constructor(blob: Blob) {
    this.blob = blob;
  }
  size(): number {
    return this.blob.size;
  }
  async read(start: number, length: number): Promise<Uint8Array> {
    const end = Math.min(start + length, this.blob.size);
    if (start < 0 || start >= end) return new Uint8Array(0);
    const ab = await this.blob.slice(start, end).arrayBuffer();
    return new Uint8Array(ab);
  }
}

/** Demo-only: fetch a URL once → memory buffer. */
class HttpBufferProvider implements BytesProvider {
  readonly kind = 'http-buffer' as const;
  private buf: Uint8Array;
  constructor(buf: Uint8Array) {
    this.buf = buf;
  }
  size(): number {
    return this.buf.byteLength;
  }
  async read(start: number, length: number): Promise<Uint8Array> {
    const end = Math.min(start + length, this.buf.byteLength);
    if (start < 0 || start >= end) return new Uint8Array(0);
    return this.buf.subarray(start, end);
  }
}

// -------------------- Public message types (stable) --------------------

type InitFromSourceMsg = {
  type: 'initialize';
  id: string;
  buffer?: ArrayBuffer;
  file?: File;
  url?: string; // demo path: fetch to memory once
};

type GetEntriesMsg = { type: 'getEntries'; id: string };

type ReadFileChunkedMsg = {
  type: 'readFileChunked';
  id: string;
  path: string;         // entry path as returned by getEntries
  chunkSize?: number;   // post-decompression chunk size (default ~256KB)
  to?: string;          // for routing support
  from?: string;        // for routing support
};

// Responses
type ErrorResp = { type: 'error'; id: string; error: string };
type InitializeComplete = { type: 'initializeComplete'; id: string };
type GetEntriesComplete = { type: 'getEntriesComplete'; id: string; entries: ZipEntryMeta[] };
type ReadFileChunk = { type: 'readFileChunk'; id: string; path: string; bytes: Uint8Array; done: boolean };

// -------------------- Entry types --------------------

type ZipEntryMeta = {
  id: string;            // stable id (we use the path)
  name: string;
  path: string;
  size: number;          // uncompressed
  compressedSize: number;
  isDir: boolean;
};

// Internal representation (holds offsets needed to stream)
type ZipEntryInternal = {
  path: string;
  name: string;
  isDir: boolean;
  method: number;        // 0=Stored, 8=Deflate
  flags: number;
  compressedSize: number;
  uncompressedSize: number;
  localHeaderOffset: number;
  dataStart?: number;    // computed from local header on demand
};

// -------------------- Worker state --------------------

const state: {
  provider: BytesProvider | null;
  fileSize: number;
  entries: ZipEntryInternal[] | null;
  entriesByPath: Map<string, ZipEntryInternal>;
  // Only for demo HTTP source: some zips use renamed_ paths.
  renamedMode: boolean;
  sourceKind: BytesProvider['kind'] | null;
} = {
  provider: null,
  fileSize: 0,
  entries: null,
  entriesByPath: new Map(),
  renamedMode: false,
  sourceKind: null,
};

// -------------------- ZIP parsing helpers --------------------

const SIG = {
  EOCD: 0x06054b50,
  ZIP64_EOCD_LOC: 0x07064b50,
  ZIP64_EOCD: 0x06064b50,
  CEN: 0x02014b50,
  LFH: 0x04034b50,
};

function dv(u8: Uint8Array) {
  return new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
}

function findEOCD(tail: Uint8Array): number {
  const view = dv(tail);
  // EOCD minimum size = 22 bytes
  for (let i = tail.length - 22; i >= 0; i--) {
    if (view.getUint32(i, true) === SIG.EOCD) return i;
  }
  return -1;
}

function readUInt64LE(view: DataView, off: number): number {
  const lo = view.getUint32(off, true);
  const hi = view.getUint32(off + 4, true);
  return hi * 2 ** 32 + lo;
}

type CDLocator = { cdOffset: number; cdSize: number; totalEntries: number };

function parseCentralDirectoryLocator(
  tail: Uint8Array,
  _fileSize: number,
  tailStart: number
): CDLocator {
  const view = dv(tail);
  const eocd = findEOCD(tail);
  if (eocd >= 0) {
    const totalEntries = view.getUint16(eocd + 10, true);
    const cdSize = view.getUint32(eocd + 12, true);
    const cdOffset = view.getUint32(eocd + 16, true);

    // If any 32-bit sentinel values are present, resolve via ZIP64 records.
    const needZip64 =
      totalEntries === 0xffff ||
      cdSize === 0xffffffff ||
      cdOffset === 0xffffffff;

    if (!needZip64) {
      return { cdOffset, cdSize, totalEntries };
    }

    // Search for ZIP64 EOCD Locator in the tail region
    for (let i = eocd - 20; i >= 0; i--) {
      if (view.getUint32(i, true) === SIG.ZIP64_EOCD_LOC) {
        const zip64EOCDOffset = readUInt64LE(view, i + 8);
        // Position within our tail buffer
        const abs = zip64EOCDOffset - tailStart;
        if (
          abs >= 0 &&
          abs + 56 <= tail.byteLength &&
          view.getUint32(abs, true) === SIG.ZIP64_EOCD
        ) {
          const total64 = readUInt64LE(view, abs + 24);
          const cdSize64 = readUInt64LE(view, abs + 32);
          const cdOffset64 = readUInt64LE(view, abs + 40);
          return {
            cdOffset: cdOffset64,
            cdSize: cdSize64,
            totalEntries: total64,
          };
        }
        break;
      }
    }

    // Fallback to 32-bit if ZIP64 locator not found
    return { cdOffset, cdSize, totalEntries };
  }
  throw new Error('EOCD not found; file may not be a ZIP or tail window too small');
}

function parseCentralDirectory(buf: Uint8Array): ZipEntryInternal[] {
  const view = dv(buf);
  const out: ZipEntryInternal[] = [];
  let off = 0;

  while (off + 46 <= buf.length) {
    const sig = view.getUint32(off, true);
    if (sig !== SIG.CEN) break;

    const flags = view.getUint16(off + 8, true);
    const method = view.getUint16(off + 10, true);
    const compSize = view.getUint32(off + 20, true);
    const uncompSize = view.getUint32(off + 24, true);
    const nameLen = view.getUint16(off + 28, true);
    const extraLen = view.getUint16(off + 30, true);
    const commentLen = view.getUint16(off + 32, true);
    const lfhOffset = view.getUint32(off + 42, true);

    const nameBytes = buf.subarray(off + 46, off + 46 + nameLen);
    const path = new TextDecoder().decode(nameBytes);
    const isDir = path.endsWith('/') || path.endsWith('\\');

    out.push({
      path,
      name: path.replace(/[/\\]$/, '').split(/[/\\]/).pop() || path,
      isDir,
      method,
      flags,
      compressedSize: compSize >>> 0,
      uncompressedSize: uncompSize >>> 0,
      localHeaderOffset: lfhOffset >>> 0,
    });

    off += 46 + nameLen + extraLen + commentLen;
  }
  return out;
}

function parseLocalHeaderForDataStart(
  lfh: Uint8Array,
  lfhGlobalOffset: number
): { dataStart: number; method: number } {
  const view = dv(lfh);
  if (view.getUint32(0, true) !== SIG.LFH) {
    throw new Error('Invalid local file header');
  }
  const method = view.getUint16(8, true);
  const nameLen = view.getUint16(26, true);
  const extraLen = view.getUint16(28, true);
  const dataStart = lfhGlobalOffset + 30 + nameLen + extraLen;
  return { dataStart, method };
}

// -------------------- Utility helpers --------------------

function toMeta(e: ZipEntryInternal): ZipEntryMeta {
  return {
    id: e.path,
    name: e.name,
    path: e.path,
    size: e.uncompressedSize,
    compressedSize: e.compressedSize,
    isDir: e.isDir,
  };
}

function okMessage<T extends object>(m: T) {
  // @ts-ignore
  (self as any).postMessage(m);
}

function errMessage(id: string, error: unknown) {
  const msg = error instanceof Error ? error.message : String(error);
  okMessage<ErrorResp>({ type: 'error', id, error: msg });
}

// Wrap provider bytes into a ReadableStream by fetching in windows.
function makeRangeStream(
  provider: BytesProvider,
  start: number,
  length: number,
  windowSize = 1024 * 1024 // 1MB reads
): ReadableStream<Uint8Array> {
  let sent = 0;
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (sent >= length) {
        controller.close();
        return;
      }
      const toRead = Math.min(windowSize, length - sent);
      try {
        const part = await provider.read(start + sent, toRead);
        if (part.byteLength === 0) {
          controller.close();
          return;
        }
        controller.enqueue(part);
        sent += part.byteLength;
      } catch (e) {
        controller.error(e);
      }
    },
  });
}

async function chunkAndEmit(
  buf: Uint8Array,
  outSize: number,
  emit: (b: Uint8Array, done: boolean) => void
) {
  let i = 0;
  while (i < buf.byteLength) {
    const j = Math.min(i + outSize, buf.byteLength);
    emit(buf.subarray(i, j), false);
    i = j;
  }
}

// Compute and cache `dataStart` for an entry using the provider.
async function computeDataStart(provider: BytesProvider, entry: ZipEntryInternal): Promise<number> {
  if (entry.dataStart != null) return entry.dataStart;
  // Read a small window around the LFH (64KB is more than enough)
  const lfhBuf = await provider.read(entry.localHeaderOffset, 64 * 1024);
  const { dataStart } = parseLocalHeaderForDataStart(lfhBuf, entry.localHeaderOffset);
  entry.dataStart = dataStart;
  return dataStart;
}

// -------------------- Loaders --------------------

async function loadFromProvider(id: string, provider: BytesProvider, isDemoHttp = false) {
  state.provider = provider;
  state.sourceKind = provider.kind;
  state.fileSize = provider.size();
  state.entries = null;
  state.entriesByPath.clear();
  state.renamedMode = false;

  // 1) Tail window → EOCD(/ZIP64) → central directory location
  const tailLen = Math.min(1024 * 1024, state.fileSize); // 1MB
  const tailStart = state.fileSize - tailLen;
  const tail = await provider.read(tailStart, tailLen);
  const { cdOffset, cdSize } = parseCentralDirectoryLocator(tail, state.fileSize, tailStart);

  // 2) Read central directory
  const central = await provider.read(cdOffset, cdSize);
  const entries = parseCentralDirectory(central);

  // 3) Demo-only renamed_ quirk (HTTP demo source only)
  state.renamedMode = isDemoHttp && entries.length > 0 && entries.every(e => e.path.startsWith('renamed_'));

  // 4) Index entries
  state.entries = entries;
  state.entriesByPath.clear();
  for (const e of entries) state.entriesByPath.set(e.path, e);

  okMessage<InitializeComplete>({ type: 'initializeComplete', id });
}

async function loadFromMessage(msg: InitFromSourceMsg) {
  const { id, buffer, file, url } = msg;

  if (buffer) {
    const provider = new BufferProvider(new Uint8Array(buffer));
    await loadFromProvider(id, provider, /*isDemoHttp*/ false);
    return;
  }

  if (file) {
    const provider = new BlobProvider(file);
    await loadFromProvider(id, provider, /*isDemoHttp*/ false);
    return;
  }

  if (url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
    const arr = new Uint8Array(await r.arrayBuffer());
    const provider = new HttpBufferProvider(arr);
    await loadFromProvider(id, provider, /*isDemoHttp*/ true);
    return;
  }

  throw new Error('No buffer, file, or url provided to initialize');
}

// -------------------- Public ops --------------------

async function onGetEntries(msg: GetEntriesMsg) {
  const { id } = msg;
  try {
    if (!state.entries) throw new Error('Archive not initialized');
    const metas = state.entries.map(toMeta);
    okMessage<GetEntriesComplete>({ type: 'getEntriesComplete', id, entries: metas });
  } catch (e) {
    errMessage(id, e);
  }
}

async function onReadFileChunked(msg: ReadFileChunkedMsg) {
  const { id, path } = msg;
  const chunkOutSize = msg.chunkSize ?? 256 * 1024;

  // Check if this is a routed message (has 'from' field)
  const isRouted = 'from' in msg && msg.from;
  const routingInfo = isRouted ? { to: msg.from, from: 'zipWorker' } : {};

  const emit = (bytes: Uint8Array, done: boolean) => {
    okMessage<ReadFileChunk & { to?: string; from?: string }>({
      type: 'readFileChunk',
      id,
      path,
      bytes,
      done,
      ...routingInfo
    });
  };

  try {
    if (!state.provider || !state.entries) throw new Error('Archive not initialized');

    // Lookup entry (support demo renamed_ quirk ONLY for http-buffer)
    let entry = state.entriesByPath.get(path);
    if (!entry && state.sourceKind === 'http-buffer' && state.renamedMode) {
      entry = state.entriesByPath.get(`renamed_${path}`);
    }
    if (!entry) throw new Error(`Entry not found: ${path}`);
    if (entry.isDir) throw new Error('Cannot read a directory');

    const provider = state.provider;
    const dataStart = await computeDataStart(provider, entry);
    const compSize = entry.compressedSize;

    // Build a stream of *compressed* bytes via the provider
    const compStream = makeRangeStream(provider, dataStart, compSize);

    if (entry.method === 0 /* Stored */) {
      const reader = compStream.getReader();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) await chunkAndEmit(value as Uint8Array, chunkOutSize, emit);
      }
      emit(new Uint8Array(0), true);
      return;
    }

    if (entry.method === 8 /* Deflate */) {
      const Decomp: any = (globalThis as any).DecompressionStream;
      if (typeof Decomp !== 'function') {
        throw new Error('DecompressionStream API not available in this environment');
      }
      const plainStream = compStream.pipeThrough(new Decomp('deflate-raw'));
      const reader = plainStream.getReader();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) await chunkAndEmit(value as Uint8Array, chunkOutSize, emit);
      }
      emit(new Uint8Array(0), true);
      return;
    }

    throw new Error(`Unsupported compression method: ${entry.method}`);
  } catch (e) {
    errMessage(id, e);
  }
}

// -------------------- Dispatch --------------------

type InMsg = InitFromSourceMsg | GetEntriesMsg | ReadFileChunkedMsg;

self.addEventListener('message', (ev: MessageEvent<InMsg>) => {
  const msg = ev.data;
  switch (msg.type) {
    case 'initialize':
      void loadFromMessage(msg);
      break;
    case 'getEntries':
      void onGetEntries(msg);
      break;
    case 'readFileChunked':
      void onReadFileChunked(msg);
      break;
    default: {
      const id = (msg as any).id ?? 'unknown';
      okMessage<ErrorResp>({ type: 'error', id, error: `Unknown message type: ${(msg as any).type}` });
    }
  }
});
