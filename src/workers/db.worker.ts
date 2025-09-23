/**
 * Database Worker - owns the DuckDB instance and handles all database operations
 * Requests files from zip worker for table loading, executes queries
 */

import * as duckdb from '@duckdb/duckdb-wasm';
import { preprocessCSV, shouldPreprocess } from '../crdb/csvPreprocessor';
import { getTableTypeHints } from '../crdb/columnTypeRegistry';
import { ProtoDecoder } from '../crdb/protoDecoder';
import * as protobuf from 'protobufjs';
import crdbDescriptors from '../../public/crdb.json';
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import mvp_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';
import duckdb_wasm_eh from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url';
import eh_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url';

// Message types
interface SetZipWorkerPortMessage {
  type: 'setZipWorkerPort';
  port: MessagePort;
}

interface InitializeDatabaseMessage {
  type: 'initializeDatabase';
  id: string;
}

interface StartTableLoadingMessage {
  type: 'startTableLoading';
  id: string;
  tables: Array<{
    name: string;
    path: string;
    size: number;
    nodeId?: number;
    originalName?: string;
    isError?: boolean;
  }>;
}

interface LoadSingleTableMessage {
  type: 'loadSingleTable';
  id: string;
  table: {
    name: string;
    path: string;
    size: number;
    nodeId?: number;
    originalName?: string;
    isError?: boolean;
  };
}

interface ExecuteQueryMessage {
  type: 'executeQuery';
  id: string;
  sql: string;
}

interface GetTableSchemaMessage {
  type: 'getTableSchema';
  id: string;
  tableName: string;
}

interface GetLoadedTablesMessage {
  type: 'getLoadedTables';
  id: string;
}

interface GetDuckDBFunctionsMessage {
  type: 'getDuckDBFunctions';
  id: string;
}

interface GetDuckDBKeywordsMessage {
  type: 'getDuckDBKeywords';
  id: string;
}

interface StopLoadingMessage {
  type: 'stopLoading';
  id: string;
}

type DBWorkerMessage =
  | SetZipWorkerPortMessage
  | InitializeDatabaseMessage
  | StartTableLoadingMessage
  | LoadSingleTableMessage
  | ExecuteQueryMessage
  | GetTableSchemaMessage
  | GetLoadedTablesMessage
  | GetDuckDBFunctionsMessage
  | GetDuckDBKeywordsMessage
  | StopLoadingMessage;

// Response types
interface DatabaseInitializedResponse {
  type: 'databaseInitialized';
  id: string;
  success: boolean;
  error?: string;
}

interface TableLoadProgressResponse {
  type: 'tableLoadProgress';
  id: string;
  tableName: string;
  status: 'loading' | 'completed' | 'error' | 'deferred';
  rowCount?: number;
  error?: string;
  nodeId?: number;
  originalName?: string;
  isError?: boolean;
  size?: number;
}

interface TableLoadingCompleteResponse {
  type: 'tableLoadingComplete';
  id: string;
  success: boolean;
  tablesLoaded: number;
  error?: string;
}

interface QueryResultResponse {
  type: 'queryResult';
  id: string;
  success: boolean;
  data?: any[];
  error?: string;
}

interface TableSchemaResponse {
  type: 'tableSchema';
  id: string;
  success: boolean;
  schema?: any[];
  error?: string;
}

interface LoadedTablesResponse {
  type: 'loadedTables';
  id: string;
  success: boolean;
  tables?: string[];
  error?: string;
}

interface DuckDBFunctionsResponse {
  type: 'duckDBFunctions';
  id: string;
  success: boolean;
  functions?: Array<{name: string; type: string; description?: string}>;
  error?: string;
}

interface DuckDBKeywordsResponse {
  type: 'duckDBKeywords';
  id: string;
  success: boolean;
  keywords?: string[];
  error?: string;
}


// Global state
let zipWorker: MessagePort | null = null;
let db: duckdb.AsyncDuckDB | null = null;
let conn: duckdb.AsyncDuckDBConnection | null = null;
let initialized = false;
let loadedTables = new Set<string>();
let currentLoadingId: string | null = null;
let shouldStop = false;

