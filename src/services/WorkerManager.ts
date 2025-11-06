/**
 * Thin proxy to the controller worker - main thread is purely reactive
 * Controller drives all business logic, main thread just responds to notifications
 */

import type {
  ZipEntryMeta,
  IWorkerManager,
  IWorkerManagerCallbacks,
  LogEntry,
  TableData,
  FileStatus,
  SendSafelyConfig,
  SearchResult,
} from "../state/types";

interface PendingRequest {
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
}

interface StreamingPendingRequest {
  resolve: (value: void) => void;
  reject: (error: Error) => void;
  onChunk: (
    chunk: Uint8Array,
    progress: { loaded: number; total: number; done: boolean },
  ) => void;
}

export class WorkerManager implements IWorkerManager {
  private controllerWorker: Worker | null = null;
  private pendingRequests = new Map<
    string,
    PendingRequest | StreamingPendingRequest
  >();
  private requestCounter = 0;
  private options: IWorkerManagerCallbacks;
  private workerInitialized = false;

  constructor(options: IWorkerManagerCallbacks = {}) {
    this.options = options;
    this.initializeWorker();
  }

  private async initializeWorker() {
    try {
      const ControllerWorker = (
        await import("../workers/controller.worker.ts?worker")
      ).default;
      this.controllerWorker = new ControllerWorker();
      this.controllerWorker.onmessage = this.handleMessage.bind(this);
      this.controllerWorker.onerror = (error) => {
        console.error("❌ Controller worker error:", error);
      };
      this.workerInitialized = true;
    } catch (error) {
      console.error("❌ Failed to initialize controller worker:", error);
    }
  }

  private async waitForWorker(): Promise<Worker> {
    while (!this.workerInitialized || !this.controllerWorker) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    return this.controllerWorker;
  }

  updateCallbacks(options: IWorkerManagerCallbacks) {
    this.options = { ...this.options, ...options };
    // Don't send callback functions to worker - they're handled in main thread
  }

  async loadZipData(zipData: Uint8Array): Promise<ZipEntryMeta[]> {
    // Use the new loadZip command that runs the full pipeline - handled by controller directly
    await this.sendMessage({ type: "loadZip", zipData });
    // Return empty array - main thread will get notifications with actual entries
    return [];
  }

  async loadZipFile(file: File): Promise<ZipEntryMeta[]> {
    // Pass File object directly for large files to avoid loading into memory
    await this.sendMessage({ type: "loadZipFile", file });
    // Return empty array - main thread will get notifications with actual entries
    return [];
  }

  async loadZipDataFromSendSafely(
    sendSafelyConfig: SendSafelyConfig,
  ): Promise<ZipEntryMeta[]> {
    // Use the new loadZipFromSendSafely command that runs the full pipeline
    await this.sendMessage({ type: "loadZipFromSendSafely", sendSafelyConfig });
    // Return empty array - main thread will get notifications with actual entries
    return [];
  }

  async initializeWorkers(): Promise<void> {
    // Init is handled by controller directly, no 'to' field needed
    await this.sendMessage({ type: "init" });
  }

  async proceedWithRecovery(): Promise<void> {
    // User confirmed they want to proceed with recovered ZIP entries
    await this.sendMessage({ type: "proceedWithRecovery" });
  }

  async loadSingleStackFile(filePath: string): Promise<void> {
    // Trigger loading of a single stack file
    await this.sendMessage({ type: "loadSingleStackFile", filePath });
  }

  async initializeDatabase(): Promise<void> {
    // Database initialization is handled by controller during init
    return Promise.resolve();
  }

  async startTableLoading(tables: Array<TableData>): Promise<void> {
    await this.sendMessage({
      type: "startTableLoading",
      to: "dbWorker",
      tables,
    });
  }

  async loadSingleTable(table: TableData): Promise<void> {
    await this.sendMessage({ type: "loadSingleTable", to: "dbWorker", table });
  }

