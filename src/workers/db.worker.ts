/**
 * Database Worker - owns the DuckDB instance and handles all database operations
 * Requests files from zip worker for table loading, executes queries
 */

import * as duckdb from "@duckdb/duckdb-wasm";
import { preprocessCSV, shouldPreprocess } from "../crdb/csvPreprocessor";
import { getTableTypeHints } from "../crdb/columnTypeRegistry";
import { protoDecoder } from "../crdb/protoDecoder";

import mvpWasmUrl from "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url";
import mvpWorkerUrl from "@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url";
import ehWasmUrl from "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url";
import ehWorkerUrl from "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url";

// Message format for centralized routing
interface RoutedMessage {
  to: string;
  from: string;
  id: string;
  type: string;
  error?: string;
  bytes?: string | Uint8Array;
  done?: boolean;
  success?: boolean;
  result?: { text: string };
  [key: string]: unknown;
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
    nodeFiles?: Array<{
      path: string;
      size: number;
      nodeId: number;
      isError: boolean;
    }>;
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
    nodeFiles?: Array<{
      path: string;
      size: number;
      nodeId: number;
      isError: boolean;
    }>;
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
  schema?: Array<{ column_name: string; data_type: string }>;
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
interface ReadFileCompleteResponse {
  type: "readFileComplete";
  id: string;
  success: boolean;
  result?: { text: string };
  error?: string;
}

interface PendingZipRequest {
  resolve: (value: ReadFileCompleteResponse) => void;
  reject: (error: Error) => void;
  timeoutId: NodeJS.Timeout;
  chunks: Uint8Array[];
}

const pendingZipRequests = new Map<string, PendingZipRequest>();
const loadedTables = new Set<string>();
let currentLoadingId: string | null = null;
let shouldStop = false;

// Process very large files incrementally by loading directly into DuckDB
async function loadLargeFileIncrementally(
  data: Uint8Array,
  decoder: TextDecoder,
  tableName: string,
  delimiter: string,
  nameForPreprocessing: string,
  nodeId?: number,
): Promise<number> {
  if (!conn || !db) {
    throw new Error("DuckDB not initialized");
  }

  const chunkSize = 50 * 1024 * 1024; // 50MB chunks
  const totalSize = data.length;
  let offset = 0;
  let remainder = "";
  let totalRows = 0;
  let chunkNumber = 0;
  let headers: string[] = [];

  const totalChunks = Math.ceil(totalSize / chunkSize);
  console.log(`📊 Loading large file incrementally in ${totalChunks} chunks`);

  // Use quoted table name to preserve dots
  const quotedTableName = `"${tableName}"`;

  // Check if table already exists (for multi-node tables)
  let tableExists = false;
  if (nodeId !== undefined) {
    try {
      await conn.query(`SELECT 1 FROM ${quotedTableName} LIMIT 1`);
      tableExists = true;
    } catch {
      tableExists = false;
    }
  } else {
    // Drop table if exists (only for non-multi-node tables)
    await conn.query(`DROP TABLE IF EXISTS ${quotedTableName}`);
  }

  while (offset < totalSize) {
    const end = Math.min(offset + chunkSize, totalSize);
    const chunk = data.subarray(offset, end);

    // Decode this chunk
    const chunkText = decoder.decode(chunk, { stream: end < totalSize });
    const fullText = remainder + chunkText;

    // Split by lines and process complete lines
    const lines = fullText.split("\n");

    // Keep the last potentially incomplete line as remainder for next chunk
    remainder = end < totalSize ? lines.pop() || "" : "";

    if (lines.length > 0) {
      // Reconstruct this chunk's content with complete lines
      const chunkContent = lines.join("\n");

      if (chunkContent.trim()) {
        // Extract headers from first chunk
        if (chunkNumber === 0) {
          headers = lines[0].split(delimiter);
          console.log(`📋 Headers: ${headers.join(", ")}`);
        }

        // Determine which lines are data (skip header on first chunk)
        const dataLines = chunkNumber === 0 ? lines.slice(1) : lines;

        if (dataLines.length > 0) {
          // Create content with headers for processing
          const contentForProcessing = [
            headers.join(delimiter),
            ...dataLines,
          ].join("\n");

          let processedContent = contentForProcessing;

          // Apply preprocessing if needed
          const needsPreprocessing = shouldPreprocess(
            nameForPreprocessing,
            contentForProcessing,
          );
          if (needsPreprocessing) {
            console.log(`🔧 Preprocessing chunk ${chunkNumber + 1}...`);
            try {
              processedContent = preprocessCSV(contentForProcessing, {
                tableName: nameForPreprocessing,
                delimiter,
                decodeKeys: true,
                decodeProtos: true,
                protoDecoder: protoDecoder,
              });
            } catch (err) {
              console.warn(
                `⚠️ Preprocessing failed for chunk ${chunkNumber + 1}:`,
                err,
              );
            }
          }

          // Register this chunk as a temporary file
          const chunkFileName = `${tableName}_chunk_${chunkNumber}.txt`;
          await db.registerFileText(chunkFileName, processedContent);

          // Load this chunk into the table
          if (chunkNumber === 0 && !tableExists) {
            // First chunk and table doesn't exist - create table
            let sql: string;
            if (nodeId !== undefined) {
              sql = `
                CREATE TABLE ${quotedTableName} AS
                SELECT ${nodeId} AS debug_node, * FROM read_csv_auto(
                  '${chunkFileName}',
                  delim='${delimiter}',
                  header=true
                )
              `;
            } else {
              sql = `
                CREATE TABLE ${quotedTableName} AS
                SELECT * FROM read_csv_auto(
                  '${chunkFileName}',
                  delim='${delimiter}',
                  header=true
                )
              `;
            }
            await conn.query(sql);
            console.log(
              `📊 Created table from first chunk (${dataLines.length} data rows)`,
            );
          } else {
            // Subsequent chunks or table exists - insert data
            let sql: string;
            if (nodeId !== undefined) {
              sql = `
                INSERT INTO ${quotedTableName}
                SELECT ${nodeId} AS debug_node, * FROM read_csv_auto(
                  '${chunkFileName}',
                  delim='${delimiter}',
                  header=true
                )
              `;
            } else {
              sql = `
                INSERT INTO ${quotedTableName}
                SELECT * FROM read_csv_auto(
                  '${chunkFileName}',
                  delim='${delimiter}',
                  header=true
                )
              `;
            }
            await conn.query(sql);
            console.log(
              `📊 Inserted ${dataLines.length} rows from chunk ${chunkNumber + 1}`,
            );
          }

          chunkNumber++;

          // Send progress event after each chunk
          self.postMessage({
            type: "tableLoadProgress",
            tableName,
            status: "loading",
            chunkProgress: {
              current: chunkNumber,
              total: totalChunks,
              percentage: Math.round((chunkNumber / totalChunks) * 100),
            },
            nodeId: undefined, // We don't have nodeId in this context
            originalName: nameForPreprocessing,
            isError: false,
          });
        }
      }
    }

    offset = end;
  }

  // Handle any remaining content
  if (remainder.trim()) {
    let processedContent = remainder;

    const needsPreprocessing = shouldPreprocess(
      nameForPreprocessing,
      remainder,
    );
    if (needsPreprocessing) {
      try {
        processedContent = preprocessCSV(remainder, {
          tableName: nameForPreprocessing,
          delimiter,
          decodeKeys: true,
          decodeProtos: true,
          protoDecoder: protoDecoder,
        });
      } catch (err) {
        console.warn(`⚠️ Preprocessing failed for final chunk:`, err);
      }
    }

    const chunkFileName = `${tableName}_final.txt`;
    await db.registerFileText(chunkFileName, processedContent);

    if (chunkNumber === 0 && !tableExists) {
      // Only remainder content and table doesn't exist
      let sql: string;
      if (nodeId !== undefined) {
        sql = `
          CREATE TABLE ${quotedTableName} AS
          SELECT ${nodeId} AS debug_node, * FROM read_csv_auto(
            '${chunkFileName}',
            delim='${delimiter}',
            header=true
          )
        `;
      } else {
        sql = `
          CREATE TABLE ${quotedTableName} AS
          SELECT * FROM read_csv_auto(
            '${chunkFileName}',
            delim='${delimiter}',
            header=true
          )
        `;
      }
      await conn.query(sql);
    } else {
      // Insert final chunk
      let sql: string;
      if (nodeId !== undefined) {
        sql = `
          INSERT INTO ${quotedTableName}
          SELECT ${nodeId} AS debug_node, * FROM read_csv_auto(
            '${chunkFileName}',
            delim='${delimiter}',
            header=true
          )
        `;
      } else {
        sql = `
          INSERT INTO ${quotedTableName}
          SELECT * FROM read_csv_auto(
            '${chunkFileName}',
            delim='${delimiter}',
            header=true
          )
        `;
      }
      await conn.query(sql);
    }

    // Send final progress update if we processed a final chunk
    if (remainder.trim()) {
      chunkNumber++;
      self.postMessage({
        type: "tableLoadProgress",
        tableName,
        status: "loading",
        chunkProgress: {
          current: chunkNumber,
          total: totalChunks,
          percentage: 100, // Final chunk completes the loading
        },
        nodeId: undefined,
        originalName: nameForPreprocessing,
        isError: false,
      });
    }
  }

  // Get final row count
  let finalRowCount: number;
  if (nodeId !== undefined && tableExists) {
    // For multi-node INSERT operations, return only rows added (not total)
    // Count from the processed data
    const countBeforeResult = await conn.query(
      `SELECT COUNT(*) as count FROM ${quotedTableName} WHERE debug_node != ${nodeId}`,
    );
    const countBefore = countBeforeResult.toArray()[0].count;
    const countAfterResult = await conn.query(
      `SELECT COUNT(*) as count FROM ${quotedTableName}`,
    );
    const countAfter = countAfterResult.toArray()[0].count;
    finalRowCount = countAfter - countBefore;
  } else {
    // For CREATE operations or single-node tables, get total count
    const countResult = await conn.query(
      `SELECT COUNT(*) as count FROM ${quotedTableName}`,
    );
    finalRowCount = countResult.toArray()[0].count;
  }

  console.log(`✅ Successfully loaded large table with ${finalRowCount} rows`);
  loadedTables.add(tableName);
  return finalRowCount;
}

interface ResponseMessage {
  type: string;
  id: string;
  success: boolean;
  result?: unknown;
  error?: string;
}

// Helper to send responses with or without routing
function sendResponse(
  message: RoutedMessage | DBWorkerMessage,
  response: ResponseMessage,
) {
  if ("from" in message && message.from) {
    // Routed response
    self.postMessage({ ...response, to: message.from, from: "dbWorker" });
  } else {
    // Direct response
    self.postMessage(response);
  }
}

const LARGE_FILE_THRESHOLD = 4 * 1024 * 1024;

function sendMessageToZipWorker(message: {
  type: string;
  path?: string;
  id?: string;
}): Promise<ReadFileCompleteResponse> {
  return new Promise((resolve, reject) => {
    const id =
      message.id ||
      `zip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Set timeout
    const timeoutId = setTimeout(() => {
      pendingZipRequests.delete(id);
      reject(new Error("Zip worker request timeout"));
    }, 30000);

    // Store the pending request
    pendingZipRequests.set(id, { resolve, reject, timeoutId, chunks: [] });

    // Send routed message through main thread
    self.postMessage({
      to: "zipWorker",
      from: "dbWorker",
      ...message,
      id,
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
      const bytes = message.bytes;
      if (bytes instanceof Uint8Array) {
        request.chunks.push(bytes);
      } else if (typeof bytes === "string") {
        // Convert string to Uint8Array for consistency
        const encoder = new TextEncoder();
        request.chunks.push(encoder.encode(bytes));
      } else {
        console.warn(`⚠️ Received unknown chunk type: ${typeof bytes}`);
      }

      if (message.done) {
        // All chunks received, concatenate and decode
        clearTimeout(request.timeoutId);
        pendingZipRequests.delete(message.id);
        // Calculate total length and concatenate all chunks
        const totalLength = request.chunks.reduce(
          (sum, chunk) => sum + chunk.length,
          0,
        );

        const combined = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of request.chunks) {
          combined.set(chunk, offset);
          offset += chunk.length;
        }

        let totalText: string;
        const decoder = new TextDecoder();

        // For very large files, skip creating huge strings and load incrementally
        if (totalLength > 200 * 1024 * 1024) {
          // 200MB threshold
          console.log(
            `📄 Large file detected (${(totalLength / (1024 * 1024)).toFixed(1)}MB), will handle incrementally`,
          );
          totalText = "LARGE_FILE_PLACEHOLDER"; // Signal to use incremental loading
        } else {
          // Decode the complete data as text for smaller files
          try {
            totalText = decoder.decode(combined);
          } catch (error) {
            if (
              error instanceof RangeError &&
              error.message.includes("Invalid string length")
            ) {
              throw new Error(
                `File is too large to process (${(totalLength / (1024 * 1024 * 1024)).toFixed(2)}GB). JavaScript string limitations exceeded.`,
              );
            }
            throw error;
          }
        }

        // For large files, include raw bytes in the response
        const result: { text: string; rawBytes?: Uint8Array } = { text: totalText };
        if (totalText === "LARGE_FILE_PLACEHOLDER") {
          result.rawBytes = combined;
        }

        request.resolve({
          type: "readFileComplete",
          id: message.id,
          success: true,
          result,
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
        success: message.success ?? false,
        result: message.result,
        error: message.error,
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
    // Use DuckDB's Vite recipe with proper ?url imports
    const bundles: duckdb.DuckDBBundles = {
      mvp: { mainModule: mvpWasmUrl, mainWorker: mvpWorkerUrl },
      eh: { mainModule: ehWasmUrl, mainWorker: ehWorkerUrl },
    };

    // Select bundle based on browser support
    const bundle = await duckdb.selectBundle(bundles);

    // Create worker with type: 'module' as recommended by DuckDB docs
    const worker = new Worker(bundle.mainWorker!, { type: 'module' });

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
        SET custom_extension_repository = '${
          import.meta.env.DEV
            ? new URL("/duckdb-extensions", location.origin).href
            : new URL("../duckdb-extensions", import.meta.url).href
        }';
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

      if (table.isError) {
        continue;
      }

      if (
        table.size > LARGE_FILE_THRESHOLD ||
        (tables.length > 300 && table.path.includes("/nodes/"))
      ) {
        self.postMessage({
          type: "tableLoadProgress",
          tableName: table.name,
          status: "deferred",
          nodeId: table.nodeId,
          size: table.size,
        });
      } else {
        await loadSingleTable(table);
        tablesLoaded++;
      }
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
  const { table } = message;
  await loadSingleTable(table);
}

interface TableInfo {
  name: string;
  path: string;
  size: number;
  nodeId?: number;
  originalName?: string;
  isError?: boolean;
  nodeFiles?: Array<{
    path: string;
    size: number;
    nodeId: number;
    isError: boolean;
  }>;
}

async function loadSingleTable(table: TableInfo) {
  const { name: tableName, path, size, nodeId, originalName, isError, nodeFiles } = table;

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

    // Handle multi-node tables
    if (nodeFiles && nodeFiles.length > 0) {

      let totalRowCount = 0;
      for (const nodeFile of nodeFiles) {
        // Request file from zip worker
        const fileResponse = await sendMessageToZipWorker({
          type: "readFileChunked",
          path: nodeFile.path,
        });

        if (!fileResponse.success) {
          throw new Error(`Failed to read file from node ${nodeFile.nodeId}: ${fileResponse.error}`);
        }

        if (!fileResponse.result?.text) {
          throw new Error(`No content found in file from node ${nodeFile.nodeId}`);
        }

        const text = fileResponse.result.text;

        // Check if this is a large file that needs incremental loading
        if (text === "LARGE_FILE_PLACEHOLDER") {
          console.log(`🔄 Loading large file from node ${nodeFile.nodeId} incrementally...`);
          const rawBytes = (fileResponse.result as { rawBytes?: Uint8Array })?.rawBytes;
          if (!rawBytes) {
            throw new Error("Raw bytes not available for large file processing");
          }

          const rowCount = await loadLargeFileIncrementally(
            rawBytes,
            new TextDecoder(),
            tableName,
            "\t",
            originalName || tableName,
            nodeFile.nodeId,
          );
          totalRowCount += rowCount;
        } else {
          // Load from text
          const rowCount = await loadTableFromText(
            tableName,
            text,
            "\t",
            originalName,
            nodeFile.nodeId,
          );
          totalRowCount += rowCount;
        }
      }

      self.postMessage({
        type: "tableLoadProgress",
        tableName,
        status: "completed",
        rowCount: totalRowCount,
        nodeId,
        originalName,
        isError,
      });

      // Mark table as loaded and return - don't fall through to single-file path
      loadedTables.add(tableName);
      return;
    }

    // Check if already loaded (for non-multi-node tables)
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

    // Note: loadSingleTable is specifically for loading deferred tables on demand
    // So we don't check size limits here - user explicitly requested loading

    // Request file from zip worker
    const fileResponse = await sendMessageToZipWorker({
      type: "readFileChunked",
      path,
    });

    if (!fileResponse.success) {
      throw new Error(fileResponse.error || "Failed to read file from zip");
    }

    if (!fileResponse.result?.text) {
      throw new Error("No content found in file");
    }

    const text = fileResponse.result.text;

    // Check if this is a large file that needs incremental loading
    if (text === "LARGE_FILE_PLACEHOLDER") {
      console.log(`🔄 Loading large table ${tableName} incrementally...`);
      // Get the raw bytes from the response
      const rawBytes = (fileResponse.result as { rawBytes?: Uint8Array })?.rawBytes;
      if (!rawBytes) {
        throw new Error("Raw bytes not available for large file processing");
      }

      // Load directly using incremental approach
      const rowCount = await loadLargeFileIncrementally(
        rawBytes,
        new TextDecoder(),
        tableName,
        "\t",
        originalName || tableName,
      );

      // Send completion event for incremental loading
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
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`Failed to load table ${tableName}:`, error);

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
  nodeId?: number,
): Promise<number> {
  if (!conn || !db) {
    throw new Error("DuckDB not initialized");
  }

  // For multi-node tables, don't skip if already loaded - we're adding more data
  if (loadedTables.has(tableName) && nodeId === undefined) {
    // Get and return existing row count (only for non-multi-node tables)
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
    const needsPreprocessing = shouldPreprocess(nameForPreprocessing, content);

    if (needsPreprocessing) {
      try {
        processedContent = preprocessCSV(content, {
          tableName: nameForPreprocessing, // Use original name for column mapping
          delimiter,
          decodeKeys: true,
          decodeProtos: protoDecoder ? true : false, // Only enable if we have a decoder
          protoDecoder: protoDecoder || undefined, // Use worker-specific decoder
        });
        usePreprocessed = true;
      } catch (err) {
        console.warn(`❌ Preprocessing failed for ${tableName}:`, err);
        processedContent = content;
      }
    }

    // Create table from CSV/TSV content
    // First, register the content as a virtual file
    const fileBaseName = tableName.replace(/[^a-zA-Z0-9_]/g, "_");
    await db.registerFileText(`${fileBaseName}.txt`, processedContent);

    // Check if we have type hints for this table
    const typeHints = getTableTypeHints(tableName);

    // Check if table already exists (for multi-node tables)
    let tableExists = false;
    if (nodeId !== undefined) {
      try {
        await conn.query(`SELECT 1 FROM ${quotedTableName} LIMIT 1`);
        tableExists = true;
      } catch {
        tableExists = false;
      }
    }

    // Create table from CSV with auto-detection or explicit types
    try {
      let sql: string;

      if (!tableExists) {
        // Drop table if exists (only for non-multi-node or first load)
        if (nodeId === undefined) {
          await conn.query(`DROP TABLE IF EXISTS ${quotedTableName}`);
        }

        // CREATE TABLE
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

          if (nodeId !== undefined) {
            // Multi-node table: add debug_node column
            sql = `
              CREATE TABLE ${quotedTableName} AS
              SELECT ${nodeId} AS debug_node, * FROM read_csv(
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
          }
        } else {
          // No type hints, use standard auto-detection
          if (nodeId !== undefined) {
            // Multi-node table: add debug_node column
            sql = `
              CREATE TABLE ${quotedTableName} AS
              SELECT ${nodeId} AS debug_node, * FROM read_csv_auto(
                '${fileBaseName}.txt',
                delim='${delimiter}',
                header=true
              )
            `;
          } else {
            sql = `
              CREATE TABLE ${quotedTableName} AS
              SELECT * FROM read_csv_auto(
                '${fileBaseName}.txt',
                delim='${delimiter}',
                header=true
              )
            `;
          }
        }
      } else {
        // INSERT INTO existing table
        if (typeHints.size > 0) {
          const firstLine = processedContent.split("\n")[0];
          const headers = firstLine.split(delimiter);

          const columnDefs = headers.map((header) => {
            const hint = typeHints.get(header.toLowerCase());
            const columnType = hint || "VARCHAR";
            return `'${header}': '${columnType}'`;
          });

          const columnsClause = columnDefs.join(", ");
          sql = `
            INSERT INTO ${quotedTableName}
            SELECT ${nodeId} AS debug_node, * FROM read_csv(
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
          sql = `
            INSERT INTO ${quotedTableName}
            SELECT ${nodeId} AS debug_node, * FROM read_csv_auto(
              '${fileBaseName}.txt',
              delim='${delimiter}',
              header=true
            )
          `;
        }
      }

      await conn.query(sql);
    } catch (parseError: unknown) {
      const error =
        parseError instanceof Error
          ? parseError
          : new Error(String(parseError));
      // If preprocessing caused issues or CSV sniffing failed, try with original content
      if (
        usePreprocessed &&
        (error.message?.includes("sniffing file") ||
          error.message?.includes("Error when sniffing file"))
      ) {
        // Re-register with original content
        await db.registerFileText(`${fileBaseName}.txt`, content);

        let sql: string;
        if (!tableExists) {
          // CREATE TABLE
          if (nodeId !== undefined) {
            sql = `
              CREATE TABLE ${quotedTableName} AS
              SELECT ${nodeId} AS debug_node, * FROM read_csv_auto(
                '${fileBaseName}.txt',
                delim='${delimiter}',
                header=true
              )
            `;
          } else {
            sql = `
              CREATE TABLE ${quotedTableName} AS
              SELECT * FROM read_csv_auto(
                '${fileBaseName}.txt',
                delim='${delimiter}',
                header=true
              )
            `;
          }
        } else {
          // INSERT INTO
          sql = `
            INSERT INTO ${quotedTableName}
            SELECT ${nodeId} AS debug_node, * FROM read_csv_auto(
              '${fileBaseName}.txt',
              delim='${delimiter}',
              header=true
            )
          `;
        }

        await conn.query(sql);
      } else if (
        error.message?.includes("Error when sniffing file") ||
        error.message?.includes("not possible to automatically detect") ||
        error.message?.includes("Could not convert string") ||
        error.message?.includes("Conversion Error: CSV Error")
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

        let fallbackSql: string;
        if (!tableExists) {
          // CREATE TABLE
          if (nodeId !== undefined) {
            fallbackSql = `
              CREATE TABLE ${quotedTableName} AS
              SELECT ${nodeId} AS debug_node, * FROM read_csv(
                '${fileBaseName}.txt',
                delim='${delimiter}',
                header=true,
                columns={${columnDefs}},
                auto_detect=false,
                sample_size=1
              )
            `;
          } else {
            fallbackSql = `
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
          }
        } else {
          // INSERT INTO
          fallbackSql = `
            INSERT INTO ${quotedTableName}
            SELECT ${nodeId} AS debug_node, * FROM read_csv(
              '${fileBaseName}.txt',
              delim='${delimiter}',
              header=true,
              columns={${columnDefs}},
              auto_detect=false,
              sample_size=1
            )
          `;
        }

        try {
          await conn.query(fallbackSql);
        } catch (fallbackError: unknown) {
          const fallbackErr =
            fallbackError instanceof Error
              ? fallbackError
              : new Error(String(fallbackError));
          console.error(
            `Even fallback failed for ${tableName}:`,
            fallbackErr.message,
          );
          throw error; // Throw original error if fallback also fails
        }
      } else {
        throw error;
      }
    }

    // Get row count
    let count: number;
    if (nodeId !== undefined && tableExists) {
      // For multi-node INSERT operations, count rows we just added
      // We can't easily get this from DuckDB, so parse the content
      const lines = content.split('\n');
      // First line is header, rest are data (excluding empty last line)
      count = lines.filter((line, idx) => idx > 0 && line.trim()).length;
    } else {
      // For CREATE operations or single-node tables, get total count
      const countResult = await conn.query(
        `SELECT COUNT(*) as count FROM ${quotedTableName}`,
      );
      count = countResult.toArray()[0].count;
    }

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