// Worker-specific proto decoder
let workerProtoDecoder: ProtoDecoder | null = null;

const LARGE_FILE_THRESHOLD = 20 * 1024 * 1024; // 20MB


function sendMessageToZipWorker(message: any): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!zipWorker) {
      reject(new Error('Zip worker not available'));
      return;
    }

    const id = `zip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timeoutId = setTimeout(() => {
      reject(new Error('Zip worker request timeout'));
    }, 30000); // 30 second timeout

    const handler = (event: MessageEvent) => {
      const response = event.data;
      if (response.id === id) {
        clearTimeout(timeoutId);
        zipWorker!.removeEventListener('message', handler);
        resolve(response);
      }
    };

    zipWorker.addEventListener('message', handler);
    zipWorker.postMessage({ ...message, id });
  });
}

function setZipWorkerPort(message: SetZipWorkerPortMessage) {
  zipWorker = message.port;

  // Start the port to enable message receiving
  zipWorker.start();
}

async function initializeDatabase(message: InitializeDatabaseMessage) {
  const { id } = message;

  if (initialized) {
    self.postMessage({
      type: 'databaseInitialized',
      id,
      success: true,
    } as DatabaseInitializedResponse);
    return;
  }

  try {
    // Configure DuckDB with workers
    const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
      mvp: {
        mainModule: duckdb_wasm,
        mainWorker: mvp_worker,
      },
      eh: {
        mainModule: duckdb_wasm_eh,
        mainWorker: eh_worker,
      },
    };

    // Select bundle based on browser support
    const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);

    // Instantiate worker
    const worker = new Worker(bundle.mainWorker!);
    // Use a silent logger to avoid spammy console output
    const logger = new duckdb.VoidLogger();

    // Initialize database
    db = new duckdb.AsyncDuckDB(logger, worker);
    await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

    // Configure database options
    await db.open({
      query: {
        castBigIntToDouble: true,
        castTimestampToDate: true  // Convert timestamps to JavaScript Date objects
      }
    });

    // Create connection
    conn = await db.connect();

    // Preload JSON extension to avoid loading it later during table creation
    try {
      await conn.query("INSTALL json; LOAD json;");
    } catch (err) {
      console.warn('Failed to preload JSON extension:', err);
      // Continue anyway - extension will load on demand
    }

    // Initialize worker-specific proto decoder with bundled descriptors
    try {
      workerProtoDecoder = new ProtoDecoder();
      // Create protobuf root directly from bundled JSON
      const root = protobuf.Root.fromJSON(crdbDescriptors as any);
      (workerProtoDecoder as any).root = root;
      (workerProtoDecoder as any).loaded = true;
    } catch (protoError) {
      console.warn('⚠️ Failed to initialize proto decoder in worker:', protoError);
      workerProtoDecoder = null; // Preprocessing will skip proto decoding
    }

    initialized = true;

    self.postMessage({
      type: 'databaseInitialized',
      id,
      success: true,
    } as DatabaseInitializedResponse);

  } catch (error) {
    console.error('Failed to initialize DuckDB:', error);
    self.postMessage({
      type: 'databaseInitialized',
      id,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    } as DatabaseInitializedResponse);
  }
}

async function startTableLoading(message: StartTableLoadingMessage) {
  const { id, tables } = message;

  currentLoadingId = id;
  shouldStop = false;

  try {
    let tablesLoaded = 0;

    // Process each table
    for (const table of tables) {
      if (shouldStop || currentLoadingId !== id) {
        break;
      }

      await loadSingleTable(table, id);
      tablesLoaded++;
    }

    if (!shouldStop && currentLoadingId === id) {
      self.postMessage({
        type: 'tableLoadingComplete',
        id,
        success: true,
        tablesLoaded,
        } as TableLoadingCompleteResponse);
    }

  } catch (error) {
    if (currentLoadingId === id) {
      self.postMessage({
        type: 'tableLoadingComplete',
        id,
        success: false,
        tablesLoaded: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        } as TableLoadingCompleteResponse);
    }
  }
}

async function loadSingleTableFromMessage(message: LoadSingleTableMessage) {
  const { id, table } = message;
  await loadSingleTable(table, id);
}

async function loadSingleTable(table: any, loadingId: string) {
  const { name: tableName, path, size, nodeId, originalName, isError } = table;

  if (!conn) {
    throw new Error('Database not initialized');
  }

  try {
    // Send progress update - loading
    self.postMessage({
      type: 'tableLoadProgress',
      id: loadingId,
      tableName,
      status: 'loading',
      nodeId,
      originalName,
      isError,
      size,
    } as TableLoadProgressResponse);

    // Check if already loaded
    if (loadedTables.has(tableName)) {
      const quotedTableName = `"${tableName}"`;
      const countResult = await conn.query(
        `SELECT COUNT(*) as count FROM ${quotedTableName}`
      );
      const rowCount = countResult.toArray()[0].count;

      self.postMessage({
        type: 'tableLoadProgress',
        id: loadingId,
        tableName,
        status: 'completed',
        rowCount,
        nodeId,
        originalName,
        isError,
        } as TableLoadProgressResponse);
      return;
    }

    // Check file size - defer loading if too large
    if (size > LARGE_FILE_THRESHOLD) {
  
      self.postMessage({
        type: 'tableLoadProgress',
        id: loadingId,
        tableName,
        status: 'deferred',
        nodeId,
        originalName,
        isError,
        size,
        } as TableLoadProgressResponse);
      return;
    }

    // Request file from zip worker
    const fileResponse = await sendMessageToZipWorker({
      type: 'readFile',
      path
    });

    if (!fileResponse.success) {
      throw new Error(fileResponse.error || 'Failed to read file from zip');
    }

    if (!fileResponse.result?.text) {
      throw new Error('No text content found in file');
    }

    // Load table using DuckDB logic (from duckdb.ts)
    const rowCount = await loadTableFromText(tableName, fileResponse.result.text, '\t', originalName);

    self.postMessage({
      type: 'tableLoadProgress',
      id: loadingId,
      tableName,
      status: 'completed',
      rowCount,
      nodeId,
      originalName,
      isError,
    } as TableLoadProgressResponse);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Failed to load table ${tableName}:`, error);

    self.postMessage({
      type: 'tableLoadProgress',
      id: loadingId,
      tableName,
      status: 'error',
      error: errorMessage,
      nodeId,
      originalName,
      isError,
    } as TableLoadProgressResponse);
  }
}

