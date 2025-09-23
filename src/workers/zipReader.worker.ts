/**
 * Centralized Zip Worker - manages the entire zip file and handles all zip operations
 * Other workers can message this worker to get file lists and read individual files
 */

import * as fflate from 'fflate';
import type { ZipEntryMeta } from '../state/types';

interface InitializeMessage {
  type: 'initialize';
  id: string;
  zipData: Uint8Array;
}

interface GetEntriesMessage {
  type: 'getEntries';
  id: string;
}

interface ReadFileMessage {
  type: 'readFile';
  id: string;
  path: string;
}

interface ReadFileChunkedMessage {
  type: 'readFileChunked';
  id: string;
  path: string;
  chunkSize?: number;
}



interface SetIndexingWorkerPortMessage {
  type: 'setIndexingWorkerPort';
  port: MessagePort;
}

interface SetDbWorkerPortMessage {
  type: 'setDbWorkerPort';
  port: MessagePort;
}

type WorkerMessage = InitializeMessage | GetEntriesMessage | ReadFileMessage | ReadFileChunkedMessage | SetIndexingWorkerPortMessage | SetDbWorkerPortMessage;

interface InitializeResponse {
  type: 'initializeComplete';
  id: string;
  success: boolean;
  entries?: ZipEntryMeta[];
  error?: string;
}

interface GetEntriesResponse {
  type: 'getEntriesComplete';
  id: string;
  entries: ZipEntryMeta[];
}

interface ReadFileResponse {
  type: 'readFileComplete';
  id: string;
  success: boolean;
  result?: { text?: string; bytes?: Uint8Array };
  error?: string;
}

interface ReadFileChunkResponse {
  type: 'readFileChunk';
  id: string;
  chunk: string;
  progress: {
    loaded: number;
    total: number;
    done: boolean;
  };
}

interface ErrorResponse {
  type: 'error';
  id: string;
  error: string;
}


// Global state for the worker
let zipData: Uint8Array | null = null;
let entries: ZipEntryMeta[] = [];
let indexingWorkerPort: MessagePort | null = null;
let dbWorkerPort: MessagePort | null = null;

// Helper to get current performance metadata for this worker

function isLikelyText(str: string): boolean {
  // Check first 1000 chars for binary content
  const sample = str.slice(0, 1000);
  for (let i = 0; i < sample.length; i++) {
    const code = sample.charCodeAt(i);
    // Allow common control chars (tab, newline, carriage return)
    if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
      return false;
    }
  }
  return true;
}

