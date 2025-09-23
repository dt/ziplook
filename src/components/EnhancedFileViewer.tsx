import { useEffect, useState, memo, useCallback, useRef } from "react";
import Editor, { type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import type { ViewerTab } from "../state/types";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { matchesFilter } from "../utils/filterUtils";
import { useApp } from "../state/AppContext";
import { setupLogLanguage } from "../services/monacoConfig";
import { detectBinary, getFileTypeDescription } from "../utils/binaryDetection";

interface FileViewerProps {
  tab: ViewerTab & { kind: "file" };
}

// Debounce helper
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function EnhancedFileViewer({ tab }: FileViewerProps) {
  const { dispatch, state } = useApp();

  // File loading state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");
  const [progress, setProgress] = useState({ loaded: 0, total: 0, percent: 0 });
  const [isStreaming, setIsStreaming] = useState(false);

  // Binary detection state
  const [binaryDetected, setBinaryDetected] = useState(false);
  const [binaryReason, setBinaryReason] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [userOverrideBinary, setUserOverrideBinary] = useState(false);

  // Filter state
  const [filterText, setFilterText] = useState(tab.filterText || "");
  const [contextLines, setContextLines] = useState("");
  const [visibleLineCount, setVisibleLineCount] = useState(0);
  const [totalLineCount, setTotalLineCount] = useState(0);

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const abortRef = useRef<(() => void) | null>(null);
  const filterInputRef = useRef<HTMLInputElement>(null);
  const decorationIds = useRef<string[]>([]);
  const languageRef = useRef<string>("plaintext");
  const initialFilterRef = useRef<{ text: string; context: number } | null>(
    null,
  );
  const applyFilterRef = useRef<
    ((query: string, context?: number) => void) | null
  >(null);
  const pendingLineNumber = useRef<number | null>(null);

  // Get original filename from filesIndex (never changes, unaffected by tab renaming)
  const originalFile = state.filesIndex[tab.fileId];
  const originalFileName =
    originalFile?.path || originalFile?.name || tab.title;

  // Detect file type and language
  const getLanguage = useCallback((fileName: string): string => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      json: "json",
      jsonl: "json",
      ndjson: "json",
      html: "html",
      htm: "html",
      css: "css",
      scss: "scss",
      sass: "sass",
      less: "less",
      xml: "xml",
      yaml: "yaml",
      yml: "yaml",
      md: "markdown",
      markdown: "markdown",
      py: "python",
      rb: "ruby",
      go: "go",
      java: "java",
      c: "c",
      cpp: "cpp",
      cc: "cpp",
      cxx: "cpp",
      h: "c",
      hpp: "cpp",
      cs: "csharp",
      php: "php",
      rs: "rust",
      toml: "toml",
      ini: "ini",
      cfg: "ini",
      conf: "ini",
      sql: "sql",
      sh: "shell",
      bash: "shell",
      zsh: "shell",
      fish: "shell",
      ps1: "powershell",
      psm1: "powershell",
      bat: "bat",
      cmd: "bat",
      dockerfile: "dockerfile",
      makefile: "makefile",
      mk: "makefile",
      r: "r",
      R: "r",
      swift: "swift",
      kt: "kotlin",
      scala: "scala",
      vim: "vim",
      lua: "lua",
      perl: "perl",
      pl: "perl",
      groovy: "groovy",
      gradle: "groovy",
      proto: "protobuf",
      graphql: "graphql",
      gql: "graphql",
      diff: "diff",
      patch: "diff",
      log: "log",
      txt: "plaintext",
      text: "plaintext",
      csv: "plaintext",
      tsv: "plaintext",
    };

    return languageMap[ext || ""] || "plaintext";
  }, []);

  const language = getLanguage(originalFileName);
  languageRef.current = language; // Keep ref in sync

  // Store initial filter state
  if (filterText) {
    console.log(
      "📄 FileViewer: Initial filter detected:",
      filterText,
      "context:",
      contextLines,
    );
    initialFilterRef.current = {
      text: filterText,
      context: parseInt(contextLines) || 0,
    };
  }

  // DEBUG: Uncomment to test with different language
  // const language = 'javascript'; // Force javascript highlighting for testing

  // Apply filter/grep functionality
  const applyFilter = useCallback((query: string, context: number = 0) => {
    console.log("📄 FileViewer: Applying filter:", query, "context:", context);
    if (!editorRef.current || !monacoRef.current) {
      console.log(
        "📄 FileViewer: Editor or Monaco not available for filtering",
      );
      return;
    }

    const model = editorRef.current.getModel();
    if (!model) {
      return;
    }

    // Reset if empty
    if (!query) {
      // Clear hidden areas
      if ((editorRef.current as any).setHiddenAreas) {
        (editorRef.current as any).setHiddenAreas([]);
      }
      decorationIds.current = editorRef.current.deltaDecorations(
        decorationIds.current,
        [],
      );
      setVisibleLineCount(model?.getLineCount() || 0); // Show all lines
      return;
    }

    // Use our boolean expression filter to test each line
    const visible = new Set<number>();
    const matchingLines: Array<{ lineNumber: number; range: any }> = [];
    const maxLine = model.getLineCount();

    // Test each line against the boolean expression
    for (let lineNum = 1; lineNum <= maxLine; lineNum++) {
      const lineContent = model.getLineContent(lineNum);

      if (matchesFilter(lineContent, query)) {
        // Add the line and context lines
        const start = Math.max(1, lineNum - context);
        const end = Math.min(maxLine, lineNum + context);
        for (let ln = start; ln <= end; ln++) {
          visible.add(ln);
        }

        // Track for highlighting
        matchingLines.push({
          lineNumber: lineNum,
          range: new monacoRef.current.Range(
            lineNum,
            1,
            lineNum,
            lineContent.length + 1,
          ),
        });
      }
    }

    // Always keep line 1 visible (never hide it)
    visible.add(1);

    // Build hidden ranges for setHiddenAreas
    const hiddenRanges: any[] = [];
    let runStart: number | null = null;

    for (let ln = 1; ln <= maxLine; ln++) {
      const shouldHide = !visible.has(ln);
      if (shouldHide && runStart === null) {
        runStart = ln;
      }
      if ((!shouldHide || ln === maxLine) && runStart !== null) {
        const runEnd = shouldHide && ln === maxLine ? ln : ln - 1;
        if (runEnd >= runStart) {
          hiddenRanges.push(
            new monacoRef.current.Range(runStart, 1, runEnd, 1),
          );
        }
        runStart = null;
      }
    }

    // Use setHiddenRanges to hide non-matching lines
    if ((editorRef.current as any).setHiddenAreas) {
      (editorRef.current as any).setHiddenAreas(hiddenRanges);
    }

    // Add highlight decorations for matching lines
    const highlightDecorations = matchingLines.map((m) => ({
      range: m.range,
      options: {
        inlineClassName: "grep-highlight",
        overviewRuler: {
          position: monacoRef.current!.editor.OverviewRulerLane.Center,
          color: "rgba(255, 200, 0, 0.8)",
        },
      },
    }));

    decorationIds.current = editorRef.current.deltaDecorations(
      decorationIds.current,
      highlightDecorations,
    );

    // Update visible line count
    const actualMatches = matchingLines.length > 0 ? visible.size : 0;
    setVisibleLineCount(actualMatches);

    // DISABLED: Reveal first match - testing if this clears hidden areas
    /*if (matchingLines.length > 0) {
      editorRef.current.revealRangeNearTop(matchingLines[0].range);
    }*/
  }, []);

  // Keep applyFilter ref in sync
  applyFilterRef.current = applyFilter;

  // Update tab title when filter changes
  const updateTabTitle = useCallback(
    (filterText: string) => {
      const baseTitle = tab.title.replace(/ \(filtered\)$/, ""); // Remove existing filter suffix
      const newTitle = filterText ? `${baseTitle} (filtered)` : baseTitle;
      const isFiltered = !!filterText;

      dispatch({
        type: "UPDATE_TAB",
        id: tab.id,
        updates: {
          title: newTitle,
          isFiltered,
          filterText: filterText || undefined,
        },
      });
    },
    [tab.id, tab.title, dispatch],
  );

  // Debounced filter application
  const debouncedApplyFilter = useRef(
    debounce((query: string, context: number) => {
      applyFilter(query, context);
      updateTabTitle(query);
    }, 150),
  ).current;

  // Load file content
  const loadFile = useCallback(async () => {
    setLoading(true);
    setError(null);
    setContent("");
    setProgress({ loaded: 0, total: 0, percent: 0 });
    setIsStreaming(true);
    setBinaryDetected(false);
    setBinaryReason("");
    setFileType("");
    setUserOverrideBinary(false);

    try {
      // Get file path from filesIndex
      const fileEntry = state.filesIndex[tab.fileId];
      if (!fileEntry) {
        throw new Error("File not found in index");
      }

      if (!state.workerManager) {
        throw new Error("WorkerManager not available");
      }

      // First check by extension
      const extensionResult = detectBinary(fileEntry.path);
      if (extensionResult.isBinary) {
        setBinaryDetected(true);
        setBinaryReason(extensionResult.reason || "Binary file detected");
        setFileType(getFileTypeDescription(extensionResult, fileEntry.path));
        setLoading(false);
        setIsStreaming(false);
        return;
      }

      let accumulatedContent = "";
      let hasCheckedContent = false;
      const startTime = Date.now();
      let lastUpdateTime = startTime;
      let hasSetInitialContent = false;

      await state.workerManager.readFileStream(
        fileEntry.path,
        (
          chunk: string,
          progressInfo: { loaded: number; total: number; done: boolean },
        ) => {
          accumulatedContent += chunk;

          // Check content for binary on first chunk (if extension didn't already detect it)
          if (!hasCheckedContent && accumulatedContent.length >= 1024) {
            const contentResult = detectBinary(
              fileEntry.path,
              accumulatedContent,
            );
            if (contentResult.isBinary) {
              setBinaryDetected(true);
              setBinaryReason(
                contentResult.reason || "Binary content detected",
              );
              setFileType(
                getFileTypeDescription(contentResult, fileEntry.path),
              );
              setLoading(false);
              setIsStreaming(false);
              return; // Stop processing
            }
            hasCheckedContent = true;
          }

          const percent =
            progressInfo.total > 0
              ? Math.round((progressInfo.loaded / progressInfo.total) * 100)
              : 0;
          setProgress({
            loaded: progressInfo.loaded,
            total: progressInfo.total,
            percent,
          });

          const now = Date.now();
          // Set initial content immediately, then throttle to every 3 seconds, then final content
          const shouldUpdate =
            !hasSetInitialContent ||
            now - lastUpdateTime > 3000 ||
            progressInfo.done;

          if (shouldUpdate) {
            console.log(
              "📄 FileViewer: Setting content, accumulated length:",
              accumulatedContent.length,
              "done:",
              progressInfo.done,
            );
            setContent(accumulatedContent);
            lastUpdateTime = now;
            hasSetInitialContent = true;

            // Try pending line navigation after content update
            if (pendingLineNumber.current) {
              setTimeout(() => {
                if (pendingLineNumber.current) {
                  navigateToLine(pendingLineNumber.current);
                }
              }, 100); // Small delay to let Monaco process the content update
            }
          }

          if (progressInfo.done) {
            console.log(
              "📄 FileViewer: Streaming complete, final content length:",
              accumulatedContent.length,
            );
            setLoading(false);
            setIsStreaming(false);
            abortRef.current = null;

            // Final retry for pending line navigation
            if (pendingLineNumber.current) {
              setTimeout(() => {
                if (pendingLineNumber.current) {
                  console.log(
                    "📄 FileViewer: Final retry for line navigation:",
                    pendingLineNumber.current,
                  );
                  navigateToLine(pendingLineNumber.current);
                }
              }, 200); // Slightly longer delay for final attempt
            }
          }
        },
      );
    } catch (err) {
      console.error("Failed to read file:", err);
      setError(
        `Failed to read file: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
      setLoading(false);
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [tab.fileId, state.filesIndex, state.workerManager]);

  useEffect(() => {
    if (!content && !loading && state.workerManager) {
      loadFile();
    }

    return () => {
      if (abortRef.current) {
        abortRef.current();
      }
    };
  }, [loadFile, content, loading, state.workerManager]);

  const handleBeforeMount = useCallback((monaco: Monaco) => {
    // Setup log language if this is a log file
    if (languageRef.current === "log") {
      setupLogLanguage(monaco);
    }
  }, []); // No dependencies - stable callback

  const handleEditorDidMount = useCallback(
    (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;

      const model = editor.getModel();
      if (model) {
        // Force set the language if it's wrong
        if (languageRef.current === "log" && model.getLanguageId() !== "log") {
          monaco.editor.setModelLanguage(model, "log");
        }
      }

      // Format JSON files
      if (languageRef.current === "json") {
        const currentContent = editor.getValue();
        if (currentContent) {
          try {
            const parsed = JSON.parse(currentContent);
            const formatted = JSON.stringify(parsed, null, 2);
            if (formatted !== currentContent) {
              editor.setValue(formatted);
            }
          } catch {
            // Not valid JSON, leave as is
          }
        }
      }

      // Configure JSON validation
      if (languageRef.current === "json") {
        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
          validate: true,
          schemas: [],
          allowComments: true,
          trailingCommas: "ignore",
        });
      }

      // Set initial line counts
      if (model) {
        const lineCount = model.getLineCount();
        setTotalLineCount(lineCount);
        setVisibleLineCount(lineCount);
      }

      // Jump to specific line if provided (using the unified navigation function with retry logic)
      if (tab.lineNumber && tab.lineNumber > 0) {
        // Small delay to ensure model is ready
        setTimeout(() => navigateToLine(tab.lineNumber!), 50);
      }

      // Apply initial filter if any
      if (initialFilterRef.current && applyFilterRef.current) {
        const { text, context } = initialFilterRef.current;
        applyFilterRef.current(text, context);
        initialFilterRef.current = null; // Clear after use
      }
    },
    [tab.lineNumber],
  ); // Include lineNumber in dependencies

  // Navigation function that can be called directly
  const navigateToLine = useCallback((lineNumber: number) => {
    if (!editorRef.current || !monacoRef.current || lineNumber <= 0) {
      // Store pending line number for retry when editor/content is ready
      pendingLineNumber.current = lineNumber;
      return false;
    }

    const editor = editorRef.current;
    const monaco = monacoRef.current;
    const model = editor.getModel();

    if (!model) {
      // Store pending line number for retry when model is ready
      pendingLineNumber.current = lineNumber;
      return false;
    }

    const currentLineCount = model.getLineCount();
    if (lineNumber > currentLineCount) {
      // Line not loaded yet, store for retry
      pendingLineNumber.current = lineNumber;
      console.log(
        "📄 FileViewer: Line",
        lineNumber,
        "not yet loaded (current max:",
        currentLineCount,
        "), will retry",
      );
      return false;
    }

    const targetLine = Math.min(lineNumber, currentLineCount);
    const isExactLine = targetLine === lineNumber; // Are we navigating to the exact requested line?

    // Jump to the line
    editor.setPosition({ lineNumber: targetLine, column: 1 });
    editor.revealLineInCenter(targetLine);

    // Only add visual effects if we're at the exact target line
    if (isExactLine) {
      // Highlight the target line briefly
      const range = new monaco.Range(
        targetLine,
        1,
        targetLine,
        model.getLineMaxColumn(targetLine) || 1,
      );
      const decorationIds = editor.deltaDecorations(
        [],
        [
          {
            range,
            options: {
              className: "line-highlight-flash",
              isWholeLine: true,
            },
          },
        ],
      );

      // Animate the line number - try multiple selectors to find the right element
      setTimeout(() => {
        const editorDom = editor.getDomNode();
        if (!editorDom) return;

        // Try different selectors for Monaco's line number elements
        const selectors = [
          `.margin .line-numbers [data-line-number="${targetLine}"]`,
          `.margin .line-numbers .cldr:nth-child(${targetLine})`,
          `.margin .line-numbers div:nth-child(${targetLine})`,
          `.margin .margin-view-overlays div:nth-child(${targetLine})`,
          `.margin-view-overlays .current-line`,
          `.line-numbers .active-line-number`,
        ];

        let lineNumberElement = null;
        for (const selector of selectors) {
          lineNumberElement = editorDom.querySelector(selector);
          if (lineNumberElement) break;
        }

        // If we can't find the specific line number, try to find all line number elements
        if (!lineNumberElement) {
          const allLineNumbers = editorDom.querySelectorAll(
            ".margin .line-numbers div",
          );
          if (allLineNumbers && allLineNumbers[targetLine - 1]) {
            lineNumberElement = allLineNumbers[targetLine - 1];
          }
        }

        if (lineNumberElement && lineNumberElement instanceof HTMLElement) {
          lineNumberElement.style.animation = "lineNumberPop 0.5s ease-out";
          lineNumberElement.style.transformOrigin = "center";
          setTimeout(() => {
            lineNumberElement.style.animation = "";
            lineNumberElement.style.transformOrigin = "";
          }, 500);
        }
      }, 200); // Delay to ensure DOM is ready

      // Remove highlight after 3 seconds
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.deltaDecorations(decorationIds, []);
        }
      }, 3000);

      // Clear pending navigation since we succeeded with the exact line
      pendingLineNumber.current = null;
      console.log(
        "📄 FileViewer: Successfully navigated to exact line",
        lineNumber,
      );
    } else {
      console.log(
        "📄 FileViewer: Navigated to partial line",
        targetLine,
        "waiting for line",
        lineNumber,
      );
    }

    return isExactLine;
  }, []);

  // Handle line navigation when lineNumber changes
  useEffect(() => {
    if (tab.lineNumber && tab.lineNumber > 0) {
      navigateToLine(tab.lineNumber);
    }
  }, [tab.lineNumber, navigateToLine]);

  // Also navigate when the tab becomes active (in case we missed the lineNumber change)
  useEffect(() => {
    if (tab.lineNumber && tab.lineNumber > 0) {
      // Small delay to ensure editor is ready
      setTimeout(() => {
        navigateToLine(tab.lineNumber!); // Non-null assertion since we checked above
      }, 100);
    }
  }, []); // Only run once when the component mounts

  // Note: We don't need to update content when using defaultValue + keepCurrentModel
  // because the model is stable and content updates would clear hidden areas

  // Handle filter input change
  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFilterText(value);
      const numericContext =
        contextLines === "" ? 0 : parseInt(contextLines, 10);
      debouncedApplyFilter(value, numericContext);
    },
    [contextLines, debouncedApplyFilter],
  );

  // Open search with keyboard shortcut
  const openSearch = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.trigger("keyboard", "actions.find", null);
    }
  }, []);

  // Focus filter input
  const focusFilter = useCallback(() => {
    if (filterInputRef.current) {
      filterInputRef.current.focus();
      filterInputRef.current.select();
    }
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    { key: "f", cmd: true, handler: openSearch },
    { key: "/", handler: focusFilter },
  ]);

  // Loading state
  if (loading && !content) {
    return (
      <div className="file-viewer loading">
        <div className="loading-container">
          <div className="loading-message">Loading {tab.title}...</div>
          {progress.total > 0 && (
            <>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
              <div className="progress-text">
                {formatFileSize(progress.loaded)} /{" "}
                {formatFileSize(progress.total)} ({progress.percent}%)
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="file-viewer error">
        <div className="error-message">
          <h3>Error loading file</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Show binary file warning
  if (binaryDetected && !userOverrideBinary) {
    return (
      <div className="file-viewer binary-warning">
        <div className="binary-warning-container">
          <div className="binary-warning-icon">⚠️</div>
          <div className="binary-warning-content">
            <h3>Binary File Detected</h3>
            <p>
              <strong>{fileType}</strong>
            </p>
            <p className="binary-reason">{binaryReason}</p>
            <p>
              This file appears to contain binary data and may not display
              correctly as text.
            </p>
            <div className="binary-warning-actions">
              <button
                className="btn btn-primary"
                onClick={() => setUserOverrideBinary(true)}
              >
                Open Anyway
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  // Close the tab
                  dispatch({ type: "CLOSE_TAB", id: tab.id });
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Only load Monaco/Editor for non-binary files
  if (binaryDetected && userOverrideBinary) {
    // User chose to override binary warning, show a warning but still render editor
    return (
      <div className="enhanced-file-viewer">
        <div className="binary-override-warning">
          <span className="warning-icon">⚠️</span>
          <span>
            Displaying binary file as text - content may not render correctly
          </span>
        </div>

        {/* Filter controls */}
        <div className="file-controls">
          <div className="filter-controls">
            <input
              ref={filterInputRef}
              type="text"
              className="filter-input"
              placeholder="Filter: word +include -exclude (/ to focus)"
              value={filterText}
              onChange={handleFilterChange}
            />
            <input
              type="text"
              className="context-input"
              placeholder="plus context lines"
              value={contextLines}
              onChange={(e) => {
                const value = e.target.value;
                // Only allow empty string or numeric input
                if (value === "" || /^\d+$/.test(value)) {
                  setContextLines(value);
                  const numericValue = value === "" ? 0 : parseInt(value, 10);
                  debouncedApplyFilter(filterText, numericValue);
                }
              }}
              style={{ width: "120px" }}
            />
            {filterText && (
              <span className="filter-status">
                {visibleLineCount.toLocaleString()} /{" "}
                {totalLineCount.toLocaleString()} lines
              </span>
            )}
          </div>
        </div>

        <Editor
          height="calc(100% - 70px)" // Adjust for warning banner
          language="plaintext" // Force plaintext for binary files
          value={content}
          path={tab.fileId}
          keepCurrentModel={true}
          theme="vs-dark"
          beforeMount={handleBeforeMount}
          onMount={handleEditorDidMount}
          options={{
            readOnly: true,
            minimap: { enabled: false }, // Disable minimap for binary files
            scrollBeyondLastLine: false,
            fontSize: 13,
            fontFamily: 'Monaco, Menlo, "Courier New", monospace',
            automaticLayout: true,
            wordWrap: "off",
            lineNumbers: "on",
            renderLineHighlight: "all",
            scrollbar: {
              vertical: "visible",
              horizontal: "visible",
              useShadows: false,
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
            folding: false, // Disable folding for binary files
            quickSuggestions: false,
            suggestOnTriggerCharacters: false,
            links: false,
            contextmenu: true,
            selectionHighlight: false,
            occurrencesHighlight: "off",
            formatOnPaste: false,
            formatOnType: false,
            renderValidationDecorations: "off",
            smoothScrolling: true,
            cursorBlinking: "blink",
            cursorSmoothCaretAnimation: "off",
            unicodeHighlight: {
              ambiguousCharacters: false,
              invisibleCharacters: false,
            },
            find: {
              seedSearchStringFromSelection: "always",
              autoFindInSelection: "never",
              addExtraSpaceOnTop: true,
            },
          }}
        />

        {/* Streaming indicator */}
        {isStreaming && (
          <div className="streaming-footer">
            <div className="streaming-status">
              <span className="loading-spinner-small" />
              <span>Streaming content... {progress.percent}% complete</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="enhanced-file-viewer">
      {/* Filter controls */}
      <div className="file-controls">
        <div className="filter-controls">
          <input
            ref={filterInputRef}
            type="text"
            className="filter-input"
            placeholder="Filter: word +include -exclude (/ to focus)"
            value={filterText}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            className="context-input"
            placeholder="plus context lines"
            value={contextLines}
            onChange={(e) => {
              const value = e.target.value;
              // Only allow empty string or numeric input
              if (value === "" || /^\d+$/.test(value)) {
                setContextLines(value);
                const numericValue = value === "" ? 0 : parseInt(value, 10);
                debouncedApplyFilter(filterText, numericValue);
              }
            }}
            style={{ width: "120px" }}
          />
          {filterText && (
            <span className="filter-status">
              {visibleLineCount.toLocaleString()} /{" "}
              {totalLineCount.toLocaleString()} lines
            </span>
          )}
        </div>
      </div>

      <Editor
        height="calc(100% - 40px)"
        language={language}
        value={content}
        path={tab.fileId} // stable path for the model
        keepCurrentModel={true}
        theme={language === "log" ? "log-theme" : "vs-dark"}
        beforeMount={handleBeforeMount}
        onMount={handleEditorDidMount}
        options={{
          readOnly: true,
          minimap: {
            enabled: content.length > 10000, // Only show minimap for large files
          },
          scrollBeyondLastLine: false,
          fontSize: 13,
          fontFamily: 'Monaco, Menlo, "Courier New", monospace',
          automaticLayout: true,
          wordWrap: "off",
          lineNumbers: "on",
          renderLineHighlight: "all",
          scrollbar: {
            vertical: "visible",
            horizontal: "visible",
            useShadows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
          folding: true,
          foldingStrategy: "indentation",
          showFoldingControls: "always",
          bracketPairColorization: {
            enabled: true,
          },
          guides: {
            bracketPairs: true,
            indentation: true,
          },
          // Enable breadcrumbs for navigation - note: this should be set via Monaco configuration
          // 'breadcrumbs.enabled': true,
          // Quick suggestions for navigation
          quickSuggestions: false,
          suggestOnTriggerCharacters: false,
          // Enhanced navigation
          links: false,
          contextmenu: true,
          // Better selection
          selectionHighlight: true,
          occurrencesHighlight: "singleFile",
          // Format on paste
          formatOnPaste: false,
          formatOnType: false,
          // Performance settings
          renderValidationDecorations: "on",
          smoothScrolling: true,
          cursorBlinking: "blink",
          cursorSmoothCaretAnimation: "on",
          // Disable unicode ambiguous character warnings for log files
          unicodeHighlight: {
            ambiguousCharacters: language === "log" ? false : true,
            invisibleCharacters: language === "log" ? false : true,
          },
          // Search settings
          find: {
            seedSearchStringFromSelection: "always",
            autoFindInSelection: "never",
            addExtraSpaceOnTop: true,
          },
        }}
      />

      {/* Streaming indicator */}
      {isStreaming && (
        <div className="streaming-footer">
          <div className="streaming-status">
            <span className="loading-spinner-small" />
            <span>Streaming content... {progress.percent}% complete</span>
          </div>
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export default memo(EnhancedFileViewer);
