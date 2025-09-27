/**
 * Log search index using FlexSearch for fast full-text search
 * Combined with native JS for regex and exact matching
 */

import FlexSearch from "flexsearch";
import type {
  SearchResult,
  SearchQuery,
  FileIndexStatus,
} from "../state/types";
import type { ParsedLogEntry } from "./logParser";
import { LogParser } from "./logParser";
import type { ParsedQuery } from "./queryParser";
import type { DocumentData } from "flexsearch";

// FlexSearch result types
type FlexSearchResultId = string | number;

interface FlexSearchFieldResult {
  field: string;
  result: FlexSearchResultId[];
}

interface FlexSearchSimpleResult {
  result: FlexSearchResultId[];
}

type FlexSearchResults =
  | FlexSearchFieldResult[]
  | FlexSearchSimpleResult[]
  | FlexSearchResultId[];

// FlexSearch Document instance for our indexed log entries
interface FlexSearchDocument {
  add(document: IndexedLogEntry): this;
  search(query: string, options?: { limit?: number }): FlexSearchResults;
  clear(): this;
}

interface IndexedLogEntry extends DocumentData {
  id: number;
  level: string;
  timestamp: string;
  goroutineId: string;
  file: string;
  tags: string;
  tagPairs: string;
  message: string;
  sourceFile: string;
  startLine: number;
  endLine: number;
}

export class LogSearchIndex {
  private flexIndex: FlexSearchDocument;
  private entries = new Map<number, ParsedLogEntry>();
  private logParser = new LogParser();
  private isReady = false;
  private fileStatuses = new Map<string, FileIndexStatus>();
  private addedEntryCount = 0;

  constructor() {
    this.flexIndex = new FlexSearch.Document({
      index: [
        {
          field: "level",
          tokenize: "forward",
          resolution: 5,
        },
        {
          field: "goroutineId",
          tokenize: "forward",
          resolution: 5,
        },
        {
          field: "file",
          tokenize: "forward",
          resolution: 5,
        },
        {
          field: "tags",
          tokenize: "forward",
          resolution: 9,
        },
        {
          field: "tagPairs",
          tokenize: "forward",
          resolution: 9,
        },
        {
          field: "message",
          tokenize: "forward",
          resolution: 9,
        },
      ],
      store: true, // Store all fields
      id: "id",
    });
  }

  /**
   * Register a file for potential indexing
   */
  registerFile(filePath: string, fileName: string, size: number): void {
    if (!this.fileStatuses.has(filePath)) {
      this.fileStatuses.set(filePath, {
        path: filePath,
        name: fileName,
        size,
        status: "unindexed",
      });
    }
  }

  /**
   * Index a log file by parsing and adding all entries
   */
  async indexLogFile(filePath: string, content: string): Promise<void> {
    // Update status to indexing
    const fileStatus = this.fileStatuses.get(filePath);
    if (fileStatus) {
      fileStatus.status = "indexing";
    }

    try {
      const { entries } = this.logParser.parseLogFile(content, filePath);

      for (const entry of entries) {
        await this.addLogEntry(entry);
      }

      // Update status to indexed
      if (fileStatus) {
        fileStatus.status = "indexed";
        fileStatus.entries = entries.length;
        fileStatus.indexedAt = new Date();
      }

      this.isReady = true;
    } catch (error) {
      // Update status to error
      if (fileStatus) {
        fileStatus.status = "error";
        fileStatus.error =
          error instanceof Error ? error.message : "Unknown error";
      }
      throw error;
    }
  }

