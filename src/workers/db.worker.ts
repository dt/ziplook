/**
 * Database Worker - owns the DuckDB instance and handles all database operations
 * Requests files from zip worker for table loading, executes queries
 */

import * as duckdb from "@duckdb/duckdb-wasm";
import { shouldPreprocess } from "../crdb/csvPreprocessor";
import { protoDecoder } from "../crdb/protoDecoder";
import { generateCsvReadSql } from "../crdb/csvUtils";
import { preprocessAndLoadInBatches } from "../crdb/batchProcessor";
import { getTableTypeHints } from "../crdb/columnTypeRegistry";

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
  result?: { text?: string; rawBytes?: Uint8Array };
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
  result?: { text?: string; rawBytes?: Uint8Array };
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
async function loadFileIncrementally(
  data: Uint8Array,
  decoder: TextDecoder,
  tableName: string,
  delimiter: string,
  nodeId?: number,
  sourcePath?: string,
): Promise<number> {
  if (!conn || !db) {
    throw new Error("DuckDB not initialized");
  }

  const chunkSize = 10 * 1024 * 1024; // 10MB chunks - same as batch processor
  const totalSize = data.length;
  let offset = 0;
  let remainder = "";
  let chunkNumber = 0;
  let headers: string[] = [];

  const totalChunks = Math.ceil(totalSize / chunkSize);

  // Use quoted table name to preserve dots
  const quotedTableName = `"${tableName}"`;

  // Check if table already exists (for multi-node tables)
  let tableExists = false;
  if (nodeId !== undefined) {
    // Use catalog query to avoid error logging
    const checkResult = await conn.query(`
      SELECT COUNT(*) as count
      FROM information_schema.tables
      WHERE table_name = '${tableName}' AND table_schema = 'main'
    `);
    tableExists = Number(checkResult.toArray()[0].count) > 0;
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

    // Find complete CSV rows (handling quoted fields that may contain newlines)
    const completeRows: string[] = [];
    let currentRowStart = 0;
    let inQuotes = false;
    let lastCompleteRowEnd = 0;

    for (let i = 0; i < fullText.length; i++) {
      const char = fullText[i];

      if (char === '"') {
        // Check if this is an escaped quote (doubled "")
        if (i + 1 < fullText.length && fullText[i + 1] === '"') {
          i++; // Skip the next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === '\n' && !inQuotes) {
        // Found end of a complete CSV row
        const row = fullText.substring(currentRowStart, i);
        // Only trim the trailing \r if present, not all whitespace
        const trimmedRow = row.endsWith('\r') ? row.slice(0, -1) : row;
        if (trimmedRow) {
          completeRows.push(trimmedRow);
        }
        lastCompleteRowEnd = i + 1;
        currentRowStart = i + 1;
      }
    }

    // Keep any incomplete row as remainder for next chunk
    // But only if we're not at the end of the file
    if (end < totalSize) {
      remainder = fullText.substring(lastCompleteRowEnd);
      // Debug: warn if remainder is getting very large (indicates a very long line)
      if (remainder.length > 1024 * 1024) { // 1MB
        console.warn(`⚠️ Large remainder at chunk ${chunkNumber}: ${remainder.length} bytes (likely a very long CSV row)`);
      }
    } else {
      // At end of file - process any remaining content as a complete row
      if (lastCompleteRowEnd < fullText.length) {
        const row = fullText.substring(lastCompleteRowEnd);
        const trimmedRow = row.endsWith('\r') ? row.slice(0, -1) : row;
        if (trimmedRow) {
          completeRows.push(trimmedRow);
        }
      }
      remainder = "";
    }

    if (completeRows.length > 0) {
      // Reconstruct this chunk's content with complete rows
      const chunkContent = completeRows.join("\n");

      if (chunkContent.trim()) {
        // Extract headers from first chunk
        if (chunkNumber === 0) {
          headers = completeRows[0].split(delimiter);
        }

        // Determine which rows are data (skip header on first chunk)
        const dataRows = chunkNumber === 0 ? completeRows.slice(1) : completeRows;

        // Process even if no data rows - we need to create an empty table
        if (dataRows.length > 0 || (chunkNumber === 0 && !tableExists)) {
          // Create content with headers for processing
          const contentForProcessing = [
            headers.join(delimiter),
            ...dataRows,
          ].join("\n");

          let processedContent = contentForProcessing;

          // Apply preprocessing if needed using batch processor
          const needsPreprocessing = shouldPreprocess(
            tableName,
            contentForProcessing,
          );

          if (needsPreprocessing) {
            // Use the batch processor for this chunk
            // Note: This will handle the chunk's data in smaller batches internally
            await preprocessAndLoadInBatches(contentForProcessing, {
              tableName,
              delimiter,
              decodeKeys: true,
              decodeProtos: protoDecoder ? true : false,
              protoDecoder: protoDecoder || undefined,
              conn,
              db,
              sourcePath,
              nodeId: chunkNumber === 0 && !tableExists ? nodeId : undefined,
              forceInsert: chunkNumber > 0 || tableExists, // Force INSERT mode for chunks after the first
            });
            // The batch processor successfully loaded the data
            chunkNumber++;
            offset = end;
            continue;
          }

          // Register this chunk as a temporary file
          const chunkFileName = `${tableName}_chunk_${chunkNumber}.txt`;
          await db.registerFileText(chunkFileName, processedContent);

          try {
            // Load this chunk into the table
            if (chunkNumber === 0 && !tableExists) {
              // First chunk and table doesn't exist - create table
              const typeHints = getTableTypeHints(tableName);
              const sql = generateCsvReadSql({
                fileName: chunkFileName,
                tableName,
                delimiter,
                operation: 'create',
                nodeId,
                typeHints: typeHints.size > 0 ? typeHints : undefined,
                headers,
              });
              try {
                await conn.query(sql);
              } catch (error) {
                const pathContext = sourcePath ? ` (source: ${sourcePath})` : '';
                const enhancedError = error instanceof Error
                  ? new Error(`${error.message}${pathContext}`)
                  : new Error(`Unknown error${pathContext}`);
                if (error instanceof Error) enhancedError.stack = error.stack;
                throw enhancedError;
              }
            } else {
              // Subsequent chunks or table exists - insert data
              const sql = generateCsvReadSql({
                fileName: chunkFileName,
                tableName,
                delimiter,
                operation: 'insert',
                nodeId,
              });
              try {
                await conn.query(sql);
              } catch (error) {
                const pathContext = sourcePath ? ` (source: ${sourcePath})` : '';
                const enhancedError = error instanceof Error
                  ? new Error(`${error.message}${pathContext}`)
                  : new Error(`Unknown error${pathContext}`);
                if (error instanceof Error) enhancedError.stack = error.stack;
                throw enhancedError;
              }
            }
          } finally {
            // Always clean up the chunk file, whether load succeeded or failed
            await db.dropFile(chunkFileName);
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
            originalName: tableName,
            isError: false,
          });
        }
      }
    }

    offset = end;
  }

  // Handle any remaining content
  if (remainder.trim()) {
    // Always include headers for the final chunk
    let processedContent = [headers.join(delimiter), remainder].join("\n");

    const needsPreprocessing = shouldPreprocess(
      tableName,
      processedContent,
    );
    if (needsPreprocessing) {
      // Use batch processor for remainder (already has headers)
      await preprocessAndLoadInBatches(processedContent, {
        tableName,
        delimiter,
        decodeKeys: true,
        decodeProtos: protoDecoder ? true : false,
        protoDecoder: protoDecoder || undefined,
        conn,
        db,
        sourcePath,
        nodeId: !tableExists ? nodeId : undefined,
      });
      // Already loaded by batch processor - need to get final count
      // Jump to the counting logic at the end
    } else {
      const chunkFileName = `${tableName}_final.txt`;
      await db.registerFileText(chunkFileName, processedContent);

      try {
        const operation = (chunkNumber === 0 && !tableExists) ? 'create' : 'insert';
        const typeHints = operation === 'create' ? getTableTypeHints(tableName) : undefined;
        const sql = generateCsvReadSql({
          fileName: chunkFileName,
          tableName,
          delimiter,
          operation,
          nodeId,
          typeHints: typeHints && typeHints.size > 0 ? typeHints : undefined,
          headers: operation === 'create' ? headers : undefined,
        });

        try {
          await conn.query(sql);
        } catch (error) {
          const pathContext = sourcePath ? ` (source: ${sourcePath})` : '';
          const enhancedError = error instanceof Error
            ? new Error(`${error.message}${pathContext}`)
            : new Error(`Unknown error${pathContext}`);
          if (error instanceof Error) enhancedError.stack = error.stack;
          throw enhancedError;
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
            originalName: tableName,
            isError: false,
          });
        }
      } finally {
        // Always clean up the final chunk file, whether load succeeded or failed
        await db.dropFile(chunkFileName);
      }
    }
  }

  // Get final row count from the table we just loaded
  // We only get here if all loading succeeded, so the table MUST exist
  let finalRowCount: number;

  if (nodeId !== undefined && tableExists) {
    // For multi-node INSERT operations, return only rows added (not total)
    // Count from the processed data
    const countBeforeResult = await conn.query(
      `SELECT COUNT(*) as count FROM ${quotedTableName} WHERE debug_node != ${nodeId}`,
    );
    const countBefore = Number(countBeforeResult.toArray()[0].count);
    const countAfterResult = await conn.query(
      `SELECT COUNT(*) as count FROM ${quotedTableName}`,
    );
    const countAfter = Number(countAfterResult.toArray()[0].count);
    finalRowCount = countAfter - countBefore;
  } else {
    // For CREATE operations or single-node tables, get total count
    const countResult = await conn.query(
      `SELECT COUNT(*) as count FROM ${quotedTableName}`,
    );
    finalRowCount = Number(countResult.toArray()[0].count);
  }

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

