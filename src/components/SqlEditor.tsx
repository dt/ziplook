import { useState, useCallback, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import type { ViewerTab } from "../state/types";
import { useApp } from "../state/AppContext";
import { isDefaultTableQuery, generateQueryTitle } from "../utils/sqlParser";
import {
  setupDuckDBLanguage,
  refreshSchemaCache,
} from "../services/monacoConfig";
import { formatValue } from "../crdb/index";

interface SqlEditorProps {
  tab: ViewerTab & { kind: "sql" };
}

function SqlEditor({ tab }: SqlEditorProps) {
  const { dispatch, state } = useApp();
  const [query, setQuery] = useState(tab.query || "");
  const [results, setResults] = useState<Record<string, unknown>[] | null>(
    null,
  );
  const [columnTypes, setColumnTypes] = useState<Record<string, string> | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedCell, setExpandedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [collapsedColumns, setCollapsedColumns] = useState<Set<string>>(new Set());
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ columnName: string; value: string }[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const hasAutoRun = useRef(false);
  const wasLoading = useRef(tab.isLoading);
  const lastNotifiedQuery = useRef(tab.query);
  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const tableRef = useRef<HTMLTableElement | null>(null);
  const floatingButtonRef = useRef<HTMLButtonElement | null>(null);

  // Calculate editor height based on content
  const calculateEditorHeight = useCallback(() => {
    if (!editorRef.current) return "42px"; // 2 lines default (21px per line)

    const lineCount = editorRef.current.getModel()?.getLineCount() || 1;
    const lineHeight = 21; // Monaco default line height
    const padding = 10; // Some padding

    // Start at 2 lines, expand to show content + 1 spare line, max 10 lines
    const minLines = 2;
    const maxLines = 10;
    const targetLines = Math.max(minLines, Math.min(lineCount + 1, maxLines));

    return `${targetLines * lineHeight + padding}px`;
  }, []);

  const [editorHeight, setEditorHeight] = useState("52px"); // 2 lines + padding initially

  // Handle opening the row details modal
  const handleOpenRowDetails = useCallback((rowIndex: number) => {
    if (!results || !results[rowIndex]) return;

    const row = results[rowIndex];
    const content: { columnName: string; value: string }[] = [];

    // Convert each field to string for display
    Object.entries(row).forEach(([columnName, value]) => {
      const columnType = columnTypes ? columnTypes[columnName] : undefined;
      const stringValue = formatValue(value, columnType);
      content.push({ columnName, value: stringValue });
    });

    setModalContent(content);
    setModalOpen(true);
  }, [results, columnTypes]);

  // Copy text to clipboard with pretty-printing for JSON
  const copyToClipboard = useCallback(async (text: string, fieldName: string) => {
    try {
      // Pretty-print JSON if applicable (but only for values under 2MB)
      let textToCopy = text;
      const MAX_PRETTY_PRINT_SIZE = 2 * 1024 * 1024; // 2MB
      if (text && text.length < MAX_PRETTY_PRINT_SIZE && (text.startsWith('{') || text.startsWith('['))) {
        try {
          const parsed = JSON.parse(text);
          textToCopy = JSON.stringify(parsed, null, 2);
        } catch {
          // Not valid JSON, use as-is
        }
      }

      await navigator.clipboard.writeText(textToCopy);

      // Show success feedback
      setCopiedField(fieldName);
      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }, []);

  // Toggle column width between normal and collapsed
  const toggleColumnWidth = (columnName: string) => {
    setCollapsedColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(columnName)) {
        newSet.delete(columnName);
      } else {
        newSet.add(columnName);
      }
      return newSet;
    });
  };

  const renderCellValue = (
    value: unknown,
    rowIndex: number,
    colIndex: number,
    columnName?: string,
  ) => {
    if (value === null) return <span className="sql-null">NULL</span>;

    // Get column type for this column
    const columnType = columnName && columnTypes ? columnTypes[columnName] : undefined;

    // Use formatValue to handle Date objects properly
    const strValue = formatValue(value, columnType);

    // Check if it's a protobuf config column (still in hex)
    const isConfigColumn =
      columnName &&
      (columnName.toLowerCase() === "config" ||
        columnName.toLowerCase() === "descriptor" ||
        columnName.toLowerCase() === "payload");

    // If it's hex data, just show it truncated if too long
    if (strValue.startsWith("\\x") && isConfigColumn) {
      const displayValue =
        strValue.length > 50 ? `${strValue.slice(0, 50)}...` : strValue;
      return <span className="sql-cell-hex">{displayValue}</span>;
    }

    // Check for DistSQL diagram URLs (check first 1KB, but replace in full string)
    const sampleText = strValue.substring(0, 1024);
    if (sampleText.includes('cockroachdb.github.io/distsqlplan/decode.html')) {
      // Run replacement on the full string to capture the entire URL
      const urlMatch = strValue.match(/"(https:\/\/cockroachdb\.github\.io\/distsqlplan\/decode\.html#[^"]+)"/);
      if (urlMatch) {
        const url = urlMatch[1];
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="sql-cell-link"
            style={{ color: '#0066cc', textDecoration: 'underline' }}
          >
            distsql plan diagram
          </a>
        );
      }
    }

    // Check if it's JSON (from decoded protobuf or other sources)
    // Only attempt to parse/pretty-print if under 2MB
    const MAX_PRETTY_PRINT_SIZE = 2 * 1024 * 1024; // 2MB
    if (strValue.length < MAX_PRETTY_PRINT_SIZE && (strValue.startsWith("{") || strValue.startsWith("["))) {
      try {
        const parsed = JSON.parse(strValue);
        const prettyJson = JSON.stringify(parsed, null, 2);

        // Apply truncation logic to JSON as well
        if (prettyJson.length > 100) {
          const isExpanded =
            expandedCell?.row === rowIndex && expandedCell?.col === colIndex;
          return (
            <pre
              className="sql-cell-json"
              style={{ margin: 0, fontSize: "0.9em" }}
            >
              {isExpanded ? prettyJson : `${prettyJson.substring(0, 100)}...`}
            </pre>
          );
        } else {
          return (
            <pre
              className="sql-cell-json"
              style={{ margin: 0, fontSize: "0.9em" }}
            >
              {prettyJson}
            </pre>
          );
        }
      } catch {
        // Not valid JSON, display as string
      }
    }

    // Regular value
    if (strValue.length > 100) {
      const isExpanded =
        expandedCell?.row === rowIndex && expandedCell?.col === colIndex;
      return (
        <span className={isExpanded ? "sql-cell-expanded" : ""}>
          {isExpanded ? strValue : `${strValue.substring(0, 100)}...`}
        </span>
      );
    }

    return strValue;
  };

  const handleCellClick = (rowIndex: number, colIndex: number, value: unknown, columnName?: string) => {
    const selection = window.getSelection();
    const hasSelection = selection && selection.toString().length > 0;
    if (hasSelection) return;

    const columnType = columnName && columnTypes ? columnTypes[columnName] : undefined;
    const strValue = formatValue(value, columnType);

    // Check if it's JSON or regular text that needs truncation
    let needsTruncation = false;
    const MAX_PRETTY_PRINT_SIZE = 2 * 1024 * 1024; // 2MB
    if (strValue.length < MAX_PRETTY_PRINT_SIZE && (strValue.startsWith("{") || strValue.startsWith("["))) {
      try {
        const parsed = JSON.parse(strValue);
        const prettyJson = JSON.stringify(parsed, null, 2);
        needsTruncation = prettyJson.length > 100;
      } catch {
        needsTruncation = strValue.length > 100;
      }
    } else {
      needsTruncation = strValue.length > 100;
    }

    if (needsTruncation) {
      const isExpanded =
        expandedCell?.row === rowIndex && expandedCell?.col === colIndex;
      setExpandedCell(isExpanded ? null : { row: rowIndex, col: colIndex });
    }
  };

  const runQuery = useCallback(async () => {
    if (!query.trim()) return;

    if (!state.workerManager) {
      setError("Database not ready");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setColumnTypes(null);

    try {
      const result = await state.workerManager.executeQuery(query);
      setResults(result.data);
      setColumnTypes(result.columnTypes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Query failed");
    } finally {
      setLoading(false);
    }
  }, [query, state.workerManager]);

  const handleEditorWillMount = (monaco: Monaco) => {
    // Setup DuckDB language - global guard prevents duplicates
    setupDuckDBLanguage(monaco);
  };

  const handleEditorDidMount = async (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco,
  ) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Set initial height
    const initialHeight = calculateEditorHeight();
    setEditorHeight(initialHeight);

    // Refresh schema cache when editor mounts
    await refreshSchemaCache();

    // Add keyboard shortcut for running query
    editor.addAction({
      id: "run-query",
      label: "Run Query",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: async () => {
        const currentQuery = editor.getValue();
        if (!currentQuery.trim()) return;

        if (!state.workerManager) {
          setError("Database not ready");
          return;
        }

        setLoading(true);
        setError(null);
        setResults(null);
        setColumnTypes(null);

        try {
          const result = await state.workerManager.executeQuery(currentQuery);
          setResults(result.data);
          setColumnTypes(result.columnTypes);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Query failed");
        } finally {
          setLoading(false);
        }
      },
    });

    // Focus the editor
    editor.focus();
  };

  // Auto-run query when tab opens with a pre-filled query or when loading completes
  useEffect(() => {
    // Check if we just finished loading (transition from loading to not loading)
    const justFinishedLoading = wasLoading.current && !tab.isLoading;

    if (tab.query && !tab.isLoading) {
      // Run query if we haven't auto-run yet OR if we just finished loading
      if (!hasAutoRun.current || justFinishedLoading) {
        hasAutoRun.current = true;
        runQuery();
      }
    }

    // Update the loading state tracker
    wasLoading.current = tab.isLoading;
  }, [tab.query, tab.isLoading, runQuery]);

  // Update tab when query changes
  useEffect(() => {
    if (query !== lastNotifiedQuery.current) {
      const sourceTable = tab.sourceTable;
      const isCustom = !isDefaultTableQuery(query, sourceTable);
      const newTitle = generateQueryTitle(query, sourceTable);

      dispatch({
        type: "UPDATE_TAB",
        id: tab.id,
        updates: {
          query,
          title: newTitle,
          isCustomQuery: isCustom,
        },
      });

      lastNotifiedQuery.current = query;
    }
  }, [query, tab.id, tab.sourceTable, dispatch]);

  // Refresh schema cache when tab changes (new tables might be loaded)
  useEffect(() => {
    if (monacoRef.current) {
      refreshSchemaCache();
    }
  }, [tab.id]);

  // Show loading state if the table is being loaded
  if (tab.isLoading) {
    return (
      <div className="sql-editor">
        <div style={{
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)'
        }}>
          <span className="loading-spinner-inline" style={{ marginRight: '8px' }}></span>
          <span>Loading table {tab.sourceTable}...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="sql-editor">
      <div className="sql-editor-container">
        <button
          className="sql-run-button"
          onClick={runQuery}
          disabled={loading || !query.trim()}
          title="Run Query (Cmd/Ctrl+Enter)"
        >
          {loading ? "Running..." : "Run Query"}
        </button>
        <Editor
          height={editorHeight}
          language="duckdb-sql"
          value={query}
          onChange={(value) => {
            setQuery(value || "");
            // Update height after content change
            setTimeout(() => {
              const newHeight = calculateEditorHeight();
              setEditorHeight(newHeight);
            }, 0);
          }}
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            renderLineHighlight: "all",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 4, bottom: 4 },
            scrollbar: {
              vertical: "auto",
              horizontal: "auto",
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
            suggestOnTriggerCharacters: true,
            quickSuggestions: {
              other: true,
              comments: false,
              strings: false,
            },
            acceptSuggestionOnCommitCharacter: true,
            acceptSuggestionOnEnter: "on",
            accessibilitySupport: "off",
            autoIndent: "advanced",
            wordBasedSuggestions: "off",
            suggest: {
              showKeywords: true,
              showSnippets: false,
              showFunctions: true,
              showVariables: true,
              showClasses: true,
              showStructs: true,
              showInterfaces: true,
              showModules: true,
              showProperties: true,
              showEvents: true,
              showOperators: true,
              showUnits: true,
              showValues: true,
              showConstants: true,
              showEnums: true,
              showEnumMembers: true,
              showColors: false,
              showFiles: false,
              showReferences: false,
              showFolders: false,
              showTypeParameters: true,
              showWords: false,
              insertMode: "replace",
              filterGraceful: true,
              localityBonus: true,
              shareSuggestSelections: false,
            },
            bracketPairColorization: {
              enabled: true,
            },
            matchBrackets: "always",
            autoClosingBrackets: "always",
            autoClosingQuotes: "never",
            formatOnType: true,
            formatOnPaste: true,
            trimAutoWhitespace: true,
          }}
        />
      </div>
      <div className="sql-results">
        {error && (
          <div className="sql-error">
            <strong>Error:</strong> {error}
          </div>
        )}
        {results && (
          <div
            className="sql-table-wrapper"
            onMouseLeave={(e) => {
              // Only hide button if we're leaving the wrapper entirely
              const relatedTarget = e.relatedTarget as HTMLElement;
              if (!relatedTarget ||
                  (!relatedTarget.closest('.sql-table-wrapper') &&
                   !relatedTarget.classList.contains('sql-row-details-button'))) {
                if (floatingButtonRef.current) {
                  floatingButtonRef.current.style.display = 'none';
                }
                setHoveredRow(null);
              }
            }}
          >
            {results.length === 0 ? (
              <p>No results</p>
            ) : (
              <table
                className="sql-table"
                ref={tableRef}
              >
                <thead>
                  <tr>
                    {results[0] &&
                      Object.keys(results[0]).map((col) => {
                        const isCollapsed = collapsedColumns.has(col);
                        return (
                          <th
                            key={col}
                            className={isCollapsed ? 'collapsed-column' : ''}
                            onClick={() => toggleColumnWidth(col)}
                            style={isCollapsed ? { cursor: 'pointer' } : undefined}
                            title={isCollapsed ? `Show column: ${col}` : `Hide column: ${col}`}
                          >
                            {isCollapsed ? (
                              `${col.charAt(0)}...`
                            ) : (
                              <div className="column-header">
                                <div className="column-name">
                                  {col}
                                </div>
                              </div>
                            )}
                          </th>
                        );
                      })}
                  </tr>
                </thead>
                <tbody>
                  {results.slice(0, 1000).map((row, i) => (
                    <tr
                      key={i}
                      onMouseEnter={(e) => {
                        // Only update if it's a different row
                        if (hoveredRow !== i) {
                          setHoveredRow(i);
                          // Position the floating button
                          if (floatingButtonRef.current) {
                            const rect = e.currentTarget.getBoundingClientRect();

                            // Calculate the visible portion of the row
                            const viewportTop = 0;
                            const viewportBottom = window.innerHeight;

                            // Find the visible top and bottom of the row
                            const visibleTop = Math.max(rect.top, viewportTop);
                            const visibleBottom = Math.min(rect.bottom, viewportBottom);

                            // Center the button in the visible portion
                            let buttonTop;

                            if (rect.top >= viewportTop && rect.bottom <= viewportBottom) {
                              // Row is fully visible - center normally
                              buttonTop = rect.top + (rect.height / 2) - 10;
                            } else {
                              // Row extends beyond viewport - center in visible portion
                              const visibleCenter = visibleTop + ((visibleBottom - visibleTop) / 2);
                              buttonTop = visibleCenter - 10;

                              // Add small margins from viewport edges
                              buttonTop = Math.max(10, Math.min(buttonTop, viewportBottom - 30));
                            }

                            floatingButtonRef.current.style.top = `${buttonTop}px`;
                            floatingButtonRef.current.style.left = `${rect.left - 24}px`;
                            floatingButtonRef.current.style.display = 'block';
                          }
                        }
                      }}
                    >
                      {Object.entries(row).map(([colName, val], j) => {
                        const columnType = columnTypes ? columnTypes[colName] : undefined;
                        const strValue = formatValue(val, columnType);
                        const isTruncatable = strValue.length > 100;
                        return (
                          <td
                            key={j}
                            className={collapsedColumns.has(colName) ? 'collapsed-column' : ''}
                            onClick={() => handleCellClick(i, j, val, colName)}
                            style={isTruncatable ? { cursor: 'pointer' } : undefined}
                          >
                            {renderCellValue(val, i, j, colName)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {results.length > 1000 && (
              <p className="sql-truncated">
                Showing first 1000 of {results.length} rows
              </p>
            )}
          </div>
        )}
      </div>

      {/* Floating button for row details */}
      <style>{`
        .sql-row-details-button::before {
          content: '';
          position: absolute;
          top: -15px;
          left: -15px;
          right: -15px;
          bottom: -15px;
          z-index: -1;
        }
      `}</style>
      <button
        ref={floatingButtonRef}
        className="sql-row-details-button"
        style={{
          position: 'fixed',
          display: 'none',
          zIndex: 1000,
          width: '20px',
          height: '20px',
          padding: '0',
          fontSize: '14px',
          lineHeight: '20px',
          textAlign: 'center',
          backgroundColor: '#4a4a4a',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          transform: 'scale(1)',
        }}
        onMouseEnter={(e) => {
          // Grow by 40% when hovering
          e.currentTarget.style.transform = 'scale(1.4)';
          e.currentTarget.style.backgroundColor = '#5a5a5a';
        }}
        onMouseLeave={(e) => {
          // Shrink back to normal size
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.backgroundColor = '#4a4a4a';
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (hoveredRow !== null) {
            handleOpenRowDetails(hoveredRow);
          }
        }}
        title="View row details (fullscreen)"
      >
        ⤢
      </button>

      {/* Modal for row details */}
      {modalOpen && (
        <div
          className="sql-row-modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="sql-row-modal"
            style={{
              backgroundColor: '#2a2a2a',
              border: '2px solid #444',
              borderRadius: '8px',
              padding: '8px', // Small padding for the outer container
              width: '90%',
              maxWidth: '90%',
              height: '90vh',
              maxHeight: '90vh',
              position: 'relative',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fixed header with title and close button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderBottom: '1px solid #444',
                marginBottom: '8px',
              }}
            >
              <h3 style={{ margin: 0, color: '#e0e0e0' }}>Row Details</h3>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#999',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '0',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={() => setModalOpen(false)}
                title="Close"
              >
                ×
              </button>
            </div>

            {/* Inner scrollable container */}
            <div
              style={{
                flex: 1,
                overflow: 'auto',
                padding: '12px',
                paddingRight: '20px',
              }}
            >
              <div className="sql-row-modal-content">
                {modalContent.map((field, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: '16px',
                      borderBottom: index < modalContent.length - 1 ? '1px solid #444' : 'none',
                      paddingBottom: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <h4 style={{ margin: 0, color: '#b0b0b0', fontSize: '14px', flex: 1 }}>
                        {field.columnName}
                      </h4>
                      <button
                        style={{
                          padding: '4px 8px',
                          fontSize: '12px',
                          backgroundColor: copiedField === field.columnName ? '#2a5a2a' : '#3a3a3a',
                          color: copiedField === field.columnName ? '#90ee90' : '#e0e0e0',
                          border: `1px solid ${copiedField === field.columnName ? '#3a7a3a' : '#555'}`,
                          borderRadius: '4px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                        onClick={() => copyToClipboard(field.value, field.columnName)}
                        title={`Copy ${field.columnName}`}
                      >
                        {copiedField === field.columnName ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <div
                      style={{
                        padding: '8px',
                        backgroundColor: '#1e1e1e',
                        borderRadius: '4px',
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        color: '#d0d0d0',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                      }}
                    >
                      {field.value ? (
                        (() => {
                          // First, pretty-print if it's JSON (but only if under 2MB)
                          let displayValue = field.value;
                          const MAX_PRETTY_PRINT_SIZE = 2 * 1024 * 1024; // 2MB
                          if (field.value.length < MAX_PRETTY_PRINT_SIZE &&
                              (field.value.startsWith('{') || field.value.startsWith('['))) {
                            try {
                              const parsed = JSON.parse(field.value);
                              displayValue = JSON.stringify(parsed, null, 2);
                            } catch {
                              // Not valid JSON, use as-is
                            }
                          }

                          // Then linkify URLs in the (possibly pretty-printed) content
                          const urlRegex = /(https?:\/\/[^\s"',}\]()<>]+)/g;
                          const parts = displayValue.split(urlRegex);

                          return parts.map((part, i) => {
                            if (part.match(urlRegex)) {
                              return (
                                <a
                                  key={i}
                                  href={part}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: '#4a9eff', textDecoration: 'underline' }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {part}
                                </a>
                              );
                            }
                            return part;
                          });
                        })()
                      ) : (
                        <span style={{ color: '#666', fontStyle: 'italic' }}>NULL</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SqlEditor;
