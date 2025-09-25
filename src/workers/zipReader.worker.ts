/**
 * Centralized Zip Worker - manages the entire zip file and handles all zip operations
 * Other workers can message this worker to get file lists and read individual files
 */

import * as fflate from "fflate";
import type { ZipEntryMeta } from "../state/types";

interface InitializeMessage {
  type: "initialize";
  id: string;
  zipData: Uint8Array;
}

interface GetEntriesMessage {
  type: "getEntries";
  id: string;
}

interface ReadFileMessage {
  type: "readFile";
  id: string;
  path: string;
}

interface ReadFileChunkedMessage {
  type: "readFileChunked";
  id: string;
  path: string;
  chunkSize?: number;
}

type WorkerMessage =
  | InitializeMessage
  | GetEntriesMessage
  | ReadFileMessage
  | ReadFileChunkedMessage;

interface InitializeResponse {
  type: "initializeComplete";
  id: string;
  success: boolean;
  entries?: ZipEntryMeta[];
  error?: string;
}

interface GetEntriesResponse {
  type: "getEntriesComplete";
  id: string;
  entries: ZipEntryMeta[];
}



interface ErrorResponse {
  type: "error";
  id: string;
  error: string;
}

// Message format for centralized routing
interface RoutedMessage {
  to: string;
  from: string;
  id: string;
  type: string;
  [key: string]: any;
}

// Global state for the worker
let zipData: Uint8Array | null = null;
let entries: ZipEntryMeta[] = [];

// Helper to get current performance metadata for this worker