  /**
   * Add a single parsed log entry to the index
   */
  async addLogEntry(entry: ParsedLogEntry): Promise<void> {
    // Check if we're overwriting an existing entry (this would be bad!)
    if (this.entries.has(entry.id)) {
      console.warn(
        `🔍 WARNING: Overwriting existing entry with ID ${entry.id}! Previous entry:`,
        this.entries.get(entry.id)?.fileName,
        "New entry:",
        entry.fileName,
      );
    }

    // Store full entry for retrieval
    this.entries.set(entry.id, entry);

    // Add to FlexSearch index with normalized content
    const indexEntry: IndexedLogEntry = {
      id: entry.id,
      level: entry.level,
      timestamp: entry.timestamp,
      goroutineId: entry.goroutineId,
      file: entry.codeFileLine,
      tags: Object.keys(entry.tagMap).join(" "),
      tagPairs: Object.entries(entry.tagMap)
        .map(([k, v]) => `${k}=${v}`)
        .join(" "),
      message: entry.message,
      sourceFile: entry.fileName,
      startLine: entry.fileLine,
      endLine: entry.fileLine,
    };

    this.flexIndex.add(indexEntry);
    this.addedEntryCount++;
  }

  /**
   * Mark a file as indexed with the given number of entries
   */
  markFileAsIndexed(filePath: string, entryCount: number): void {
    const fileStatus = this.fileStatuses.get(filePath);
    if (fileStatus) {
      fileStatus.status = "indexed";
      fileStatus.entries = entryCount;
      fileStatus.indexedAt = new Date();
    }
    this.isReady = true;

    // Run a test to verify FlexSearch is working
    if (this.entries.size > 0) {
      this.testFlexSearch().catch((error) => {
        console.error("🔍 FlexSearch test failed:", error);
      });
    }
  }

  /**
   * Mark a file as being indexed (in progress)
   */
  markFileAsIndexing(filePath: string): void {
    const fileStatus = this.fileStatuses.get(filePath);
    if (fileStatus) {
      fileStatus.status = "indexing";
    }
  }

  /**
   * Mark a file as having an error during indexing
   */
  markFileAsError(filePath: string, error: string): void {
    const fileStatus = this.fileStatuses.get(filePath);
    if (fileStatus) {
      fileStatus.status = "error";
      fileStatus.error = error;
    }
  }

  /**
   * New unified search method using parsed query
   */
  async searchWithParsedQuery(
    parsedQuery: ParsedQuery,
  ): Promise<SearchResult[]> {
    if (!this.isReady) {
      return [];
    }

    let results: SearchResult[] = [];

    // Start with all entries
    let candidateEntries = Array.from(this.entries.values());

    // Apply field-specific filters first (fastest filters)
    if (parsedQuery.level) {
      candidateEntries = candidateEntries.filter(
        (entry) =>
          entry.level.toLowerCase() === parsedQuery.level!.toLowerCase(),
      );
    }

    if (parsedQuery.file) {
      candidateEntries = candidateEntries.filter(
        (entry) =>
          entry.fileName.includes(parsedQuery.file!) ||
          entry.codeFileLine.includes(parsedQuery.file!),
      );
    }

    if (parsedQuery.goroutine) {
      candidateEntries = candidateEntries.filter(
        (entry) => entry.goroutineId === parsedQuery.goroutine,
      );
    }

    if (parsedQuery.tags && parsedQuery.tags.length > 0) {
      candidateEntries = candidateEntries.filter((entry) => {
        return parsedQuery.tags!.some((tagFilter) => {
          return Object.keys(entry.tagMap).some((tag: string) =>
            tag.includes(tagFilter),
          );
        });
      });
    }

    // Apply text search (more expensive)
    if (parsedQuery.regex) {
      // Regex search
      try {
        const regex = new RegExp(
          parsedQuery.regex.pattern,
          parsedQuery.regex.flags || "gi",
        );
        candidateEntries = candidateEntries.filter((entry) =>
          regex.test(entry.message),
        );
      } catch (error) {
        console.error(
          "Invalid regex pattern:",
          parsedQuery.regex.pattern,
          error,
        );
        return [];
      }
    }

    // Apply exact phrase searches
    if (parsedQuery.exactPhrases.length > 0) {
      candidateEntries = candidateEntries.filter((entry) => {
        return parsedQuery.exactPhrases.every((phrase) =>
          entry.message.includes(phrase),
        );
      });
    }

    // Apply keyword searches using FlexSearch for remaining candidates
    if (parsedQuery.keywords.length > 0) {
      // Use FlexSearch for keyword matching
      const keywordQuery = parsedQuery.keywords.join(" ");
      const flexResults = await this.flexIndex.search(keywordQuery, {
        limit: 2000,
      });
      const flexResultIds = new Set(
        this.extractIdsFromFlexSearchResults(flexResults),
      );

      candidateEntries = candidateEntries.filter((entry) =>
        flexResultIds.has(entry.id),
      );
    }

    // Convert to search results
    results = candidateEntries.map((entry) =>
      this.entryToSearchResult(entry, parsedQuery.originalQuery),
    );

    // Sort by relevance (most recent first for now)
    results.sort((a, b) => b.startLine - a.startLine);

    // Limit results
    const finalResults = results.slice(0, 1000);
    return finalResults;
  }

