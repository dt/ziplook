/**
 * Pure CSV parsing utilities that can be tested in isolation
 * Extracted from db.worker.ts and csvPreprocessor.ts
 */

export interface CSVParseResult {
  headers: string[];
  rows: string[][];
}

export interface CSVParseOptions {
  delimiter?: string;
  hasHeader?: boolean;
}

/**
 * Parse delimited content (CSV/TSV) into headers and rows
 */
export function parseDelimited(
  content: string,
  options: CSVParseOptions = {}
): CSVParseResult {
  const { delimiter = "\t", hasHeader = true } = options;

  const lines = content.trim().split("\n");
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  if (hasHeader) {
    const headers = lines[0].split(delimiter);
    const rows = lines.slice(1).map((line) => line.split(delimiter));
    return { headers, rows };
  } else {
    const rows = lines.map((line) => line.split(delimiter));
    return { headers: [], rows };
  }
}

/**
 * Reconstruct CSV content from headers and rows
 */
export function reconstructCSV(
  headers: string[],
  rows: string[][],
  delimiter: string = "\t"
): string {
  const processedLines = [
    headers.join(delimiter),
    ...rows.map((row) => row.join(delimiter)),
  ];
  return processedLines.join("\n");
}

/**
 * Extract a specific column from parsed CSV data
 */
export function extractColumn(
  parseResult: CSVParseResult,
  columnName: string
): string[] {
  const columnIndex = parseResult.headers.indexOf(columnName);
  if (columnIndex === -1) {
    throw new Error(`Column "${columnName}" not found in headers`);
  }

  return parseResult.rows.map(row => row[columnIndex] || "");
}

/**
 * Find columns that match a predicate function
 */
export function findColumnIndices(
  headers: string[],
  predicate: (header: string, index: number) => boolean
): number[] {
  return headers
    .map((header, index) => ({ header, index }))
    .filter(({ header, index }) => predicate(header, index))
    .map(({ index }) => index);
}

/**
 * Transform specific columns in CSV data
 */
export function transformColumns(
  parseResult: CSVParseResult,
  transformations: Map<number, (value: string, rowIndex: number) => string>
): CSVParseResult {
  const transformedRows = parseResult.rows.map((row, rowIndex) => {
    return row.map((value, colIndex) => {
      const transformer = transformations.get(colIndex);
      return transformer ? transformer(value, rowIndex) : value;
    });
  });

  return {
    headers: parseResult.headers,
    rows: transformedRows
  };
}