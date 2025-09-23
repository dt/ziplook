/**
 * ZipReader that uses Web Workers for non-blocking file operations
 */

import type { ZipEntryMeta } from '../state/types';

type StreamCallback = (chunk: string, progress: {
  loaded: number;
  total: number;
  done: boolean;
}) => void;

interface WorkerMessage {
  type: string;
  id: string;
  [key: string]: any;
}

interface WorkerResponse {
  type: string;
  id: string;
  [key: string]: any;
}

export class ZipReaderWorker {
  private zipData: Uint8Array;
  private entries: ZipEntryMeta[] = [];
  private worker: Worker | null = null;
  private pendingRequests = new Map<string, {
    resolve: (value: any) => void;
    reject: (error: Error) => void;
    streamCallback?: StreamCallback;
  }>();

  constructor(data: Uint8Array) {
    this.zipData = data;
    this.initializeWorker();
  }

  private initializeWorker() {
    try {
      // Create worker from the worker file
      this.worker = new Worker(
        new URL('../workers/zipReader.worker.ts', import.meta.url),
        { type: 'module' }
      );

      this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
        this.handleWorkerMessage(event.data);
      };

      this.worker.onerror = (error) => {
        console.error('Worker error:', error);
        // Reject all pending requests
        for (const [, request] of this.pendingRequests) {
          request.reject(new Error('Worker error'));
        }
        this.pendingRequests.clear();
      };
    } catch (error) {
      console.error('Failed to create worker:', error);
      this.worker = null;
    }
  }

  private handleWorkerMessage(response: WorkerResponse) {
    const request = this.pendingRequests.get(response.id);
    if (!request) {
      console.warn('Received response for unknown request:', response.id);
      return;
    }

    switch (response.type) {
      case 'readFileComplete':
        this.pendingRequests.delete(response.id);
        if (response.success) {
          request.resolve(response.result);
        } else {
          request.reject(new Error(response.error));
        }
        break;

      case 'readFileChunk':
        if (request.streamCallback) {
          request.streamCallback(response.chunk, response.progress);
        }
        if (response.progress.done) {
          this.pendingRequests.delete(response.id);
          request.resolve(undefined);
        }
        break;

      case 'readFileError':
        this.pendingRequests.delete(response.id);
        request.reject(new Error(response.error));
        break;

      default:
        console.warn('Unknown worker response type:', response.type);
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async initialize(): Promise<ZipEntryMeta[]> {
    // Keep the existing synchronous initialization since it's already optimized
    const { unzip } = await import('fflate');

    return new Promise((resolve, reject) => {
      // This runs without blocking the main thread
      unzip(this.zipData, {
        filter: (file) => {
          const path = file.name;
          const isDir = path.endsWith('/');
          const name = path.split('/').pop() || path;

          // Skip hidden files and system files
          const segments = path.split('/');
          const shouldSkip = segments.some(segment =>
            segment.startsWith('.') || segment.startsWith('__')
          );

          if (!shouldSkip) {
            // Remove 'renamed_' prefix from displayed path and name for cleaner UI
            const displayPath = path.startsWith('renamed_') ? path.slice(8) : path;
            const displayName = name.startsWith('renamed_') ? name.slice(8) : name;

            this.entries.push({
              id: displayPath,
              name: displayName,
              path: displayPath,
              size: file.originalSize || 0,
              compressedSize: file.size || 0,
              isDir,
            });
          }

          return false; // Don't extract files during initialization
        }
      }, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(this.entries);
        }
      });
    });
  }

  getEntries(): ZipEntryMeta[] {
    return this.entries;
  }

  async readFile(
    path: string,
    _onProgress?: (loaded: number, total: number) => void
  ): Promise<{ text?: string; bytes?: Uint8Array }> {
    if (!this.worker) {
      // Fallback to original implementation if worker fails
      return this.readFileSync(path);
    }

    const id = this.generateRequestId();

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });

      this.worker!.postMessage({
        type: 'readFile',
        id,
        path,
        zipData: this.zipData
      } as WorkerMessage);
    });
  }

  async readFileStream(
    path: string,
    onChunk: StreamCallback,
    onProgress?: (loaded: number, total: number) => void
  ): Promise<void> {
    if (!this.worker) {
      // Fallback to original implementation if worker fails
      return this.readFileStreamSync(path, onChunk, onProgress);
    }

    const id = this.generateRequestId();

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, {
        resolve,
        reject,
        streamCallback: onChunk
      });

      this.worker!.postMessage({
        type: 'readFileChunked',
        id,
        path,
        zipData: this.zipData,
        chunkSize: 8192
      } as WorkerMessage);
    });
  }

  // Fallback methods for when worker is not available
  private async readFileSync(path: string): Promise<{ text?: string; bytes?: Uint8Array }> {
    const { unzip } = await import('fflate');

    return new Promise((resolve, reject) => {
      const pathsToTry = [path, `renamed_${path}`];

      unzip(this.zipData, {
        filter: (file) => pathsToTry.includes(file.name)
      }, (err, files) => {
        if (err) {
          reject(err);
          return;
        }

        let data = files[path];
        if (!data) {
          data = files[`renamed_${path}`];
        }

        if (!data) {
          reject(new Error(`File not found in zip: ${path}`));
          return;
        }

        const bytes = data as Uint8Array;

        try {
          const text = new TextDecoder('utf-8').decode(bytes);
          if (this.isLikelyText(text)) {
            resolve({ text, bytes });
          } else {
            resolve({ bytes });
          }
        } catch {
          resolve({ bytes });
        }
      });
    });
  }

  private async readFileStreamSync(
    path: string,
    onChunk: StreamCallback,
    _onProgress?: (loaded: number, total: number) => void
  ): Promise<void> {
    const result = await this.readFileSync(path);
    if (result.text) {
      onChunk(result.text, { loaded: result.text.length, total: result.text.length, done: true });
    }
  }

  private isLikelyText(str: string): boolean {
    const sample = str.slice(0, 1000);
    for (let i = 0; i < sample.length; i++) {
      const code = sample.charCodeAt(i);
      if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
        return false;
      }
    }
    return true;
  }

  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.pendingRequests.clear();
  }
}