/**
 * Query parser for in-band search syntax
 *
 * Supported syntax:
 * - level:error - Search for specific log level
 * - tag:job=456 - Search for specific tag value
 * - file:some.log - Search in specific file
 * - goroutine:123 - Search in specific goroutine
 * - "exact phrase" - Exact phrase search (quoted)
 * - /regex/flags - Regex search
 * - plain text - Keyword search across all fields
 *
 * Multiple terms are AND-ed together:
 * - level:error database - Error level logs containing "database"
 * - file:raft.log tag:node=1 - Logs from raft.log with node=1 tag
 */

export interface ParsedQuery {
  // Field-specific filters
  level?: string;
  file?: string;
  goroutine?: string;
  tags?: string[];

  // Main search terms
  keywords: string[]; // General keyword search
  exactPhrases: string[]; // Quoted exact phrases
  regex?: { pattern: string; flags: string };

  // Original query for display
  originalQuery: string;
}

export class QueryParser {
  /**
   * Parse a search query into structured components
   */
  static parse(query: string): ParsedQuery {
    const result: ParsedQuery = {
      keywords: [],
      exactPhrases: [],
      tags: [],
      originalQuery: query.trim(),
    };

    if (!query.trim()) {
      return result;
    }

    // Tokenize the query while preserving quoted strings and field specifiers
    const tokens = this.tokenize(query);

    for (const token of tokens) {
      if (this.isFieldSpecifier(token)) {
        this.parseFieldSpecifier(token, result);
      } else if (this.isQuotedString(token)) {
        // Remove quotes and add as exact phrase
        result.exactPhrases.push(token.slice(1, -1));
      } else if (this.isRegex(token)) {
        // Parse regex with flags
        const regexMatch = token.match(/^\/(.+?)\/([gimuy]*)$/);
        if (regexMatch) {
          result.regex = {
            pattern: regexMatch[1],
            flags: regexMatch[2] || "",
          };
        }
      } else if (token.trim()) {
        // Regular keyword
        result.keywords.push(token.trim());
      }
    }

    return result;
  }

  /**
   * Tokenize query while preserving quoted strings and field specifiers
   */
  private static tokenize(query: string): string[] {
    const tokens: string[] = [];
    let current = "";
    let inQuotes = false;
    let quoteChar = "";

    for (let i = 0; i < query.length; i++) {
      const char = query[i];

      if ((char === '"' || char === "'") && !inQuotes) {
        // Start of quoted string
        if (current.trim()) {
          tokens.push(current.trim());
          current = "";
        }
        inQuotes = true;
        quoteChar = char;
        current = char;
      } else if (char === quoteChar && inQuotes) {
        // End of quoted string
        current += char;
        tokens.push(current);
        current = "";
        inQuotes = false;
        quoteChar = "";
      } else if (inQuotes) {
        // Inside quotes, preserve everything
        current += char;
      } else if (char === " " || char === "\t") {
        // Whitespace outside quotes
        if (current.trim()) {
          tokens.push(current.trim());
          current = "";
        }
      } else {
        // Regular character
        current += char;
      }
    }

    // Add remaining token
    if (current.trim()) {
      tokens.push(current.trim());
    }

    return tokens;
  }

  /**
   * Check if token is a field specifier like "level:error"
   */
  private static isFieldSpecifier(token: string): boolean {
    return /^(level|file|goroutine|tag):.+/.test(token);
  }

  /**
   * Check if token is a quoted string
   */
  private static isQuotedString(token: string): boolean {
    return (
      (token.startsWith('"') && token.endsWith('"')) ||
      (token.startsWith("'") && token.endsWith("'"))
    );
  }

  /**
   * Check if token is a regex pattern
   */
  private static isRegex(token: string): boolean {
    return /^\/.*\/[gimuy]*$/.test(token);
  }

  /**
   * Parse a field specifier like "level:error" or "tag:job=456"
   */
  private static parseFieldSpecifier(token: string, result: ParsedQuery): void {
    const colonIndex = token.indexOf(":");
    if (colonIndex === -1) return;

    const field = token.substring(0, colonIndex).toLowerCase();
    const value = token.substring(colonIndex + 1);

    switch (field) {
      case "level":
        result.level = value.toLowerCase();
        break;
      case "file":
        result.file = value;
        break;
      case "goroutine":
        result.goroutine = value;
        break;
      case "tag":
        if (!result.tags) result.tags = [];
        result.tags.push(value);
        break;
    }
  }

  /**
   * Convert parsed query back to a simple text for display/editing
   */
  static stringify(parsed: ParsedQuery): string {
    const parts: string[] = [];

    if (parsed.level) parts.push(`level:${parsed.level}`);
    if (parsed.file) parts.push(`file:${parsed.file}`);
    if (parsed.goroutine) parts.push(`goroutine:${parsed.goroutine}`);
    if (parsed.tags) {
      parsed.tags.forEach((tag) => parts.push(`tag:${tag}`));
    }
    if (parsed.regex) {
      parts.push(`/${parsed.regex.pattern}/${parsed.regex.flags}`);
    }

    // Add quoted exact phrases
    parsed.exactPhrases.forEach((phrase) => {
      parts.push(`"${phrase}"`);
    });

    // Add keywords
    parts.push(...parsed.keywords);

    return parts.join(" ");
  }

  /**
   * Get human-readable description of the query
   */
  static describe(parsed: ParsedQuery): string {
    const parts: string[] = [];

    if (parsed.level) parts.push(`level is ${parsed.level.toUpperCase()}`);
    if (parsed.file) parts.push(`file contains "${parsed.file}"`);
    if (parsed.goroutine) parts.push(`goroutine ${parsed.goroutine}`);
    if (parsed.tags && parsed.tags.length > 0) {
      parts.push(`tags: ${parsed.tags.join(", ")}`);
    }
    if (parsed.exactPhrases.length > 0) {
      parts.push(
        `exact phrases: ${parsed.exactPhrases.map((p) => `"${p}"`).join(", ")}`,
      );
    }
    if (parsed.keywords.length > 0) {
      parts.push(`keywords: ${parsed.keywords.join(", ")}`);
    }
    if (parsed.regex) {
      parts.push(`regex: /${parsed.regex.pattern}/${parsed.regex.flags}`);
    }

    return parts.length > 0 ? parts.join(" AND ") : "empty query";
  }
}