  async executeQuery(sql: string): Promise<{
    data: Record<string, unknown>[];
    columnTypes: Record<string, string>;
  }> {
    const result = await this.sendMessage({
      type: "executeQuery",
      to: "dbWorker",
      sql,
    });
    return result as {
      data: Record<string, unknown>[];
      columnTypes: Record<string, string>;
    };
  }

  async getTableSchema(
    tableName: string,
  ): Promise<Array<{ column_name: string; data_type: string }>> {
    return this.sendMessage({
      type: "getTableSchema",
      to: "dbWorker",
      tableName,
    }) as Promise<Array<{ column_name: string; data_type: string }>>;
  }

  async getLoadedTables(): Promise<string[]> {
    return this.sendMessage({
      type: "getLoadedTables",
      to: "dbWorker",
    }) as Promise<string[]>;
  }

  async getDuckDBFunctions(): Promise<
    Array<{ name: string; type: string; description?: string }>
  > {
    return this.sendMessage({
      type: "getDuckDBFunctions",
      to: "dbWorker",
    }) as Promise<Array<{ name: string; type: string; description?: string }>>;
  }

  async getDuckDBKeywords(): Promise<string[]> {
    return this.sendMessage({
      type: "getDuckDBKeywords",
      to: "dbWorker",
    }) as Promise<string[]>;
  }

  async registerFiles(
    files: Array<{ path: string; name: string; size: number }>,
  ): Promise<void> {
    await this.sendMessage({
      type: "registerFiles",
      to: "indexingWorker",
      files,
    });
  }

  async startIndexing(filePaths: string[]): Promise<void> {
    await this.sendMessage({
      type: "startIndexing",
      to: "indexingWorker",
      filePaths,
    });
  }

  async indexSingleFile(file: {
    path: string;
    name: string;
    size: number;
  }): Promise<void> {
    await this.sendMessage({
      type: "indexSingleFile",
      to: "indexingWorker",
      file,
    });
  }

  async searchLogs(query: string): Promise<SearchResult[]> {
    return this.sendMessage({
      type: "searchLogs",
      to: "indexingWorker",
      query,
    }) as Promise<SearchResult[]>;
  }

  async getFileStatuses(): Promise<FileStatus[]> {
    return this.sendMessage({
      type: "getFileStatuses",
      to: "indexingWorker",
    }) as Promise<FileStatus[]>;
  }

  async readFileStream(
    path: string,
    onChunk: (
      chunk: Uint8Array,
      progress: { loaded: number; total: number; done: boolean },
    ) => void,
    options?: { decompress?: boolean },
  ): Promise<void> {
    const worker = await this.waitForWorker();

    // For streaming, we need to handle chunks directly
    return new Promise<void>((resolve, reject) => {
      const id = `req_${++this.requestCounter}`;
      this.pendingRequests.set(id, {
        resolve,
        reject,
        onChunk,
      } as StreamingPendingRequest);

      worker.postMessage({
        type: "readFileChunked", // Use readFileChunked for streaming
        to: "zipWorker",
        path,
        id,
        decompress: options?.decompress || false,
      });
    });
  }


  cancelStream(): void {
    this.sendMessage({ type: "cancelStream", to: "zipWorker" });
  }

  destroy() {
    if (this.controllerWorker) {
      this.controllerWorker.terminate();
    }
    this.pendingRequests.clear();
  }

