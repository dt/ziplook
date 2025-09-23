/**
 * Worker Manager - orchestrates zip worker, DB worker, and indexing worker communication
 * Implements the planned architecture for worker-to-worker communication
 */

import type { ZipEntryMeta } from '../state/types';
import { getPerfMeta } from '../utils/memoryReporting';

interface WorkerManagerOptions {
  onIndexingProgress?: (progress: { current: number; total: number; fileName: string }) => void;
  onIndexingComplete?: (success: boolean, totalEntries: number, error?: string, ruleDescription?: string) => void;
  onIndexingFileResult?: (filePath: string, entries: any[]) => void;
  onTableLoadProgress?: (tableName: string, status: string, rowCount?: number, error?: string) => void;
  onTableLoadingComplete?: (success: boolean, tablesLoaded: number, error?: string) => void;
  onDatabaseInitialized?: (success: boolean, error?: string) => void;
  onMemoryReport?: (workerId: 'main' | 'db' | 'indexing' | 'zip', perfMeta: any) => void;
}

// Global singleton instance
let globalWorkerManager: WorkerManager | null = null;
let initializationPromise: Promise<WorkerManager> | null = null;

export class WorkerManager {
  private zipWorker: Worker | null = null;
  private dbWorker: Worker | null = null;
  private indexingWorker: Worker | null = null;
  private zipToDbChannel: MessageChannel | null = null;
  private zipToIndexingChannel: MessageChannel | null = null;
  private pendingZipRequests = new Map<string, {
    resolve: (value: any) => void;
    reject: (error: Error) => void;
  }>();
  private pendingDbRequests = new Map<string, {
    resolve: (value: any) => void;
    reject: (error: Error) => void;
  }>();
  private pendingIndexingRequests = new Map<string, {
    resolve: (value: any) => void;
    reject: (error: Error) => void;
  }>();
  private options: WorkerManagerOptions;
  private databaseInitialized = false;

  constructor(options: WorkerManagerOptions = {}) {
    this.options = options;
  }

  // Allow updating callbacks after initialization
  updateCallbacks(options: WorkerManagerOptions) {
    this.options = { ...this.options, ...options };
  }

  async loadZipData(zipData: Uint8Array): Promise<ZipEntryMeta[]> {
    if (!this.zipWorker) {
      throw new Error('Zip worker not initialized');
    }

    try {
      // Load zip data into existing worker
      const entries = await this.sendZipWorkerMessage({
        type: 'initialize',
        zipData
      });

      if (!entries.success) {
        throw new Error(entries.error || 'Failed to load zip data');
      }

      return entries.entries || [];

    } catch (error) {
      console.error('Failed to load zip data:', error);
      throw error;
    }
  }

  async initializeWorkers(): Promise<void> {
    try {

      // Create zip worker first
      this.zipWorker = new Worker(
        new URL('../workers/zipReader.worker.ts', import.meta.url),
        { type: 'module' }
      );

      this.zipWorker.onmessage = (event) => {
        this.handleZipWorkerMessage(event.data);
      };

      this.zipWorker.onerror = (error) => {
        console.error('❌ Zip worker error:', error);
      };


      // Create DB worker
      this.dbWorker = new Worker(
        new URL('../workers/db.worker.ts', import.meta.url),
        { type: 'module' }
      );

      this.dbWorker.onmessage = (event) => {
        this.handleDbWorkerMessage(event.data);
      };

      this.dbWorker.onerror = (error) => {
        console.error('❌ DB worker error:', error);
      };


      // Create indexing worker
      this.indexingWorker = new Worker(
        new URL('../workers/indexing.worker.ts', import.meta.url),
        { type: 'module' }
      );

      this.indexingWorker.onmessage = (event) => {
        this.handleIndexingWorkerMessage(event.data);
      };

      this.indexingWorker.onerror = (error) => {
        console.error('❌ Indexing worker error:', error);
      };


      // Create channels for direct worker communication
      this.zipToDbChannel = new MessageChannel();
      this.zipToIndexingChannel = new MessageChannel();


      // Connect DB worker to zip worker
      this.dbWorker.postMessage({
        type: 'setZipWorkerPort',
        port: this.zipToDbChannel.port1
      }, [this.zipToDbChannel.port1]);

      this.zipWorker.postMessage({
        type: 'setDbWorkerPort',
        port: this.zipToDbChannel.port2
      }, [this.zipToDbChannel.port2]);

      // Connect indexing worker to zip worker
      this.indexingWorker.postMessage({
        type: 'setZipWorkerPort',
        port: this.zipToIndexingChannel.port1
      }, [this.zipToIndexingChannel.port1]);

      this.zipWorker.postMessage({
        type: 'setIndexingWorkerPort',
        port: this.zipToIndexingChannel.port2
      }, [this.zipToIndexingChannel.port2]);

      // Initialize the database
      await this.initializeDatabase();


    } catch (error) {
      console.error('❌ Failed to initialize workers:', error);
      throw error;
    }
  }


