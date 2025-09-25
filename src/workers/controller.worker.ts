/**
 * Controller Worker - drives all business logic and coordinates other workers
 * Main thread is purely reactive, just responding to notifications
 */

import type { ZipEntryMeta } from "../state/types";

// Notification types sent to main thread
interface Notification {
  type: string;
  [key: string]: any;
}

// Main thread command types
interface Command {
  type: string; // Any command type - pure envelope routing
  to?: string; // Target worker for envelope routing
  id?: string;
  [key: string]: any;
}

// Table preparation logic removed - DB worker now handles this

// Controller state
let zipWorker: Worker | null = null;
let dbWorker: Worker | null = null;
let indexingWorker: Worker | null = null;
let workers: Map<string, Worker> = new Map();
let initialized = false;
let stackParsingCompleted = false;

// Pending requests from main thread
let pendingRequests = new Map<string, { resolve: any; reject: any }>();

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

    // Create zip worker
    zipWorker = new Worker(
      new URL("./zipReader.worker.ts", import.meta.url),
      { type: "module" }
    );
    zipWorker.onmessage = (event) => handleWorkerMessage("zipWorker", event);
    zipWorker.onerror = (error) => console.error("❌ Zip worker error:", error);

    // Create DB worker
    dbWorker = new Worker(
      new URL("./db.worker.ts", import.meta.url),
      { type: "module" }
    );
    dbWorker.onmessage = (event) => handleWorkerMessage("dbWorker", event);
    dbWorker.onerror = (error) => console.error("❌ DB worker error:", error);

    // Create indexing worker
    indexingWorker = new Worker(
      new URL("./indexing.worker.ts", import.meta.url),
      { type: "module" }
    );
    indexingWorker.onmessage = (event) => handleWorkerMessage("indexingWorker", event);
    indexingWorker.onerror = (error) => console.error("❌ Indexing worker error:", error);

    // Register workers for routing
    workers.set("zipWorker", zipWorker);
    workers.set("dbWorker", dbWorker);
    workers.set("indexingWorker", indexingWorker);

    // Initialize database
    await initializeDatabase();

    initialized = true;
    console.log("✅ Controller: All workers initialized");
    notify({ type: "status", message: "Workers ready" });

  } catch (error) {
    console.error("❌ Controller: Failed to initialize:", error);
    notify({
      type: "error",
      message: `Failed to initialize: ${error instanceof Error ? error.message : "Unknown error"}`
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
      resolve: (response: any) => {
        clearTimeout(timeout);
        if (response.success) {
          console.log("✅ Controller: Database initialized");
          resolve();
        } else {
          reject(new Error(response.error || "Database initialization failed"));
        }
      },
      reject: (error: Error) => {
        clearTimeout(timeout);
        reject(error);
      }
    });

    dbWorker!.postMessage({
      type: "initializeDatabase",
      id
    });
  });
}

// Load zip file and run the entire pipeline
async function loadZipFile(zipData: Uint8Array): Promise<void> {
  try {
    // Reset pipeline state
    stackParsingCompleted = false;

    // Stage 1: Reading zip file
    notify({ type: "loadingStage", stage: "reading-zip", message: "Loading zip file..." });

    const zipEntries = await loadZipData(zipData);

    // Stage 2: Scanning files
    notify({ type: "loadingStage", stage: "scanning-files", message: `Scanning ${zipEntries.length} files...` });

    // Notify main thread about file list
    notify({
      type: "fileList",
      entries: zipEntries,
      totalFiles: zipEntries.length
    });

    // Store zip entries globally for later stages
    (globalThis as any).__zipEntries = zipEntries;

    // Stage 3: Table loading - let DB worker decide what to load
    notify({ type: "loadingStage", stage: "table-loading", message: "Starting table loading..." });


    // Send the full file listing to DB worker - let it decide what to load
    if (dbWorker) {
      dbWorker.postMessage({
        type: "processFileList",
        id: generateId(),
        fileList: zipEntries
      });
    }

    console.log("✅ Controller: Zip file processing complete, table loading in progress");

  } catch (error) {
    console.error("❌ Controller: Load failed:", error);
    notify({
      type: "error",
      message: `Load failed: ${error instanceof Error ? error.message : "Unknown error"}`
    });
    throw error;
  }
}