  /**
   * Extract entry IDs from FlexSearch results
   */
  private extractIdsFromFlexSearchResults(
    results: FlexSearchResults,
  ): number[] {
    const ids: number[] = [];

    if (Array.isArray(results)) {
      for (const result of results) {
        if (typeof result === "string") {
          ids.push(parseInt(result));
        } else if (typeof result === "number") {
          ids.push(result);
        } else if (
          result &&
          Array.isArray((result as FlexSearchSimpleResult).result)
        ) {
          const simpleResult = result as FlexSearchSimpleResult;
          ids.push(
            ...simpleResult.result.map((id: FlexSearchResultId) =>
              typeof id === "string" ? parseInt(id) : id,
            ),
          );
        } else if (
          result &&
          (result as FlexSearchFieldResult).field &&
          Array.isArray((result as FlexSearchFieldResult).result)
        ) {
          // FlexSearch document results have this structure
          const fieldResult = result as FlexSearchFieldResult;
          ids.push(
            ...fieldResult.result.map((id: FlexSearchResultId) =>
              typeof id === "string" ? parseInt(id) : id,
            ),
          );
        }
      }
    } else if (
      results &&
      Array.isArray((results as FlexSearchSimpleResult).result)
    ) {
      const simpleResults = results as FlexSearchSimpleResult;
      ids.push(
        ...simpleResults.result.map((id: FlexSearchResultId) =>
          typeof id === "string" ? parseInt(id) : id,
        ),
      );
    }

    return [...new Set(ids)]; // Remove duplicates
  }

  /**
   * Search with multiple strategies based on query type
   */
  async search(query: SearchQuery): Promise<SearchResult[]> {
    if (!this.isReady) {
      return [];
    }

    switch (query.type) {
      case "keyword":
        return this.keywordSearch(query.text, query.filters);
      case "exact":
        return this.exactSearch(query.text, query.filters);
      case "regex":
        return this.regexSearch(query.text, query.filters);
      case "tag":
        return this.tagSearch(query.text, query.filters);
      case "level":
        return this.levelSearch(query.text, query.filters);
      case "goroutine":
        return this.goroutineSearch(query.text, query.filters);
      case "file":
        return this.fileSearch(query.text, query.filters);
      default:
        return this.keywordSearch(query.text, query.filters);
    }
  }

  /**
   * Fast keyword search using FlexSearch
   */
  private async keywordSearch(
    text: string,
    filters?: SearchQuery["filters"],
  ): Promise<SearchResult[]> {
    const searchResults = await this.flexIndex.search(text, { limit: 1000 });
    return this.processFlexSearchResults(searchResults, filters);
  }

  /**
   * Exact string matching using native JS
   */
  private async exactSearch(
    text: string,
    filters?: SearchQuery["filters"],
  ): Promise<SearchResult[]> {
    const results: SearchResult[] = [];

    for (const entry of this.entries.values()) {
      if (this.applyFilters(entry, filters) && entry.message.includes(text)) {
        results.push(this.entryToSearchResult(entry, text));
      }
    }

    return results;
  }