async function loadTableFromText(
  tableName: string,
  content: string,
  delimiter: string = '\t',
  originalName?: string
): Promise<number> {
  if (!conn || !db) {
    throw new Error('DuckDB not initialized');
  }

  if (loadedTables.has(tableName)) {
    // Get and return existing row count
    const quotedTableName = `"${tableName}"`;
    const countResult = await conn.query(
      `SELECT COUNT(*) as count FROM ${quotedTableName}`
    );
    return countResult.toArray()[0].count;
  }

  try {
    // Use quoted table name to preserve dots
    const quotedTableName = `"${tableName}"`;

    // Check if we should preprocess this table
    let processedContent = content;
    let usePreprocessed = false;

    // Use original table name for preprocessing detection, but processed name for proto mapping
    const nameForPreprocessing = originalName || tableName;
    if (shouldPreprocess(nameForPreprocessing, content)) {
      try {
        processedContent = preprocessCSV(content, {
          tableName: nameForPreprocessing, // Use original name for column mapping
          delimiter,
          decodeKeys: true,
          decodeProtos: workerProtoDecoder ? true : false, // Only enable if we have a decoder
          protoDecoder: workerProtoDecoder || undefined // Use worker-specific decoder
        });
        usePreprocessed = true;
      } catch (err) {
        console.warn(`Preprocessing failed for ${tableName}:`, err);
        processedContent = content;
      }
    }

    // Create table from CSV/TSV content
    // First, register the content as a virtual file
    const fileBaseName = tableName.replace(/[^a-zA-Z0-9_]/g, '_');
    await db.registerFileText(
      `${fileBaseName}.txt`,
      processedContent
    );

    // Drop table if exists
    await conn.query(`DROP TABLE IF EXISTS ${quotedTableName}`);

    // Check if we have type hints for this table
    const typeHints = getTableTypeHints(tableName);

    // Create table from CSV with auto-detection or explicit types
    try {
      let sql: string;

      if (typeHints.size > 0) {
        // For tables with type hints, try explicit column definitions first
        const firstLine = processedContent.split('\n')[0];
        const headers = firstLine.split(delimiter);

        // Build column definitions with type hints for ALL columns
        const columnDefs = headers.map(header => {
          const hint = typeHints.get(header.toLowerCase());
          const columnType = hint || 'VARCHAR'; // Safe default for columns without hints
          return `'${header}': '${columnType}'`;
        });

        const columnsClause = columnDefs.join(', ');
        sql = `
          CREATE TABLE ${quotedTableName} AS
          SELECT * FROM read_csv(
            '${fileBaseName}.txt',
            delim='${delimiter}',
            header=true,
            columns={${columnsClause}},
            auto_detect=false,
            quote='"',
            escape='"'
          )
        `;
      } else {
        // No type hints, use standard auto-detection
        sql = `
          CREATE TABLE ${quotedTableName} AS
          SELECT * FROM read_csv_auto(
            '${fileBaseName}.txt',
            delim='${delimiter}',
            header=true
          )
        `;
      }

      await conn.query(sql);
    } catch (parseError: any) {
      // If preprocessing caused issues or CSV sniffing failed, try with original content
      if (usePreprocessed && (parseError.message?.includes('sniffing file') ||
                             parseError.message?.includes('Error when sniffing file'))) {

        // Re-register with original content
        await db.registerFileText(
          `${fileBaseName}.txt`,
          content
        );

        const sql = `
          CREATE TABLE ${quotedTableName} AS
          SELECT * FROM read_csv_auto(
            '${fileBaseName}.txt',
            delim='${delimiter}',
            header=true
          )
        `;

        await conn.query(sql);
      } else if (parseError.message?.includes('Error when sniffing file') ||
                 parseError.message?.includes('not possible to automatically detect') ||
                 parseError.message?.includes('Could not convert string') ||
                 parseError.message?.includes('Conversion Error: CSV Error')) {
        // Some files have such complex data that DuckDB can't auto-detect them
        // Try with very explicit parameters and treat everything as VARCHAR
        console.warn(`Cannot auto-detect CSV format for ${tableName}, using fallback`);

        // Parse headers manually
        const lines = content.split('\n');
        const headerLine = lines[0];
        const headers = headerLine.split(delimiter);

        // Apply type hints if available, otherwise use VARCHAR to avoid detection issues
        const columnDefs = headers.map(header => {
          const hint = typeHints.get(header.toLowerCase());
          const safeType = hint || 'VARCHAR';
          return `'${header}': '${safeType}'`;
        }).join(', ');

        const fallbackSql = `
          CREATE TABLE ${quotedTableName} AS
          SELECT * FROM read_csv(
            '${fileBaseName}.txt',
            delim='${delimiter}',
            header=true,
            columns={${columnDefs}},
            auto_detect=false,
            sample_size=1
          )
        `;

        try {
          await conn.query(fallbackSql);
        } catch (fallbackError: any) {
          console.error(`Even fallback failed for ${tableName}:`, fallbackError.message);
          throw parseError; // Throw original error if fallback also fails
        }
      } else {
        throw parseError;
      }
    }

    // Get row count
    const countResult = await conn.query(
      `SELECT COUNT(*) as count FROM ${quotedTableName}`
    );
    const count = countResult.toArray()[0].count;

    loadedTables.add(tableName);
    return count;
  } catch (error) {
    console.error(`Failed to load table ${tableName}:`, error);
    throw error;
  }
}

