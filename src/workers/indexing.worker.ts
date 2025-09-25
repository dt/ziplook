/**
 * Indexing Worker - handles log file parsing and search index building
 * Messages the zip worker to get file contents
 * Manages FlexSearch index for fast text search
 */

import { LogSearchIndex } from "../services/logSearchIndex";
import { LogParser } from "../services/logParser";
import { QueryParser } from "../services/queryParser";

// Message format for centralized routing
interface RoutedMessage {
  to: string;
  from: string;
  id: string;
  type: string;
  [key: string]: any;
}

interface IndexingProgressResponse {
  type: "indexingProgress";
  id: string;
  current: number;
  total: number;
  fileName: string;
}

interface IndexingCompleteResponse {
  type: "indexingComplete";
  id: string;
  success: boolean;
  totalEntries: number;
  error?: string;
  ruleDescription?: string;
}

interface IndexingFileResultResponse {
  type: "indexingFileResult";
  id: string;
  filePath: string;
  entries: any[];
}

interface IndexingErrorResponse {
  type: "indexingError";
  id: string;
  error: string;
}


// Global state
let pendingZipRequests = new Map<string, {
  resolve: (value: any) => void;
  reject: (error: Error) => void;
  timeoutId: NodeJS.Timeout;
  chunks: Uint8Array[];
  totalBytes: Uint8Array | null;
}>();
let currentIndexingId: string | null = null;
let shouldStop = false;
let globalEntryIdCounter = 0; // Global counter to ensure unique IDs across all files

// Initialize search index when worker boots
const searchIndex = new LogSearchIndex();

// Registered files map
let registeredFiles = new Map<string, { path: string; name: string; size: number }>();

// Helper to send responses with or without routing
function sendResponse(message: any, response: any) {
  if (message.from) {
    // Routed response
    self.postMessage({ ...response, to: message.from, from: "indexingWorker" });
  } else {
    // Direct response
    self.postMessage(response);
  }
}

