import { describe, it, expect } from 'vitest';
import { LogSearchIndex } from './logSearchIndex';

describe('LogSearchIndex Integration', () => {
  it('should index and search log content', async () => {
    const index = new LogSearchIndex();

    // Sample CockroachDB log content
    const logContent = `I250917 21:50:59.410399 7012 4@util/log/event_log.go:90 ⋮ [T1,Vsystem,n1] 1 Database connection established
I250917 21:50:59.410558 7012 util/log/file_sync_buffer.go:237 ⋮ [T1,config] file created at: 2025/09/17 21:50:59
E250917 22:23:06.174161 95149 4@util/log/event_log.go:90 ⋮ [T1,Vsystem,n1] 4 Database connection failed
W250917 22:23:07.175000 95150 util/log/memory.go:45 ⋮ [T1,memory] Memory usage high: 85%`;

    // Index the content
    await index.indexLogFile('test.log', logContent);

    expect(index.isIndexReady()).toBe(true);

    const stats = index.getIndexStats();
    expect(stats.totalEntries).toBe(4);
    expect(stats.indexedFiles.has('test.log')).toBe(true);

    // Test keyword search
    const searchResults = await index.search({
      text: 'database connection',
      type: 'keyword'
    });

    expect(searchResults.length).toBeGreaterThan(0);
    expect(searchResults.some(r => r.message.toLowerCase().includes('database connection'))).toBe(true);

    // Test exact search
    const exactResults = await index.search({
      text: 'Database connection established',
      type: 'exact'
    });

    expect(exactResults.length).toBe(1);
    expect(exactResults[0].message).toBe('Database connection established');

    // Test level search
    const errorResults = await index.search({
      text: 'E',
      type: 'level'
    });

    expect(errorResults.length).toBe(1);
    expect(errorResults[0].level).toBe('E');

    // Test goroutine search
    const goroutineResults = await index.search({
      text: '7012',
      type: 'goroutine'
    });

    expect(goroutineResults.length).toBe(2);
    expect(goroutineResults.every(r => r.goroutineId === '7012')).toBe(true);
  });

  it('should handle regex search', async () => {
    const index = new LogSearchIndex();

    const logContent = `I250917 21:50:59.410399 7012 test.go:1 ⋮ [T1] Connection ID: conn_12345
I250917 21:50:59.410558 7012 test.go:2 ⋮ [T1] Connection ID: conn_67890
I250917 21:50:59.410700 7012 test.go:3 ⋮ [T1] Session started`;

    await index.indexLogFile('test.log', logContent);

    // Test regex search for connection IDs
    const regexResults = await index.search({
      text: 'conn_\\d+',
      type: 'regex'
    });

    expect(regexResults.length).toBe(2);
    expect(regexResults.every(r => r.message.includes('conn_'))).toBe(true);
  });

  it('should handle tag search', async () => {
    const index = new LogSearchIndex();

    const logContent = `I250917 21:50:59.410399 7012 test.go:1 ⋮ [T1,Vsystem,n1,client=127.0.0.1] Message 1
I250917 21:50:59.410558 7012 test.go:2 ⋮ [T2,config] Message 2
I250917 21:50:59.410700 7012 test.go:3 ⋮ [T1,Vsystem,n2] Message 3`;

    await index.indexLogFile('test.log', logContent);

    // Test tag search
    const vSystemResults = await index.search({
      text: 'Vsystem',
      type: 'tag'
    });

    expect(vSystemResults.length).toBe(2);
    expect(vSystemResults.every(r => r.tags?.includes('Vsystem'))).toBe(true);

    // Test tag with value
    const clientResults = await index.search({
      text: 'client',
      type: 'tag'
    });

    expect(clientResults.length).toBe(1);
    expect(clientResults[0].tags?.includes('client')).toBe(true);
  });
});