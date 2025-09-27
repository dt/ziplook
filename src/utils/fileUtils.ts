import type { WorkerManager } from "../services/WorkerManager";

export interface BufferedFileResult {
  text?: string;
  bytes?: Uint8Array;
}

/**
 * Utility function to read a file and buffer all chunks into a single text result.
 * This is useful for callers that need the complete file content rather than streaming.
 *
 * Note: The WorkerManager already decodes chunks to text, so this concatenates the text chunks.
 */
export async function readFileBuffered(
  workerManager: WorkerManager,
  path: string,
): Promise<BufferedFileResult> {
  return new Promise((resolve, reject) => {
    let fullText = "";

    workerManager
      .readFileStream(path, (chunk: string, progress) => {
        fullText += chunk;

        if (progress.done) {
          // Convert back to bytes for compatibility
          const bytes = new TextEncoder().encode(fullText);
          resolve({ text: fullText, bytes });
        }
      })
      .catch(reject);
  });
}

/**
 * Utility function to read a file and buffer raw bytes without text decoding.
 * This version works directly with the raw chunks before they're decoded to text.
 *
 * For cases where you need the original binary data, you would need to modify
 * WorkerManager.readFileStream to provide a raw bytes mode, or use this as
 * a template for a new method that doesn't decode to text.
 */
export async function readFileBufferedBytes(
  workerManager: WorkerManager,
  path: string,
): Promise<Uint8Array> {
  // For now, convert from the text back to bytes
  // TODO: Add a raw bytes streaming mode to WorkerManager if needed
  const result = await readFileBuffered(workerManager, path);
  return result.bytes!;
}
