import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { DuckDBInstance, DuckDBConnection } from '@duckdb/node-api';
import { type DuckDBService, type DuckDBQueryResult, type DuckDBConnection as IDuckDBConnection } from './duckdb-interface';
import { preprocessCSV, shouldPreprocess } from '../crdb/csvPreprocessor';
import { getTableTypeHints } from '../crdb/columnTypeRegistry';

class NodeDuckDBQueryResult implements DuckDBQueryResult {
  private _rows: any;
  constructor(_rows: any) {
    this._rows = _rows;
  }

  toArray(): any[] {
    return this._rows;
  }

  get(index: number): any {
    return this._rows[index];
  }

  get rows(): any[] {
    return this._rows;
  }
}

class NodeDuckDBConnectionImpl implements IDuckDBConnection {
  private conn: DuckDBConnection;
  constructor(conn: DuckDBConnection) {
    this.conn = conn;
  }

  async query(sql: string): Promise<DuckDBQueryResult> {
    const result = await this.conn.run(sql);
    return new NodeDuckDBQueryResult(result as any);
  }

  async close(): Promise<void> {
    this.conn.closeSync();
  }
}

export class NodeDuckDBService implements DuckDBService {
  private instance!: DuckDBInstance;
  private conn!: DuckDBConnection;
  private dir!: string;
  private initialized = false;
  private loadedTables = new Set<string>();

  async initialize(): Promise<void> {
    if (this.initialized) return;

    this.instance = await DuckDBInstance.create(':memory:');
    this.conn = await this.instance.connect();
    this.dir = mkdtempSync(join(tmpdir(), 'duckdb-test-'));

    // Create schemas for CRDB table namespaces
    await this.createSchemas();

    this.initialized = true;
  }

  private async createSchemas(): Promise<void> {
    if (!this.conn) {
      throw new Error('DuckDB not initialized');
    }

    try {
      // Create schemas for CRDB namespaces
      await this.conn.run('CREATE SCHEMA IF NOT EXISTS system');
      await this.conn.run('CREATE SCHEMA IF NOT EXISTS crdb_internal');
    } catch (error) {
      console.error('Failed to create schemas:', error);
      throw error;
    }
  }


  async connect(): Promise<IDuckDBConnection> {
    if (!this.conn) {
      throw new Error('DuckDB not initialized');
    }
    return new NodeDuckDBConnectionImpl(this.conn);
  }

  async registerFileText(filename: string, content: string): Promise<void> {
    const path = join(this.dir, filename);
    writeFileSync(path, content, 'utf8');
  }

