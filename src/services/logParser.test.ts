import { describe, it, expect } from "vitest";
import { LogParser } from "./logParser";

describe("LogParser", () => {
  const parser = new LogParser();

  const testLines = [
    'I250917 21:50:59.410399 7012 4@util/log/event_log.go:90 ⋮ [T1,Vsystem,n1,client=127.0.0.1:39464,hostnossl,user=root] 1 {"Timestamp":1758145859410395744,"EventType":"client_authentication_ok","InstanceID":1,"Network":"tcp","RemoteAddress":"‹127.0.0.1:39464›","SessionID":"18663058157652af0000000000000001","Transport":"hostnossl","User":"‹root›","SystemIdentity":"‹root›","Method":"insecure"}',
    "I250917 21:50:59.410558 7012 util/log/file_sync_buffer.go:237 ⋮ [T1,config] file created at: 2025/09/17 21:50:59",
    "I250917 21:50:59.410573 7012 util/log/file_sync_buffer.go:237 ⋮ [T1,config] running on machine: ‹david-test-0001›",
    "I250917 21:50:59.410585 7012 util/log/file_sync_buffer.go:237 ⋮ [T1,config] binary: CockroachDB CCL v25.4.0-alpha.2-dev-5f5c6a65f739d6b247afec3411ed1284266bd1f7 (x86_64-pc-linux-gnu, built 2025/09/17 06:08:24, go1.23.12 X:nocoverageredesign)",
    "    at DatabasePool.connect(pool.js:45)",
    "    at async UserService.getUser(user.js:12)",
    'E250917 22:23:06.174161 95149 4@util/log/event_log.go:90 ⋮ [T1,Vsystem,n1,client=10.142.0.19:40262,hostnossl,user=root] 4 {"Timestamp":1758147786174157557,"EventType":"client_authentication_error","InstanceID":1,"Network":"tcp","RemoteAddress":"‹10.142.0.19:40262›","SessionID":"18663218b188875e0000000000000001","Transport":"hostnossl","User":"‹root›","SystemIdentity":"‹root›","Method":"insecure"}',
  ];

  const testContent = testLines.join("\n");

  it("should parse CockroachDB log entries correctly", () => {
    const { entries, stats } = parser.parseLogFile(testContent, "test.log");

    expect(entries).toHaveLength(5); // 4 single-line entries + 1 multi-line entry
    expect(stats.totalLines).toBe(7);
    expect(stats.parsedEntries).toBe(5);
    expect(stats.multiLineEntries).toBe(2); // Two continuation lines
  });

  it("should parse log entry with counter correctly", () => {
    const singleLine =
      'I250917 21:50:59.410399 7012 4@util/log/event_log.go:90 ⋮ [T1,Vsystem,n1] 1 {"test": "message"}';
    const { entries } = parser.parseLogFile(singleLine, "test.log");

    expect(entries).toHaveLength(1);
    const entry = entries[0];

    expect(entry.level).toBe("I");
    expect(entry.timestamp).toBe("250917 21:50:59.410399");
    expect(entry.goroutineId).toBe("7012");
    expect(entry.channel).toBe("4");
    expect(entry.file).toBe("util/log/event_log.go");
    expect(entry.line).toBe(90);
    expect(entry.tags).toEqual(["T1", "Vsystem", "n1"]);
    expect(entry.message).toBe('{"test": "message"}');
  });

  it("should parse log entry without counter correctly", () => {
    const singleLine =
      "I250917 21:50:59.410558 7012 util/log/file_sync_buffer.go:237 ⋮ [T1,config] file created at: 2025/09/17 21:50:59";
    const { entries } = parser.parseLogFile(singleLine, "test.log");

    expect(entries).toHaveLength(1);
    const entry = entries[0];

    expect(entry.level).toBe("I");
    expect(entry.timestamp).toBe("250917 21:50:59.410558");
    expect(entry.goroutineId).toBe("7012");
    expect(entry.channel).toBeUndefined();
    expect(entry.file).toBe("util/log/file_sync_buffer.go");
    expect(entry.line).toBe(237);
    expect(entry.tags).toEqual(["T1", "config"]);
    expect(entry.message).toBe("file created at: 2025/09/17 21:50:59");
  });

  it("should parse tags with key-value pairs correctly", () => {
    const singleLine =
      "I250917 21:50:59.410399 7012 4@util/log/event_log.go:90 ⋮ [T1,Vsystem,n1,client=127.0.0.1:39464,hostnossl,user=root] 1 test message";
    const { entries } = parser.parseLogFile(singleLine, "test.log");

    expect(entries).toHaveLength(1);
    const entry = entries[0];

    expect(entry.tags).toEqual([
      "T1",
      "Vsystem",
      "n1",
      "client",
      "hostnossl",
      "user",
    ]);
    expect(entry.tagMap).toEqual({
      client: "127.0.0.1:39464",
      user: "root",
    });
  });

  it("should handle multi-line log entries", () => {
    const multiLineContent = [
      "I250917 21:50:59.410585 7012 util/log/file_sync_buffer.go:237 ⋮ [T1,config] binary: CockroachDB",
      "    at DatabasePool.connect(pool.js:45)",
      "    at async UserService.getUser(user.js:12)",
      "I250917 21:50:59.410590 7012 util/log/file_sync_buffer.go:238 ⋮ [T1,config] next entry",
    ].join("\n");

    const { entries } = parser.parseLogFile(multiLineContent, "test.log");

    expect(entries).toHaveLength(2);

    const firstEntry = entries[0];
    expect(firstEntry.startLine).toBe(1);
    expect(firstEntry.endLine).toBe(3);
    expect(firstEntry.message).toContain("binary: CockroachDB");
    expect(firstEntry.message).toContain("at DatabasePool.connect(pool.js:45)");
    expect(firstEntry.message).toContain(
      "at async UserService.getUser(user.js:12)",
    );

    const secondEntry = entries[1];
    expect(secondEntry.startLine).toBe(4);
    expect(secondEntry.endLine).toBe(4);
    expect(secondEntry.message).toBe("next entry");
  });

  it("should handle unparseable lines as standalone entries", () => {
    const mixedContent = [
      "This is an unparseable line",
      "I250917 21:50:59.410585 7012 util/log/file_sync_buffer.go:237 ⋮ [T1,config] valid entry",
      "Another unparseable line",
    ].join("\n");

    const { entries, stats } = parser.parseLogFile(mixedContent, "test.log");

    expect(entries).toHaveLength(3);
    expect(stats.unparseableLines).toBe(2);

    expect(entries[0].unparseable).toBe(true);
    expect(entries[0].message).toBe("This is an unparseable line");

    expect(entries[1].unparseable).toBeUndefined();
    expect(entries[1].level).toBe("I");

    expect(entries[2].unparseable).toBe(true);
    expect(entries[2].message).toBe("Another unparseable line");
  });

  it("should normalize messages correctly", () => {
    const testCases = [
      {
        input: "session_id=abc123 user_id=456",
        expected: "session_id=[ID] user_id=[ID]",
      },
      {
        input: "UUID: 12345678-1234-1234-1234-123456789abc",
        expected: "UUID: [UUID]",
      },
      {
        input: "Connect to 192.168.1.1:5432",
        expected: "Connect to [IP:PORT]",
      },
      {
        input: "Memory address: 0xdeadbeef",
        expected: "Memory address: [ADDR]",
      },
      {
        input: "Timestamp: 2024-01-01T12:00:00",
        expected: "Timestamp: [TIMESTAMP]",
      },
    ];

    testCases.forEach(({ input, expected }) => {
      const normalized = LogParser.normalizeMessage(input);
      expect(normalized).toBe(expected);
    });
  });

  it("should extract different log levels correctly", () => {
    const testCases = [
      {
        line: "I250917 21:50:59.410558 7012 test.go:1 ⋮ [T1] info message",
        level: "I",
      },
      {
        line: "W250917 21:50:59.410558 7012 test.go:1 ⋮ [T1] warning message",
        level: "W",
      },
      {
        line: "E250917 21:50:59.410558 7012 test.go:1 ⋮ [T1] error message",
        level: "E",
      },
      {
        line: "F250917 21:50:59.410558 7012 test.go:1 ⋮ [T1] fatal message",
        level: "F",
      },
    ];

    testCases.forEach(({ line, level }) => {
      const { entries } = parser.parseLogFile(line, "test.log");
      expect(entries).toHaveLength(1);
      expect(entries[0].level).toBe(level);
    });
  });

  it("should track goroutine IDs correctly", () => {
    const testContent = [
      "I250917 21:50:59.410558 7012 test.go:1 ⋮ [T1] message from goroutine 7012",
      "I250917 21:50:59.410559 8045 test.go:2 ⋮ [T1] message from goroutine 8045",
      "I250917 21:50:59.410560 7012 test.go:3 ⋮ [T1] another message from goroutine 7012",
    ].join("\n");

    const { entries } = parser.parseLogFile(testContent, "test.log");

    expect(entries).toHaveLength(3);
    expect(entries[0].goroutineId).toBe("7012");
    expect(entries[1].goroutineId).toBe("8045");
    expect(entries[2].goroutineId).toBe("7012");
  });
});
