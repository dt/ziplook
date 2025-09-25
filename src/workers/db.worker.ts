/**
 * Database Worker - owns the DuckDB instance and handles all database operations
 * Requests files from zip worker for table loading, executes queries
 */

import * as duckdb from "@duckdb/duckdb-wasm";
import { preprocessCSV, shouldPreprocess } from "../crdb/csvPreprocessor";
import { getTableTypeHints } from "../crdb/columnTypeRegistry";
import { ProtoDecoder } from "../crdb/protoDecoder";
import * as protobuf from "protobufjs";
import crdbDescriptors from "../../public/crdb.json";
import duckdb_wasm from "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url";
import mvp_worker from "@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url";
import duckdb_wasm_eh from "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url";
import eh_worker from "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url";

// Message format for centralized routing
interface RoutedMessage {
  to: string;
  from: string;
  id: string;
  type: string;
  [key: string]: any;
}

interface InitializeDatabaseMessage {
  type: "initializeDatabase";
  id: string;
}

interface StartTableLoadingMessage {
  type: "startTableLoading";
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
  type: "loadSingleTable";
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
  type: "executeQuery";
  id: string;
  sql: string;
}

interface GetTableSchemaMessage {
  type: "getTableSchema";
  id: string;
  tableName: string;
}

interface GetLoadedTablesMessage {
  type: "getLoadedTables";
  id: string;
}

interface GetDuckDBFunctionsMessage {
  type: "getDuckDBFunctions";
  id: string;
}

interface GetDuckDBKeywordsMessage {
  type: "getDuckDBKeywords";
  id: string;
}

interface StopLoadingMessage {
  type: "stopLoading";
  id: string;
}

interface ProcessFileListMessage {
  type: "processFileList";
  id: string;
  fileList: Array<{
    path: string;
    name: string;
    size: number;
    isDir: boolean;
  }>;
}

type DBWorkerMessage =
  | InitializeDatabaseMessage
  | StartTableLoadingMessage
  | LoadSingleTableMessage
  | ExecuteQueryMessage
  | GetTableSchemaMessage
  | GetLoadedTablesMessage
  | GetDuckDBFunctionsMessage
  | GetDuckDBKeywordsMessage
  | StopLoadingMessage
  | ProcessFileListMessage;

// Response types
interface DatabaseInitializedResponse {
  type: "databaseInitialized";
  id: string;
  success: boolean;
  error?: string;
}




interface TableSchemaResponse {
  type: "tableSchema";
  id: string;
  success: boolean;
  schema?: any[];
  error?: string;
}


interface DuckDBFunctionsResponse {
  type: "duckDBFunctions";
  id: string;
  success: boolean;
  functions?: Array<{ name: string; type: string; description?: string }>;
  error?: string;
}

interface DuckDBKeywordsResponse {
  type: "duckDBKeywords";
  id: string;
  success: boolean;
  keywords?: string[];
  error?: string;
}

// Global state
let db: duckdb.AsyncDuckDB | null = null;
let conn: duckdb.AsyncDuckDBConnection | null = null;
let initialized = false;
let pendingZipRequests = new Map<string, {
  resolve: (value: any) => void;
  reject: (error: Error) => void;
  timeoutId: NodeJS.Timeout;
  chunks: string[];
  totalText: string;
}>();
let loadedTables = new Set<string>();
let currentLoadingId: string | null = null;
let shouldStop = false;

// Worker-specific proto decoder
let workerProtoDecoder: ProtoDecoder | null = null;

// Helper to send responses with or without routing
function sendResponse(message: any, response: any) {
  if (message.from) {
    // Routed response
    self.postMessage({ ...response, to: message.from, from: "dbWorker" });
  } else {
    // Direct response
    self.postMessage(response);
  }
}

const LARGE_FILE_THRESHOLD = 20 * 1024 * 1024; // 20MB

