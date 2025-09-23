/**
 * Indexing Worker - handles log file parsing and search index building
 * Messages the zip worker to get file contents
 * Manages FlexSearch index for fast text search
 */

import { LogSearchIndex } from "../services/logSearchIndex";
import { LogParser } from "../services/logParser";
import { QueryParser } from "../services/queryParser";

interface SetZipWorkerPortMessage {
  type: "setZipWorkerPort";
  port: MessagePort;
}

interface RegisterFilesMessage {
  type: "registerFiles";
  id: string;
  files: Array<{ path: string; name: string; size: number }>;
}

interface StartIndexingMessage {
  type: "startIndexing";
  id: string;
  filePaths: string[]; // Just paths of already-registered files to index
}

interface IndexSingleFileMessage {
  type: "indexSingleFile";
  id: string;
  file: { path: string; name: string; size: number };
}

interface StopIndexingMessage {
  type: "stopIndexing";
  id: string;
}

interface SearchMessage {
  type: "search";
  id: string;
  query: string;
}

interface GetFileStatusesMessage {
  type: "getFileStatuses";
  id: string;
}

interface SearchResponseMessage {
  type: "searchResponse";
  id: string;
  success: boolean;
  results?: any[];
  error?: string;
}

type IndexingWorkerMessage =
  | SetZipWorkerPortMessage
  | RegisterFilesMessage
  | StartIndexingMessage
  | IndexSingleFileMessage
  | StopIndexingMessage
  | SearchMessage
  | GetFileStatusesMessage;

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

interface FileStatusesResponse {
  type: "fileStatuses";
  id: string;
  success: boolean;
  fileStatuses?: Array<{
    path: string;
    name: string;
    size: number;
    status: "unindexed" | "indexing" | "indexed" | "error";
    entries?: number;
    indexedAt?: Date;
    error?: string;
  }>;
  error?: string;
}

// Global state
let zipWorker: MessagePort | null = null;
let currentIndexingId: string | null = null;
let shouldStop = false;
let globalEntryIdCounter = 0; // Global counter to ensure unique IDs across all files

// Initialize search index when worker boots
const searchIndex = new LogSearchIndex();

// Using imported LogParser instead of local WorkerLogParser

