// Registry for column type hints to fix DuckDB auto-detection issues
export interface ColumnTypeHint {
  table: string;
  column: string;
  duckdbType: string;
  description?: string;
}

// Known problematic columns that need type hints
export const COLUMN_TYPE_HINTS: ColumnTypeHint[] = [
  // crdb_internal.node_queries - has mixed timestamp formats
  {
    table: "crdb_internal.node_queries",
    column: "start",
    duckdbType: "VARCHAR", // Keep as string, can be cast in queries
    description: "Mixed timestamp formats with/without timezone",
  },
  {
    table: "node_queries",
    column: "start",
    duckdbType: "VARCHAR",
    description: "Mixed timestamp formats with/without timezone",
  },

  // system.jobs - commonly has timestamp issues, use VARCHAR for safety with NULL handling
  {
    table: "system.jobs",
    column: "created",
    duckdbType: "VARCHAR",
    description: "Timestamp as VARCHAR due to NULL handling issues",
  },
  {
    table: "system.jobs",
    column: "finished",
    duckdbType: "VARCHAR",
    description: "Timestamp as VARCHAR due to NULL handling issues",
  },

  // Common session/transaction tables with timestamp issues
  {
    table: "node_sessions",
    column: "session_start",
    duckdbType: "VARCHAR",
    description: "Mixed timestamp formats",
  },
  {
    table: "node_transactions",
    column: "start",
    duckdbType: "VARCHAR",
    description: "Mixed timestamp formats",
  },

  // Node IDs should be INTEGER (32-bit) across all tables
  {
    table: "crdb_internal.node_build_info",
    column: "node_id",
    duckdbType: "INTEGER",
    description: "Node ID as 32-bit integer",
  },
  {
    table: "crdb_internal.kv_node_status",
    column: "node_id",
    duckdbType: "INTEGER",
    description: "Node ID as integer",
  },
  {
    table: "crdb_internal.kv_node_status",
    column: "started_at",
    duckdbType: "VARCHAR",
    description: "Timestamp as VARCHAR for safe parsing",
  },
  {
    table: "crdb_internal.kv_node_status",
    column: "updated_at",
    duckdbType: "VARCHAR",
    description: "Timestamp as VARCHAR for safe parsing",
  },
  {
    table: "crdb_internal.kv_node_status",
    column: "metrics",
    duckdbType: "VARCHAR",
    description: "Large JSON field that breaks auto-detection",
  },

  // Protobuf columns that are converted to JSON should be typed as JSON
  {
    table: "system.descriptor",
    column: "descriptor",
    duckdbType: "JSON",
    description: "Protobuf data converted to JSON",
  },
  {
    table: "system.span_configurations",
    column: "config",
    duckdbType: "JSON",
    description: "Protobuf data converted to JSON",
  },
  {
    table: "system.jobs",
    column: "payload",
    duckdbType: "JSON",
    description: "Protobuf data converted to JSON",
  },
  {
    table: "system.jobs",
    column: "progress",
    duckdbType: "JSON",
    description: "Protobuf data converted to JSON",
  },
  {
    table: "system.job_info",
    column: "value",
    duckdbType: "JSON",
    description:
      "Protobuf data converted to JSON, or fallback JSON wrapper for non-proto data",
  },
];

// Find column type hint for a given table/column
export function findColumnTypeHint(
  tableName: string,
  columnName: string,
): ColumnTypeHint | null {
  // Normalize names (remove schema prefix if present, handle numeric prefixes)
  const normalizedTable = tableName
    .toLowerCase()
    .replace(/^\d+_/, "") // Remove numeric prefix like "143_"
    .replace(/^.*\./, ""); // Remove schema prefix
  const normalizedColumn = columnName.toLowerCase();

  return (
    COLUMN_TYPE_HINTS.find((hint) => {
      const hintTable = hint.table.toLowerCase().replace(/^.*\./, "");
      return (
        (hintTable === normalizedTable ||
          hint.table.toLowerCase() === `crdb_internal.${normalizedTable}` ||
          hint.table.toLowerCase() === `system.${normalizedTable}`) &&
        hint.column.toLowerCase() === normalizedColumn
      );
    }) || null
  );
}

// Get all type hints for a table
export function getTableTypeHints(tableName: string): Map<string, string> {
  const hints = new Map<string, string>();
  const normalizedTable = tableName
    .toLowerCase()
    .replace(/^\d+_/, "") // Remove numeric prefix like "143_"
    .replace(/_by_node$/, ""); // Remove _by_node suffix for multi-node tables

  COLUMN_TYPE_HINTS.forEach((hint) => {
    const hintTable = hint.table.toLowerCase().replace(/^.*\./, "");
    const tableWithoutSchema = normalizedTable.replace(/^.*\./, "");

    // Match by table name, with or without schema prefix
    if (
      hintTable === tableWithoutSchema ||
      hint.table.toLowerCase() === normalizedTable ||
      hint.table.toLowerCase() === `crdb_internal.${tableWithoutSchema}` ||
      hint.table.toLowerCase() === `system.${tableWithoutSchema}`
    ) {
      hints.set(hint.column.toLowerCase(), hint.duckdbType);
    }
  });

  return hints;
}