function sendMessageToZipWorker(message: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const id = message.id || `zip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Set timeout
    const timeoutId = setTimeout(() => {
      pendingZipRequests.delete(id);
      reject(new Error("Zip worker request timeout"));
    }, 30000);

    // Store the pending request
    pendingZipRequests.set(id, { resolve, reject, timeoutId, chunks: [], totalText: "" });

    // Send routed message through main thread
    self.postMessage({
      to: "zipWorker",
      from: "dbWorker",
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
      // Accumulate chunks
      request.chunks.push(message.chunk);
      // Decode chunk to text before accumulating
      if (message.chunk instanceof Uint8Array) {
        request.totalText += new TextDecoder().decode(message.chunk);
      } else {
        request.totalText += message.chunk;
      }

      if (message.progress.done) {
        // All chunks received, resolve with complete response
        clearTimeout(request.timeoutId);
        pendingZipRequests.delete(message.id);

        request.resolve({
          type: "readFileComplete",
          id: message.id,
          success: true,
          result: { text: request.totalText }
        });
      }
    }

    if (message.type === "readFileComplete") {
      // Handle complete file response
      clearTimeout(request.timeoutId);
      pendingZipRequests.delete(message.id);

      request.resolve({
        type: "readFileComplete",
        id: message.id,
        success: message.success,
        result: message.result,
        error: message.error
      });
    }
    return;
  }

  }


async function initializeDatabase(message: InitializeDatabaseMessage) {
  const { id } = message;

  if (initialized) {
    self.postMessage({
      type: "databaseInitialized",
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
        castTimestampToDate: true, // Convert timestamps to JavaScript Date objects
      },
    });

    // Create connection
    conn = await db.connect();

    // Preload JSON extension to avoid loading it later during table creation
    try {
      await conn.query(`
        SET custom_extension_repository = '${new URL('duckdb-extensions', location.href).href}';
        SET autoinstall_extension_repository = 'custom';
        -- optional hardening
        SET allow_community_extensions = false;
        INSTALL json;
        LOAD json;
      `);
    } catch (err) {
      console.warn("Failed to preload JSON extension:", err);
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
      console.warn(
        "⚠️ Failed to initialize proto decoder in worker:",
        protoError,
      );
      workerProtoDecoder = null; // Preprocessing will skip proto decoding
    }

    initialized = true;

    self.postMessage({
      type: "databaseInitialized",
      id,
      success: true,
    } as DatabaseInitializedResponse);
  } catch (error) {
    console.error("Failed to initialize DuckDB:", error);
    self.postMessage({
      type: "databaseInitialized",
      id,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
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
        type: "tableLoadingComplete",
        success: true,
        tablesLoaded,
      });
    }
  } catch (error) {
    if (currentLoadingId === id) {
      self.postMessage({
        type: "tableLoadingComplete",
        success: false,
        tablesLoaded: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

async function loadSingleTableFromMessage(message: LoadSingleTableMessage) {
  const { id, table } = message;
  await loadSingleTable(table, id);
}

async function loadSingleTable(table: any, _loadingId: string) {
  const { name: tableName, path, size, nodeId, originalName, isError } = table;
  const startTime = performance.now();
  
  if (!conn) {
    throw new Error("Database not initialized");
  }

  try {
    // Send progress update - loading
    self.postMessage({
      type: "tableLoadProgress",
      tableName,
      status: "loading",
      nodeId,
      originalName,
      isError,
      size,
    });

    // Check if already loaded
    if (loadedTables.has(tableName)) {
      const quotedTableName = `"${tableName}"`;
      const countResult = await conn.query(
        `SELECT COUNT(*) as count FROM ${quotedTableName}`,
      );
      const rowCount = countResult.toArray()[0].count;

      self.postMessage({
        type: "tableLoadProgress",
        tableName,
        status: "completed",
        rowCount,
        nodeId,
        originalName,
        isError,
      });
      return;
    }

    // Check file size - defer loading if too large
    if (size > LARGE_FILE_THRESHOLD) {
      self.postMessage({
        type: "tableLoadProgress",
        tableName,
        status: "deferred",
        nodeId,
        originalName,
        isError,
        size,
      });
      return;
    }

    // Request file from zip worker
    const fileResponse = await sendMessageToZipWorker({
      type: "readFile",
      path,
    });

    if (!fileResponse.success) {
      throw new Error(fileResponse.error || "Failed to read file from zip");
    }

    if (!fileResponse.result?.text) {
      throw new Error("No content found in file");
    }

    const text = fileResponse.result.text;

    // Load table using DuckDB logic (from duckdb.ts)
    const rowCount = await loadTableFromText(
      tableName,
      text,
      "\t",
      originalName,
    );
    self.postMessage({
      type: "tableLoadProgress",
      tableName,
      status: "completed",
      rowCount,
      nodeId,
      originalName,
      isError,
    });
  } catch (error) {
    const errorEndTime = performance.now();
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`📊 DB Worker: Failed to load table ${tableName} in ${(errorEndTime - startTime).toFixed(2)}ms:`, error);

    self.postMessage({
      type: "tableLoadProgress",
      tableName,
      status: "error",
      error: errorMessage,
      nodeId,
      originalName,
      isError,
    });
  }
}

async function loadTableFromText(
  tableName: string,
  content: string,
  delimiter: string = "\t",
  originalName?: string,
): Promise<number> {
  if (!conn || !db) {
    throw new Error("DuckDB not initialized");
  }

  if (loadedTables.has(tableName)) {
    // Get and return existing row count
    const quotedTableName = `"${tableName}"`;
    const countResult = await conn.query(
      `SELECT COUNT(*) as count FROM ${quotedTableName}`,
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
          protoDecoder: workerProtoDecoder || undefined, // Use worker-specific decoder
        });
        usePreprocessed = true;
      } catch (err) {
        console.warn(`Preprocessing failed for ${tableName}:`, err);
        processedContent = content;
      }
    }

    // Create table from CSV/TSV content
    // First, register the content as a virtual file
    const fileBaseName = tableName.replace(/[^a-zA-Z0-9_]/g, "_");
    await db.registerFileText(`${fileBaseName}.txt`, processedContent);

    // Drop table if exists
    await conn.query(`DROP TABLE IF EXISTS ${quotedTableName}`);

    // Check if we have type hints for this table
    const typeHints = getTableTypeHints(tableName);

    // Create table from CSV with auto-detection or explicit types
    try {
      let sql: string;

      if (typeHints.size > 0) {
        // For tables with type hints, try explicit column definitions first
        const firstLine = processedContent.split("\n")[0];
        const headers = firstLine.split(delimiter);

        // Build column definitions with type hints for ALL columns
        const columnDefs = headers.map((header) => {
          const hint = typeHints.get(header.toLowerCase());
          const columnType = hint || "VARCHAR"; // Safe default for columns without hints
          return `'${header}': '${columnType}'`;
        });

        const columnsClause = columnDefs.join(", ");
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
      if (
        usePreprocessed &&
        (parseError.message?.includes("sniffing file") ||
          parseError.message?.includes("Error when sniffing file"))
      ) {
        // Re-register with original content
        await db.registerFileText(`${fileBaseName}.txt`, content);

        const sql = `
          CREATE TABLE ${quotedTableName} AS
          SELECT * FROM read_csv_auto(
            '${fileBaseName}.txt',
            delim='${delimiter}',
            header=true
          )
        `;

        await conn.query(sql);
      } else if (
        parseError.message?.includes("Error when sniffing file") ||
        parseError.message?.includes("not possible to automatically detect") ||
        parseError.message?.includes("Could not convert string") ||
        parseError.message?.includes("Conversion Error: CSV Error")
      ) {
        // Some files have such complex data that DuckDB can't auto-detect them
        // Try with very explicit parameters and treat everything as VARCHAR
        console.warn(
          `Cannot auto-detect CSV format for ${tableName}, using fallback`,
        );

        // Parse headers manually
        const lines = content.split("\n");
        const headerLine = lines[0];
        const headers = headerLine.split(delimiter);

        // Apply type hints if available, otherwise use VARCHAR to avoid detection issues
        const columnDefs = headers
          .map((header) => {
            const hint = typeHints.get(header.toLowerCase());
            const safeType = hint || "VARCHAR";
            return `'${header}': '${safeType}'`;
          })
          .join(", ");

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
          console.error(
            `Even fallback failed for ${tableName}:`,
            fallbackError.message,
          );
          throw parseError; // Throw original error if fallback also fails
        }
      } else {
        throw parseError;
      }
    }

    // Get row count
    const countResult = await conn.query(
      `SELECT COUNT(*) as count FROM ${quotedTableName}`,
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
  rewritten = rewritten.replace(
    /\bcrdb_internal\.([a-zA-Z0-9_]+)\b/gi,
    '"crdb_internal.$1"',
  );

  // Handle per-node schema references like n1_system.table -> "n1_system.table"
  rewritten = rewritten.replace(/\bn\d+_system\.([a-zA-Z0-9_]+)\b/gi, '"$&"');
  rewritten = rewritten.replace(
    /\bn\d+_crdb_internal\.([a-zA-Z0-9_]+)\b/gi,
    '"$&"',
  );

  return rewritten;
}

async function executeQuery(message: any) {
  const { id, sql } = message;
  console.log(`🗄️  DB Worker: Executing query: ${sql}`);

  if (!conn) {
    sendResponse(message, {
      type: "queryResult",
      id,
      success: false,
      error: "Database not initialized",
    });
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
      Object.keys(firstRow).forEach((columnName) => {
        const value = firstRow[columnName];
        // Check if this looks like a timestamp (large number in milliseconds range)
        if (
          (typeof value === "number" && value > 1000000000000 && value < 2000000000000) ||
          (typeof value === "bigint" && value > 1000000000000n && value < 2000000000000n)
        ) {
          // This is likely a timestamp in milliseconds, convert all rows
          data.forEach((row) => {
            if (typeof row[columnName] === "number") {
              row[columnName] = new Date(row[columnName]);
            } else if (typeof row[columnName] === "bigint") {
              row[columnName] = new Date(Number(row[columnName]));
            }
          });
        }
      });
    }

    // Sanitize data to ensure it can be cloned for postMessage
    const sanitizedData = data.map((row) => {
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

    console.log(`🗄️  DB Worker: Query completed, returning ${sanitizedData.length} rows`);
    sendResponse(message, {
      type: "queryResult",
      id,
      success: true,
      result: sanitizedData,
    });
  } catch (error) {
    console.error("Query failed:", error);
    sendResponse(message, {
      type: "queryResult",
      id,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
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
      type: "tableSchema",
      id,
      success: true,
      schema: data,
    } as TableSchemaResponse);
  } catch (error) {
    self.postMessage({
      type: "tableSchema",
      id,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    } as TableSchemaResponse);
  }
}

async function getLoadedTables(message: any) {
  const { id } = message;

  if (!conn) {
    sendResponse(message, {
      type: "loadedTables",
      id,
      success: false,
      error: "Database not initialized",
    });
    return;
  }

  try {
    const result = await conn.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'main'
    `);
    const tables = result.toArray().map((row) => row.table_name);

    sendResponse(message, {
      type: "loadedTables",
      id,
      success: true,
      result: tables,
    });
  } catch (error) {
    sendResponse(message, {
      type: "loadedTables",
      id,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

async function getDuckDBFunctions(message: GetDuckDBFunctionsMessage) {
  const { id } = message;

  if (!conn) {
    self.postMessage({
      type: "duckDBFunctions",
      id,
      success: false,
      error: "Database not initialized",
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

    const rawFunctions = result.toArray();

    // Sanitize data to ensure it can be cloned for postMessage
    const functions = rawFunctions.map((row) => {
      const sanitizedRow: any = {};
      for (const [key, value] of Object.entries(row)) {
        try {
          // Handle BigInt values explicitly
          if (typeof value === 'bigint') {
            sanitizedRow[key] = value.toString();
          } else {
            JSON.stringify(value);
            sanitizedRow[key] = value;
          }
        } catch (e) {
          sanitizedRow[key] = String(value);
        }
      }
      return {
        name: sanitizedRow.function_name.toUpperCase(),
        type: sanitizedRow.function_type,
      };
    });

    self.postMessage({
      type: "duckDBFunctions",
      id,
      success: true,
      functions,
    } as DuckDBFunctionsResponse);
  } catch (err) {
    console.warn("Failed to get DuckDB functions:", err);
    // Fallback to a basic set including TO_TIMESTAMP
    const fallbackFunctions = [
      { name: "COUNT", type: "aggregate" },
      { name: "SUM", type: "aggregate" },
      { name: "AVG", type: "aggregate" },
      { name: "MIN", type: "aggregate" },
      { name: "MAX", type: "aggregate" },
      { name: "CAST", type: "scalar" },
      { name: "COALESCE", type: "scalar" },
      { name: "UPPER", type: "scalar" },
      { name: "LOWER", type: "scalar" },
      { name: "LENGTH", type: "scalar" },
      { name: "SUBSTRING", type: "scalar" },
      { name: "REPLACE", type: "scalar" },
      { name: "TRIM", type: "scalar" },
      { name: "ABS", type: "scalar" },
      { name: "ROUND", type: "scalar" },
      { name: "TO_TIMESTAMP", type: "scalar" },
      { name: "TO_DATE", type: "scalar" },
      { name: "TO_CHAR", type: "scalar" },
    ];

    self.postMessage({
      type: "duckDBFunctions",
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
      type: "duckDBKeywords",
      id,
      success: false,
      error: "Database not initialized",
    } as DuckDBKeywordsResponse);
    return;
  }

  try {
    // Get DuckDB keywords
    const result = await conn.query(`
      SELECT keyword_name FROM duckdb_keywords()
    `);

    const keywords = result
      .toArray()
      .map((row) => row.keyword_name.toUpperCase());

    self.postMessage({
      type: "duckDBKeywords",
      id,
      success: true,
      keywords,
    } as DuckDBKeywordsResponse);
  } catch (err) {
    console.warn("Failed to get DuckDB keywords:", err);
    // Fallback to basic SQL keywords
    const fallbackKeywords = [
      "SELECT",
      "FROM",
      "WHERE",
      "JOIN",
      "LEFT",
      "RIGHT",
      "INNER",
      "GROUP",
      "BY",
      "ORDER",
      "HAVING",
      "LIMIT",
      "OFFSET",
      "AS",
      "ON",
      "AND",
      "OR",
      "NOT",
      "IN",
      "EXISTS",
      "BETWEEN",
      "LIKE",
    ];

    self.postMessage({
      type: "duckDBKeywords",
      id,
      success: true,
      keywords: fallbackKeywords,
    } as DuckDBKeywordsResponse);
  }
}

async function query(sql: string): Promise<any> {
  if (!conn) {
    throw new Error("DuckDB not initialized");
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

// Process file list and decide what tables to load
async function processFileList(message: ProcessFileListMessage) {
  try {
    console.log(`🎯 DB Worker: Processing file list with ${message.fileList.length} files`);

    // Simplified filter: just files that start with "system" and end with ".txt"
    const tablesToLoad = message.fileList.filter(
      (entry) =>
        !entry.isDir &&
        (entry.path.includes("/system.") || entry.path.includes("/crdb_internal.")) &&
        entry.path.endsWith(".txt")
    );
    console.log(`🎯 DB Worker: Found ${tablesToLoad.length} potential table files`);

    // Prepare tables with proper naming (same logic as DropZone had)
    const preparedTables = [];
    for (const entry of tablesToLoad) {
      // Extract just the filename from the path
      const filename = entry.name.split("/").pop() || entry.name;
      let tableName = filename.replace(/\.(err\.txt|txt|csv)$/, "");
      let nodeId: number | undefined;
      let originalName: string | undefined;

      // Parse node ID from path like /nodes/1/system.jobs.txt
      const nodeMatch = entry.path.match(/\/nodes\/(\d+)\//);
      if (nodeMatch) {
        nodeId = parseInt(nodeMatch[1], 10);
        originalName = tableName;

        // For schema.table format, create per-node schema: system.job_info -> n1_system.job_info
        if (tableName.includes(".")) {
          const [schema, table] = tableName.split(".", 2);
          tableName = `n${nodeId}_${schema}.${table}`;
        } else {
          // For regular tables, prefix as before
          tableName = `n${nodeId}_${tableName}`;
        }
      }

      // Check if it's an error file
      const isErrorFile = entry.path.endsWith(".err.txt");

      const preparedTable = {
        name: tableName,
        sourceFile: entry.path,  // UI expects sourceFile, not path
        path: entry.path,
        size: entry.size,
        nodeId,
        originalName,
        isError: isErrorFile,
        loaded: false,  // Initially not loaded
        loading: false, // Initially not loading
      };

      preparedTables.push(preparedTable);

      // Notify controller about each table we want to load
      self.postMessage({
        type: "tableDiscovered",
        table: preparedTable
      });
    }

    // Start loading the tables
    if (preparedTables.length > 0) {
      console.log(`🎯 DB Worker: Found ${preparedTables.length} tables, checking if database is ready for data loading`);

      // Wait for database to be initialized before starting data loading
      if (!initialized) {
        console.log(`🎯 DB Worker: Database not initialized yet, waiting...`);

        // Poll for initialization with a reasonable timeout
        const maxWaitTime = 30000; // 30 seconds
        const pollInterval = 100; // 100ms
        const startTime = Date.now();

        while (!initialized && (Date.now() - startTime) < maxWaitTime) {
          await new Promise(resolve => setTimeout(resolve, pollInterval));
        }

        if (!initialized) {
          throw new Error("Database initialization timeout while waiting to load tables");
        }

        console.log(`🎯 DB Worker: Database is now initialized, proceeding with table loading`);
      }

      console.log(`🎯 DB Worker: Starting to load ${preparedTables.length} tables`);

      // Use the existing startTableLoading logic
      const fakeMessage = {
        type: "startTableLoading" as const,
        id: message.id,
        tables: preparedTables
      };

      startTableLoading(fakeMessage);
    } else {
      // No tables to load
      self.postMessage({
        type: "tableLoadingComplete",
        success: true,
        tablesLoaded: 0,
        error: null
      });
    }

    // Send response to controller
    self.postMessage({
      type: "response",
      id: message.id,
      success: true,
      result: { tablesFound: preparedTables.length }
    });

  } catch (error) {
    console.error("❌ DB Worker: Failed to process file list:", error);
    self.postMessage({
      type: "response",
      id: message.id,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

// Handle all messages based on type, regardless of routing
self.onmessage = (event: MessageEvent<DBWorkerMessage | RoutedMessage>) => {
  const message = event.data;

  // Handle routed zip worker responses first
  if ('from' in message && message.from === "zipWorker" && (message.type === "readFileChunk" || message.type === "readFileComplete")) {
    handleRoutedMessage(message as RoutedMessage);
    return;
  }

  // Handle all other messages by type
  switch (message.type) {
    case "initializeDatabase":
      initializeDatabase(message as any);
      break;
    case "startTableLoading":
      startTableLoading(message as any);
      break;
    case "loadSingleTable":
      loadSingleTableFromMessage(message as any);
      break;
    case "executeQuery":
      executeQuery(message as any);
      break;
    case "getTableSchema":
      getTableSchema(message as any);
      break;
    case "getLoadedTables":
      getLoadedTables(message as any);
      break;
    case "getDuckDBFunctions":
      getDuckDBFunctions(message as any);
      break;
    case "getDuckDBKeywords":
      getDuckDBKeywords(message as any);
      break;
    case "stopLoading":
      stopLoading(message as any);
      break;
    case "processFileList":
      processFileList(message as any);
      break;
    default:
      console.error("Unknown DB worker message type:", message.type);
  }
};

// Export for TypeScript
export {};
