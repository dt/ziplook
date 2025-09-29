import type { WorkerManager } from "../services/WorkerManager";

export interface BufferedFileResult {
  text?: string;
  bytes?: Uint8Array;
}

/**
 * Utility function to read a file and buffer all chunks into a single result.
 * This is useful for callers that need the complete file content rather than streaming.
 */
export async function readFileBuffered(
  workerManager: WorkerManager,
  path: string,
): Promise<BufferedFileResult> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];

    workerManager
      .readFileStream(path, (chunk: Uint8Array, progress) => {
        chunks.push(chunk);

        if (progress.done) {
          // Combine all chunks into a single Uint8Array
          const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
          const bytes = new Uint8Array(totalLength);
          let offset = 0;
          for (const chunk of chunks) {
            bytes.set(chunk, offset);
            offset += chunk.length;
          }

          // Decode to text only if valid UTF-8
          let text: string | undefined;
          try {
            text = new TextDecoder().decode(bytes);
          } catch {
            // Not valid UTF-8, leave text undefined
          }

          resolve({ text, bytes });
        }
      })
      .catch(reject);
  });
}

/**
 * Utility function to read a file and buffer raw bytes without text decoding.
 * This now works directly with the raw Uint8Array chunks.
 */
export async function readFileBufferedBytes(
  workerManager: WorkerManager,
  path: string,
): Promise<Uint8Array> {
  const result = await readFileBuffered(workerManager, path);
  return result.bytes!;
}
