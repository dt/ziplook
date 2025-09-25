/**
 * Thin proxy to the controller worker - main thread is purely reactive
 * Controller drives all business logic, main thread just responds to notifications
 */

import type { ZipEntryMeta } from "../state/types";

interface WorkerManagerOptions {
  // Stage progression callbacks
  onLoadingStage?: (stage: string, message: string) => void;
  onFileList?: (entries: any[], totalFiles: number) => void;
  onTableAdded?: (table: any) => void;
  onSendStackFileToIframe?: (path: string, content: string) => void;
  onStackProcessingComplete?: (stackFilesCount: number) => void;

  // Legacy indexing callbacks (still needed)
  onIndexingProgress?: (progress: {
    current: number;
    total: number;
    fileName: string;
  }) => void;
  onIndexingComplete?: (
    success: boolean,
    totalEntries: number,
    error?: string,
    ruleDescription?: string,
  ) => void;
  onIndexingFileResult?: (filePath: string, entries: any[]) => void;

  // File status update callbacks
  onFileStatusUpdate?: (fileStatuses: any[]) => void;

  // Legacy table callbacks (still needed for individual table progress)
  onTableLoadProgress?: (
    tableName: string,
    status: string,
    rowCount?: number,
    error?: string,
  ) => void;
  onTableLoadingComplete?: (
    success: boolean,
    tablesLoaded: number,
    error?: string,
  ) => void;
  onDatabaseInitialized?: (success: boolean, error?: string) => void;
}

export class WorkerManager {
  private controllerWorker: Worker;
  private pendingRequests = new Map<string, { resolve: any; reject: any }>();
  private requestCounter = 0;
  private options: WorkerManagerOptions;

  constructor(options: WorkerManagerOptions = {}) {
    this.options = options;

    this.controllerWorker = new Worker(
      new URL("../workers/controller.worker.ts", import.meta.url),
      { type: "module" }
    );

    this.controllerWorker.onmessage = this.handleMessage.bind(this);
    this.controllerWorker.onerror = (error) => {
      console.error("❌ Controller worker error:", error);
    };
  }

  updateCallbacks(options: WorkerManagerOptions) {
    this.options = { ...this.options, ...options };
    // Don't send callback functions to worker - they're handled in main thread
  }

  async loadZipData(zipData: Uint8Array): Promise<ZipEntryMeta[]> {
    // Use the new loadZip command that runs the full pipeline - handled by controller directly
    await this.sendMessage({ type: "loadZip", zipData });
    // Return empty array - main thread will get notifications with actual entries
    return [];
  }

  async initializeWorkers(): Promise<void> {
    // Init is handled by controller directly, no 'to' field needed
    return this.sendMessage({ type: "init" });
  }

  async initializeDatabase(): Promise<void> {
    // Database initialization is handled by controller during init
    return Promise.resolve();
  }

  async startTableLoading(tables: Array<any>): Promise<void> {
    return this.sendMessage({ type: "startTableLoading", to: "dbWorker", tables });
  }

  async loadSingleTable(table: any): Promise<void> {
    return this.sendMessage({ type: "loadSingleTable", to: "dbWorker", table });
  }

  async executeQuery(sql: string): Promise<any[]> {
    const result = await this.sendMessage({ type: "executeQuery", to: "dbWorker", sql });
    return result;
  }

  async getTableSchema(tableName: string): Promise<any[]> {
    return this.sendMessage({ type: "getTableSchema", to: "dbWorker", tableName });
  }

  async getLoadedTables(): Promise<string[]> {
    return this.sendMessage({ type: "getLoadedTables", to: "dbWorker" });
  }

  async getDuckDBFunctions(): Promise<Array<{ name: string; type: string; description?: string }>> {
    return this.sendMessage({ type: "getDuckDBFunctions", to: "dbWorker" });
  }

  async getDuckDBKeywords(): Promise<string[]> {
    return this.sendMessage({ type: "getDuckDBKeywords", to: "dbWorker" });
  }

  async registerFiles(files: Array<{ path: string; name: string; size: number }>): Promise<void> {
    return this.sendMessage({ type: "registerFiles", to: "indexingWorker", files });
  }

  async startIndexing(filePaths: string[]): Promise<void> {
    return this.sendMessage({ type: "startIndexing", to: "indexingWorker", filePaths });
  }

  async indexSingleFile(file: { path: string; name: string; size: number }): Promise<void> {
    return this.sendMessage({ type: "indexSingleFile", to: "indexingWorker", file });
  }

  async searchLogs(query: string): Promise<any[]> {
    return this.sendMessage({ type: "searchLogs", to: "indexingWorker", query });
  }

  async getFileStatuses(): Promise<any[]> {
    return this.sendMessage({ type: "getFileStatuses", to: "indexingWorker" });
  }


  async readFileStream(
    path: string,
    onChunk: (chunk: string, progress: { loaded: number; total: number; done: boolean }) => void,
  ): Promise<void> {
    // For streaming, we need to handle chunks directly
    return new Promise((resolve, reject) => {
      const id = `req_${++this.requestCounter}`;
      this.pendingRequests.set(id, {
        resolve,
        reject,
        onChunk
      } as any);

      this.controllerWorker.postMessage({
        type: "readFileChunked", // Use readFileChunked for streaming
        to: "zipWorker",
        path,
        id
      });
    });
  }

  cancelStream(): void {
    this.sendMessage({ type: "cancelStream", to: "zipWorker" });
  }

  destroy() {
    this.controllerWorker.terminate();
    this.pendingRequests.clear();
  }