function rewriteQuery(sql: string): string {
  // Convert schema.table references to quoted table names since tables are stored with dots
  let rewritten = sql;

  // Handle explicit schema.table references by quoting them
  rewritten = rewritten.replace(/\bsystem\.([a-zA-Z0-9_]+)\b/gi, '"system.$1"');
  rewritten = rewritten.replace(/\bcrdb_internal\.([a-zA-Z0-9_]+)\b/gi, '"crdb_internal.$1"');

  // Handle per-node schema references like n1_system.table -> "n1_system.table"
  rewritten = rewritten.replace(/\bn\d+_system\.([a-zA-Z0-9_]+)\b/gi, '"$&"');
  rewritten = rewritten.replace(/\bn\d+_crdb_internal\.([a-zA-Z0-9_]+)\b/gi, '"$&"');

  return rewritten;
}

async function executeQuery(message: ExecuteQueryMessage) {
  const { id, sql } = message;

  if (!conn) {
    self.postMessage({
      type: 'queryResult',
      id,
      success: false,
      error: 'Database not initialized',
    } as QueryResultResponse);
    return;
  }

  try {
    const rewrittenSql = rewriteQuery(sql);
    const result = await conn.query(rewrittenSql);
    const data = result.toArray();

    // Get column names and check for timestamps in the data
    // DuckDB returns timestamps as numbers (milliseconds since epoch)
    if (data.length > 0) {
      const firstRow = data[0];
      Object.keys(firstRow).forEach(columnName => {
        const value = firstRow[columnName];
        // Check if this looks like a timestamp (large number in milliseconds range)
        if (typeof value === 'number' && value > 1000000000000 && value < 2000000000000) {
          // This is likely a timestamp in milliseconds, convert all rows
          data.forEach(row => {
            if (typeof row[columnName] === 'number') {
              row[columnName] = new Date(row[columnName]);
            } else if (typeof row[columnName] === 'bigint') {
              row[columnName] = new Date(Number(row[columnName]));
            }
          });
        }
      });
    }

    // Sanitize data to ensure it can be cloned for postMessage
    const sanitizedData = data.map(row => {
      const sanitizedRow: any = {};
      for (const [key, value] of Object.entries(row)) {
        try {
          // Test if the value can be cloned by attempting JSON serialization
          JSON.stringify(value);
          sanitizedRow[key] = value;
        } catch (e) {
          // If value can't be serialized, convert to string
          sanitizedRow[key] = String(value);
        }
      }
      return sanitizedRow;
    });

    self.postMessage({
      type: 'queryResult',
      id,
      success: true,
      data: sanitizedData,
    } as QueryResultResponse);
  } catch (error) {
    console.error('Query failed:', error);
    self.postMessage({
      type: 'queryResult',
      id,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    } as QueryResultResponse);
  }
}

