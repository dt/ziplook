/**
 * Log parsing service for CockroachDB logs
 * Based on existing regex patterns from logRegex.test.ts
 */

export interface ParsedLogEntry {
  fileName: string;
  fileLine: number;

  id: number;
  level: 'I' | 'W' | 'E' | 'F';
  timestamp: string;
  goroutineId: string;
  codeFileLine: string; // foo.go:123
  tagMap: Record<string, string>;
  message: string;
}

export interface LogParsingStats {
  totalLines: number;
  parsedEntries: number;
  unparseableLines: number;
  multiLineEntries: number;
}

export class LogParser {
  private static readonly LOG_REGEX_WITH_COUNTER = /^([IWEF])([0-9: ]{15})(\.\d+)( \d+ )(\d+@)([^:]+)(:\d+)( ⋮ )(\[[^\]]*\]) (\d+) (.*)$/;
  private static readonly LOG_REGEX_WITHOUT_COUNTER = /^([IWEF])([0-9: ]{15})(\.\d+)( \d+ )([^@:]+)(:\d+)( ⋮ )(\[[^\]]*\]) (.*)$/;

  private entryCounter = 0;
  private pendingEntry: Partial<ParsedLogEntry> | null = null;
  private stats: LogParsingStats = {
    totalLines: 0,
    parsedEntries: 0,
    unparseableLines: 0,
    multiLineEntries: 0
  };

  /**
   * Parse a complete log file into structured entries
   */
  parseLogFile(content: string, sourceFile: string): { entries: ParsedLogEntry[], stats: LogParsingStats } {
    const lines = content.split('\n');
    const entries: ParsedLogEntry[] = [];

    this.resetState();

    lines.forEach((line, lineIndex) => {
      this.stats.totalLines++;
      const parsed = this.parseLogLine(line, lineIndex + 1, sourceFile);

      if (parsed) {
        // Complete previous entry if exists
        if (this.pendingEntry) {
          entries.push(this.completePendingEntry());
          this.stats.parsedEntries++;
        }

        // Start new entry
        this.pendingEntry = parsed;
      } else {
        // Continuation line - append to pending entry
        if (this.pendingEntry) {
          this.appendToPendingEntry(line, lineIndex + 1);
          this.stats.multiLineEntries++;
        } else {
          // Orphaned line - treat as standalone unparseable entry
          entries.push(this.createUnparseableEntry(line, lineIndex + 1, sourceFile));
          this.stats.unparseableLines++;
        }
      }
    });

    // Don't forget the last entry
    if (this.pendingEntry) {
      entries.push(this.completePendingEntry());
      this.stats.parsedEntries++;
    }

    return { entries, stats: this.stats };
  }

  /**
   * Parse a single log line using the established regex patterns
   */
  private parseLogLine(line: string, lineNum: number, sourceFile: string): Partial<ParsedLogEntry> | null {
    // Try regex with counter first
    let match = line.match(LogParser.LOG_REGEX_WITH_COUNTER);
    let hasCounter = true;

    if (!match) {
      // Try regex without counter
      match = line.match(LogParser.LOG_REGEX_WITHOUT_COUNTER);
      hasCounter = false;
    }

    if (!match) {
      return null; // Unparseable line
    }

    let level, datetime, fractional, pid, channel, filePath, lineStr, tags, message;

    if (hasCounter) {
      // With counter: groups [1-11]: level, datetime, fractional, pid, channel@, file, :line, separator, tags, counter, message
      [, level, datetime, fractional, pid, channel, filePath, lineStr, , tags, , message] = match;
      channel = channel.replace('@', '');
    } else {
      // Without counter: groups [1-9]: level, datetime, fractional, pid, file, :line, separator, tags, message
      [, level, datetime, fractional, pid, filePath, lineStr, , tags, message] = match;
      channel = undefined;
    }

    const timestamp = `${datetime}${fractional}`;
    const goroutineId = pid.trim();
    const lineNumber = parseInt(lineStr?.replace(':', '') || '0');

    const { tagMap } = this.parseTags(tags);

    return {
      fileName: sourceFile,
      fileLine: lineNum,
      id: this.generateEntryId(),
      level: level as 'I' | 'W' | 'E' | 'F',
      timestamp,
      goroutineId,
      codeFileLine: `${filePath || ''}:${lineNumber}`,
      tagMap,
      message: message || ''
    };
  }

  /**
   * Parse tags from [T1,Vsystem,n1,client=127.0.0.1:39464,hostnossl,user=root] format
   */
  private parseTags(tagString: string): { tagMap: Record<string, string> } {
    const tagMap: Record<string, string> = {};

    // Remove brackets and split by comma
    const tagContent = tagString.replace(/^\[|\]$/g, '');
    const tags = tagContent.split(',').map(t => t.trim());

    for (const tag of tags) {
      if (tag.includes('=')) {
        // Key-value tag
        const [key, value] = tag.split('=', 2);
        tagMap[key] = value;
      } else {
        // Simple tag (store with empty value to indicate it exists)
        tagMap[tag] = '';
      }
    }

    return { tagMap };
  }

  private resetState(): void {
    this.entryCounter = 0;
    this.pendingEntry = null;
    this.stats = {
      totalLines: 0,
      parsedEntries: 0,
      unparseableLines: 0,
      multiLineEntries: 0
    };
  }

  private generateEntryId(): number {
    return ++this.entryCounter;
  }

  private completePendingEntry(): ParsedLogEntry {
    if (!this.pendingEntry) {
      throw new Error('No pending entry to complete');
    }

    return this.pendingEntry as ParsedLogEntry;
  }

  private appendToPendingEntry(line: string, _lineNum: number): void {
    if (!this.pendingEntry) {
      return;
    }

    this.pendingEntry.message += '\n' + line;
    // Note: fileLine stays as the first line number for multi-line entries
  }

  private createUnparseableEntry(line: string, lineNum: number, sourceFile: string): ParsedLogEntry {
    return {
      fileName: sourceFile,
      fileLine: lineNum,
      id: this.generateEntryId(),
      level: 'I', // Default level for unparseable
      timestamp: '',
      goroutineId: '',
      codeFileLine: '', // No source code file for unparseable lines
      tagMap: {},
      message: line
    };
  }

  /**
   * Normalize message content for better search matching
   */
  static normalizeMessage(message: string): string {
    return message
      // Replace UUIDs
      .replace(/\b[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\b/gi, '[UUID]')
      // Replace session IDs
      .replace(/\bsession_id=\w+/gi, 'session_id=[ID]')
      .replace(/\brequest_id=\w+/gi, 'request_id=[ID]')
      .replace(/\buser_id=\d+/gi, 'user_id=[ID]')
      // Replace timestamps within messages
      .replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/g, '[TIMESTAMP]')
      // Replace memory addresses
      .replace(/0x[a-f0-9]+/gi, '[ADDR]')
      // Replace IP addresses (but keep structure for search)
      .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP]')
      // Replace port numbers after IP
      .replace(/\[IP\]:\d+/g, '[IP:PORT]');
  }
}