  async initializeDatabase(): Promise<void> {
    if (!this.dbWorker) {
      throw new Error('DB worker not initialized');
    }

    // If already initialized, return immediately
    if (this.databaseInitialized) {
      return;
    }

    return new Promise((resolve, reject) => {
      const id = this.generateRequestId();
      this.pendingDbRequests.set(id, {
        resolve: (response) => {
          if (response.success) {
            this.databaseInitialized = true;
            if (this.options.onDatabaseInitialized) {
              this.options.onDatabaseInitialized(true);
            }
            resolve();
          } else {
            this.databaseInitialized = false;
            if (this.options.onDatabaseInitialized) {
              this.options.onDatabaseInitialized(false, response.error);
            }
            reject(new Error(response.error || 'Failed to initialize database'));
          }
        },
        reject
      });

      this.dbWorker!.postMessage({
        type: 'initializeDatabase',
        id
      });
    });
  }

  async startTableLoading(tables: Array<{
    name: string;
    path: string;
    size: number;
    nodeId?: number;
    originalName?: string;
    isError?: boolean;
  }>): Promise<void> {
    if (!this.dbWorker) {
      throw new Error('DB worker not initialized');
    }

    // Wait for database to be initialized before starting table loading
    if (!this.databaseInitialized) {
      await this.initializeDatabase();
    }


    // Send table loading request to DB worker
    this.dbWorker.postMessage({
      type: 'startTableLoading',
      id: `table_loading_${Date.now()}`,
      tables
    });
  }

  async loadSingleTable(table: {
    name: string;
    path: string;
    size: number;
    nodeId?: number;
    originalName?: string;
    isError?: boolean;
  }): Promise<void> {
    if (!this.dbWorker) {
      throw new Error('DB worker not initialized');
    }

    // Wait for database to be initialized before loading table
    if (!this.databaseInitialized) {
      await this.initializeDatabase();
    }


    this.dbWorker.postMessage({
      type: 'loadSingleTable',
      id: `single_table_${Date.now()}`,
      table
    });
  }

  async executeQuery(sql: string): Promise<any[]> {
    if (!this.dbWorker) {
      throw new Error('DB worker not initialized');
    }

    // Wait for database to be initialized before executing query
    if (!this.databaseInitialized) {
      await this.initializeDatabase();
    }

    return new Promise((resolve, reject) => {
      const id = this.generateRequestId();
      this.pendingDbRequests.set(id, {
        resolve: (response) => {
          if (response.success) {
            resolve(response.data || []);
          } else {
            reject(new Error(response.error || 'Query failed'));
          }
        },
        reject
      });

      this.dbWorker!.postMessage({
        type: 'executeQuery',
        id,
        sql
      });
    });
  }

  async getTableSchema(tableName: string): Promise<any[]> {
    if (!this.dbWorker) {
      throw new Error('DB worker not initialized');
    }

    // Wait for database to be initialized
    if (!this.databaseInitialized) {
      await this.initializeDatabase();
    }

    return new Promise((resolve, reject) => {
      const id = this.generateRequestId();
      this.pendingDbRequests.set(id, {
        resolve: (response) => {
          if (response.success) {
            resolve(response.schema || []);
          } else {
            reject(new Error(response.error || 'Failed to get table schema'));
          }
        },
        reject
      });

      this.dbWorker!.postMessage({
        type: 'getTableSchema',
        id,
        tableName
      });
    });
  }