function initialize(message: InitializeMessage) {
  const { id, zipData: newZipData } = message;

  // Store the zip data globally in the worker
  zipData = newZipData;
  entries = [];

  const { unzip } = fflate;

  // Extract entries list without reading file contents
  unzip(zipData, {
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

        entries.push({
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
      self.postMessage({
        type: 'initializeComplete',
        id,
        success: false,
        error: err.message,
      } as InitializeResponse);
    } else {
      self.postMessage({
        type: 'initializeComplete',
        id,
        success: true,
        entries,
      } as InitializeResponse);
    }
  });
}

function getEntries(message: GetEntriesMessage) {
  const { id } = message;

  self.postMessage({
    type: 'getEntriesComplete',
    id,
    entries,
  } as GetEntriesResponse);
}

function readFile(message: ReadFileMessage) {
  const { id, path } = message;

  if (!zipData) {
    self.postMessage({
      type: 'error',
      id,
      error: 'Zip data not initialized'
    } as ErrorResponse);
    return;
  }

  const { unzip } = fflate;

  const pathsToTry = [path, `renamed_${path}`];

  unzip(zipData, {
    filter: (file) => pathsToTry.includes(file.name)
  }, (err, files) => {
    if (err) {
      self.postMessage({
        type: 'readFileComplete',
        id,
        success: false,
        error: err.message
      } as ReadFileResponse);
      return;
    }

    // Try the requested path first, then the renamed version
    let data = files[path];
    if (!data) {
      data = files[`renamed_${path}`];
    }

    if (!data) {
      self.postMessage({
        type: 'readFileComplete',
        id,
        success: false,
        error: `File not found in zip: ${path}`
      } as ReadFileResponse);
      return;
    }

    const bytes = data as Uint8Array;

    // Try to decode as text
    try {
      const text = new TextDecoder('utf-8').decode(bytes);
      if (isLikelyText(text)) {
        self.postMessage({
          type: 'readFileComplete',
          id,
          success: true,
          result: { text, bytes }
        } as ReadFileResponse);
      } else {
        self.postMessage({
          type: 'readFileComplete',
          id,
          success: true,
          result: { bytes }
        } as ReadFileResponse);
      }
    } catch (decodeError) {
      self.postMessage({
        type: 'readFileComplete',
        id,
        success: true,
        result: { bytes }
      } as ReadFileResponse);
    }
  });
}

function readFileChunked(message: ReadFileChunkedMessage) {
  const { id, path, chunkSize = 8192 } = message;

  if (!zipData) {
    self.postMessage({
      type: 'error',
      id,
      error: 'Zip data not initialized'
    } as ErrorResponse);
    return;
  }

  const { unzip } = fflate;
  const pathsToTry = [path, `renamed_${path}`];

  unzip(zipData, {
    filter: (file) => pathsToTry.includes(file.name)
  }, (err, files) => {
    if (err) {
      self.postMessage({
        type: 'error',
        id,
        error: err.message
      } as ErrorResponse);
      return;
    }

    // Try the requested path first, then the renamed version
    let data = files[path];
    if (!data) {
      data = files[`renamed_${path}`];
    }

    if (!data) {
      self.postMessage({
        type: 'error',
        id,
        error: `File not found in zip: ${path}`
      } as ErrorResponse);
      return;
    }

    const bytes = data as Uint8Array;

    // Try to decode as text
    try {
      const text = new TextDecoder('utf-8').decode(bytes);
      if (isLikelyText(text)) {
        // Send text in chunks
        const totalLength = text.length;
        let sent = 0;

        const sendChunk = () => {
          if (sent >= totalLength) {
            self.postMessage({
              type: 'readFileChunk',
              id,
              chunk: '',
              progress: { loaded: totalLength, total: totalLength, done: true }
            } as ReadFileChunkResponse);
            return;
          }

          const chunk = text.slice(sent, sent + chunkSize);
          sent += chunk.length;

          self.postMessage({
            type: 'readFileChunk',
            id,
            chunk,
            progress: { loaded: sent, total: totalLength, done: sent >= totalLength }
          } as ReadFileChunkResponse);

          // Schedule next chunk
          if (sent < totalLength) {
            setTimeout(sendChunk, 0);
          }
        };

        sendChunk();
      } else {
        self.postMessage({
          type: 'error',
          id,
          error: 'File is not text content'
        } as ErrorResponse);
      }
    } catch (decodeError) {
      self.postMessage({
        type: 'error',
        id,
        error: 'Failed to decode file as text'
      } as ErrorResponse);
    }
  });
}

function setIndexingWorkerPort(port: MessagePort) {
  indexingWorkerPort = port;

  // Start the port to enable message receiving
  indexingWorkerPort.start();

  // Listen for messages from indexing worker
  indexingWorkerPort.onmessage = (event) => {
    const message = event.data;

    // Handle the message (same logic as main thread messages)
    switch (message.type) {
      case 'readFile':
        readFileForIndexingWorker(message);
        break;
      default:
        console.error('Unknown indexing worker message type:', message.type);
    }
  };
}

function setDbWorkerPort(port: MessagePort) {
  dbWorkerPort = port;

  // Start the port to enable message receiving
  dbWorkerPort.start();

  // Listen for messages from DB worker
  dbWorkerPort.onmessage = (event) => {
    const message = event.data;

    // Handle the message (same logic as main thread messages)
    switch (message.type) {
      case 'readFile':
        readFileForDbWorker(message);
        break;
      case 'readMultipleFiles':
        readMultipleFilesForDbWorker(message);
        break;
      default:
        console.error('Unknown DB worker message type:', message.type);
    }
  };
}

function readFileForIndexingWorker(message: any) {
  const { id, path } = message;


  if (!zipData) {
    console.error('🔧 Zip worker: No zip data initialized!');
    if (indexingWorkerPort) {
      indexingWorkerPort.postMessage({
        type: 'readFileComplete',
        id,
        success: false,
        error: 'Zip data not initialized'
      });
    }
    return;
  }

  const { unzip } = fflate;
  const pathsToTry = [path, `renamed_${path}`];


  unzip(zipData, {
    filter: (file) => pathsToTry.includes(file.name)
  }, (err, files) => {
    if (err) {
      console.error('🔧 Zip worker: Unzip failed for indexing worker:', err.message);
      if (indexingWorkerPort) {
        indexingWorkerPort.postMessage({
          type: 'readFileComplete',
          id,
          success: false,
          error: err.message
        });
      }
      return;
    }

    try {
      // Try original path first, then renamed version
      const originalFile = files[path];
      const renamedFile = files[`renamed_${path}`];
      const file = originalFile || renamedFile;

      if (!file) {
        if (indexingWorkerPort) {
          indexingWorkerPort.postMessage({
            type: 'readFileComplete',
            id,
            success: false,
            error: 'File not found'
          });
        }
        return;
      }

      // Try to decode as text first
      const text = new TextDecoder('utf-8', { fatal: false }).decode(file);
      let result: { text?: string; bytes?: Uint8Array };

      if (isLikelyText(text)) {
        result = { text };
      } else {
        result = { bytes: file };
      }


      if (indexingWorkerPort) {
        indexingWorkerPort.postMessage({
          type: 'readFileComplete',
          id,
          success: true,
          result
        });
      }

    } catch (fileError) {
      console.error('🔧 Zip worker: Error processing file for indexing worker:', fileError);
      if (indexingWorkerPort) {
        indexingWorkerPort.postMessage({
          type: 'readFileComplete',
          id,
          success: false,
          error: fileError instanceof Error ? fileError.message : 'Unknown error'
        });
      }
    }
  });
}


function readFileForDbWorker(message: any) {
  const { id, path } = message;


  if (!zipData) {
    console.error('🔧 Zip worker: No zip data initialized!');
    if (dbWorkerPort) {
      dbWorkerPort.postMessage({
        type: 'readFileComplete',
        id,
        success: false,
        error: 'Zip data not initialized'
      });
    }
    return;
  }

  const { unzip } = fflate;
  const pathsToTry = [path, `renamed_${path}`];


  unzip(zipData, {
    filter: (file) => pathsToTry.includes(file.name)
  }, (err, files) => {
    if (err) {
      console.error('🔧 Zip worker: Unzip failed for DB worker:', err.message);
      if (dbWorkerPort) {
        dbWorkerPort.postMessage({
          type: 'readFileComplete',
          id,
          success: false,
          error: err.message
        });
      }
      return;
    }

    try {
      // Try original path first, then renamed version
      const originalFile = files[path];
      const renamedFile = files[`renamed_${path}`];
      const file = originalFile || renamedFile;

      if (!file) {
        if (dbWorkerPort) {
          dbWorkerPort.postMessage({
            type: 'readFileComplete',
            id,
            success: false,
            error: 'File not found'
          });
        }
        return;
      }

      // Try to decode as text first
      const text = new TextDecoder('utf-8', { fatal: false }).decode(file);
      let result: { text?: string; bytes?: Uint8Array };

      if (isLikelyText(text)) {
        result = { text };
      } else {
        result = { bytes: file };
      }


      if (dbWorkerPort) {
        dbWorkerPort.postMessage({
          type: 'readFileComplete',
          id,
          success: true,
          result
        });
      }

    } catch (fileError) {
      console.error('🔧 Zip worker: Error processing file for DB worker:', fileError);
      if (dbWorkerPort) {
        dbWorkerPort.postMessage({
          type: 'readFileComplete',
          id,
          success: false,
          error: fileError instanceof Error ? fileError.message : 'Unknown error'
        });
      }
    }
  });
}

function readMultipleFilesForDbWorker(message: any) {
  const { id, paths } = message;


  if (!zipData) {
    console.error('🔧 Zip worker: No zip data initialized!');
    if (dbWorkerPort) {
      dbWorkerPort.postMessage({
        type: 'error',
        id,
        error: 'Zip data not initialized'
      });
    }
    return;
  }

  const { unzip } = fflate;
  const allPathsToTry: string[] = [];

  // Build list of all paths to try (including renamed versions)
  for (const path of paths) {
    allPathsToTry.push(path, `renamed_${path}`);
  }


  unzip(zipData, {
    filter: (file) => allPathsToTry.includes(file.name)
  }, (err, files) => {
    if (err) {
      console.error('🔧 Zip worker: Unzip failed for DB worker:', err.message);
      if (dbWorkerPort) {
        dbWorkerPort.postMessage({
          type: 'readMultipleFilesComplete',
          id,
          success: false,
          error: err.message
        });
      }
      return;
    }

    const results: Array<{ path: string; text?: string; bytes?: Uint8Array; error?: string }> = [];

    // Process each requested path
    for (const path of paths) {
      try {
        // Try original path first, then renamed version
        const originalFile = files[path];
        const renamedFile = files[`renamed_${path}`];
        const file = originalFile || renamedFile;

        if (!file) {
          results.push({ path, error: 'File not found' });
          continue;
        }

        // Try to decode as text first
        const text = new TextDecoder('utf-8', { fatal: false }).decode(file);
        if (isLikelyText(text)) {
          results.push({ path, text });
        } else {
          results.push({ path, bytes: file });
        }
      } catch (fileError) {
        results.push({
          path,
          error: fileError instanceof Error ? fileError.message : 'Unknown error'
        });
      }
    }


    if (dbWorkerPort) {
      dbWorkerPort.postMessage({
        type: 'readMultipleFilesComplete',
        id,
        success: true,
        results
      });
    }
  });
}

// Handle messages from main thread and other workers
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const message = event.data;


  switch (message.type) {
    case 'initialize':
      initialize(message);
      break;
    case 'getEntries':
      getEntries(message);
      break;
    case 'readFile':
      readFile(message);
      break;
    case 'readFileChunked':
      readFileChunked(message);
      break;
    case 'setIndexingWorkerPort':
      setIndexingWorkerPort((message as SetIndexingWorkerPortMessage).port);
      break;
    case 'setDbWorkerPort':
      setDbWorkerPort((message as SetDbWorkerPortMessage).port);
      break;
    default:
      console.error('Unknown worker message type:', (message as any).type);
      self.postMessage({
        type: 'error',
        id: (message as any).id || 'unknown',
        error: `Unknown message type: ${(message as any).type}`
      } as ErrorResponse);
  }
};

// Export for TypeScript
export {};