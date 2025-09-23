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
  searchIndex?: SearchIndex; // Log search index state
  workerManager?: any; // WorkerManager instance
  workersReady?: boolean; // Whether workers are initialized and ready
  indexingStatus?: "none" | "indexing" | "ready"; // Global indexing status
  indexingProgress?: {
    current: number;
    total: number;
    fileName: string;
  } | null; // Current indexing progress
  indexingRuleDescription?: string; // Description of the rule used for indexing (e.g., "*.log")
}
