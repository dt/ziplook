/**
 * Controller Worker - drives all business logic and coordinates other workers
 * Main thread is purely reactive, just responding to notifications
 */

import type { ZipEntryMeta } from "../state/types";

// Extend worker scope with typed state
declare const self: Worker & {
  zipEntries?: ZipEntryMeta[];
};

// Notification types sent to main thread
interface Notification {
  type: string;
  [key: string]: unknown;
}

// Main thread command types
interface Command {
  type: string; // Any command type - pure envelope routing
  to?: string; // Target worker for envelope routing
  id?: string;
  [key: string]: unknown;
}

// Response type for pending requests
interface WorkerResponse {
  success: boolean;
  result?: unknown;
  error?: string;
  type?: string;
  entries?: unknown;
  bytes?: unknown;
  done?: boolean;
}

// Pending request handler
interface PendingRequest {
  resolve: (response: WorkerResponse) => void;
  reject: (error: Error) => void;
}

// Table preparation logic removed - DB worker now handles this

// Controller state
let zipWorker: Worker | null = null;
let dbWorker: Worker | null = null;
let indexingWorker: Worker | null = null;
const workers: Map<string, Worker> = new Map();
let initialized = false;
let stackParsingCompleted = false;

// Pending requests from main thread
const pendingRequests = new Map<string, PendingRequest>();

// Helper to send notifications to main thread
function notify(notification: Notification) {
  self.postMessage({ ...notification, messageType: "notification" });
}