  private async sendMessage(
    message: Record<string, unknown>,
  ): Promise<unknown> {
    const worker = await this.waitForWorker();

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
        worker.postMessage(messageWithId, transferable);
      } else {
        worker.postMessage(messageWithId);
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
    if (
      message.type === "response" &&
      message.result?.type === "readFileChunk"
    ) {
      const pending = this.pendingRequests.get(message.id);
      if (pending && "onChunk" in pending) {
        // Pass through raw bytes - consumers can decode if needed
        const chunk = message.result.bytes;
        const progressInfo = {
          done: message.result.done,
          loaded: chunk?.length || 0,
          total: 0, // Total not available in chunk format
        };
        (pending as StreamingPendingRequest).onChunk(
          chunk,
          progressInfo,
        );

        if (message.result.done) {
          this.pendingRequests.delete(message.id);
          (pending as StreamingPendingRequest).resolve(undefined);
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

  private handleWorkerMessage(message: Record<string, unknown>) {
    switch (message.type) {
      case "tableLoadProgress":
        this.options.onTableLoadProgress?.(
          message.tableName as string,
          message.status as string,
          message.rowCount as number,
          message.error as string,
          message.chunkProgress as
            | { current: number; total: number; percentage: number }
            | undefined,
          message.fileProgress as
            | { current: number; total: number; percentage: number }
            | undefined,
        );
        break;

      case "tableLoadingComplete":
        this.options.onTableLoadingComplete?.(
          message.success as boolean,
          message.tablesLoaded as number,
          message.error as string,
        );
        break;

      case "indexingProgress":
        this.options.onIndexingProgress?.({
          current: message.current as number,
          total: message.total as number,
          fileName: message.fileName as string,
        });
        break;

      case "indexingComplete":
        this.options.onIndexingComplete?.(
          message.success as boolean,
          message.totalEntries as number,
          message.error as string,
          message.ruleDescription as string,
        );
        break;

      case "tableDiscovered":
        this.options.onTableAdded?.(message.table as TableData);
        break;

      case "indexingFileResult":
        this.options.onIndexingFileResult?.(
          message.filePath as string,
          message.entries as LogEntry[],
        );
        break;

      case "fileStatusUpdate":
        this.options.onFileStatusUpdate?.(
          (message.fileStatuses as FileStatus[]) || [],
        );
        break;

      case "readFileChunk":
        // Forward readFileChunk messages as response
        this.handleMessage({
          data: {
            type: "response",
            id: message.id,
            success: true,
            result: message,
          },
        } as MessageEvent);
        break;

      default:
        console.log(
          `🎯 Unhandled worker message from ${message.from}:`,
          message.type,
          message,
        );
    }
  }

  private handleNotification(message: Record<string, unknown>) {
    switch (message.type) {
      case "loadingStage":
        this.options.onLoadingStage?.(
          message.stage as string,
          message.message as string,
        );
        break;

      case "fileList":
        this.options.onFileList?.(
          message.entries as ZipEntryMeta[],
          message.totalFiles as number,
        );
        break;

      case "cdScanningComplete":
        this.options.onCdScanningComplete?.(
          message.entriesCount as number,
        );
        break;

      case "sendStackFileToIframe":
        this.options.onSendStackFileToIframe?.(
          message.path as string,
          message.content as string,
          message.name as string | undefined,
        );
        break;

      case "stackProcessingComplete":
        this.options.onStackProcessingComplete?.(
          message.stackFilesCount as number,
        );
        break;

      case "status":
        break;

      case "error":
        console.error(`🎯 Error: ${message.message}`);
        break;

      case "zipLoaded":
        // DEPRECATED: Keep for backwards compatibility but prefer fileList
        console.log(
          `🎯 Zip loaded (deprecated): ${(message.entries as ZipEntryMeta[]).length} files`,
        );
        this.options.onFileList?.(
          message.entries as ZipEntryMeta[],
          (message.entries as ZipEntryMeta[]).length,
        );
        break;

      case "indexingProgress":
        this.options.onIndexingProgress?.({
          current: message.current as number,
          total: message.total as number,
          fileName: message.fileName as string,
        });
        break;

      case "indexingComplete":
        this.options.onIndexingComplete?.(
          message.success as boolean,
          message.totalEntries as number,
          message.error as string,
          message.ruleDescription as string,
        );
        break;

      case "indexingError":
        console.error("Indexing error:", message.error);
        break;

      case "fileStatusUpdate":
        this.options.onFileStatusUpdate?.(
          (message.fileStatuses as FileStatus[]) || [],
        );
        break;

      default:
    }
  }
}

// Global singleton
let globalWorkerManager: WorkerManager | null = null;
let initializationPromise: Promise<WorkerManager> | null = null;

export async function getWorkerManager(
  options?: IWorkerManagerCallbacks,
): Promise<WorkerManager> {
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