async function executeQuery(
  message: ExecuteQueryMessage | (RoutedMessage & ExecuteQueryMessage),
) {
  const { id, sql } = message;

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

    // Get column types from the result schema
    const schema = result.schema.fields;
    const columnTypes = new Map<string, string>();
    schema.forEach((field) => {
      columnTypes.set(field.name, field.type.toString());
    });

    // Sanitize data and convert types in one pass
    const sanitizedData = data.map((row) => {
      const sanitizedRow: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(row)) {
        const columnType = columnTypes.get(key);

        // Handle TIME columns (microseconds since midnight as bigint)
        if (columnType && (columnType.toUpperCase().includes('TIME') || columnType === 'Time64[us]')) {
          if (value !== null && value !== undefined && (typeof value === 'bigint' || typeof value === 'number')) {
            // Convert microseconds to HH:MM:SS.ffffff
            const totalMicros = typeof value === 'bigint' ? Number(value) : value;
            const hours = Math.floor(totalMicros / 3600000000);
            const minutes = Math.floor((totalMicros % 3600000000) / 60000000);
            const seconds = Math.floor((totalMicros % 60000000) / 1000000);
            const micros = totalMicros % 1000000;
            sanitizedRow[key] = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(micros).padStart(6, '0')}`;
          } else {
            sanitizedRow[key] = value;
          }
        }
        // Handle TIMESTAMP columns
        else if (
          (typeof value === "number" &&
            value > 1000000000000 &&
            value < 2000000000000) ||
          (typeof value === "bigint" &&
            value > 1000000000000n &&
            value < 2000000000000n)
        ) {
          sanitizedRow[key] = new Date(Number(value));
        }
        // Handle other values
        else {
          try {
            // Test if the value can be cloned by attempting JSON serialization
            JSON.stringify(value);
            sanitizedRow[key] = value;
          } catch {
            // If value can't be serialized, convert to string
            sanitizedRow[key] = String(value);
          }
        }
      }
      return sanitizedRow;
    });

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

async function getLoadedTables(
  message: GetLoadedTablesMessage | (RoutedMessage & GetLoadedTablesMessage),
) {
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
      const sanitizedRow: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(row)) {
        try {
          // Handle BigInt values explicitly
          if (typeof value === "bigint") {
            sanitizedRow[key] = value.toString();
          } else {
            JSON.stringify(value);
            sanitizedRow[key] = value;
          }
        } catch {
          sanitizedRow[key] = String(value);
        }
      }
      return {
        name: String(sanitizedRow.function_name).toUpperCase(),
        type: String(sanitizedRow.function_type),
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

async function query(sql: string): Promise<Record<string, unknown>[]> {
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
    // Processing file list

    // Simplified filter: just files that start with "system" and end with ".txt"
    const tablesToLoad = message.fileList.filter(
      (entry) =>
        !entry.isDir &&
        (entry.path.includes("/system.") ||
          entry.path.includes("/crdb_internal.")) &&
        entry.path.endsWith(".txt"),
    );
    // Found potential table files

    // Prepare tables with proper naming (same logic as DropZone had)
    const clusterTables: Array<{
      name: string;
      sourceFile: string;
      path: string;
      size: number;
      nodeId?: number;
      originalName?: string;
      isError: boolean;
      loaded: boolean;
      loading: boolean;
      nodeFiles?: Array<{
        path: string;
        size: number;
        nodeId: number;
        isError: boolean;
      }>;
    }> = [];
    const perNodeFiles: Map<string, Array<{
      path: string;
      size: number;
      nodeId: number;
      isError: boolean;
    }>> = new Map();

    for (const entry of tablesToLoad) {
      // Extract just the filename from the path
      const filename = entry.name.split("/").pop() || entry.name;
      let tableName = filename.replace(/\.(err\.txt|txt|csv)$/, "");

      // Check if it's an error file
      const isErrorFile = entry.path.endsWith(".err.txt");

      // Parse node ID from path like /nodes/1/system.jobs.txt
      const nodeMatch = entry.path.match(/\/nodes\/(\d+)\//);
      if (nodeMatch) {
        const nodeId = parseInt(nodeMatch[1], 10);
        const originalName = tableName;

        // Group per-node files by their original table name
        if (!perNodeFiles.has(originalName)) {
          perNodeFiles.set(originalName, []);
        }
        perNodeFiles.get(originalName)!.push({
          path: entry.path,
          size: entry.size,
          nodeId,
          isError: isErrorFile,
        });
      } else {
        // Cluster-level table (no node ID)
        const preparedTable = {
          name: tableName,
          sourceFile: entry.path,
          path: entry.path,
          size: entry.size,
          nodeId: undefined,
          originalName: undefined,
          isError: isErrorFile,
          loaded: false,
          loading: false,
        };
        clusterTables.push(preparedTable);
      }
    }

    // Process cluster tables
    const preparedTables = [...clusterTables];
    for (const table of clusterTables) {
      self.postMessage({
        type: "tableDiscovered",
        table,
      });
    }

    // Process per-node tables - create combined _by_node tables
    for (const [originalName, nodeFiles] of perNodeFiles.entries()) {
      // Calculate total size across all nodes
      const totalSize = nodeFiles.reduce((sum, file) => sum + file.size, 0);
      const hasErrors = nodeFiles.some(f => f.isError);

      // Create combined table name with _by_node suffix
      const combinedTableName = `${originalName}_by_node`;

      // Create a single table entry representing all nodes
      const combinedTable = {
        name: combinedTableName,
        sourceFile: nodeFiles[0].path, // Store first file path for reference
        path: nodeFiles[0].path,
        size: totalSize,
        nodeId: undefined, // No single node ID - it's multi-node
        originalName,
        isError: hasErrors,
        loaded: false,
        loading: false,
        // Store metadata about constituent nodes
        nodeFiles: nodeFiles.map(f => ({
          path: f.path,
          size: f.size,
          nodeId: f.nodeId,
          isError: f.isError,
        })),
      };

      preparedTables.push(combinedTable);

      self.postMessage({
        type: "tableDiscovered",
        table: combinedTable,
      });
    }

    // Start loading the tables
    if (preparedTables.length > 0) {
      // Found tables, checking if database is ready for data loading

      // Wait for database to be initialized before starting data loading
      if (!initialized) {
        // Database not initialized yet, waiting

        // Poll for initialization with a reasonable timeout
        const maxWaitTime = 30000; // 30 seconds
        const pollInterval = 100; // 100ms
        const startTime = Date.now();

        while (!initialized && Date.now() - startTime < maxWaitTime) {
          await new Promise((resolve) => setTimeout(resolve, pollInterval));
        }

        if (!initialized) {
          throw new Error(
            "Database initialization timeout while waiting to load tables",
          );
        }

        // Database is now initialized, proceeding with table loading
      }

      // Starting to load tables

      // Use the existing startTableLoading logic
      const fakeMessage = {
        type: "startTableLoading" as const,
        id: message.id,
        tables: preparedTables,
      };

      startTableLoading(fakeMessage);
    } else {
      // No tables to load
      self.postMessage({
        type: "tableLoadingComplete",
        success: true,
        tablesLoaded: 0,
        error: null,
      });
    }

    // Send response to controller
    self.postMessage({
      type: "response",
      id: message.id,
      success: true,
      result: { tablesFound: preparedTables.length },
    });
  } catch (error) {
    console.error("❌ DB Worker: Failed to process file list:", error);
    self.postMessage({
      type: "response",
      id: message.id,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// Handle all messages based on type, regardless of routing
self.onmessage = (event: MessageEvent<DBWorkerMessage | RoutedMessage>) => {
  const message = event.data;

  // Handle routed zip worker responses first
  if (
    "from" in message &&
    message.from === "zipWorker" &&
    (message.type === "readFileChunk" || message.type === "readFileComplete")
  ) {
    handleRoutedMessage(message as RoutedMessage);
    return;
  }

  // Handle all other messages by type
  switch (message.type) {
    case "initializeDatabase":
      initializeDatabase(message as InitializeDatabaseMessage);
      break;
    case "startTableLoading":
      startTableLoading(message as StartTableLoadingMessage);
      break;
    case "loadSingleTable":
      loadSingleTableFromMessage(message as LoadSingleTableMessage);
      break;
    case "executeQuery":
      executeQuery(
        message as ExecuteQueryMessage | (RoutedMessage & ExecuteQueryMessage),
      );
      break;
    case "getTableSchema":
      getTableSchema(message as GetTableSchemaMessage);
      break;
    case "getLoadedTables":
      getLoadedTables(
        message as
          | GetLoadedTablesMessage
          | (RoutedMessage & GetLoadedTablesMessage),
      );
      break;
    case "getDuckDBFunctions":
      getDuckDBFunctions(message as GetDuckDBFunctionsMessage);
      break;
    case "getDuckDBKeywords":
      getDuckDBKeywords(message as GetDuckDBKeywordsMessage);
      break;
    case "stopLoading":
      stopLoading(message as StopLoadingMessage);
      break;
    case "processFileList":
      processFileList(message as ProcessFileListMessage);
      break;
    default:
      console.error("Unknown DB worker message type:", message.type);
  }
};

// Export for TypeScript
export {};