function initialize(message: InitializeMessage) {
  const { id, zipData: newZipData } = message;

  // Store the zip data globally in the worker
  zipData = newZipData;
  entries = [];

  const { unzip } = fflate;

  // Extract entries list without reading file contents
  unzip(
    zipData,
    {
      filter: (file) => {
        const path = file.name;
        const isDir = path.endsWith("/");
        const name = path.split("/").pop() || path;

        // Skip hidden files and system files
        const segments = path.split("/");
        const shouldSkip = segments.some(
          (segment) => segment.startsWith(".") || segment.startsWith("__"),
        );

        if (!shouldSkip) {
          // Remove 'renamed_' prefix from displayed path and name for cleaner UI
          const displayPath = path.startsWith("renamed_")
            ? path.slice(8)
            : path;
          const displayName = name.startsWith("renamed_")
            ? name.slice(8)
            : name;

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
      },
    },
    (err) => {
      if (err) {
        self.postMessage({
          type: "initializeComplete",
          id,
          success: false,
          error: err.message,
        } as InitializeResponse);
      } else {
        self.postMessage({
          type: "initializeComplete",
          id,
          success: true,
          entries,
        } as InitializeResponse);
      }
    },
  );
}

function getEntries(message: GetEntriesMessage) {
  const { id } = message;

  self.postMessage({
    type: "getEntriesComplete",
    id,
    entries,
  } as GetEntriesResponse);
}


function readFile(message: ReadFileMessage) {
  const { id, path } = message;

  if (!zipData) {
    self.postMessage({
      type: "error",
      id,
      error: "Zip data not initialized",
    } as ErrorResponse);
    return;
  }

  const { unzip } = fflate;
  const pathsToTry = [path, `renamed_${path}`];

  unzip(
    zipData,
    {
      filter: (file) => pathsToTry.includes(file.name),
    },
    (err, files) => {
      if (err) {
        self.postMessage({
          type: "readFileComplete",
          id,
          success: false,
          error: err.message,
        });
        return;
      }

      // Try the requested path first, then the renamed version
      let data = files[path];
      if (!data) {
        data = files[`renamed_${path}`];
      }

      if (!data) {
        self.postMessage({
          type: "readFileComplete",
          id,
          success: false,
          error: `File not found in zip: ${path}`,
        });
        return;
      }

      const bytes = data as Uint8Array;

      // Return bytes only - let caller decide how to decode
      self.postMessage({
        type: "readFileComplete",
        id,
        success: true,
        result: { bytes },
      });
    },
  );
}

// Helper function to send messages with optional routing
function sendResponse(response: any, routeTo?: string) {
  if (routeTo) {
    // Send as routed message
    self.postMessage({
      to: routeTo,
      from: "zipWorker",
      ...response,
    } as RoutedMessage);
  } else {
    // Send as direct message
    self.postMessage(response);
  }
}

function readFileChunked(message: ReadFileChunkedMessage & { _routeTo?: string }) {
  const { id, path, chunkSize = 131072, _routeTo } = message;

  if (!zipData) {
    sendResponse({
      type: "error",
      id,
      error: "Zip data not initialized",
    }, _routeTo);
    return;
  }

  const { unzip } = fflate;
  const pathsToTry = [path, `renamed_${path}`];

  unzip(
    zipData,
    {
      filter: (file) => pathsToTry.includes(file.name),
    },
    (err, files) => {
      if (err) {
        console.log(`🗜️  Zip Worker: Decompression failed for ${path}:`, err.message);
        sendResponse({
          type: "error",
          id,
          error: err.message,
        }, _routeTo);
        return;
      }

      // Try the requested path first, then the renamed version
      let data = files[path];
      if (!data) {
        data = files[`renamed_${path}`];
      }

      if (!data) {
        sendResponse({
          type: "error",
          id,
          error: `File not found in zip: ${path}`,
        }, _routeTo);
        return;
      }

      const bytes = data as Uint8Array;

      // Send bytes in chunks - let caller decode as needed
      const totalLength = bytes.length;
      let sent = 0;

      const sendChunk = () => {
        if (sent >= totalLength) {
          return;
        }

        const end = Math.min(sent + chunkSize, totalLength);
        const chunk = bytes.slice(sent, end);
        sent = end;
        const isDone = sent >= totalLength;

        sendResponse({
          type: "readFileChunk",
          id,
          chunk,
          progress: {
            loaded: sent,
            total: totalLength,
            done: isDone,
          },
        }, _routeTo);

        if (!isDone) {
          sendChunk();
        }
      };

      sendChunk();
    },
  );
}

// Handle routed messages from other workers
function handleRoutedMessage(message: RoutedMessage) {
  const { from, type } = message;

  switch (type) {
    case "readFile":
      // Convert routed message to standard format and process with chunked response
      readFileChunked({
        type: "readFileChunked",
        id: message.id,
        path: message.path,
        chunkSize: message.chunkSize,
        // Add routing info so responses can be routed back
        _routeTo: from,
      } as any);
      break;
    default:
      console.error(`Unknown routed message type: ${type} from ${from}`);
      // Send error response back through main thread
      self.postMessage({
        to: from,
        from: "zipWorker",
        type: "error",
        id: message.id,
        error: `Unknown message type: ${type}`,
      } as RoutedMessage);
  }
}




// Handle messages from main thread and other workers
self.onmessage = (event: MessageEvent<WorkerMessage | RoutedMessage>) => {
  const message = event.data;

  // Check if this is a routed message (has 'to' and 'from' fields)
  if ('to' in message && 'from' in message) {
    handleRoutedMessage(message as RoutedMessage);
    return;
  }

  // Handle direct messages to this worker
  const directMessage = message as WorkerMessage;
  switch (directMessage.type) {
    case "initialize":
      initialize(directMessage);
      break;
    case "getEntries":
      getEntries(directMessage);
      break;
    case "readFile":
      readFile(directMessage);
      break;
    case "readFileChunked":
      readFileChunked(directMessage as ReadFileChunkedMessage);
      break;
    default:
      console.error("Unknown worker message type:", (directMessage as any).type);
      self.postMessage({
        type: "error",
        id: (directMessage as any).id || "unknown",
        error: `Unknown message type: ${(directMessage as any).type}`,
      } as ErrorResponse);
  }
};

// Export for TypeScript
export {};