  /**
   * Regex search using native JS RegExp
   */
  private async regexSearch(
    pattern: string,
    filters?: SearchQuery["filters"],
  ): Promise<SearchResult[]> {
    const results: SearchResult[] = [];

    try {
      const regex = new RegExp(pattern, "gi");

      for (const entry of this.entries.values()) {
        if (this.applyFilters(entry, filters)) {
          const matches = entry.message.match(regex);
          if (matches) {
            results.push(this.entryToSearchResult(entry, matches[0]));
          }
        }
      }
    } catch (error) {
      console.warn("Invalid regex pattern:", pattern, error);
    }

    return results;
  }

  /**
   * Search by specific tags
   */
  private async tagSearch(
    tagQuery: string,
    filters?: SearchQuery["filters"],
  ): Promise<SearchResult[]> {
    const results: SearchResult[] = [];

    for (const entry of this.entries.values()) {
      if (this.applyFilters(entry, filters)) {
        // Check if tag exists in tagMap keys or values
        const hasTag =
          Object.keys(entry.tagMap).includes(tagQuery) ||
          Object.values(entry.tagMap).includes(tagQuery);

        if (hasTag) {
          results.push(this.entryToSearchResult(entry, tagQuery));
        }
      }
    }

    return results;
  }

  /**
   * Search by log level
   */
  private async levelSearch(
    level: string,
    filters?: SearchQuery["filters"],
  ): Promise<SearchResult[]> {
    // Simple filter by level using our entries map
    const results: SearchResult[] = [];
    for (const entry of this.entries.values()) {
      if (
        entry.level === level.toUpperCase() &&
        this.applyFilters(entry, filters)
      ) {
        results.push(this.entryToSearchResult(entry, level));
      }
    }
    return results;
  }

  /**
   * Search by goroutine ID
   */
  private async goroutineSearch(
    goroutineId: string,
    filters?: SearchQuery["filters"],
  ): Promise<SearchResult[]> {
    // Simple filter by goroutine ID using our entries map
    const results: SearchResult[] = [];
    for (const entry of this.entries.values()) {
      if (
        entry.goroutineId === goroutineId &&
        this.applyFilters(entry, filters)
      ) {
        results.push(this.entryToSearchResult(entry, goroutineId));
      }
    }
    return results;
  }

  /**
   * Search by file path
   */
  private async fileSearch(
    filePath: string,
    filters?: SearchQuery["filters"],
  ): Promise<SearchResult[]> {
    const searchResults = await this.flexIndex.search(filePath, {
      limit: 1000,
    });
    return this.processFlexSearchResults(searchResults, filters);
  }

  /**
   * Process FlexSearch results and convert to SearchResult format
   */
  private processFlexSearchResults(
    searchResults: FlexSearchResults,
    filters?: SearchQuery["filters"],
  ): SearchResult[] {
    const results: SearchResult[] = [];

    if (Array.isArray(searchResults)) {
      for (const result of searchResults) {
        if (typeof result === "string" || typeof result === "number") {
          // Direct ID result
          const numericId =
            typeof result === "string" ? parseInt(result) : result;
          const entry = this.entries.get(numericId);
          if (entry && this.applyFilters(entry, filters)) {
            results.push(this.entryToSearchResult(entry));
          }
        } else if (
          (result as FlexSearchFieldResult).result &&
          Array.isArray((result as FlexSearchFieldResult).result)
        ) {
          // Field-based result
          const fieldResult = result as FlexSearchFieldResult;
          for (const id of fieldResult.result) {
            const numericId = typeof id === "string" ? parseInt(id) : id;
            const entry = this.entries.get(numericId);
            if (entry && this.applyFilters(entry, filters)) {
              results.push(this.entryToSearchResult(entry));
            }
          }
        }
      }
    }

    return results;
  }

