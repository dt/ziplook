// Test SendSafely import
import {
  createSendSafelyClient,
  SendSafelyClient,
} from "../utils/sendSafelyClient.js";
import * as openpgp from "openpgp";

//
// src/workers/zipReader.worker.ts
//
// Refactor: introduce a generic async BytesProvider abstraction so we can
// plug in different backing sources (Buffer, Blob/File, HTTP→buffer, future
// SendSafely, IndexedDB, etc.) without changing ZIP logic.
//
// Public API kept as before (minus readFile, per your request):
//  - postMessage({ type: 'initialize', id, buffer? | file? | url? | sendSafely? })
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
  readonly kind: "buffer" | "blob" | "http-buffer" | "custom";
  size(): number;
  read(start: number, length: number): Promise<Uint8Array>;
}

/** Backed by a Uint8Array already in memory. */
class BufferProvider implements BytesProvider {
  readonly kind = "buffer" as const;
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
  readonly kind = "blob" as const;
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
  readonly kind = "http-buffer" as const;
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
  type: "initialize";
  id: string;
  buffer?: ArrayBuffer;
  file?: File;
  url?: string; // demo path: fetch to memory once
  sendSafely?: SendSafelyInit; // SendSafely source
};

type GetEntriesMsg = { type: "getEntries"; id: string };

type ReadFileChunkedMsg = {
  type: "readFileChunked";
  id: string;
  path: string; // entry path as returned by getEntries
  chunkSize?: number; // post-decompression chunk size (default ~256KB)
  to?: string; // for routing support
  from?: string; // for routing support
};

// Responses
type ErrorResp = { type: "error"; id: string; error: string };
type InitializeComplete = { type: "initializeComplete"; id: string };
type GetEntriesComplete = {
  type: "getEntriesComplete";
  id: string;
  entries: ZipEntryMeta[];
};
type ReadFileChunk = {
  type: "readFileChunk";
  id: string;
  path: string;
  bytes: Uint8Array;
  done: boolean;
};

// -------------------- Entry types --------------------

type ZipEntryMeta = {
  id: string; // stable id (we use the path)
  name: string;
  path: string;
  size: number; // uncompressed
  compressedSize: number;
  isDir: boolean;
};

// Internal representation (holds offsets needed to stream)
type ZipEntryInternal = {
  path: string;
  name: string;
  isDir: boolean;
  method: number; // 0=Stored, 8=Deflate
  flags: number;
  compressedSize: number;
  uncompressedSize: number;
  localHeaderOffset: number;
  dataStart?: number; // computed from local header on demand
};

// -------------------- Worker state --------------------

const state: {
  provider: BytesProvider | null;
  fileSize: number;
  entries: ZipEntryInternal[] | null;
  entriesByPath: Map<string, ZipEntryInternal>;
  sourceKind: BytesProvider["kind"] | null;
} = {
  provider: null,
  fileSize: 0,
  entries: null,
  entriesByPath: new Map(),
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
    if (view.getUint32(i, true) === SIG.EOCD) {
      return i;
    }
  }

  return -1;
}

function readUInt64LE(view: DataView, off: number): number {
  const lo = view.getUint32(off, true);
  const hi = view.getUint32(off + 4, true);
  return hi * 2 ** 32 + lo;
}