// Helper to generate request IDs
function generateId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Initialize all workers
async function initializeController(): Promise<void> {
  if (initialized) return;

  try {
    notify({ type: "status", message: "Initializing workers..." });

    // Create zip worker using Vite's worker system
    try {
      // Attempting to create zip worker
      const ZipReaderWorker = (await import("./zipReader.worker.ts?worker"))
        .default;
      zipWorker = new ZipReaderWorker();
      // Zip worker created successfully

      zipWorker.onmessage = (event) => handleWorkerMessage("zipWorker", event);
      zipWorker.onerror = (event) => {
        console.error("❌ Zip worker error event:", event);
        if (event instanceof ErrorEvent) {
          console.error("❌ Zip worker ErrorEvent details:", {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error,
          });
        }
      };

      zipWorker.onmessageerror = (event) => {
        console.error("❌ Zip worker message error:", event);
      };
    } catch (creationError: unknown) {
      console.error("❌ Failed to create zip worker:", creationError);
      const error =
        creationError instanceof Error
          ? creationError
          : new Error(String(creationError));
      console.error("❌ Creation error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }

    // Create DB worker using Vite's worker system
    try {
      const DbWorker = (await import("./db.worker.ts?worker")).default;
      dbWorker = new DbWorker();
      dbWorker.onmessage = (event) => handleWorkerMessage("dbWorker", event);
      dbWorker.onerror = (error) => console.error("❌ DB worker error:", error);
    } catch (error) {
      console.error("❌ Failed to create DB worker:", error);
    }

    // Create indexing worker using Vite's worker system
    try {
      const IndexingWorker = (await import("./indexing.worker.ts?worker"))
        .default;
      indexingWorker = new IndexingWorker();
      indexingWorker.onmessage = (event) =>
        handleWorkerMessage("indexingWorker", event);
      indexingWorker.onerror = (error) =>
        console.error("❌ Indexing worker error:", error);
    } catch (error) {
      console.error("❌ Failed to create indexing worker:", error);
    }

    // Register workers for routing (only if they were created successfully)
    if (zipWorker) workers.set("zipWorker", zipWorker);
    if (dbWorker) workers.set("dbWorker", dbWorker);
    if (indexingWorker) workers.set("indexingWorker", indexingWorker);

    // Initialize database
    await initializeDatabase();

    initialized = true;
    // All workers initialized
    notify({ type: "status", message: "Workers ready" });
  } catch (error) {
    console.error("❌ Controller: Failed to initialize:", error);
    notify({
      type: "error",
      message: `Failed to initialize: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
    throw error;
  }
}

// Initialize database
async function initializeDatabase(): Promise<void> {
  if (!dbWorker) throw new Error("DB worker not initialized");

  return new Promise((resolve, reject) => {
    const id = generateId();
    const timeout = setTimeout(() => {
      reject(new Error("Database initialization timeout"));
    }, 30000);

    pendingRequests.set(id, {
      resolve: (response: WorkerResponse) => {
        clearTimeout(timeout);
        if (response.success) {
          // Database initialized
          resolve();
        } else {
          reject(new Error(response.error || "Database initialization failed"));
        }
      },
      reject: (error: Error) => {
        clearTimeout(timeout);
        reject(error);
      },
    });

    dbWorker!.postMessage({
      type: "initializeDatabase",
      id,
    });
  });
}

// Load zip file from File object and run the entire pipeline
async function loadZipFromFile(file: File): Promise<void> {
  try {
    // Reset pipeline state
    stackParsingCompleted = false;

    // Stage 1: Reading zip file
    notify({
      type: "loadingStage",
      stage: "reading-zip",
      message: "Loading zip file...",
    });

    const zipEntries = await loadZipDataFromFile(file);

    // Stage 2: Scanning files
    notify({
      type: "loadingStage",
      stage: "scanning-files",
      message: `Scanning ${zipEntries.length} files...`,
    });

    // Notify main thread about file list
    notify({
      type: "fileList",
      entries: zipEntries,
      totalFiles: zipEntries.length,
    });

    // Store zip entries in worker scope for later stages
    self.zipEntries = zipEntries;

    // Stage 3: Table loading - let DB worker decide what to load
    notify({
      type: "loadingStage",
      stage: "table-loading",
      message: "Starting table loading...",
    });

    // Send the full file listing to DB worker - let it decide what to load
    if (dbWorker) {
      dbWorker.postMessage({
        type: "processFileList",
        id: generateId(),
        fileList: zipEntries,
      });
    }

    // Zip file processing complete, table loading in progress
  } catch (error) {
    console.error("❌ Controller: Load failed:", error);
    notify({
      type: "error",
      message: `Load failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
    throw error;
  }
}

// Load zip file from buffer and run the entire pipeline
async function loadZipFile(zipData: Uint8Array): Promise<void> {
  try {
    // Reset pipeline state
    stackParsingCompleted = false;

    // Stage 1: Reading zip file
    notify({
      type: "loadingStage",
      stage: "reading-zip",
      message: "Loading zip file...",
    });

    const zipEntries = await loadZipData(zipData);

    // Stage 2: Scanning files
    notify({
      type: "loadingStage",
      stage: "scanning-files",
      message: `Scanning ${zipEntries.length} files...`,
    });

    // Notify main thread about file list
    notify({
      type: "fileList",
      entries: zipEntries,
      totalFiles: zipEntries.length,
    });

    // Store zip entries in worker scope for later stages
    self.zipEntries = zipEntries;

    // Stage 3: Table loading - let DB worker decide what to load
    notify({
      type: "loadingStage",
      stage: "table-loading",
      message: "Starting table loading...",
    });

    // Send the full file listing to DB worker - let it decide what to load
    if (dbWorker) {
      dbWorker.postMessage({
        type: "processFileList",
        id: generateId(),
        fileList: zipEntries,
      });
    }

    // Zip file processing complete, table loading in progress
  } catch (error) {
    console.error("❌ Controller: Load failed:", error);
    notify({
      type: "error",
      message: `Load failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
    throw error;
  }
}

// Load zip file from SendSafely and run the entire pipeline
interface SendSafelyConfig {
  host: string;
  apiKey: string;
  apiSecret: string;
  keyCode: string;
  fileName: string;
  packageInfo: {
    packageId: string;
    keyCode: string;
    serverSecret: string;
  };
}

async function loadZipFileFromSendSafely(
  sendSafelyConfig: SendSafelyConfig,
): Promise<void> {
  try {
    // Reset pipeline state
    stackParsingCompleted = false;

    // Stage 1: Connecting to SendSafely
    notify({
      type: "loadingStage",
      stage: "reading-zip",
      message: "Connecting to SendSafely...",
    });

    const zipEntries = await loadZipDataFromSendSafely(sendSafelyConfig);

    // Stage 2: Scanning files
    notify({
      type: "loadingStage",
      stage: "scanning-files",
      message: `Scanning ${zipEntries.length} files...`,
    });

    // Notify main thread about file list
    notify({
      type: "fileList",
      entries: zipEntries,
      totalFiles: zipEntries.length,
    });

    // Store zip entries in worker scope for later stages
    self.zipEntries = zipEntries;

    // Stage 3: Table loading - let DB worker decide what to load
    notify({
      type: "loadingStage",
      stage: "table-loading",
      message: "Starting table loading...",
    });

    // Send the full file listing to DB worker - let it decide what to load
    if (dbWorker) {
      dbWorker.postMessage({
        type: "processFileList",
        id: generateId(),
        fileList: zipEntries,
      });
    }

    // SendSafely zip file processing complete, table loading in progress
  } catch (error) {
    console.error("❌ Controller: SendSafely load failed:", error);
    notify({
      type: "error",
      message: `SendSafely load failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
    throw error;
  }
}

// Load zip data from File object into zip worker
async function loadZipDataFromFile(file: File): Promise<ZipEntryMeta[]> {
  if (!zipWorker) throw new Error("Zip worker not initialized");

  // First initialize the zip worker with File object
  await new Promise<void>((resolve, reject) => {
    const id = generateId();
    const timeout = setTimeout(
      () => reject(new Error("Zip initialization timeout")),
      30000,
    );

    pendingRequests.set(id, {
      resolve: (response: WorkerResponse) => {
        clearTimeout(timeout);
        if (response.type === "initializeComplete") {
          resolve();
        } else if (response.type === "error") {
          reject(new Error(response.error || "Failed to initialize zip"));
        }
      },
      reject: (error: Error) => {
        clearTimeout(timeout);
        reject(error);
      },
    });

    zipWorker!.postMessage({
      type: "initialize",
      id,
      file: file,
    });
  });

  // Then get the entries
  return new Promise((resolve, reject) => {
    const id = generateId();
    const timeout = setTimeout(
      () => reject(new Error("Get entries timeout")),
      30000,
    );

    pendingRequests.set(id, {
      resolve: (response: WorkerResponse) => {
        clearTimeout(timeout);
        if (response.type === "getEntriesComplete") {
          resolve((response.entries as ZipEntryMeta[]) || []);
        } else if (response.type === "error") {
          reject(new Error(response.error || "Failed to get entries"));
        }
      },
      reject: (error: Error) => {
        clearTimeout(timeout);
        reject(error);
      },
    });

    zipWorker!.postMessage({
      type: "getEntries",
      id,
    });
  });
}

// Load zip data from buffer into zip worker
async function loadZipData(zipData: Uint8Array): Promise<ZipEntryMeta[]> {
  if (!zipWorker) throw new Error("Zip worker not initialized");

  // First initialize the zip worker
  await new Promise<void>((resolve, reject) => {
    const id = generateId();
    const timeout = setTimeout(
      () => reject(new Error("Zip initialization timeout")),
      30000,
    );

    pendingRequests.set(id, {
      resolve: (response: WorkerResponse) => {
        clearTimeout(timeout);
        if (response.type === "initializeComplete") {
          resolve();
        } else if (response.type === "error") {
          reject(new Error(response.error || "Failed to initialize zip"));
        }
      },
      reject: (error: Error) => {
        clearTimeout(timeout);
        reject(error);
      },
    });

    zipWorker!.postMessage({
      type: "initialize",
      id,
      buffer: zipData.buffer.slice(
        zipData.byteOffset,
        zipData.byteOffset + zipData.byteLength,
      ),
    });
  });

  // Then get the entries
  return new Promise((resolve, reject) => {
    const id = generateId();
    const timeout = setTimeout(
      () => reject(new Error("Get entries timeout")),
      30000,
    );

    pendingRequests.set(id, {
      resolve: (response: WorkerResponse) => {
        clearTimeout(timeout);
        if (response.type === "getEntriesComplete") {
          resolve((response.entries as ZipEntryMeta[]) || []);
        } else if (response.type === "error") {
          reject(new Error(response.error || "Failed to get entries"));
        }
      },
      reject: (error: Error) => {
        clearTimeout(timeout);
        reject(error);
      },
    });

    zipWorker!.postMessage({
      type: "getEntries",
      id,
    });
  });
}

// Load zip data from SendSafely into zip worker
async function loadZipDataFromSendSafely(
  sendSafelyConfig: SendSafelyConfig,
): Promise<ZipEntryMeta[]> {
  if (!zipWorker) throw new Error("Zip worker not initialized");

  // First initialize the zip worker with SendSafely config
  await new Promise<void>((resolve, reject) => {
    const id = generateId();
    const timeout = setTimeout(
      () => reject(new Error("SendSafely initialization timeout")),
      30000,
    );

    pendingRequests.set(id, {
      resolve: (response: WorkerResponse) => {
        clearTimeout(timeout);
        if (response.type === "initializeComplete") {
          resolve();
        } else if (response.type === "error") {
          reject(
            new Error(response.error || "Failed to initialize SendSafely zip"),
          );
        }
      },
      reject: (error: Error) => {
        clearTimeout(timeout);
        reject(error);
      },
    });

    zipWorker!.postMessage({
      type: "initialize",
      id,
      sendSafely: sendSafelyConfig,
    });
  });

  // Then get the entries
  return new Promise((resolve, reject) => {
    const id = generateId();
    const timeout = setTimeout(
      () => reject(new Error("Get entries timeout")),
      30000,
    );

    pendingRequests.set(id, {
      resolve: (response: WorkerResponse) => {
        clearTimeout(timeout);
        if (response.type === "getEntriesComplete") {
          resolve((response.entries as ZipEntryMeta[]) || []);
        } else if (response.type === "error") {
          reject(new Error(response.error || "Failed to get entries"));
        }
      },
      reject: (error: Error) => {
        clearTimeout(timeout);
        reject(error);
      },
    });

    zipWorker!.postMessage({
      type: "getEntries",
      id,
    });
  });
}

// Legacy functions removed - workers now receive file listings directly

// Start stack parsing - find and process stack files
async function startStackParsing(): Promise<void> {
  if (stackParsingCompleted) {
    startIndexing();
    return;
  }

  try {
    notify({
      type: "loadingStage",
      stage: "stack-parsing",
      message: "Processing stack files...",
    });

    // Get the stored zip entries
    const storedEntries = self.zipEntries;
    if (!storedEntries) {
      startIndexing();
      return;
    }

    // Stack files are now discovered in UI from file list
    // Just mark parsing as completed and continue with indexing
    stackParsingCompleted = true;
    startIndexing();
  } catch (error) {
    console.error("❌ Controller: Stack parsing failed:", error);
    stackParsingCompleted = true;
    startIndexing(); // Continue with indexing even if stack parsing fails
  }
}

// Load stack files on demand when Stackgazer is clicked
async function loadStackFiles() {

  try {
    // Get the stored zip entries
    const storedEntries = self.zipEntries;
    if (!storedEntries) {
      console.warn("❌ Controller: No zip entries available for stack loading");
      return;
    }

    // Find all stacks.txt files
    const stackFiles = storedEntries.filter(
      (entry: ZipEntryMeta) =>
        !entry.isDir && entry.path.includes("stacks.txt"),
    );

    if (stackFiles.length === 0) {
      console.warn("❌ Controller: No stack files found");
      return;
    }

    notify({
      type: "loadingStage",
      stage: "stack-loading",
      message: "Loading stack files...",
    });

    // Compute common prefix and suffix for display names
    let commonPrefix = "";
    let commonSuffix = "";

    if (stackFiles.length > 1) {
      // Find common prefix - compare character by character
      const firstPath = stackFiles[0].path;
      let prefixLen = firstPath.length;
      let suffixLen = firstPath.length;

      for (const stackFile of stackFiles) {
        const path = stackFile.path;

        // Find how many characters match at the start
        let matchStart = 0;
        while (matchStart < prefixLen && matchStart < path.length &&
               firstPath[matchStart] === path[matchStart]) {
          matchStart++;
        }
        prefixLen = matchStart;

        // Find how many characters match at the end
        let matchEnd = 0;
        while (matchEnd < suffixLen && matchEnd < path.length &&
               firstPath[firstPath.length - 1 - matchEnd] === path[path.length - 1 - matchEnd]) {
          matchEnd++;
        }
        suffixLen = matchEnd;
      }

      commonPrefix = firstPath.substring(0, prefixLen);
      commonSuffix = firstPath.substring(firstPath.length - suffixLen);
    }

    // Process each stack file individually
    let processedCount = 0;
    for (const stackFile of stackFiles) {
      try {
        // Request file content from zip worker
        const fileContent = await readStackFile(stackFile.path);

        // Compute display name by removing common prefix/suffix
        let name = stackFile.path;
        if (commonPrefix.length > 0) {
          name = name.substring(commonPrefix.length);
        }
        if (commonSuffix.length > 0 && name.endsWith(commonSuffix)) {
          name = name.substring(0, name.length - commonSuffix.length);
        }
        // If name is empty after trimming, use the full path
        if (name.length === 0) {
          name = stackFile.path;
        }

        // Send each file individually to UI
        notify({
          type: "sendStackFileToIframe",
          path: stackFile.path,
          name: name,
          content: fileContent,
        });

        processedCount++;
      } catch (error) {
        console.error(
          `❌ Controller: Failed to read stack file ${stackFile.path}:`,
          error,
        );
      }
    }

    // Send completion notification after all files have been sent individually
    if (processedCount > 0) {
      notify({
        type: "stackProcessingComplete",
        stackFilesCount: processedCount,
      });
    }

  } catch (error) {
    console.error("❌ Controller: Stack loading failed:", error);
  }
}

// Read a stack file from zip worker
async function readStackFile(path: string): Promise<string> {
  if (!zipWorker) throw new Error("Zip worker not initialized");

  return new Promise((resolve, reject) => {
    const id = generateId();
    const timeout = setTimeout(
      () => reject(new Error("Stack file read timeout")),
      30000,
    );
    const chunks: Uint8Array[] = [];

    pendingRequests.set(id, {
      resolve: (response: WorkerResponse) => {
        if (response.type === "readFileChunk") {
          chunks.push(response.bytes as Uint8Array);
          if (response.done) {
            clearTimeout(timeout);
            // Combine all chunks and decode to text
            const totalLength = chunks.reduce(
              (sum, chunk) => sum + chunk.length,
              0,
            );
            const combined = new Uint8Array(totalLength);
            let offset = 0;
            for (const chunk of chunks) {
              combined.set(chunk, offset);
              offset += chunk.length;
            }
            const text = new TextDecoder().decode(combined);
            resolve(text);
          }
        } else if (response.type === "error") {
          clearTimeout(timeout);
          reject(new Error(response.error || "Failed to read stack file"));
        }
      },
      reject: (error: Error) => {
        clearTimeout(timeout);
        reject(error);
      },
    });

    zipWorker!.postMessage({
      type: "readFileChunked",
      id,
      path,
    });
  });
}

// Start indexing phase
async function startIndexing(): Promise<void> {
  notify({
    type: "loadingStage",
    stage: "indexing",
    message: "Starting file indexing...",
  });

  // Get the stored zip entries
  const storedEntries = self.zipEntries;
  if (!storedEntries) {
    notify({
      type: "loadingStage",
      stage: "complete",
      message: "Processing complete",
    });
    return;
  }

  if (indexingWorker) {
    // First register all files with indexing worker
    indexingWorker.postMessage({
      to: "indexingWorker",
      from: "mainThread",
      type: "registerFiles",
      id: generateId(),
      files: storedEntries.map((entry: ZipEntryMeta) => ({
        path: entry.path,
        name: entry.name,
        size: entry.size,
      })),
    });

    // Then tell it to start indexing (it will decide what to index from registered files)
    indexingWorker.postMessage({
      to: "indexingWorker",
      from: "mainThread",
      type: "startIndexing",
      id: generateId(),
    });
  }
}

// Route messages between workers
function routeMessage(message: Record<string, unknown>) {
  if (message.to && typeof message.to === "string" && workers.has(message.to)) {
    const targetWorker = workers.get(message.to)!;
    targetWorker.postMessage(message);
  } else {
    console.error(`🎯 Controller: Unknown routing target: ${message.to}`);
  }
}

// Handle messages from workers
function handleWorkerMessage(fromWorker: string, event: MessageEvent) {
  const message = event.data;
  // Route inter-worker messages
  if (message.to && message.from) {
    // Handle responses routed back to main thread
    if (message.to === "mainThread") {
      // Handle specific message types that need to be preserved as notifications
      if (
        message.type === "indexingComplete" ||
        message.type === "indexingProgress" ||
        message.type === "indexingError" ||
        message.type === "fileStatusUpdate"
      ) {
        // Forward as notification preserving all fields
        notify({
          type: message.type,
          success: message.success,
          totalEntries: message.totalEntries,
          error: message.error,
          ruleDescription: message.ruleDescription,
          id: message.id,
          current: message.current,
          total: message.total,
          fileName: message.fileName,
          filePath: message.filePath,
          entries: message.entries,
          fileStatuses: message.fileStatuses,
        });
        return;
      }

      // For chunk messages, the entire message is the result
      // For other messages, extract the result field to avoid cloning issues
      const result =
        message.type === "readFileChunk" ? message : message.result;

      self.postMessage({
        type: "response",
        id: message.id,
        success: message.success !== false,
        result: result,
        error: message.error,
      });
      return;
    }

    // No special handling needed - just route the message

    routeMessage(message);
    return;
  }

  // Handle responses to our requests
  if (message.id && pendingRequests.has(message.id)) {
    const request = pendingRequests.get(message.id)!;

    if (message.type === "error") {
      pendingRequests.delete(message.id);
      request.reject(new Error(message.error));
    } else {
      // For readFileChunk messages, only delete the request when done
      if (message.type === "readFileChunk" && !message.done) {
        // Keep the request active for more chunks
        request.resolve(message);
      } else {
        // Final message or non-chunk message
        pendingRequests.delete(message.id);
        request.resolve(message);
      }
    }
    return;
  }

  // Handle command responses (responses to registerFiles, startIndexing, etc.)
  if (message.id && !message.to && !message.from) {
    self.postMessage({
      type: "response",
      id: message.id,
      success: message.success !== false,
      result: message.result || message,
      error: message.error,
    });
    return;
  }

  // Handle specific business logic triggers, but forward messages generically
  if (message.type === "tableLoadingComplete") {
    // Business logic: start stack parsing after table loading
    if (message.success) {
      startStackParsing();
    }
  } else if (message.type === "indexingComplete") {
    // Business logic: signal pipeline completion

    if (message.success) {
      // Full pipeline complete - indexing finished
      notify({
        type: "loadingStage",
        stage: "complete",
        message: `Processing complete - ${message.totalEntries} files indexed`,
      });
    } else {
      // Indexing failed (error logged separately)
      notify({
        type: "loadingStage",
        stage: "error",
        message: `Indexing failed: ${message.error}`,
      });
    }
  }

  self.postMessage({
    ...message,
    from: fromWorker,
  });
}

// Handle commands from main thread
self.onmessage = async (event: MessageEvent<Command>) => {
  const command = event.data;

  try {
    // Handle controller-specific commands
    if (command.type === "init") {
      await initializeController();
      self.postMessage({ type: "response", id: command.id, success: true });
      return;
    }

    if (command.type === "loadZip") {
      // Convert transferred ArrayBuffer back to Uint8Array
      const zipData =
        command.zipData instanceof ArrayBuffer
          ? new Uint8Array(command.zipData)
          : (command.zipData as Uint8Array);
      await loadZipFile(zipData);
      self.postMessage({ type: "response", id: command.id, success: true });
      return;
    }

    if (command.type === "loadZipFile") {
      // Load from File object directly (for large files)
      await loadZipFromFile(command.file as File);
      self.postMessage({ type: "response", id: command.id, success: true });
      return;
    }

    if (command.type === "loadZipFromSendSafely") {
      await loadZipFileFromSendSafely(
        command.sendSafelyConfig as SendSafelyConfig,
      );
      self.postMessage({ type: "response", id: command.id, success: true });
      return;
    }

    if (command.type === "loadStackFiles") {
      await loadStackFiles();
      self.postMessage({ type: "response", id: command.id, success: true });
      return;
    }

    // All other commands should use pure envelope routing
    if (command.to && workers.has(command.to)) {
      const targetWorker = workers.get(command.to)!;

      // Forward command as envelope message
      const forwardedMessage = {
        ...command,
        to: command.to,
        from: "mainThread",
      };

      targetWorker.postMessage(forwardedMessage);
    } else {
      console.error(
        `🎯 Controller: Command missing 'to' field or unknown target: ${command.type}, to: ${command.to}`,
      );
      self.postMessage({
        type: "response",
        id: command.id,
        success: false,
        error: `Command missing 'to' field or unknown target: ${command.to}`,
      });
    }
  } catch (error) {
    console.error(`🎯 Controller: Command failed:`, error);
    self.postMessage({
      type: "response",
      id: command.id,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Export for TypeScript
export {};
