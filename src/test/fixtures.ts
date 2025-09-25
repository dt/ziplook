import { readFile } from "fs/promises";
import { getWorkerManager } from "../services/WorkerManager";
import { readFileBuffered } from "../utils/fileUtils";
import type { FileEntry } from "../state/types";

let cachedDebugZip: ArrayBuffer | null = null;

export async function getDebugZip(): Promise<ArrayBuffer> {
  if (!cachedDebugZip) {
    const buffer = await readFile("./debug.zip");
    cachedDebugZip = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength,
    );
  }
  return cachedDebugZip;
}

export async function getFileFromDebugZip(path: string): Promise<Uint8Array> {
  const buffer = await getDebugZip();
  const workerManager = await getWorkerManager();
  await workerManager.loadZipData(new Uint8Array(buffer));

  const result = await readFileBuffered(workerManager, path);
  if (result.bytes) {
    return result.bytes;
  } else if (result.text) {
    return new TextEncoder().encode(result.text);
  } else {
    throw new Error(`File not found in debug.zip: ${path}`);
  }
}

export async function getTextFromDebugZip(path: string): Promise<string> {
  const buffer = await getDebugZip();
  const workerManager = await getWorkerManager();
  await workerManager.loadZipData(new Uint8Array(buffer));

  const result = await readFileBuffered(workerManager, path);
  if (result.text) {
    return result.text;
  } else {
    throw new Error(`File not found or not text: ${path}`);
  }
}

export function createMockFileEntry(overrides?: Partial<FileEntry>): FileEntry {
  return {
    filename: "test.txt",
    compressedSize: 100,
    uncompressedSize: 200,
    compressionMethod: 8,
    isDirectory: false,
    lastModified: new Date("2024-01-01"),
    crc32: 0x12345678,
    ...overrides,
  };
}

export function createMockCSVData(): string {
  return `id,name,value
1,Alice,100
2,Bob,200
3,Charlie,300`;
}

export function createMockProtoData(): Uint8Array {
  return new Uint8Array([
    0x08,
    0x96,
    0x01, // field 1, varint 150
    0x12,
    0x07,
    0x74,
    0x65,
    0x73,
    0x74,
    0x69,
    0x6e,
    0x67, // field 2, string "testing"
  ]);
}