  async loadTableFromText(
    tableName: string,
    content: string,
    delimiter: string = '\t'
  ): Promise<number> {
    if (!this.conn) {
      throw new Error('DuckDB not initialized');
    }

    if (this.loadedTables.has(tableName)) {
      const quotedTableName = `"${tableName}"`;
      const countResult = await this.conn.run(
        `SELECT COUNT(*) as count FROM ${quotedTableName}`
      );
      return (countResult as any)[0].count;
    }

    try {
      // Use quoted table name to preserve dots
      const quotedTableName = `"${tableName}"`;

      // Check if we should preprocess this table
      let processedContent = content;
      let usePreprocessed = false;

      if (shouldPreprocess(tableName, content)) {
        try {
          processedContent = preprocessCSV(content, {
            tableName,
            delimiter,
            decodeKeys: true,
            decodeProtos: true // Enable proto decoding
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
      await this.registerFileText(`${fileBaseName}.txt`, processedContent);

      // Drop table if exists
      await this.conn.run(`DROP TABLE IF EXISTS ${quotedTableName}`);

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
          const filePath = join(this.dir, `${fileBaseName}.txt`);
          sql = `
            CREATE TABLE ${quotedTableName} AS
            SELECT * FROM read_csv(
              '${filePath}',
              delim='${delimiter}',
              header=true,
              columns={${columnsClause}},
              auto_detect=false,
              quote='',
              escape=''
            )
          `;
        } else {
          // No type hints, use standard auto-detection
          const filePath = join(this.dir, `${fileBaseName}.txt`);
          sql = `
            CREATE TABLE ${quotedTableName} AS
            SELECT * FROM read_csv_auto(
              '${filePath}',
              delim='${delimiter}',
              header=true
            )
          `;
        }

        await this.conn.run(sql);
      } catch (parseError: any) {
        // If preprocessing caused issues or CSV sniffing failed, try with original content
        if (usePreprocessed && (parseError.message?.includes('sniffing file') ||
                               parseError.message?.includes('Error when sniffing file'))) {
          // Re-register with original content
          await this.registerFileText(`${fileBaseName}.txt`, content);

          const filePath = join(this.dir, `${fileBaseName}.txt`);
          const sql = `
            CREATE TABLE ${quotedTableName} AS
            SELECT * FROM read_csv_auto(
              '${filePath}',
              delim='${delimiter}',
              header=true
            )
          `;

          await this.conn.run(sql);
        } else if (parseError.message?.includes('Error when sniffing file') ||
                   parseError.message?.includes('not possible to automatically detect') ||
                   parseError.message?.includes('Could not convert string') ||
                   parseError.message?.includes('Conversion Error: CSV Error') ||
                   parseError.message?.includes('Value with unterminated quote')) {
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
          const filePath = join(this.dir, `${fileBaseName}.txt`);

          const fallbackSql = `
            CREATE TABLE ${quotedTableName} AS
            SELECT * FROM read_csv(
              '${filePath}',
              delim='${delimiter}',
              header=true,
              columns={${columnDefs}},
              auto_detect=false,
              quote='',
              escape='',
              sample_size=1
            )
          `;

          try {
            await this.conn.run(fallbackSql);
          } catch (fallbackError: any) {
            console.error(`Even fallback failed for ${tableName}:`, fallbackError.message);
            throw parseError; // Throw original error if fallback also fails
          }
        } else {
          throw parseError;
        }
      }

      // Get row count
      const countResult = await this.conn.run(
        `SELECT COUNT(*) as count FROM ${quotedTableName}`
      );
      const countArray = countResult as any;
      const count = countArray && countArray.length > 0 ? countArray[0].count : 0;

      this.loadedTables.add(tableName);
      return count;
    } catch (error) {
      console.error(`Failed to load table ${tableName}:`, error);
      throw error;
    }
  }

  private rewriteQuery(sql: string): string {
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

  async query(sql: string): Promise<DuckDBQueryResult> {
    if (!this.conn) {
      throw new Error('DuckDB not initialized');
    }

    try {
      const rewrittenSql = this.rewriteQuery(sql);
      const result = await this.conn.run(rewrittenSql);
      return new NodeDuckDBQueryResult(result as any);
    } catch (error) {
      console.error('Query failed:', error);
      throw error;
    }
  }

  async getFunctions(): Promise<Array<{ name: string; type: string }>> {
    if (!this.conn) return [];

    try {
      const result = await this.conn.run(`
        SELECT DISTINCT
          function_name,
          function_type
        FROM duckdb_functions()
        WHERE function_type IN ('scalar', 'aggregate')
        ORDER BY function_name
      `);

      return (result as any).map((row: any) => ({
        name: row.function_name.toUpperCase(),
        type: row.function_type
      }));
    } catch (err) {
      console.warn('Failed to get DuckDB functions:', err);
      return [
        { name: 'COUNT', type: 'aggregate' },
        { name: 'SUM', type: 'aggregate' },
        { name: 'AVG', type: 'aggregate' },
        { name: 'MIN', type: 'aggregate' },
        { name: 'MAX', type: 'aggregate' },
        { name: 'CAST', type: 'scalar' },
        { name: 'TO_TIMESTAMP', type: 'scalar' },
      ];
    }
  }

  async close(): Promise<void> {
    try {
      if (this.conn) {
        this.conn.closeSync();
      }
    } catch {}
    try {
      if (this.dir) {
        rmSync(this.dir, { recursive: true, force: true });
      }
    } catch {}
    this.initialized = false;
    this.loadedTables.clear();
  }

  async terminate(): Promise<void> {
    await this.close();
  }
}