  private async sendMessage(message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = `req_${++this.requestCounter}`;
      this.pendingRequests.set(id, { resolve, reject });

      const messageWithId = { ...message, id };

      // Transfer Uint8Arrays efficiently
      const transferable: Transferable[] = [];
      if (message.zipData instanceof Uint8Array) {
        transferable.push(message.zipData.buffer);
      }

      if (transferable.length > 0) {
        this.controllerWorker.postMessage(messageWithId, transferable);
      } else {
        this.controllerWorker.postMessage(messageWithId);
      }
    });
  }

  private handleMessage(event: MessageEvent) {
    const message = event.data;

    // Handle notifications from controller
    if (message.messageType === "notification") {
      this.handleNotification(message);
      return;
    }

    // Handle chunk events for streaming FIRST - check for readFileChunk in response result
    if (message.type === "response" && message.result?.type === "readFileChunk") {
      const pending = this.pendingRequests.get(message.id);
      if (pending && (pending as any).onChunk) {
        // Decode bytes to text for file viewer
        const chunk = message.result.bytes;
        const decodedChunk = chunk instanceof Uint8Array ? new TextDecoder().decode(chunk) : chunk;
        const progressInfo = {
          done: message.result.done,
          loaded: chunk?.length || 0,
          total: 0 // Total not available in chunk format
        };
        (pending as any).onChunk(decodedChunk, progressInfo);

        if (message.result.done) {
          this.pendingRequests.delete(message.id);
          pending.resolve(undefined);
        }
      }
      return;
    }

    // Handle worker messages (forwarded by controller)
    if (message.from && message.type) {
      this.handleWorkerMessage(message);
      return;
    }

    // Handle command responses
    if (message.type === "response" && message.id) {
      const pending = this.pendingRequests.get(message.id);
      if (pending) {
        this.pendingRequests.delete(message.id);

        if (message.success !== false) {
          pending.resolve(message.result);
        } else {
          pending.reject(new Error(message.error || "Request failed"));
        }
      }
      return;
    }
  }

  private handleWorkerMessage(message: any) {
    switch (message.type) {
      case "tableLoadProgress":
        this.options.onTableLoadProgress?.(
          message.tableName,
          message.status,
          message.rowCount,
          message.error
        );
        break;

      case "tableLoadingComplete":
        this.options.onTableLoadingComplete?.(
          message.success,
          message.tablesLoaded,
          message.error
        );
        break;

      case "indexingProgress":
        this.options.onIndexingProgress?.({
          current: message.current,
          total: message.total,
          fileName: message.fileName
        });
        break;

      case "indexingComplete":
        this.options.onIndexingComplete?.(
          message.success,
          message.totalEntries,
          message.error,
          message.ruleDescription
        );
        break;

      case "tableDiscovered":
        this.options.onTableAdded?.(message.table);
        break;

      case "indexingFileResult":
        this.options.onIndexingFileResult?.(message.filePath, message.entries);
        break;

      case "fileStatusUpdate":
        this.options.onFileStatusUpdate?.(message.fileStatuses || []);
        break;

      case "readFileChunk":
        // Forward readFileChunk messages as response
        this.handleMessage({
          data: {
            type: "response",
            id: message.id,
            success: true,
            result: message
          }
        } as MessageEvent);
        break;

      default:
        console.log(`🎯 Unhandled worker message from ${message.from}:`, message.type, message);
    }
  }

  private handleNotification(message: any) {
    switch (message.type) {
      case "loadingStage":
        this.options.onLoadingStage?.(message.stage, message.message);
        break;

      case "fileList":
        console.log(`🎯 File list received: ${message.totalFiles} files`);
        this.options.onFileList?.(message.entries, message.totalFiles);
        break;


      case "sendStackFileToIframe":
        this.options.onSendStackFileToIframe?.(message.path, message.content);
        break;

      case "stackProcessingComplete":
        this.options.onStackProcessingComplete?.(message.stackFilesCount);
        break;

      case "status":
        console.log(`🎯 Status: ${message.message}`);
        break;

      case "error":
        console.error(`🎯 Error: ${message.message}`);
        break;

      case "zipLoaded":
        // DEPRECATED: Keep for backwards compatibility but prefer fileList
        console.log(`🎯 Zip loaded (deprecated): ${message.entries.length} files`);
        this.options.onFileList?.(message.entries, message.entries.length);
        break;

      case "indexingProgress":
        this.options.onIndexingProgress?.({
          current: message.current,
          total: message.total,
          fileName: message.fileName
        });
        break;

      case "indexingComplete":
        this.options.onIndexingComplete?.(
          message.success,
          message.totalEntries,
          message.error,
          message.ruleDescription
        );
        break;

      case "indexingError":
        console.error("Indexing error:", message.error);
        break;

      case "fileStatusUpdate":
        this.options.onFileStatusUpdate?.(message.fileStatuses || []);
        break;

      default:
        console.log("🎯 Unknown notification:", message);
    }
  }
}

// Global singleton
let globalWorkerManager: WorkerManager | null = null;
let initializationPromise: Promise<WorkerManager> | null = null;

export async function getWorkerManager(options?: WorkerManagerOptions): Promise<WorkerManager> {
  if (globalWorkerManager) {
    if (options) {
      globalWorkerManager.updateCallbacks(options);
    }
    return globalWorkerManager;
  }

  if (initializationPromise) {
    const manager = await initializationPromise;
    if (options) {
      manager.updateCallbacks(options);
    }
    return manager;
  }

  initializationPromise = (async () => {
    globalWorkerManager = new WorkerManager(options || {});
    await globalWorkerManager.initializeWorkers();
    return globalWorkerManager;
  })();

  return initializationPromise;
}