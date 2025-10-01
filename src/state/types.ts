export type ZipEntryId = string; // zip-internal path

export interface ZipEntryMeta {
  id: ZipEntryId;
  name: string;
  path: string;
  size: number;
  compressedSize: number;
  isDir: boolean;
  lastModified?: Date;
}

export type ViewerTab =
  | {
      kind: "file";
      id: string;
      fileId: ZipEntryId;
      title: string;
      content?: string;
      isFiltered?: boolean;
      filterText?: string;
      lineNumber?: number;
    }
  | {
      kind: "sql";
      id: string;
      title: string;
      query: string;
      isCustomQuery?: boolean;
      sourceTable?: string;
    }
  | {
      kind: "error";
      id: string;
      title: string;
      error: string;
      sourceFile: ZipEntryId;
      tableName: string;
    }
  | {
      kind: "search";
      id: string;
      title: string;
      query: string;
      results?: SearchResult[];
    }
  | {
      kind: "pprof";
      id: string;
      fileId: ZipEntryId;
      title: string;
    };

export interface TableMeta {
  name: string; // normalized (e.g., system_jobs)
  sourceFile: ZipEntryId;
  loaded: boolean;
  rowCount?: number;
  deferred?: boolean; // Large tables that need click-to-load
  size?: number; // File size in bytes
  loading?: boolean; // Currently loading
  nodeId?: number; // Node ID for node-specific tables
  originalName?: string; // Original table name without node prefix
  isError?: boolean; // True for .err.txt files
  loadError?: string; // Error message if loading failed
  chunkProgress?: {
    // For large file incremental loading
    current: number;
    total: number;
    percentage: number;
  };
}

// Search-related types
export interface SearchResult {
  id: number;
  file: string;
  startLine: number;
  endLine: number;
  timestamp?: string;
  level?: "I" | "W" | "E" | "F";
  goroutineId?: string;
  tags?: string[];
  message: string;
  matchedText?: string;
  context?: string;
}

export interface SearchQuery {
  text: string;
  type: "keyword" | "exact" | "regex" | "tag" | "level" | "goroutine" | "file";
  filters?: {
    level?: "I" | "W" | "E" | "F";
    goroutineId?: string;
    file?: string;
    tags?: string[];
    timeRange?: { start: string; end: string };
  };
}

export interface FileIndexStatus {
  path: string;
  name: string;
  size: number;
  status: "unindexed" | "indexing" | "indexed" | "error";
  entries?: number;
  indexedAt?: Date;
  error?: string;
}

export interface PerfMeta {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  wasmMemorySize: number; // 0 if not applicable
  timestamp: number;
  workerId: "main" | "db" | "indexing" | "zip";
  maxSeenJSHeapSize?: number; // Track peak usage
  maxSeenWasmSize?: number; // Track peak WASM usage
}

export interface MemoryReports {
  main: PerfMeta | null;
  db: PerfMeta | null;
  indexing: PerfMeta | null;
  zip: PerfMeta | null;
}

export interface SearchIndex {
  isIndexed: boolean;
  indexedFiles: Set<string>;
  totalEntries: number;
  lastUpdated?: Date;
  fileStatuses: Map<string, FileIndexStatus>;
}

// Worker management interfaces
export interface LogEntry {
  timestamp: Date;
  level: string;
  message: string;
  file?: string;
  line?: number;
}

export interface TableData {
  name: string;
  path: string;
  size: number;
  nodeId?: number;
  originalName?: string;
  isError?: boolean;
  loaded?: boolean;
  loading?: boolean;
  sourceFile?: string;
}

export interface FileStatus {
  path: string;
  status: "pending" | "indexing" | "completed" | "error";
  progress?: number;
  error?: string;
}

export interface SendSafelyPackageInfo {
  packageId: string;
  keyCode: string;
  serverSecret: string;
}

export interface SendSafelyConfig {
  host: string;
  apiKey: string;
  apiSecret: string;
  keyCode: string;
  fileId: string;
  packageInfo: SendSafelyPackageInfo;
}

