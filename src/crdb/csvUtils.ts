/**
 * Shared CSV utility functions
 */

export interface CsvReadOptions {
  fileName: string;
  tableName: string;
  operation: 'create' | 'insert';
  nodeId?: number;
  typeHints?: Map<string, string>;
  headers?: string[];
  ignoreErrors?: boolean; // Use relaxed CSV parsing to skip malformed rows
}

export function generateCsvReadSql(options: CsvReadOptions): string {
  const { fileName, tableName, operation, nodeId, typeHints, headers, ignoreErrors } = options;
  const quotedTableName = `"${tableName}"`;

  // Build column specification if we have type hints and headers
  let columnsClause = '';
  if (typeHints && typeHints.size > 0 && headers && headers.length > 0) {
    // Build column definitions with type hints for ALL columns
    const columnDefs = headers.map((header) => {
      const hint = typeHints.get(header.toLowerCase());
      const columnType = hint || "VARCHAR";
      return `"${header}": '${columnType}'`;
    }).join(", ");

    columnsClause = `, columns = {${columnDefs}}`;
  }

  const readOptions = `
    '${fileName}',
    delim = '\t',
    quote = '"',
    escape = '"',
    header = true,
    nullstr = ['NULL', '\\N'],
    max_line_size = 33554432${ignoreErrors ? ',\n    ignore_errors = true' : ''}${columnsClause}
  `;

  if (operation === 'create') {
    if (nodeId !== undefined) {
      return `CREATE TABLE ${quotedTableName} AS
              SELECT ${nodeId} as debug_node, * FROM read_csv(${readOptions})`;
    } else {
      return `CREATE TABLE ${quotedTableName} AS
              SELECT * FROM read_csv(${readOptions})`;
    }
  } else {
    // Insert operation
    if (nodeId !== undefined) {
      return `INSERT INTO ${quotedTableName}
              SELECT ${nodeId} as debug_node, * FROM read_csv(${readOptions})`;
    } else {
      return `INSERT INTO ${quotedTableName}
              SELECT * FROM read_csv(${readOptions})`;
    }
  }
}