async function getTableSchema(message: GetTableSchemaMessage) {
  const { id, tableName } = message;

  try {
    const data = await query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = '${tableName}'
    `);

    self.postMessage({
      type: 'tableSchema',
      id,
      success: true,
      schema: data,
    } as TableSchemaResponse);
  } catch (error) {
    self.postMessage({
      type: 'tableSchema',
      id,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    } as TableSchemaResponse);
  }
}

async function getLoadedTables(message: GetLoadedTablesMessage) {
  const { id } = message;

  if (!conn) {
    self.postMessage({
      type: 'loadedTables',
      id,
      success: false,
      error: 'Database not initialized',
    } as LoadedTablesResponse);
    return;
  }

  try {
    const result = await conn.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'main'
    `);
    const tables = result.toArray().map(row => row.table_name);

    self.postMessage({
      type: 'loadedTables',
      id,
      success: true,
      tables,
    } as LoadedTablesResponse);
  } catch (error) {
    self.postMessage({
      type: 'loadedTables',
      id,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    } as LoadedTablesResponse);
  }
}

async function getDuckDBFunctions(message: GetDuckDBFunctionsMessage) {
  const { id } = message;

  if (!conn) {
    self.postMessage({
      type: 'duckDBFunctions',
      id,
      success: false,
      error: 'Database not initialized',
    } as DuckDBFunctionsResponse);
    return;
  }

  try {
    // Get all available functions from DuckDB
    const result = await conn.query(`
      SELECT DISTINCT
        function_name,
        function_type
      FROM duckdb_functions()
      WHERE function_type IN ('scalar', 'aggregate')
      ORDER BY function_name
    `);

    const functions = result.toArray().map(row => ({
      name: row.function_name.toUpperCase(),
      type: row.function_type
    }));

    self.postMessage({
      type: 'duckDBFunctions',
      id,
      success: true,
      functions,
    } as DuckDBFunctionsResponse);
  } catch (err) {
    console.warn('Failed to get DuckDB functions:', err);
    // Fallback to a basic set including TO_TIMESTAMP
    const fallbackFunctions = [
      { name: 'COUNT', type: 'aggregate' },
      { name: 'SUM', type: 'aggregate' },
      { name: 'AVG', type: 'aggregate' },
      { name: 'MIN', type: 'aggregate' },
      { name: 'MAX', type: 'aggregate' },
      { name: 'CAST', type: 'scalar' },
      { name: 'COALESCE', type: 'scalar' },
      { name: 'UPPER', type: 'scalar' },
      { name: 'LOWER', type: 'scalar' },
      { name: 'LENGTH', type: 'scalar' },
      { name: 'SUBSTRING', type: 'scalar' },
      { name: 'REPLACE', type: 'scalar' },
      { name: 'TRIM', type: 'scalar' },
      { name: 'ABS', type: 'scalar' },
      { name: 'ROUND', type: 'scalar' },
      { name: 'TO_TIMESTAMP', type: 'scalar' },
      { name: 'TO_DATE', type: 'scalar' },
      { name: 'TO_CHAR', type: 'scalar' }
    ];

    self.postMessage({
      type: 'duckDBFunctions',
      id,
      success: true,
      functions: fallbackFunctions,
    } as DuckDBFunctionsResponse);
  }
}