// Load zip data into zip worker
async function loadZipData(zipData: Uint8Array): Promise<ZipEntryMeta[]> {
  if (!zipWorker) throw new Error("Zip worker not initialized");

  return new Promise((resolve, reject) => {
    const id = generateId();
    const timeout = setTimeout(() => reject(new Error("Zip load timeout")), 30000);

    pendingRequests.set(id, {
      resolve: (response: any) => {
        clearTimeout(timeout);
        if (response.success) {
          resolve(response.entries || []);
        } else {
          reject(new Error(response.error || "Failed to load zip"));
        }
      },
      reject: (error: Error) => {
        clearTimeout(timeout);
        reject(error);
      }
    });

    zipWorker!.postMessage({
      type: "initialize",
      id,
      zipData
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
    notify({ type: "loadingStage", stage: "stack-parsing", message: "Processing stack files..." });

    // Get the stored zip entries
    const storedEntries = (globalThis as any).__zipEntries;
    if (!storedEntries) {
      startIndexing();
      return;
    }

    // Find all stacks.txt files
    const stackFiles = storedEntries.filter((entry: any) =>
      !entry.isDir && entry.path.includes('stacks.txt')
    );

    if (stackFiles.length === 0) {
      stackParsingCompleted = true;
      startIndexing();
      return;
    }

    // Process each stack file individually
    let processedCount = 0;
    for (const stackFile of stackFiles) {
      try {
        // Request file content from zip worker
        const fileContent = await readStackFile(stackFile.path);

        // Send each file individually to UI
        notify({
          type: "sendStackFileToIframe",
          path: stackFile.path,
          content: fileContent
        });

        processedCount++;
      } catch (error) {
        console.error(`❌ Controller: Failed to read stack file ${stackFile.path}:`, error);
      }
    }

    // Send completion notification after all files have been sent individually
    if (processedCount > 0) {
      notify({
        type: "stackProcessingComplete",
        stackFilesCount: processedCount
      });
    }

    stackParsingCompleted = true;
    startIndexing();

  } catch (error) {
    console.error("❌ Controller: Stack parsing failed:", error);
    stackParsingCompleted = true;
    startIndexing(); // Continue with indexing even if stack parsing fails
  }
}

// Read a stack file from zip worker
async function readStackFile(path: string): Promise<string> {
  if (!zipWorker) throw new Error("Zip worker not initialized");

  return new Promise((resolve, reject) => {
    const id = generateId();
    const timeout = setTimeout(() => reject(new Error("Stack file read timeout")), 30000);

    pendingRequests.set(id, {
      resolve: (response: any) => {
        clearTimeout(timeout);
        if (response.success && response.result?.bytes) {
          // Decode bytes to text for stack files
          const text = new TextDecoder().decode(response.result.bytes);
          resolve(text);
        } else {
          reject(new Error(response.error || "Failed to read stack file"));
        }
      },
      reject: (error: Error) => {
        clearTimeout(timeout);
        reject(error);
      }
    });

    zipWorker!.postMessage({
      type: "readFile",
      id,
      path
    });
  });
}

// Start indexing phase
async function startIndexing(): Promise<void> {

  notify({ type: "loadingStage", stage: "indexing", message: "Starting file indexing..." });

  // Get the stored zip entries
  const storedEntries = (globalThis as any).__zipEntries;
  if (!storedEntries) {
    notify({
      type: "loadingStage",
      stage: "complete",
      message: "Processing complete"
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
      files: storedEntries.map((entry: any) => ({
        path: entry.path,
        name: entry.name,
        size: entry.size
      }))
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
function routeMessage(message: any) {
  if (message.to && workers.has(message.to)) {
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
      if (message.type === "indexingComplete" || message.type === "indexingProgress" || message.type === "indexingError" || message.type === "fileStatusUpdate") {
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
          fileStatuses: message.fileStatuses
        });
        return;
      }

      // For chunk messages, the entire message is the result
      // For other messages, extract the result field to avoid cloning issues
      const result = message.type === "readFileChunk" ? message : message.result;

      self.postMessage({
        type: "response",
        id: message.id,
        success: message.success !== false,
        result: result,
        error: message.error
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
    pendingRequests.delete(message.id);

    if (message.type === "error") {
      request.reject(new Error(message.error));
    } else {
      request.resolve(message);
    }
    return;
  }

  // Handle command responses (responses to registerFiles, startIndexing, etc.)
  if (message.id && !message.to && !message.from) {
    // Only log errors to reduce noise
    if (message.success === false) {
    }
    self.postMessage({
      type: "response",
      id: message.id,
      success: message.success !== false,
      result: message.result || message,
      error: message.error
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
      console.log("✅ Controller: Full pipeline complete - indexing finished");
      notify({
        type: "loadingStage",
        stage: "complete",
        message: `Processing complete - ${message.totalEntries} files indexed`
      });
    } else {
      console.log("❌ Controller: Indexing failed:", message.error);
      notify({
        type: "loadingStage",
        stage: "error",
        message: `Indexing failed: ${message.error}`
      });
    }
  }

  self.postMessage({
    ...message,
    from: fromWorker
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
      const zipData = command.zipData instanceof ArrayBuffer
        ? new Uint8Array(command.zipData)
        : command.zipData;
      await loadZipFile(zipData);
      self.postMessage({ type: "response", id: command.id, success: true });
      return;
    }

    // All other commands should use pure envelope routing
    if (command.to && workers.has(command.to)) {
      const targetWorker = workers.get(command.to)!;
      // Forward command as envelope message
      targetWorker.postMessage({
        to: command.to,
        from: "mainThread",
        ...command
      });
    } else {
      console.error(`🎯 Controller: Command missing 'to' field or unknown target: ${command.type}, to: ${command.to}`);
      self.postMessage({
        type: "response",
        id: command.id,
        success: false,
        error: `Command missing 'to' field or unknown target: ${command.to}`
      });
    }
  } catch (error) {
    console.error(`🎯 Controller: Command failed:`, error);
    self.postMessage({
      type: "response",
      id: command.id,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Export for TypeScript
export {};