const LARGE_FILE_THRESHOLD = 1 * 1024 * 1024;
const MAX_AUTO_LOAD_FILES = 10;

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

        // Always pass raw bytes for incremental processing
        request.resolve({
          type: "readFileComplete",
          id: message.id,
          success: true,
          result: {
            rawBytes: combined
          },
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
        castBigIntToDouble: false, // Keep large integers as BigInt to preserve precision
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

      // Count how many files this table requires
      const fileCount = table.nodeFiles ? table.nodeFiles.length : 1;

      if (
        table.size > LARGE_FILE_THRESHOLD ||
        (tables.length > 300 && table.path.includes("/nodes/")) ||
        fileCount > MAX_AUTO_LOAD_FILES
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
  const { table, id } = message;
  try {
    await loadSingleTable(table);
    // Send success response
    sendResponse(message, {
      type: "loadSingleTableComplete",
      id,
      success: true,
    });
  } catch (error) {
    // Send error response
    sendResponse(message, {
      type: "loadSingleTableComplete",
      id,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
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

  // If this is an error file, don't try to load it - just mark it as discovered
  // Error files are shown in the UI with a warning icon and clicking opens the error content
  if (isError) {
    self.postMessage({
      type: "tableLoadProgress",
      tableName,
      status: "completed",
      rowCount: 0,
      nodeId,
      originalName,
      isError: true,
      size,
    });
    return;
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

    // Handle multi-node tables with sliding window parallel loading
    if (nodeFiles && nodeFiles.length > 0) {
      let totalRowCount = 0;
      let filesProcessed = 0;
      const totalFiles = nodeFiles.filter(f => !f.isError).length;
      const validFiles = nodeFiles.filter(f => !f.isError);

      // Sliding window: limit by file count AND byte size
      const MAX_QUEUED_FILES = 20; // Max files in-flight
      const MAX_QUEUED_BYTES = 8 * 1024 * 1024; // Max 8MB of compressed data in-flight
      const pendingPromises: Array<Promise<{ nodeFile: typeof validFiles[0], response: any }>> = [];
      let nextFileIndex = 0;
      let queuedBytes = 0;

      // Fill initial window (stop when either limit is reached)
      while (
        nextFileIndex < validFiles.length &&
        pendingPromises.length < MAX_QUEUED_FILES &&
        queuedBytes < MAX_QUEUED_BYTES
      ) {
        const nodeFile = validFiles[nextFileIndex];
        pendingPromises.push(
          sendMessageToZipWorker({
            type: "readFileChunked",
            path: nodeFile.path,
          }).then(response => ({ nodeFile, response }))
        );
        queuedBytes += nodeFile.size;
        nextFileIndex++;
      }

      // Process files as they complete, maintaining the window
      while (pendingPromises.length > 0) {
        // Wait for first promise to complete (FIFO order)
        const { nodeFile, response: fileResponse } = await pendingPromises.shift()!;

        filesProcessed++;
        queuedBytes -= nodeFile.size; // Remove completed file from queue size

        // Queue more files to maintain thresholds (stop when either limit is reached)
        while (
          nextFileIndex < validFiles.length &&
          pendingPromises.length < MAX_QUEUED_FILES &&
          queuedBytes < MAX_QUEUED_BYTES
        ) {
          const nextFile = validFiles[nextFileIndex];
          pendingPromises.push(
            sendMessageToZipWorker({
              type: "readFileChunked",
              path: nextFile.path,
            }).then(response => ({ nodeFile: nextFile, response }))
          );
          queuedBytes += nextFile.size;
          nextFileIndex++;
        }

        // Send progress update
        self.postMessage({
          type: "tableLoadProgress",
          tableName,
          status: "loading",
          nodeId,
          originalName,
          isError,
          fileProgress: {
            current: filesProcessed,
            total: totalFiles,
            percentage: Math.round((filesProcessed / totalFiles) * 100),
          },
        });

        if (!fileResponse.success) {
          throw new Error(`Failed to read file ${nodeFile.path} from node ${nodeFile.nodeId}: ${fileResponse.error}`);
        }

        // Always use incremental loading with raw bytes
        const rawBytes = fileResponse.result?.rawBytes;
        if (!rawBytes) {
          throw new Error(`Raw bytes not available for processing: ${nodeFile.path}`);
        }

        const rowCount = await loadFileIncrementally(
            rawBytes,
            new TextDecoder(),
            tableName,
            "\t",
            nodeFile.nodeId,
            nodeFile.path,
          );
          totalRowCount += rowCount;
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
      const rowCount = Number(countResult.toArray()[0].count);

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
      throw new Error(`Failed to read file from zip: ${path} - ${fileResponse.error || "Unknown error"}`);
    }

    // Always use incremental loading with raw bytes
    const rawBytes = fileResponse.result?.rawBytes;
    if (!rawBytes) {
      throw new Error(`Raw bytes not available for processing: ${path}`);
    }

    // Load using incremental approach
    const rowCount = await loadFileIncrementally(
        rawBytes,
        new TextDecoder(),
        tableName,
        "\t",
        nodeId,
        path,
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
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const fullErrorMessage = `Failed to load table ${tableName} from ${path}: ${errorMessage}`;
    console.error(fullErrorMessage, error);

    self.postMessage({
      type: "tableLoadProgress",
      tableName,
      status: "error",
      error: fullErrorMessage,
      nodeId,
      originalName,
      isError,
    });
  }
}


function rewriteQuery(sql: string): string {
  // Convert schema.table references to quoted table names since tables are stored with dots
  // Skip rewriting if user already used quotes (they know what they're doing)
  if (sql.includes('"')) {
    return sql;
  }

  let rewritten = sql;

  // Match dotted identifiers in table-name contexts (FROM, JOIN, INTO, TABLE, UPDATE, EXISTS)
  // This handles any prefix: system.jobs, cluster.system.jobs, n1_system.jobs, etc.
  // Allow hyphens in cluster names: mixed-version-tenant-ikhut.system.jobs
  const tableContextPattern = /\b(FROM|JOIN|INTO|TABLE|UPDATE|EXISTS)\s+((?:[a-zA-Z0-9_-]+\.)?(system|crdb_internal)\.[a-zA-Z0-9_]+)\b/gi;

  rewritten = rewritten.replace(tableContextPattern, (_match, keyword, tableName) => {
    return `${keyword} "${tableName}"`;
  });

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

    // Get column types from the result schema
    const schema = result.schema.fields;
    const columnTypes = new Map<string, string>();
    schema.forEach((field) => {
      columnTypes.set(field.name, field.type.toString());
    });

    // Extract interval columns before toArray() loses the data
    const intervalColumns = new Map<string, any>();
    schema.forEach((field, idx) => {
      if (field.type.toString().toUpperCase().includes('INTERVAL')) {
        intervalColumns.set(field.name, result.getChildAt(idx));
      }
    });

    const data = result.toArray();

    // Sanitize data and convert types in one pass
    // Convert columnTypes Map to a plain object for postMessage
    const columnTypesObject: Record<string, string> = {};
    columnTypes.forEach((type, name) => {
      columnTypesObject[name] = type;
    });

    const sanitizedData = data.map((row, rowIndex) => {
      const sanitizedRow: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(row)) {
        const columnType = columnTypes.get(key);

        // Handle INTERVAL columns - get from raw Arrow data
        if (columnType && columnType.toUpperCase().includes('INTERVAL')) {
          const intervalColumn = intervalColumns.get(key);
          if (intervalColumn) {
            // Access raw values array directly since .get() loses data
            const data = intervalColumn.data[0];
            const values = data.values;

            // stride=3 means layout is: [months, days, nanos_low] repeated, with nanos_high separate
            // Actually for MONTH_DAY_NANO it should be 4 int32s per interval
            // Let me check the actual memory layout
            const stride = 4; // Force 4 for MONTH_DAY_NANO (months, days, nanos as int64)
            const offset = rowIndex * stride;

            console.log('Stride info:', 'column.stride:', intervalColumn.stride, 'values.length:', values.length, 'rowIndex:', rowIndex, 'calculated offset:', offset);
            console.log('Values at offset:', values.slice(offset, offset + 4));

            // MONTH_DAY_NANO intervals: [int32 months, int32 days, int64 nanos as two int32s]
            const months = values[offset] || 0;
            const days = values[offset + 1] || 0;
            // Reconstruct 64-bit nanoseconds from two 32-bit parts (signed!)
            const nanosLow = values[offset + 2] || 0;
            const nanosHigh = values[offset + 3] || 0;

            console.log('Parsed values:', {months, days, nanosLow, nanosHigh});

            // Convert to unsigned for low part, keep high part signed
            const nanos = (BigInt(nanosHigh) << 32n) | BigInt(nanosLow >>> 0);

            // Convert to human-readable string
            const components: string[] = [];

            if (months !== 0) {
              const years = Math.floor(Math.abs(months) / 12);
              const remainingMonths = Math.abs(months) % 12;
              if (years > 0) components.push(`${months < 0 ? '-' : ''}${years} year${years !== 1 ? 's' : ''}`);
              if (remainingMonths > 0) components.push(`${months < 0 && years === 0 ? '-' : ''}${remainingMonths} mon${remainingMonths !== 1 ? 's' : ''}`);
            }
            if (days !== 0) {
              components.push(`${days < 0 ? '-' : ''}${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''}`);
            }
            if (nanos !== 0n) {
              // Convert nanoseconds to seconds
              const totalNanos = nanos < 0n ? -nanos : nanos;
              const totalSeconds = Number(totalNanos) / 1000000000;
              const hours = Math.floor(totalSeconds / 3600);
              const minutes = Math.floor((totalSeconds % 3600) / 60);
              const seconds = totalSeconds % 60;

              const timeParts: string[] = [];
              if (hours > 0) timeParts.push(`${hours}:`);
              timeParts.push(`${String(minutes).padStart(hours > 0 ? 2 : 1, '0')}:`);
              timeParts.push(String(seconds.toFixed(6)).padStart(9, '0'));
              components.push(`${nanos < 0n ? '-' : ''}${timeParts.join('')}`);
            }

            sanitizedRow[key] = components.length > 0 ? components.join(' ') : '00:00:00';
          } else {
            sanitizedRow[key] = value;
          }
        }
        // Handle TIME columns (microseconds since midnight as bigint)
        else if (columnType && (columnType.toUpperCase().includes('TIME') || columnType === 'Time64[us]')) {
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
          // Handle BigInt values explicitly - convert to string to preserve precision
          if (typeof value === "bigint") {
            sanitizedRow[key] = value.toString();
          } else {
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
      }
      return sanitizedRow;
    });

    sendResponse(message, {
      type: "queryResult",
      id,
      success: true,
      result: {
        data: sanitizedData,
        columnTypes: columnTypesObject,
      },
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

    // Filter for table files - match system.* and crdb_internal.* files
    // These files can be at root level, in /nodes/, or in /cluster/*/
    const allTableFiles = message.fileList.filter(
      (entry) =>
        !entry.isDir &&
        (entry.path.includes("/system.") ||
          entry.path.includes("/crdb_internal.")) &&
        entry.path.endsWith(".txt"),
    );

    // Build a map of base table paths to their entries
    // If both foo.txt and foo.err.txt exist in the SAME DIRECTORY, we only want ONE entry (the .err.txt)
    // Key format: full directory path + base name (without .txt or .err.txt)
    const tableMap = new Map<string, typeof allTableFiles[0]>();

    for (const entry of allTableFiles) {
      // Split path into directory and filename
      const lastSlash = entry.path.lastIndexOf("/");
      const dirPath = lastSlash >= 0 ? entry.path.substring(0, lastSlash + 1) : "";
      const filename = lastSlash >= 0 ? entry.path.substring(lastSlash + 1) : entry.path;

      // Check if it's an error file
      const isErrorFile = entry.path.endsWith(".err.txt");

      // Remove extensions - handle .txt.err.txt and .err.txt cases consistently
      let baseName: string;
      if (isErrorFile) {
        // Remove .err.txt suffix, then also remove any .txt suffix that might remain
        // This handles both foo.err.txt -> foo and foo.txt.err.txt -> foo
        baseName = filename.replace(/\.err\.txt$/, "").replace(/\.txt$/, "");
      } else {
        // Remove .txt or .csv suffix
        baseName = filename.replace(/\.(txt|csv)$/, "");
      }

      // Create unique key for this directory + base name
      const mapKey = dirPath + baseName;

      const existing = tableMap.get(mapKey);
      if (!existing) {
        // No entry yet, add this one
        tableMap.set(mapKey, entry);
      } else {
        // Entry exists - prefer .err.txt over .txt (in the same directory)
        if (isErrorFile) {
          tableMap.set(mapKey, entry);
        }
        // Otherwise keep the existing one (which might be .txt since we prefer .err.txt)
      }
    }

    // Get the deduplicated list - each table appears only once
    const tablesToLoad = Array.from(tableMap.values());

    // Found potential table files

    // Helper function to extract cluster name from path
    // Paths can be:
    // - debug/system.jobs.txt (root cluster)
    // - debug/nodes/1/system.jobs.txt (root cluster, per-node)
    // - debug/cluster/tenant1/system.jobs.txt (virtual cluster)
    // - debug/cluster/tenant1/nodes/1/system.jobs.txt (virtual cluster, per-node)
    function extractClusterInfo(path: string): { clusterName: string; isRoot: boolean } {
      // Match /cluster/ anywhere in the path (not just at the start)
      const clusterMatch = path.match(/\/cluster\/([^/]+)\//);
      if (clusterMatch) {
        return { clusterName: clusterMatch[1], isRoot: false };
      }
      return { clusterName: "", isRoot: true }; // Root cluster has empty name
    }

    // Prepare tables with proper naming
    // Group by cluster first, then by table name
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
      clusterName?: string;
      nodeFiles?: Array<{
        path: string;
        size: number;
        nodeId: number;
        isError: boolean;
      }>;
    }> = [];

    // Key format: "clusterName|tableName" for grouping per-node files
    const perNodeFiles: Map<string, {
      clusterName: string;
      files: Array<{
        path: string;
        size: number;
        nodeId: number;
        isError: boolean;
      }>;
    }> = new Map();

    for (const entry of tablesToLoad) {
      // Extract cluster info
      const { clusterName, isRoot } = extractClusterInfo(entry.path);

      // Extract filename from PATH (not entry.name, which might differ)
      const lastSlash = entry.path.lastIndexOf("/");
      const filename = lastSlash >= 0 ? entry.path.substring(lastSlash + 1) : entry.path;

      // Check if it's an error file
      const isErrorFile = entry.path.endsWith(".err.txt");

      // Remove extensions - use the SAME logic as deduplication
      let baseName: string;
      if (isErrorFile) {
        // Remove .err.txt suffix, then also remove any .txt suffix that might remain
        // This handles both foo.err.txt -> foo and foo.txt.err.txt -> foo
        baseName = filename.replace(/\.err\.txt$/, "").replace(/\.txt$/, "");
      } else {
        // Remove .txt or .csv suffix
        baseName = filename.replace(/\.(txt|csv)$/, "");
      }

      // Parse node ID from path like /nodes/1/system.jobs.txt or /cluster/tenant1/nodes/1/system.jobs.txt
      const nodeMatch = entry.path.match(/\/nodes\/(\d+)\//);
      if (nodeMatch) {
        const nodeId = parseInt(nodeMatch[1], 10);
        const originalName = baseName;

        // Create composite key for grouping: "clusterName|tableName"
        const groupKey = `${clusterName}|${originalName}`;

        if (!perNodeFiles.has(groupKey)) {
          perNodeFiles.set(groupKey, {
            clusterName,
            files: [],
          });
        }
        perNodeFiles.get(groupKey)!.files.push({
          path: entry.path,
          size: entry.size,
          nodeId,
          isError: isErrorFile,
        });
      } else {
        // Cluster-level table (no node ID)
        // Apply cluster prefix to table name if not root
        const tableName = isRoot ? baseName : `${clusterName}.${baseName}`;

        const preparedTable = {
          name: tableName,
          sourceFile: entry.path,
          path: entry.path,
          size: entry.size,
          nodeId: undefined,
          originalName: baseName, // Store original name without cluster prefix
          isError: isErrorFile,
          loaded: false,
          loading: false,
          clusterName: isRoot ? undefined : clusterName,
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
    for (const [groupKey, groupData] of perNodeFiles.entries()) {
      const { clusterName, files: nodeFiles } = groupData;
      const [, originalName] = groupKey.split("|");

      // Calculate total size across all nodes
      const totalSize = nodeFiles.reduce((sum, file) => sum + file.size, 0);
      const hasErrors = nodeFiles.some(f => f.isError);

      // Apply cluster prefix if not root cluster
      const isRoot = clusterName === "";
      const tableName = isRoot
        ? `${originalName}_by_node`
        : `${clusterName}.${originalName}_by_node`;

      // Create a single table entry representing all nodes
      // If there are error files, use the first error file as sourceFile for better UX
      const firstErrorFile = nodeFiles.find(f => f.isError);
      const referenceFile = firstErrorFile || nodeFiles[0];

      const combinedTable = {
        name: tableName,
        sourceFile: referenceFile.path, // Use first error file if available, otherwise first file
        path: referenceFile.path,
        size: totalSize,
        nodeId: undefined, // No single node ID - it's multi-node
        originalName,
        isError: hasErrors,
        loaded: false,
        loading: false,
        clusterName: isRoot ? undefined : clusterName,
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