// Worker manager interface - defines what the app expects from a worker coordinator
export interface IWorkerManager {
  // Core operations
  loadZipData(zipData: Uint8Array): Promise<ZipEntryMeta[]>;
  loadZipDataFromSendSafely(config: SendSafelyConfig): Promise<ZipEntryMeta[]>;
  initializeWorkers(): Promise<void>;
  destroy(): void;

  // Database operations
  executeQuery(sql: string): Promise<Record<string, unknown>[]>;
  getTableSchema(
    tableName: string,
  ): Promise<Array<{ column_name: string; data_type: string }>>;
  getLoadedTables(): Promise<string[]>;
  getDuckDBFunctions(): Promise<
    Array<{ name: string; type: string; description?: string }>
  >;
  getDuckDBKeywords(): Promise<string[]>;
  loadSingleTable(table: TableData): Promise<void>;

  // File operations
  readFileStream(
    path: string,
    onChunk: (
      chunk: Uint8Array,
      progress: { loaded: number; total: number; done: boolean },
    ) => void,
    options?: { decompress?: boolean },
  ): Promise<void>;
  cancelStream(): void;

  // Indexing operations
  searchLogs(query: string): Promise<SearchResult[]>;
  getFileStatuses(): Promise<FileStatus[]>;
  loadStackFiles(): Promise<void>;
  startIndexing(filePaths: string[]): Promise<void>;
  indexSingleFile(file: {
    path: string;
    name: string;
    size: number;
  }): Promise<void>;

  // Callback management
  updateCallbacks(options: IWorkerManagerCallbacks): void;
}

// Callback interface - defines what events the worker manager can notify about
export interface IWorkerManagerCallbacks {
  // Stage progression callbacks
  onLoadingStage?: (stage: string, message: string) => void;
  onFileList?: (entries: ZipEntryMeta[], totalFiles: number) => void;
  onTableAdded?: (table: TableData) => void;
  onSendStackFileToIframe?: (path: string, content: string, name?: string) => void;
  onStackProcessingComplete?: (stackFilesCount: number) => void;

  // Indexing callbacks
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
  onIndexingFileResult?: (filePath: string, entries: LogEntry[]) => void;

  // File status callbacks
  onFileStatusUpdate?: (fileStatuses: FileStatus[]) => void;

  // Table callbacks
  onTableLoadProgress?: (
    tableName: string,
    status: string,
    rowCount?: number,
    error?: string,
    chunkProgress?: {
      current: number;
      total: number;
      percentage: number;
    },
  ) => void;
  onTableLoadingComplete?: (
    success: boolean,
    tablesLoaded: number,
    error?: string,
  ) => void;
  onDatabaseInitialized?: (success: boolean, error?: string) => void;
}

export interface AppState {
  zip?: {
    name: string;
    size: number;
    entries: ZipEntryMeta[];
  };
  openTabs: ViewerTab[];
  activeTabId?: string;
  filesIndex: Record<ZipEntryId, ZipEntryMeta>;
  fileCache: Map<ZipEntryId, { text?: string; bytes?: Uint8Array }>;
  tables: Record<string, TableMeta>;
  tablesLoading?: boolean; // Global state for table loading
  stackData?: Record<string, string>; // Stack trace files: path -> content
  stackFiles?: Array<{ path: string; size: number; compressedSize: number }>; // Available stack files metadata
  stackgazerReady?: boolean; // Whether all stack files have been loaded and sent to iframe
  searchIndex?: SearchIndex; // Log search index state
  workerManager?: IWorkerManager; // Worker manager instance
  workersReady?: boolean; // Whether workers are initialized and ready
  indexingStatus?: "none" | "indexing" | "ready"; // Global indexing status
  indexingProgress?: {
    current: number;
    total: number;
    fileName: string;
  } | null; // Current indexing progress
  indexingRuleDescription?: string; // Description of the rule used for indexing (e.g., "*.log")
  fileStatuses?: FileIndexStatus[]; // Real-time file status updates from indexing worker
}