function sendMessageToZipWorker(message: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const id = message.id || `zip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Set timeout
    const timeoutId = setTimeout(() => {
      pendingZipRequests.delete(id);
      console.error(
        "🔧 Indexing worker: Zip worker request timeout for",
        message.type,
      );
      reject(new Error("Zip worker request timeout"));
    }, 30000);

    // Store the pending request
    pendingZipRequests.set(id, { resolve, reject, timeoutId, chunks: [], totalBytes: null });

    // Send routed message through main thread
    self.postMessage({
      to: "zipWorker",
      from: "indexingWorker",
      ...message,
      id
    } as RoutedMessage);
  });
}

// Handle routed messages from zip worker
function handleRoutedMessage(message: RoutedMessage) {

  // Handle zip worker responses
  if (message.from === "zipWorker") {
    const request = pendingZipRequests.get(message.id);
    if (!request) return;

    if (message.type === "error") {
      clearTimeout(request.timeoutId);
      pendingZipRequests.delete(message.id);
      request.reject(new Error(message.error));
      return;
    }

    if (message.type === "readFileChunk") {
      // Accumulate byte chunks
      request.chunks.push(message.bytes);

      if (message.done) {
        // All chunks received, concatenate bytes
        const totalLength = request.chunks.reduce((sum, chunk) => sum + chunk.length, 0);
        const totalBytes = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of request.chunks) {
          totalBytes.set(chunk, offset);
          offset += chunk.length;
        }

        clearTimeout(request.timeoutId);
        pendingZipRequests.delete(message.id);

        request.resolve({
          type: "readFileComplete",
          id: message.id,
          success: true,
          result: { bytes: totalBytes }
        });
      }
    }
    return;
  }

  // Handle indexing commands by message type regardless of source
  switch (message.type) {
    case "getFileStatuses":
      getFileStatuses(message);
      break;
    case "registerFiles":
      registerFiles(message);
      break;
    case "startIndexing":
      startIndexing(message);
      break;
    case "indexSingleFile":
      indexSingleFile(message);
      break;
    case "searchLogs":
      performSearch(message);
      break;
    case "stopIndexing":
      stopIndexing(message);
      break;
    default:
      console.error(`🔍 Indexing Worker: Unknown command: ${message.type}`);
  }
}

async function registerFiles(message: any) {
  const { id, files } = message;

  try {
    // Register files with the search index
    registeredFiles.clear();
    files.forEach((file: { path: string; name: string; size: number }) => {
      registeredFiles.set(file.path, file);
      searchIndex.registerFile(file.path, file.name, file.size);
    });

    // Send proactive file status update to UI
    const stats = searchIndex.getIndexStats();
    const fileStatuses = Array.from(stats.fileStatuses.values());
    self.postMessage({
      type: "fileStatusUpdate",
      fileStatuses: fileStatuses,
    });

    sendResponse(message, {
      type: "registerFilesResponse",
      id,
      success: true,
      result: { filesRegistered: files.length },
    });
  } catch (error) {
    sendResponse(message, {
      type: "registerFilesResponse",
      id,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

async function startIndexing(message: any) {
  const { id, filePaths } = message;

  try {
    let what = "";
    // If no filePaths provided, get all registered files and filter for log files
    let actualLogFiles = Array.from(registeredFiles.values());
    if (!filePaths) {
      let incomplete = false;
      actualLogFiles = actualLogFiles.filter(file => {
        if (!file.path.endsWith(".log")) {
          return false;
        }
        if (file.size > 20 * 1024 * 1024) {
          incomplete = true;
          return false;
        }
        return true;
      });
      if (incomplete) {
        what = "<20MB .log files";
      } else if (actualLogFiles.length > 0) {
        what = "all .log files";
      }
    } else {
      // Get file info from registered files
      actualLogFiles = filePaths.map((path: string) => {
        const fileInfo = registeredFiles.get(path);
        if (!fileInfo) {
          throw new Error(`File ${path} not registered`);
        }
        return fileInfo;
      });
      actualLogFiles = actualLogFiles.filter(file => file.path.endsWith(".log") || file.path.endsWith(".txt") || file.path.endsWith(".json"));

      if (actualLogFiles.length === 1) {
        what = `file: ${actualLogFiles[0].name}`;
      } else if (actualLogFiles.length > 1) {
        const extensions = [...new Set(actualLogFiles.map(f => {
          const ext = f.name.split('.').pop()?.toLowerCase();
          return ext ? `.${ext}` : '';
        }))].filter(Boolean);
        if (extensions.length === 1) {
          what = `${actualLogFiles.length} ${extensions[0]} files`;
        } else {
          what = `${actualLogFiles.length} selected files`;
        }
      }
    }

    if (actualLogFiles.length === 0) {
      self.postMessage({
        to: "mainThread",
        from: "indexingWorker",
        type: "indexingComplete",
        id,
        success: true,
        totalEntries: 0,
        ruleDescription: "No indexable files found"
      } as IndexingCompleteResponse);
      return;
    }

    currentIndexingId = id;
    shouldStop = false;

    const parser = new LogParser();
    let totalEntries = 0;

    // Process each log file individually
    for (let i = 0; i < actualLogFiles.length; i++) {
      if (shouldStop || currentIndexingId !== id) {
        break;
      }

      const logFile = actualLogFiles[i];

      // Send progress update to main thread via controller
      self.postMessage({
        to: "mainThread",
        from: "indexingWorker",
        type: "indexingProgress",
        id,
        current: i + 1,
        total: actualLogFiles.length,
        fileName: logFile.name,
      } as IndexingProgressResponse);

      try {
        // Request this single file from zip worker
        const fileResponse = await sendMessageToZipWorker({
          type: "readFileChunked",
          path: logFile.path,
        });

        if (!fileResponse.success) {
          console.warn(
            `🔧 Indexing worker: Failed to read ${logFile.path}:`,
            fileResponse.error,
          );

          // Mark file as error and send status update
          searchIndex.markFileAsError(logFile.path, fileResponse.error || "Failed to read file");
          const stats = searchIndex.getIndexStats();
          const fileStatuses = Array.from(stats.fileStatuses.values());
          self.postMessage({
            type: "fileStatusUpdate",
            fileStatuses: fileStatuses,
          });

          continue;
        }

        if (fileResponse.result?.bytes) {
          // Mark file as indexing in search index
          searchIndex.markFileAsIndexing(logFile.path);

          // Send proactive file status update to UI (file started indexing)
          const statsStart = searchIndex.getIndexStats();
          const fileStatusesStart = Array.from(statsStart.fileStatuses.values());
          self.postMessage({
            type: "fileStatusUpdate",
            fileStatuses: fileStatusesStart,
          });

          // Decode bytes to text for log parsing
          const text = new TextDecoder("utf-8").decode(fileResponse.result.bytes);

          // Parse the log file
          const parseResult = parser.parseLogFile(
            text,
            logFile.path,
          );
          totalEntries += parseResult.entries.length;

          // Add entries to search index with globally unique IDs
          parseResult.entries.forEach((entry) => {
            // Assign globally unique ID
            entry.id = ++globalEntryIdCounter;
            searchIndex.addLogEntry(entry);
          });

          // Mark file as indexed
          searchIndex.markFileAsIndexed(
            logFile.path,
            parseResult.entries.length,
          );

          // Send proactive file status update to UI
          const stats = searchIndex.getIndexStats();
          const fileStatuses = Array.from(stats.fileStatuses.values());
          self.postMessage({
            type: "fileStatusUpdate",
            fileStatuses: fileStatuses,
          });

          // Send result notification to main thread via controller
          self.postMessage({
            to: "mainThread",
            from: "indexingWorker",
            type: "indexingFileResult",
            id,
            filePath: logFile.path,
            entries: parseResult.entries,
          } as IndexingFileResultResponse);
        }

        // Brief pause to keep worker responsive and avoid overwhelming the system
        await new Promise((resolve) => setTimeout(resolve, 50));
      } catch (fileError) {
        console.warn(
          `🔧 Indexing worker: Error processing ${logFile.path}:`,
          fileError,
        );
        continue;
      }
    }

    if (!shouldStop && currentIndexingId === id) {
      self.postMessage({
        to: "mainThread",
        from: "indexingWorker",
        type: "indexingComplete",
        id,
        success: true,
        totalEntries,
        ruleDescription: what,
      } as IndexingCompleteResponse);
    } else {
    }
  } catch (error) {
    console.error("🔍 Indexing Worker: Error during startIndexing:", error);
    if (currentIndexingId === id) {
      self.postMessage({
        to: "mainThread",
        from: "indexingWorker",
        type: "indexingError",
        id,
        error: error instanceof Error ? error.message : "Unknown error",
      } as IndexingErrorResponse);
    }
  }
}

function stopIndexing(message: any) {
  const { id } = message;

  if (currentIndexingId === id) {
    shouldStop = true;
    currentIndexingId = null;
  }

  sendResponse(message, {
    type: "response",
    id,
    success: true
  });
}

async function indexSingleFile(message: any) {
  const { id, file } = message;

  try {

    // Mark file as indexing
    searchIndex.markFileAsIndexing(file.path);

    // Send proactive file status update to UI (file started indexing)
    const statsStart = searchIndex.getIndexStats();
    const fileStatusesStart = Array.from(statsStart.fileStatuses.values());
    self.postMessage({
      type: "fileStatusUpdate",
      fileStatuses: fileStatusesStart,
    });

    // Send progress update
    self.postMessage({
      type: "indexingProgress",
      id,
      current: 1,
      total: 1,
      fileName: file.name,
    } as IndexingProgressResponse);

    // Request file content from zip worker
    const fileResponse = await sendMessageToZipWorker({
      type: "readFileChunked",
      path: file.path,
    });

    if (!fileResponse.success) {
      searchIndex.markFileAsError(
        file.path,
        fileResponse.error || "Failed to read file",
      );
      sendResponse(message, {
        type: "response",
        id,
        success: false,
        error: fileResponse.error || "Failed to read file"
      });
      return;
    }

    if (fileResponse.result?.bytes) {
      // Decode bytes to text for log parsing
      const text = new TextDecoder("utf-8").decode(fileResponse.result.bytes);

      // Parse the log file
      const parser = new LogParser();
      const parseResult = parser.parseLogFile(
        text,
        file.path,
      );

      // Add entries to search index with globally unique IDs
      parseResult.entries.forEach((entry) => {
        entry.id = ++globalEntryIdCounter;
        searchIndex.addLogEntry(entry);
      });

      // Mark file as indexed
      searchIndex.markFileAsIndexed(file.path, parseResult.entries.length);

      // Send completion notification to main thread via controller
      self.postMessage({
        to: "mainThread",
        from: "indexingWorker",
        type: "indexingFileResult",
        id,
        filePath: file.path,
        entries: parseResult.entries,
      } as IndexingFileResultResponse);

      self.postMessage({
        to: "mainThread",
        from: "indexingWorker",
        type: "indexingComplete",
        id,
        success: true,
        totalEntries: parseResult.entries.length,
        ruleDescription: undefined, // Single file indexing doesn't include rule description
      } as IndexingCompleteResponse);

      // Send final file status update to UI (file completed indexing)
      const statsEnd = searchIndex.getIndexStats();
      const fileStatusesEnd = Array.from(statsEnd.fileStatuses.values());
      self.postMessage({
        type: "fileStatusUpdate",
        fileStatuses: fileStatusesEnd,
      });

      sendResponse(message, {
        type: "response",
        id,
        success: true,
      });
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    searchIndex.markFileAsError(file.path, errorMessage);

    self.postMessage({
      to: "mainThread",
      from: "indexingWorker",
      type: "indexingError",
      id,
      error: errorMessage,
    } as IndexingErrorResponse);

    // Send final file status update to UI (file failed indexing)
    const statsError = searchIndex.getIndexStats();
    const fileStatusesError = Array.from(statsError.fileStatuses.values());
    self.postMessage({
      type: "fileStatusUpdate",
      fileStatuses: fileStatusesError,
    });

    sendResponse(message, {
      type: "response",
      id,
      success: false,
      error: errorMessage,
    });
  }
}

async function performSearch(message: any) {
  const { id, query } = message;


  try {
    // Check if search index is ready
    if (!searchIndex.isIndexReady()) {
      sendResponse(message, {
        type: "searchResponse",
        id,
        success: false,
        error: "Search index not ready",
      });
      return;
    }

    // Parse the query
    const parsedQuery = QueryParser.parse(query);

    // Perform the search
    const results = await searchIndex.searchWithParsedQuery(parsedQuery);

    // Send results back
    sendResponse(message, {
      type: "searchResponse",
      id,
      success: true,
      result: results,
    });
  } catch (error) {
    console.error("🔍 Indexing worker: Search error:", error);
    sendResponse(message, {
      type: "searchResponse",
      id,
      success: false,
      error: error instanceof Error ? error.message : "Unknown search error",
    });
  }
}

async function getFileStatuses(message: any) {
  const { id } = message;

  try {
    const stats = searchIndex.getIndexStats();
    const fileStatuses = Array.from(stats.fileStatuses.values());

    sendResponse(message, {
      type: "fileStatuses",
      id,
      success: true,
      result: fileStatuses,
    });
  } catch (error) {
    console.error("🔍 Indexing worker: Get file statuses error:", error);
    sendResponse(message, {
      type: "fileStatuses",
      id,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// Handle routed messages from controller only
self.onmessage = (event: MessageEvent<RoutedMessage>) => {
  const message = event.data;

  // All messages should be routed through controller
  if ('to' in message && 'from' in message) {
    handleRoutedMessage(message as RoutedMessage);
    return;
  }

  console.error("Indexing worker received non-routed message:", message);
};

// Export for TypeScript
export {};