  async getLoadedTables(): Promise<string[]> {
    if (!this.dbWorker) {
      throw new Error('DB worker not initialized');
    }

    // Wait for database to be initialized
    if (!this.databaseInitialized) {
      await this.initializeDatabase();
    }

    return new Promise((resolve, reject) => {
      const id = this.generateRequestId();
      this.pendingDbRequests.set(id, {
        resolve: (response) => {
          if (response.success) {
            resolve(response.tables || []);
          } else {
            reject(new Error(response.error || 'Failed to get loaded tables'));
          }
        },
        reject
      });

      this.dbWorker!.postMessage({
        type: 'getLoadedTables',
        id
      });
    });
  }

  async getDuckDBFunctions(): Promise<Array<{name: string; type: string; description?: string}>> {
    if (!this.dbWorker) {
      throw new Error('DB worker not initialized');
    }

    // Wait for database to be initialized
    if (!this.databaseInitialized) {
      await this.initializeDatabase();
    }

    return new Promise((resolve, reject) => {
      const id = this.generateRequestId();
      this.pendingDbRequests.set(id, {
        resolve: (response) => {
          if (response.success) {
            resolve(response.functions || []);
          } else {
            reject(new Error(response.error || 'Failed to get DuckDB functions'));
          }
        },
        reject
      });

      this.dbWorker!.postMessage({
        type: 'getDuckDBFunctions',
        id
      });
    });
  }

  async getDuckDBKeywords(): Promise<string[]> {
    if (!this.dbWorker) {
      throw new Error('DB worker not initialized');
    }

    // Wait for database to be initialized
    if (!this.databaseInitialized) {
      await this.initializeDatabase();
    }

    return new Promise((resolve, reject) => {
      const id = this.generateRequestId();
      this.pendingDbRequests.set(id, {
        resolve: (response) => {
          if (response.success) {
            resolve(response.keywords || []);
          } else {
            reject(new Error(response.error || 'Failed to get DuckDB keywords'));
          }
        },
        reject
      });

      this.dbWorker!.postMessage({
        type: 'getDuckDBKeywords',
        id
      });
    });
  }

  async registerFiles(files: Array<{ path: string; name: string; size: number }>): Promise<void> {
    if (!this.indexingWorker) {
      throw new Error('Indexing worker not initialized');
    }

    if (!this.zipToIndexingChannel) {
      throw new Error('Zip worker channel not established');
    }

    // Send file registration to indexing worker
    this.indexingWorker.postMessage({
      type: 'registerFiles',
      id: `register_${Date.now()}`,
      files
    });
  }

  async startIndexing(filePaths: string[]): Promise<void> {
    if (!this.indexingWorker) {
      throw new Error('Indexing worker not initialized');
    }

    if (!this.zipToIndexingChannel) {
      throw new Error('Zip worker channel not established');
    }

    // Send indexing request to indexing worker
    this.indexingWorker.postMessage({
      type: 'startIndexing',
      id: `indexing_${Date.now()}`,
      filePaths
    });
  }

  async indexSingleFile(file: { path: string; name: string; size: number }): Promise<void> {
    if (!this.indexingWorker) {
      throw new Error('Indexing worker not initialized');
    }

    if (!this.zipToIndexingChannel) {
      throw new Error('Zip worker channel not established');
    }

    // Send single file indexing request to indexing worker
    this.indexingWorker.postMessage({
      type: 'indexSingleFile',
      id: `single_indexing_${Date.now()}`,
      file
    });
  }

  async searchLogs(query: string): Promise<any[]> {
    if (!this.indexingWorker) {
      throw new Error('Indexing worker not initialized');
    }


    return new Promise((resolve, reject) => {
      const id = this.generateRequestId();
      this.pendingIndexingRequests.set(id, {
        resolve: (response) => {
          if (response.success) {
            resolve(response.results || []);
          } else {
            reject(new Error(response.error || 'Search failed'));
          }
        },
        reject
      });

      this.indexingWorker!.postMessage({
        type: 'search',
        id,
        query
      });
    });
  }

