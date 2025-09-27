export function isDefaultTableQuery(
  query: string,
  tableName?: string,
): boolean {
  if (!tableName) return false;

  const normalized = query.trim().toLowerCase();
  const tablePattern = new RegExp(
    `^select\\s+\\*\\s+from\\s+${tableName.toLowerCase()}\\s+limit\\s+\\d+`,
    "i",
  );

  return tablePattern.test(normalized);
}

export function extractTablesFromQuery(query: string): string[] {
  const tables: string[] = [];

  // Remove comments
  const cleanQuery = query
    .replace(/--.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");

  // Match FROM and JOIN clauses
  const fromMatches = cleanQuery.match(/(?:from|join)\s+([a-z_][a-z0-9_]*)/gi);

  if (fromMatches) {
    fromMatches.forEach((match) => {
      const tableName = match.replace(/^(from|join)\s+/i, "").trim();
      if (tableName && !tables.includes(tableName)) {
        tables.push(tableName);
      }
    });
  }

  return tables;
}

export function generateQueryTitle(
  query: string,
  sourceTable?: string,
): string {
  // Check if it's a default table query
  if (sourceTable && isDefaultTableQuery(query, sourceTable)) {
    return sourceTable;
  }

  // New heuristic: split on first 'FROM'
  const normalizedQuery = query.trim();
  const fromMatch = normalizedQuery.match(/\bfrom\b/i);

  if (!fromMatch) {
    // No FROM clause, just clean up the query
    const title = normalizedQuery.replace(/^\s*select\s+/i, "");
    return title.length > 20 ? title.substring(0, 20) + "..." : title;
  }

  const fromIndex = fromMatch.index!;
  let selectPart = normalizedQuery.substring(0, fromIndex).trim();
  const fromPart = normalizedQuery
    .substring(fromIndex + fromMatch[0].length)
    .trim();

  // Process SELECT part
  selectPart = selectPart.replace(/^\s*select\s+/i, "");
  if (selectPart.length > 20) {
    selectPart = selectPart.substring(0, 20) + "...";
  }

  // Process FROM part
  if (fromPart) {
    // Split FROM part on WHERE
    const whereMatch = fromPart.match(/\bwhere\b/i);
    let tablesPart = fromPart;
    let wherePart = "";

    if (whereMatch) {
      const whereIndex = whereMatch.index!;
      tablesPart = fromPart.substring(0, whereIndex).trim();
      wherePart = fromPart.substring(whereIndex + whereMatch[0].length).trim();
    }

    // Extract first table name from tables part
    const tableMatch = tablesPart.match(/^\s*"?([^"\s,;()]+)"?/);
    if (tableMatch) {
      let tableName = tableMatch[1];

      // Remove schema prefixes
      tableName = tableName.replace(/^(system\.|crdb_internal\.)/i, "");

      if (tableName.length > 20) {
        tableName = tableName.substring(0, 20) + "...";
      }

      let result = `${selectPart} FROM ${tableName}`;

      // Add WHERE part if present
      if (wherePart) {
        if (wherePart.length > 15) {
          wherePart = wherePart.substring(0, 15) + "...";
        }
        result += ` WHERE ${wherePart}`;
      }

      return result;
    }
  }

  // Fallback to just the SELECT part if FROM parsing fails
  return selectPart || "Query";
}