async function getDuckDBKeywords(message: GetDuckDBKeywordsMessage) {
  const { id } = message;

  if (!conn) {
    self.postMessage({
      type: 'duckDBKeywords',
      id,
      success: false,
      error: 'Database not initialized',
    } as DuckDBKeywordsResponse);
    return;
  }

  try {
    // Get DuckDB keywords
    const result = await conn.query(`
      SELECT keyword_name FROM duckdb_keywords()
    `);

    const keywords = result.toArray().map(row => row.keyword_name.toUpperCase());

    self.postMessage({
      type: 'duckDBKeywords',
      id,
      success: true,
      keywords,
    } as DuckDBKeywordsResponse);
  } catch (err) {
    console.warn('Failed to get DuckDB keywords:', err);
    // Fallback to basic SQL keywords
    const fallbackKeywords = [
      'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER',
      'GROUP', 'BY', 'ORDER', 'HAVING', 'LIMIT', 'OFFSET', 'AS',
      'ON', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE'
    ];

    self.postMessage({
      type: 'duckDBKeywords',
      id,
      success: true,
      keywords: fallbackKeywords,
    } as DuckDBKeywordsResponse);
  }
}

async function query(sql: string): Promise<any> {
  if (!conn) {
    throw new Error('DuckDB not initialized');
  }

  const rewrittenSql = rewriteQuery(sql);
  const result = await conn.query(rewrittenSql);
  return result.toArray();
}

function stopLoading(message: StopLoadingMessage) {
  const { id } = message;

  if (currentLoadingId === id) {
    shouldStop = true;
    currentLoadingId = null;
  }
}

// Handle messages from main thread
self.onmessage = (event: MessageEvent<DBWorkerMessage>) => {
  const message = event.data;

  switch (message.type) {
    case 'setZipWorkerPort':
      setZipWorkerPort(message);
      break;
    case 'initializeDatabase':
      initializeDatabase(message);
      break;
    case 'startTableLoading':
      startTableLoading(message);
      break;
    case 'loadSingleTable':
      loadSingleTableFromMessage(message);
      break;
    case 'executeQuery':
      executeQuery(message);
      break;
    case 'getTableSchema':
      getTableSchema(message);
      break;
    case 'getLoadedTables':
      getLoadedTables(message);
      break;
    case 'getDuckDBFunctions':
      getDuckDBFunctions(message);
      break;
    case 'getDuckDBKeywords':
      getDuckDBKeywords(message);
      break;
    case 'stopLoading':
      stopLoading(message);
      break;
    default:
      console.error('Unknown DB worker message type:', (message as any).type);
  }
};

// Export for TypeScript
export {};