function parseZip64ExtraField(
  extraBytes: Uint8Array,
  hasUncompSizeSentinel = false,
  hasCompSizeSentinel = false,
  hasLfhOffsetSentinel = false,
): {
  uncompressedSize?: number;
  compressedSize?: number;
  localHeaderOffset?: number;
} | null {
  const view = dv(extraBytes);
  let off = 0;

  while (off + 4 <= extraBytes.length) {
    const id = view.getUint16(off, true);
    const size = view.getUint16(off + 2, true);

    if (id === 0x0001 && off + 4 + size <= extraBytes.length) {
      // ZIP64 extended information extra field
      const result: {
        uncompressedSize?: number;
        compressedSize?: number;
        localHeaderOffset?: number;
      } = {};
      let fieldOff = off + 4;

      // Fields are only present if the corresponding 32-bit field was a sentinel value
      // Order: uncompressed size, compressed size, local header offset, disk start number

      if (hasUncompSizeSentinel && fieldOff + 8 <= off + 4 + size) {
        result.uncompressedSize = readUInt64LE(view, fieldOff);
        fieldOff += 8;
      }
      if (hasCompSizeSentinel && fieldOff + 8 <= off + 4 + size) {
        result.compressedSize = readUInt64LE(view, fieldOff);
        fieldOff += 8;
      }
      if (hasLfhOffsetSentinel && fieldOff + 8 <= off + 4 + size) {
        result.localHeaderOffset = readUInt64LE(view, fieldOff);
        fieldOff += 8;
      }

      return result;
    }

    off += 4 + size;
  }

  return null;
}

type CDLocator = { cdOffset: number; cdSize: number; totalEntries: number };

function parseCentralDirectoryLocator(
  tail: Uint8Array,
  _fileSize: number,
  tailStart: number,
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
          // ZIP64 EOCD structure:
          // +24: Entries on this disk (8 bytes)
          // +32: Total entries (8 bytes)
          // +40: CD size (8 bytes)
          // +48: CD offset (8 bytes)
          readUInt64LE(view, abs + 24); // entriesOnDisk - not used
          const totalEntries64 = readUInt64LE(view, abs + 32);
          const cdSize64 = readUInt64LE(view, abs + 40);
          const cdOffset64 = readUInt64LE(view, abs + 48);
          return {
            cdOffset: cdOffset64,
            cdSize: cdSize64,
            totalEntries: totalEntries64,
          };
        }
        break;
      }
    }

    // Fallback to 32-bit if ZIP64 locator not found
    return { cdOffset, cdSize, totalEntries };
  }
  throw new Error(
    "EOCD not found; file may not be a ZIP or tail window too small",
  );
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
    const isDir = path.endsWith("/") || path.endsWith("\\");

    // Handle ZIP64 extended information if needed
    let actualLfhOffset = lfhOffset >>> 0;
    let actualCompSize = compSize >>> 0;
    let actualUncompSize = uncompSize >>> 0;

    // If any values are ZIP64 sentinel values, parse the ZIP64 extra field
    if (
      lfhOffset === 0xffffffff ||
      compSize === 0xffffffff ||
      uncompSize === 0xffffffff
    ) {
      const extraBytes = buf.subarray(
        off + 46 + nameLen,
        off + 46 + nameLen + extraLen,
      );

      // Parse ZIP64 field with info about which fields were sentinel values
      const zip64Info = parseZip64ExtraField(
        extraBytes,
        uncompSize === 0xffffffff,
        compSize === 0xffffffff,
        lfhOffset === 0xffffffff,
      );

      if (zip64Info) {
        if (
          lfhOffset === 0xffffffff &&
          zip64Info.localHeaderOffset !== undefined
        ) {
          actualLfhOffset = zip64Info.localHeaderOffset;
        }
        if (compSize === 0xffffffff && zip64Info.compressedSize !== undefined) {
          actualCompSize = zip64Info.compressedSize;
        }
        if (
          uncompSize === 0xffffffff &&
          zip64Info.uncompressedSize !== undefined
        ) {
          actualUncompSize = zip64Info.uncompressedSize;
        }
      }
    }

    out.push({
      path,
      name:
        path
          .replace(/[/\\]$/, "")
          .split(/[/\\]/)
          .pop() || path,
      isDir,
      method,
      flags,
      compressedSize: actualCompSize,
      uncompressedSize: actualUncompSize,
      localHeaderOffset: actualLfhOffset,
    });

    off += 46 + nameLen + extraLen + commentLen;
  }
  return out;
}