function sendMessageToZipWorker(message: any): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!zipWorker) {
      console.error("🔧 Indexing worker: Zip worker not available!");
      reject(new Error("Zip worker not available"));
      return;
    }

    const id = `zip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const timeoutId = setTimeout(() => {
      console.error(
        "🔧 Indexing worker: Zip worker request timeout for",
        message.type,
      );
      reject(new Error("Zip worker request timeout"));
    }, 30000); // 30 second timeout

    const handler = (event: MessageEvent) => {
      const response = event.data;
      if (response.id === id) {
        clearTimeout(timeoutId);
        zipWorker!.onmessage = null; // Clear the handler
        resolve(response);
      }
    };

    // Store the current handler so we can restore it later
    const originalHandler = zipWorker.onmessage;
    zipWorker.onmessage = (event) => {
      handler(event);
      // If this wasn't our response, call the original handler
      if (event.data.id !== id && originalHandler) {
        originalHandler.call(zipWorker!, event);
      }
    };

    zipWorker.postMessage({ ...message, id });
  });
}

function setZipWorkerPort(message: SetZipWorkerPortMessage) {
  zipWorker = message.port;

  // Start the port to enable message receiving
  zipWorker.start();
}

async function registerFiles(message: RegisterFilesMessage) {
  const { id, files } = message;

  // Register all files in the search index as unindexed
  files.forEach((file) => {
    searchIndex.registerFile(file.path, file.name, file.size);
  });

  // Auto-queue log files for indexing
  const logFiles = files.filter(
    (file) =>
      file.path.endsWith(".log") ||
      file.path.includes("cockroach.log") ||
      file.path.includes("stderr") ||
      file.path.includes("stdout"),
  );

  if (logFiles.length > 0) {
    // Start indexing the log files automatically
    await startIndexing({
      type: "startIndexing",
      id: `auto_${id}`,
      filePaths: logFiles.map((f) => f.path),
    });
  }
}

async function startIndexing(message: StartIndexingMessage) {
  const { id, filePaths } = message;

  currentIndexingId = id;
  shouldStop = false;

  // Get file info from search index registry
  const stats = searchIndex.getIndexStats();
  const filesToIndex = filePaths.map((path) => {
    const fileStatus = stats.fileStatuses.get(path);
    if (!fileStatus) {
      throw new Error(`File ${path} not registered in search index`);
    }
    return {
      path: fileStatus.path,
      name: fileStatus.name,
      size: fileStatus.size,
    };
  });

  const actualLogFiles = filesToIndex;

  const parser = new LogParser();
  let totalEntries = 0;

  try {
    // Process each log file individually
    for (let i = 0; i < actualLogFiles.length; i++) {
      if (shouldStop || currentIndexingId !== id) {
        break;
      }

      const logFile = actualLogFiles[i];

      // Send progress update
      self.postMessage({
        type: "indexingProgress",
        id,
        current: i + 1,
        total: actualLogFiles.length,
        fileName: logFile.name,
      } as IndexingProgressResponse);

      try {
        // Request this single file from zip worker
        const fileResponse = await sendMessageToZipWorker({
          type: "readFile",
          path: logFile.path,
        });

        if (!fileResponse.success) {
          console.warn(
            `🔧 Indexing worker: Failed to read ${logFile.path}:`,
            fileResponse.error,
          );
          continue;
        }

        if (fileResponse.result?.text) {
          // Mark file as indexing in search index
          searchIndex.markFileAsIndexing(logFile.path);

          // Parse the log file
          const parseResult = parser.parseLogFile(
            fileResponse.result.text,
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

          // Send result notification (but not the entries themselves)
          self.postMessage({
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
        type: "indexingComplete",
        id,
        success: true,
        totalEntries,
        ruleDescription: actualLogFiles.length > 0 ? "(*.log)" : undefined,
      } as IndexingCompleteResponse);
    }
  } catch (error) {
    if (currentIndexingId === id) {
      self.postMessage({
        type: "indexingError",
        id,
        error: error instanceof Error ? error.message : "Unknown error",
      } as IndexingErrorResponse);
    }
  }
}

function stopIndexing(message: StopIndexingMessage) {
  const { id } = message;

  if (currentIndexingId === id) {
    shouldStop = true;
    currentIndexingId = null;
  }
}

async function indexSingleFile(message: IndexSingleFileMessage) {
  const { id, file } = message;

  // Manual indexing allows any file type - user decides what they want to search

  try {
    // Mark file as indexing
    searchIndex.markFileAsIndexing(file.path);

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
      type: "readFile",
      path: file.path,
    });

    if (!fileResponse.success) {
      searchIndex.markFileAsError(
        file.path,
        fileResponse.error || "Failed to read file",
      );
      return;
    }

    if (fileResponse.result?.text) {
      // Parse the log file
      const parser = new LogParser();
      const parseResult = parser.parseLogFile(
        fileResponse.result.text,
        file.path,
      );

      // Add entries to search index with globally unique IDs
      parseResult.entries.forEach((entry) => {
        entry.id = ++globalEntryIdCounter;
        searchIndex.addLogEntry(entry);
      });

      // Mark file as indexed
      searchIndex.markFileAsIndexed(file.path, parseResult.entries.length);

      // Send completion notification
      self.postMessage({
        type: "indexingFileResult",
        id,
        filePath: file.path,
        entries: parseResult.entries,
      } as IndexingFileResultResponse);

      self.postMessage({
        type: "indexingComplete",
        id,
        success: true,
        totalEntries: parseResult.entries.length,
        ruleDescription: undefined, // Single file indexing doesn't include rule description
      } as IndexingCompleteResponse);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    searchIndex.markFileAsError(file.path, errorMessage);

    self.postMessage({
      type: "indexingError",
      id,
      error: errorMessage,
    } as IndexingErrorResponse);
  }
}

async function performSearch(message: SearchMessage) {
  const { id, query } = message;

  console.log(`🔍 Indexing worker: Search request for "${query}"`);

  try {
    // Check if search index is ready
    if (!searchIndex.isIndexReady()) {
      console.log("🔍 Search index not ready");
      self.postMessage({
        type: "searchResponse",
        id,
        success: false,
        error: "Search index not ready",
      } as SearchResponseMessage);
      return;
    }

    // Get current stats
    const stats = searchIndex.getIndexStats();
    console.log(`🔍 Search index stats:`, {
      totalEntries: stats.totalEntries,
      indexedFiles: stats.indexedFiles.size,
      fileStatusesCount: stats.fileStatuses.size,
    });

    // Parse the query
    const parsedQuery = QueryParser.parse(query);
    console.log(`🔍 Parsed query:`, parsedQuery);

    // Perform the search
    const results = await searchIndex.searchWithParsedQuery(parsedQuery);
    console.log(`🔍 Search completed with ${results.length} results`);

    // Log sample results
    if (results.length > 0) {
      console.log(
        `🔍 Sample results:`,
        results.slice(0, 3).map((r) => ({
          id: r.id,
          file: r.file,
          startLine: r.startLine,
          messagePreview: r.message.substring(0, 100) + "...",
        })),
      );
    }

    // Send results back
    self.postMessage({
      type: "searchResponse",
      id,
      success: true,
      results,
    } as SearchResponseMessage);
  } catch (error) {
    console.error("🔍 Indexing worker: Search error:", error);
    self.postMessage({
      type: "searchResponse",
      id,
      success: false,
      error: error instanceof Error ? error.message : "Unknown search error",
    } as SearchResponseMessage);
  }
}

async function getFileStatuses(message: GetFileStatusesMessage) {
  const { id } = message;

  try {
    const stats = searchIndex.getIndexStats();
    const fileStatuses = Array.from(stats.fileStatuses.values());

    self.postMessage({
      type: "fileStatuses",
      id,
      success: true,
      fileStatuses,
    } as FileStatusesResponse);
  } catch (error) {
    console.error("🔍 Indexing worker: Get file statuses error:", error);
    self.postMessage({
      type: "fileStatuses",
      id,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    } as FileStatusesResponse);
  }
}

// Handle messages from main thread
self.onmessage = (event: MessageEvent<IndexingWorkerMessage>) => {
  const message = event.data;

  switch (message.type) {
    case "setZipWorkerPort":
      setZipWorkerPort(message);
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
    case "stopIndexing":
      stopIndexing(message);
      break;
    case "search":
      performSearch(message);
      break;
    case "getFileStatuses":
      getFileStatuses(message);
      break;
    default:
      console.error(
        "Unknown indexing worker message type:",
        (message as any).type,
      );
  }
};

// Export for TypeScript
export {};