  /**
   * Apply additional filters to search results
   */
  private applyFilters(
    entry: ParsedLogEntry,
    filters?: SearchQuery["filters"],
  ): boolean {
    if (!filters) return true;

    if (filters.level && entry.level !== filters.level) return false;
    if (filters.goroutineId && entry.goroutineId !== filters.goroutineId)
      return false;
    if (filters.file && !entry.fileName.includes(filters.file)) return false;

    if (filters.tags) {
      const hasAllTags = filters.tags.every((tag) =>
        Object.keys(entry.tagMap).includes(tag),
      );
      if (!hasAllTags) return false;
    }

    // TODO: Implement time range filtering
    if (filters.timeRange) {
      // Would need to parse timestamps and compare
    }

    return true;
  }

  /**
   * Convert ParsedLogEntry to SearchResult
   */
  private entryToSearchResult(
    entry: ParsedLogEntry,
    matchedText?: string,
  ): SearchResult {
    return {
      id: entry.id,
      file: entry.fileName,
      startLine: entry.fileLine,
      endLine: entry.fileLine,
      timestamp: entry.timestamp,
      level: entry.level,
      goroutineId: entry.goroutineId,
      tags: Object.keys(entry.tagMap),
      message: entry.message,
      matchedText,
      context: entry.message, // No more rawMessage, just message
    };
  }

  /**
   * Get statistics about the current index
   */
  getIndexStats(): {
    totalEntries: number;
    indexedFiles: Set<string>;
    fileStatuses: Map<string, FileIndexStatus>;
  } {
    const indexedFiles = new Set<string>();

    for (const entry of this.entries.values()) {
      indexedFiles.add(entry.fileName);
    }

    return {
      totalEntries: this.entries.size,
      indexedFiles,
      fileStatuses: this.fileStatuses,
    };
  }

  /**
   * Get files by status
   */
  getFilesByStatus(status: FileIndexStatus["status"]): FileIndexStatus[] {
    return Array.from(this.fileStatuses.values()).filter(
      (f) => f.status === status,
    );
  }

  /**
   * Get file status
   */
  getFileStatus(filePath: string): FileIndexStatus | undefined {
    return this.fileStatuses.get(filePath);
  }

  /**
   * Clear the entire index
   */
  clear(): void {
    this.entries.clear();
    this.flexIndex = new FlexSearch.Document({
      index: [
        {
          field: "level",
          tokenize: "forward",
          resolution: 5,
        },
        {
          field: "goroutineId",
          tokenize: "forward",
          resolution: 5,
        },
        {
          field: "file",
          tokenize: "forward",
          resolution: 5,
        },
        {
          field: "tags",
          tokenize: "forward",
          resolution: 9,
        },
        {
          field: "tagPairs",
          tokenize: "forward",
          resolution: 9,
        },
        {
          field: "message",
          tokenize: "forward",
          resolution: 9,
        },
      ],
      store: true, // Store all fields
      id: "id",
    });
    this.isReady = false;
  }

  /**
   * Check if the index is ready for searching
   */
  isIndexReady(): boolean {
    return this.isReady;
  }

  /**
   * Test FlexSearch functionality with a simple query
   */
  async testFlexSearch(): Promise<void> {
    // Test with first few entries
    const testEntries = Array.from(this.entries.values()).slice(0, 3);

    if (testEntries.length === 0) {
      return;
    }

    for (const entry of testEntries) {
      // Try searching for a word from the message
      const words = entry.message.split(" ").filter((w) => w.length > 3);
      if (words.length > 0) {
        const testWord = words[0].toLowerCase();
        const searchResult = await this.flexIndex.search(testWord, {
          limit: 10,
        });
        this.extractIdsFromFlexSearchResults(searchResult);
      }
    }

    // Test with common search terms
    await this.flexIndex.search("insecure", { limit: 10 });
    await this.flexIndex.search("pebble", { limit: 10 });
    await this.flexIndex.search("root", { limit: 10 });
  }
}