  async getFileStatuses(): Promise<any[]> {
    if (!this.indexingWorker) {
      throw new Error('Indexing worker not initialized');
    }

    return new Promise((resolve, reject) => {
      const id = this.generateRequestId();
      this.pendingIndexingRequests.set(id, {
        resolve: (response) => {
          if (response.success) {
            resolve(response.fileStatuses || []);
          } else {
            reject(new Error(response.error || 'Get file statuses failed'));
          }
        },
        reject
      });

      this.indexingWorker!.postMessage({
        type: 'getFileStatuses',
        id
      });
    });
  }

  async readFile(path: string): Promise<{ text?: string; bytes?: Uint8Array }> {
    if (!this.zipWorker) {
      throw new Error('Zip worker not initialized');
    }

    const response = await this.sendZipWorkerMessage({
      type: 'readFile',
      path
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to read file');
    }

    return response.result;
  }

  async readFileStream(
    path: string,
    onChunk: (chunk: string, progress: { loaded: number; total: number; done: boolean }) => void
  ): Promise<void> {
    if (!this.zipWorker) {
      throw new Error('Zip worker not initialized');
    }

    return new Promise((resolve, reject) => {
      const id = this.generateRequestId();

      const cleanup = () => {
        this.pendingZipRequests.delete(id);
      };

      this.pendingZipRequests.set(id, {
        resolve: () => {
          cleanup();
          resolve();
        },
        reject: (error: Error) => {
          cleanup();
          reject(error);
        }
      });

      // Set up temporary listener for chunks
      const originalHandler = this.zipWorker!.onmessage;
      this.zipWorker!.onmessage = (event) => {
        const response = event.data;

        if (response.id === id && response.type === 'readFileChunk') {
          onChunk(response.chunk, response.progress);

          if (response.progress.done) {
            this.zipWorker!.onmessage = originalHandler;
            const request = this.pendingZipRequests.get(id);
            if (request) {
              request.resolve(undefined);
            }
          }
        } else if (response.id === id && response.type === 'error') {
          this.zipWorker!.onmessage = originalHandler;
          const request = this.pendingZipRequests.get(id);
          if (request) {
            request.reject(new Error(response.error));
          }
        } else {
          // Forward other messages to original handler
          if (originalHandler && this.zipWorker) {
            originalHandler.call(this.zipWorker, event);
          }
        }
      };

      this.zipWorker!.postMessage({
        type: 'readFileChunked',
        id,
        path
      });
    });
  }

  private sendZipWorkerMessage(message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.zipWorker) {
        reject(new Error('Zip worker not available'));
        return;
      }

      const id = this.generateRequestId();
      this.pendingZipRequests.set(id, { resolve, reject });

      this.zipWorker.postMessage({ ...message, id });
    });
  }

  private handleZipWorkerMessage(response: any) {
    // Extract and report memory data if available
    if (response.perfMeta && this.options.onMemoryReport) {
      this.options.onMemoryReport('zip', response.perfMeta);
      // Also report main thread memory when processing worker messages
      this.options.onMemoryReport('main', getPerfMeta('main', 0));
    }

    const request = this.pendingZipRequests.get(response.id);
    if (request) {
      this.pendingZipRequests.delete(response.id);

      if (response.type === 'error') {
        request.reject(new Error(response.error));
      } else {
        request.resolve(response);
      }
    }
  }

  private handleDbWorkerMessage(response: any) {
    // Extract and report memory data if available
    if (response.perfMeta && this.options.onMemoryReport) {
      this.options.onMemoryReport('db', response.perfMeta);
      // Also report main thread memory when processing worker messages
      this.options.onMemoryReport('main', getPerfMeta('main', 0));
    }

    // Handle progress/status messages
    switch (response.type) {
      case 'tableLoadProgress':
        if (this.options.onTableLoadProgress) {
          this.options.onTableLoadProgress(
            response.tableName,
            response.status,
            response.rowCount,
            response.error
          );
        }
        break;

      case 'tableLoadingComplete':
        if (this.options.onTableLoadingComplete) {
          this.options.onTableLoadingComplete(
            response.success,
            response.tablesLoaded,
            response.error
          );
        }
        break;

      case 'tableLoadingError':
        if (this.options.onTableLoadingComplete) {
          this.options.onTableLoadingComplete(false, 0, response.error);
        }
        break;

      default:
        // Handle request/response messages
        const request = this.pendingDbRequests.get(response.id);
        if (request) {
          this.pendingDbRequests.delete(response.id);
          request.resolve(response);
        }
        break;
    }
  }

  private handleIndexingWorkerMessage(response: any) {
    // Extract and report memory data if available
    if (response.perfMeta && this.options.onMemoryReport) {
      this.options.onMemoryReport('indexing', response.perfMeta);
      // Also report main thread memory when processing worker messages
      this.options.onMemoryReport('main', getPerfMeta('main', 0));
    }

    switch (response.type) {
      case 'indexingProgress':
        if (this.options.onIndexingProgress) {
          this.options.onIndexingProgress({
            current: response.current,
            total: response.total,
            fileName: response.fileName
          });
        }
        break;

      case 'indexingComplete':
        if (this.options.onIndexingComplete) {
          this.options.onIndexingComplete(response.success, response.totalEntries, response.error, response.ruleDescription);
        }
        break;

      case 'indexingFileResult':
        if (this.options.onIndexingFileResult) {
          this.options.onIndexingFileResult(response.filePath, response.entries);
        }
        break;

      case 'indexingError':
        if (this.options.onIndexingComplete) {
          this.options.onIndexingComplete(false, 0, response.error, undefined);
        }
        break;

      case 'searchResponse':
      case 'fileStatuses':
        // Handle search response and file statuses response
        const request = this.pendingIndexingRequests.get(response.id);
        if (request) {
          this.pendingIndexingRequests.delete(response.id);
          request.resolve(response);
        }
        break;

      default:
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  destroy() {
    if (this.zipWorker) {
      this.zipWorker.terminate();
      this.zipWorker = null;
    }

    if (this.dbWorker) {
      this.dbWorker.terminate();
      this.dbWorker = null;
    }

    if (this.indexingWorker) {
      this.indexingWorker.terminate();
      this.indexingWorker = null;
    }

    if (this.zipToDbChannel) {
      this.zipToDbChannel.port1.close();
      this.zipToDbChannel.port2.close();
      this.zipToDbChannel = null;
    }

    if (this.zipToIndexingChannel) {
      this.zipToIndexingChannel.port1.close();
      this.zipToIndexingChannel.port2.close();
      this.zipToIndexingChannel = null;
    }

    this.pendingZipRequests.clear();
    this.pendingDbRequests.clear();
    this.pendingIndexingRequests.clear();

    // Clear global reference
    if (globalWorkerManager === this) {
      globalWorkerManager = null;
    }
  }

  /**
   * Cancel any ongoing stream operations
   * Provides compatibility with ZipReader interface
   */
  cancelStream(): void {
    // TODO: Implement proper cancellation for streaming operations
    // For now, just log that cancellation was requested
  }
}

// Public API to get/create the singleton WorkerManager
export async function getWorkerManager(options?: WorkerManagerOptions): Promise<WorkerManager> {
  // If already initialized, just update callbacks if provided and return
  if (globalWorkerManager) {
    if (options) {
      globalWorkerManager.updateCallbacks(options);
    }
    return globalWorkerManager;
  }

  // If initialization is already in progress, wait for it
  if (initializationPromise) {
    const manager = await initializationPromise;
    if (options) {
      manager.updateCallbacks(options);
    }
    return manager;
  }

  // Start initialization

  initializationPromise = (async () => {
    globalWorkerManager = new WorkerManager(options || {});

    await globalWorkerManager.initializeWorkers();

    return globalWorkerManager;
  })();

  return initializationPromise;
}