function parseLocalHeaderForDataStart(
  lfh: Uint8Array,
  lfhGlobalOffset: number,
): { dataStart: number; method: number } {
  const view = dv(lfh);
  const sig = view.getUint32(0, true);
  if (sig !== SIG.LFH) {
    throw new Error(
      `Invalid local file header: signature 0x${sig.toString(16)} at offset ${lfhGlobalOffset}`,
    );
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
  self.postMessage(m);
}

function errMessage(id: string, error: unknown) {
  const msg = error instanceof Error ? error.message : String(error);
  okMessage<ErrorResp>({ type: "error", id, error: msg });
}

// Wrap provider bytes into a ReadableStream by fetching in windows.
function makeRangeStream(
  provider: BytesProvider,
  start: number,
  length: number,
  windowSize = 1024 * 1024, // 1MB reads
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
  emit: (b: Uint8Array, done: boolean) => void,
) {
  let i = 0;
  while (i < buf.byteLength) {
    const j = Math.min(i + outSize, buf.byteLength);
    emit(buf.subarray(i, j), false);
    i = j;
  }
  // Note: this function should not call emit with done=true
  // The caller is responsible for signaling completion
}

// Compute and cache `dataStart` for an entry using the provider.
async function computeDataStart(
  provider: BytesProvider,
  entry: ZipEntryInternal,
): Promise<number> {
  if (entry.dataStart != null) return entry.dataStart;
  // Read a small window around the LFH (64KB is more than enough)

  const lfhBuf = await provider.read(entry.localHeaderOffset, 64 * 1024);
  const { dataStart } = parseLocalHeaderForDataStart(
    lfhBuf,
    entry.localHeaderOffset,
  );
  entry.dataStart = dataStart;
  return dataStart;
}

// -------------------- Loaders --------------------

async function loadFromProvider(id: string, provider: BytesProvider) {
  state.provider = provider;
  state.sourceKind = provider.kind;
  state.fileSize = provider.size();
  state.entries = null;
  state.entriesByPath.clear();

  // 1) Tail window → EOCD(/ZIP64) → central directory location
  const tailLen = Math.min(1024 * 1024, state.fileSize); // 1MB
  const tailStart = Math.max(0, state.fileSize - tailLen); // Ensure we don't go negative

  const tail = await provider.read(tailStart, tailLen);
  const { cdOffset, cdSize } = parseCentralDirectoryLocator(
    tail,
    state.fileSize,
    tailStart,
  );

  // 2) Read central directory
  const central = await provider.read(cdOffset, cdSize);
  const allEntries = parseCentralDirectory(central);

  // Filter out __MACOSX paths (macOS metadata files)
  const entries = allEntries.filter((e) => !e.path.startsWith("__MACOSX"));

  if (entries.every((e) => e.path.startsWith("renamed_"))) {
    console.log(`ZipReader de-renaming demo zip entries..`);
    entries.forEach((e) => (e.path = e.path.substring("renamed_".length)));
  }

  // 4) Index entries
  state.entries = entries;
  state.entriesByPath.clear();
  for (const e of entries) state.entriesByPath.set(e.path, e);

  okMessage<InitializeComplete>({ type: "initializeComplete", id });
}

async function loadFromMessage(msg: InitFromSourceMsg) {
  const { id, buffer, file, url, sendSafely } = msg;

  if (buffer) {
    const provider = new BufferProvider(new Uint8Array(buffer));
    await loadFromProvider(id, provider);
    return;
  }

  if (file) {
    const provider = new BlobProvider(file);
    await loadFromProvider(id, provider);
    return;
  }

  if (url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
    const arr = new Uint8Array(await r.arrayBuffer());
    const provider = new HttpBufferProvider(arr);
    await loadFromProvider(id, provider);
    return;
  }

  if (sendSafely) {
    const provider = new SendSafelyProvider(sendSafely);
    await loadFromProvider(id, provider);
    return;
  }

  throw new Error("No buffer, file, url, or sendSafely provided to initialize");
}

// -------------------- Public ops --------------------

async function onGetEntries(msg: GetEntriesMsg) {
  const { id } = msg;
  try {
    if (!state.entries) throw new Error("Archive not initialized");
    const metas = state.entries.map(toMeta);
    okMessage<GetEntriesComplete>({
      type: "getEntriesComplete",
      id,
      entries: metas,
    });
  } catch (e) {
    errMessage(id, e);
  }
}

async function onReadFileChunked(msg: ReadFileChunkedMsg) {
  const { id, path } = msg;
  const chunkOutSize = msg.chunkSize ?? 256 * 1024;

  // Check if this is a routed message (has 'from' field)
  const isRouted = "from" in msg && msg.from;
  const routingInfo = isRouted ? { to: msg.from, from: "zipWorker" } : {};

  const emit = (bytes: Uint8Array, done: boolean) => {
    okMessage<ReadFileChunk & { to?: string; from?: string }>({
      type: "readFileChunk",
      id,
      path,
      bytes,
      done,
      ...routingInfo,
    });
  };

  try {
    if (!state.provider || !state.entries)
      throw new Error("Archive not initialized");

    const entry = state.entriesByPath.get(path);
    if (!entry) throw new Error(`Entry not found: ${path}`);
    if (entry.isDir) throw new Error("Cannot read a directory");

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
      // Feature detection for DecompressionStream without global mutation
      if (typeof DecompressionStream === "undefined") {
        throw new Error(
          "DecompressionStream API not available in this environment",
        );
      }
      const Decomp = DecompressionStream;
      const plainStream = compStream.pipeThrough(
        new Decomp("deflate-raw") as ReadableWritablePair<
          Uint8Array,
          Uint8Array
        >,
      );
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

self.addEventListener("message", (ev: MessageEvent<InMsg>) => {
  const msg = ev.data;
  switch (msg.type) {
    case "initialize":
      void loadFromMessage(msg);
      break;
    case "getEntries":
      void onGetEntries(msg);
      break;
    case "readFileChunked":
      void onReadFileChunked(msg);
      break;
    default: {
      const id = ((msg as Record<string, unknown>).id as string) ?? "unknown";
      okMessage<ErrorResp>({
        type: "error",
        id,
        error: `Unknown message type: ${(msg as Record<string, unknown>).type}`,
      });
    }
  }
});

interface SendSafelyPackageInfo {
  packageId?: string;
  packageCode?: string;
  keyCode: string;
  serverSecret?: string;
  files?: Array<{
    fileId: string;
    fileName: string;
    fileSize: number;
    parts: number;
  }>;
  package?: {
    packageId?: string;
    packageCode?: string;
    serverSecret?: string;
    files: Array<{
      fileId: string;
      fileName: string;
      fileSize: number;
      parts: number;
    }>;
  };
}

type SendSafelyInit = {
  host: string;
  apiKey: string;
  apiSecret: string;
  keyCode: string;
  fileId: string;
  packageInfo: SendSafelyPackageInfo;
};

// Small LRU for decrypted parts
class LRU<V> {
  private map = new Map<number, V>();
  private capacity: number;
  constructor(capacity = 32) {
    this.capacity = capacity;
  }
  get(k: number): V | undefined {
    const v = this.map.get(k);
    if (v !== undefined) {
      this.map.delete(k);
      this.map.set(k, v);
    }
    return v;
  }
  set(k: number, v: V) {
    if (this.map.has(k)) this.map.delete(k);
    this.map.set(k, v);
    if (this.map.size > this.capacity) {
      const oldest = this.map.keys().next().value;
      if (oldest !== undefined) {
        this.map.delete(oldest);
      }
    }
  }
}

class SendSafelyProvider implements BytesProvider {
  readonly kind = "custom" as const;

  private host: string;
  private apiKey: string;
  private apiSecret: string;
  private keyCode: string;
  private fileName: string;

  // Hydrated from package info (provided by frontend)
  private packageId: string;
  private packageCode: string;
  private serverSecret: string;
  private fileId: string;
  private fileSize: number;
  private parts: number;

  // Discovered chunk characteristics (set during initialization)
  private firstChunkSize: number = 0; // plaintext size of first chunk
  private middleChunkSize: number = 0; // plaintext size of middle chunks
  // @ts-expect-error - lastChunkSize kept for potential future use
  private _lastChunkSize: number = 0; // plaintext size of last chunk
  private chunkSizesDiscovered = false; // whether we've probed the chunks

  // caches
  private urls = new Map<number, string>(); // partIdx -> presigned URL
  private urlPageSize = 25;
  private decLRU = new LRU<Uint8Array>(24); // decrypted part cache (tune)
  private client: SendSafelyClient | null = null; // SendSafely client instance

  constructor(init: SendSafelyInit) {
    // Store credentials - client will be created on-demand
    this.host = init.host.replace(/\/+$/, "");
    this.apiKey = init.apiKey;
    this.apiSecret = init.apiSecret;
    this.keyCode = init.keyCode;
    this.fileId = init.fileId;

    // Extract package info from the provided response
    const pkgInfo = init.packageInfo;
    this.packageId = pkgInfo.packageId ?? pkgInfo.package?.packageId ?? "";
    this.packageCode =
      pkgInfo.packageCode ?? pkgInfo.package?.packageCode ?? "";
    this.serverSecret =
      pkgInfo.serverSecret ?? pkgInfo.package?.serverSecret ?? "";

    const files = (pkgInfo.files ?? pkgInfo.package?.files) as Array<{
      fileId: string;
      fileName: string;
      fileSize: number;
      parts: number;
    }>;
    const f = files.find((x) => x.fileId === this.fileId) ?? files[0];
    if (!f) throw new Error(`File not found in package: ${this.fileId}`);
    this.fileName = f.fileName;
    this.fileSize = f.fileSize;
    this.parts = f.parts;

    // Create SendSafely client instance
    this.client = createSendSafelyClient(
      this.host,
      this.apiKey,
      this.apiSecret,
    );
  }

  size(): number {
    return this.fileSize;
  }

  /**
   * Probe the first 2 and last 2 chunks to discover chunk sizes and encryption overhead
   */
  private async discoverChunkSizes(): Promise<void> {
    if (this.chunkSizesDiscovered) return;

    // Determine which chunks to probe
    const chunksToProbe = [];
    if (this.parts >= 1) chunksToProbe.push(0); // first
    if (this.parts >= 2) chunksToProbe.push(1); // second
    if (this.parts >= 3) chunksToProbe.push(this.parts - 2); // penultimate
    if (this.parts >= 4) chunksToProbe.push(this.parts - 1); // last

    // If we have fewer than 4 parts, adjust our probe strategy
    if (this.parts < 4) {
      // Probe all available chunks
      for (let i = 0; i < this.parts; i++) {
        if (!chunksToProbe.includes(i)) chunksToProbe.push(i);
      }
    }

    // Decrypt each probe chunk and measure plaintext sizes
    const chunkInfo: Array<{ chunkIdx: number; plaintextSize: number }> = [];

    for (const chunkIdx of chunksToProbe) {
      const decrypted = await this.getDecryptedPart(chunkIdx);
      chunkInfo.push({
        chunkIdx,
        plaintextSize: decrypted.length,
      });
    }

    // Determine chunk size pattern
    if (this.parts === 1) {
      // Single chunk file
      this.firstChunkSize = chunkInfo[0].plaintextSize;
      this.middleChunkSize = 0;
      this._lastChunkSize = chunkInfo[0].plaintextSize;
    } else if (this.parts === 2) {
      // Two chunk file
      this.firstChunkSize =
        chunkInfo.find((c) => c.chunkIdx === 0)?.plaintextSize || 0;
      this._lastChunkSize =
        chunkInfo.find((c) => c.chunkIdx === 1)?.plaintextSize || 0;
      this.middleChunkSize = 0; // No middle chunks
    } else if (this.parts === 3) {
      // Three chunk file
      this.firstChunkSize =
        chunkInfo.find((c) => c.chunkIdx === 0)?.plaintextSize || 0;
      this.middleChunkSize =
        chunkInfo.find((c) => c.chunkIdx === 1)?.plaintextSize || 0;
      this._lastChunkSize =
        chunkInfo.find((c) => c.chunkIdx === 2)?.plaintextSize || 0;
    } else {
      // Four or more chunks - verify middle chunks are consistent
      const firstInfo = chunkInfo.find((c) => c.chunkIdx === 0);
      const secondInfo = chunkInfo.find((c) => c.chunkIdx === 1);
      const penultimateInfo = chunkInfo.find(
        (c) => c.chunkIdx === this.parts - 2,
      );
      const lastInfo = chunkInfo.find((c) => c.chunkIdx === this.parts - 1);

      if (!firstInfo || !secondInfo || !penultimateInfo || !lastInfo) {
        throw new Error("Failed to probe required chunks");
      }

      // Verify second and penultimate chunks are the same size (middle chunk pattern)
      if (secondInfo.plaintextSize !== penultimateInfo.plaintextSize) {
        throw new Error(
          `Middle chunks have different sizes: chunk 1=${secondInfo.plaintextSize}B, chunk ${this.parts - 2}=${penultimateInfo.plaintextSize}B`,
        );
      }

      this.firstChunkSize = firstInfo.plaintextSize;
      this.middleChunkSize = secondInfo.plaintextSize;
      this._lastChunkSize = lastInfo.plaintextSize;
    }

    this.chunkSizesDiscovered = true;
  }

  /**
   * Map a byte offset to the chunk that contains it
   * Returns chunk index and offset within that chunk
   */
  private chunkForOffset(offset: number): {
    chunkIdx: number;
    offsetInChunk: number;
  } {
    if (!this.chunkSizesDiscovered) {
      throw new Error(
        "Chunk sizes not discovered yet - call discoverChunkSizes() first",
      );
    }

    if (offset < 0 || offset >= this.fileSize) {
      throw new Error(`Offset ${offset} out of bounds [0, ${this.fileSize})`);
    }

    // Optimize for the common case where first == middle (all chunks same size except last)
    if (this.firstChunkSize === this.middleChunkSize) {
      const standardChunkSize = this.firstChunkSize;
      const chunkIdx = Math.floor(offset / standardChunkSize);

      // If we calculated beyond the last regular chunk, we're in the last chunk
      if (chunkIdx >= this.parts - 1) {
        const offsetInLastChunk = offset - (this.parts - 1) * standardChunkSize;
        return { chunkIdx: this.parts - 1, offsetInChunk: offsetInLastChunk };
      } else {
        const offsetInChunk = offset % standardChunkSize;
        return { chunkIdx, offsetInChunk };
      }
    }

    // Fallback for cases where first != middle (rare)
    // Single chunk case
    if (this.parts === 1) {
      return { chunkIdx: 0, offsetInChunk: offset };
    }

    // Check if offset is in the first chunk
    if (offset < this.firstChunkSize) {
      return { chunkIdx: 0, offsetInChunk: offset };
    }

    // For 2-chunk files, anything past first chunk is in the last chunk
    if (this.parts === 2) {
      return { chunkIdx: 1, offsetInChunk: offset - this.firstChunkSize };
    }

    // For 3+ chunk files, check if we're in middle chunks or last chunk
    const afterFirstChunk = offset - this.firstChunkSize;
    const middleChunksCount = Math.max(0, this.parts - 2);
    const totalMiddleSize = middleChunksCount * this.middleChunkSize;

    if (afterFirstChunk < totalMiddleSize) {
      // We're in a middle chunk
      const middleChunkIdx = Math.floor(afterFirstChunk / this.middleChunkSize);
      const offsetInMiddleChunk = afterFirstChunk % this.middleChunkSize;
      return {
        chunkIdx: 1 + middleChunkIdx,
        offsetInChunk: offsetInMiddleChunk,
      };
    } else {
      // We're in the last chunk
      const offsetInLastChunk = afterFirstChunk - totalMiddleSize;
      return { chunkIdx: this.parts - 1, offsetInChunk: offsetInLastChunk };
    }
  }

  async read(start: number, length: number): Promise<Uint8Array> {
    // Ensure chunk sizes are discovered
    await this.discoverChunkSizes();

    // Clamp the read range to file bounds
    const end = Math.min(this.fileSize, start + length);
    if (start >= end) {
      return new Uint8Array(0);
    }

    // Find which chunks we need
    const startChunk = this.chunkForOffset(start);
    const endChunk = this.chunkForOffset(end - 1); // -1 because end is exclusive

    // Fetch and decrypt the required chunks
    const chunks: Uint8Array[] = [];
    for (
      let chunkIdx = startChunk.chunkIdx;
      chunkIdx <= endChunk.chunkIdx;
      chunkIdx++
    ) {
      chunks.push(await this.getDecryptedPart(chunkIdx));
    }

    // Assemble the requested byte range from the chunks
    const resultLength = end - start;
    const result = new Uint8Array(resultLength);
    let resultOffset = 0;

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      let chunkStart = 0;
      let chunkEnd = chunk.length;

      // For the first chunk, start from the requested offset
      if (i === 0) {
        chunkStart = startChunk.offsetInChunk;
      }

      // For the last chunk, end at the requested offset
      if (i === chunks.length - 1) {
        const lastChunkInfo = this.chunkForOffset(end - 1);
        chunkEnd = lastChunkInfo.offsetInChunk + 1; // +1 because offsetInChunk is inclusive
      }

      const bytesToCopy = chunkEnd - chunkStart;
      if (bytesToCopy > 0) {
        result.set(chunk.subarray(chunkStart, chunkEnd), resultOffset);
        resultOffset += bytesToCopy;
      }
    }

    return result.subarray(0, resultOffset);
  }

  // --- internals -------------------------------------------------------------

  private async getDecryptedPart(partIdx: number): Promise<Uint8Array> {
    const cached = this.decLRU.get(partIdx);
    if (cached) {
      return cached;
    }

    // ensure we have URL for this part (partIdx is 0-based)
    await this.ensureUrlsFor(partIdx);

    const url = this.urls.get(partIdx);
    if (!url) throw new Error(`No URL for part ${partIdx}`);

    // fetch encrypted PGP blob, send to main thread for decryption
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} for part ${partIdx}`);
    const enc = new Uint8Array(await res.arrayBuffer());

    const dec = await this.decryptPgp(enc, this.serverSecret + this.keyCode);

    this.decLRU.set(partIdx, dec);
    return dec;
  }

  private async ensureUrlsFor(targetPart: number) {
    if (this.urls.has(targetPart)) {
      return;
    }

    // targetPart is now 0-based, calculate page boundaries using 0-based math
    const startPart0Based =
      Math.floor(targetPart / this.urlPageSize) * this.urlPageSize;
    const endPart0Based = Math.min(
      this.parts - 1,
      startPart0Based + this.urlPageSize - 1,
    );

    // Convert to 1-based for API call
    const startPartApi = startPart0Based + 1;
    const endPartApi = endPart0Based + 1;

    if (!this.client) {
      throw new Error("SendSafely client not initialized");
    }
    const downloadUrls = await this.client.getDownloadUrls(
      this.packageId,
      this.fileId,
      this.keyCode,
      this.packageCode,
      startPartApi,
      endPartApi,
    );

    // Process the download URLs returned by the client
    // Convert API response parts (1-based) back to 0-based for internal storage
    for (const { part, url } of downloadUrls) {
      const part0Based = part - 1;
      this.urls.set(part0Based, url);
    }
  }

  private async decryptPgp(
    enc: Uint8Array,
    passphrase: string,
  ): Promise<Uint8Array> {
    try {
      const msg = await openpgp.readMessage({ binaryMessage: enc });

      const { data } = await openpgp.decrypt({
        message: msg,
        passwords: [passphrase],
        format: "binary",
      });

      const result = new Uint8Array(data as Uint8Array);

      // Note: Don't check for ZIP signatures here - this could be any chunk of a multi-part file
      return result;
    } catch (error) {
      console.error(`decryptPgp: decryption failed:`, error);
      throw error;
    }
  }
}
