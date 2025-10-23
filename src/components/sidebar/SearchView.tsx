import { useState, useContext, useEffect } from "react";
import { AppContext } from "../../state/AppContext";
import type {
  SearchResult,
  ViewerTab,
  FileIndexStatus,
} from "../../state/types";
import { QueryParser } from "../../services/queryParser";

// List of file extensions that can be indexed
const INDEXABLE_EXTENSIONS = [".txt", ".log", ".json"];

// Helper function to check if a file can be indexed
const isFileIndexable = (fileName: string): boolean => {
  return INDEXABLE_EXTENSIONS.some((ext) =>
    fileName.toLowerCase().endsWith(ext),
  );
};

function SearchView() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("SearchView must be used within AppProvider");
  }
  const { state, dispatch } = context;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  // React no longer owns the search index - it's owned by the indexing worker
  // We'll track indexing state here and send search queries to the worker
  const indexStatus = state.indexingStatus || "none";
  const [searchExpanded, setSearchExpanded] = useState(true);
  const [indexingExpanded, setIndexingExpanded] = useState(false);
  const [indexingSubSections, setIndexingSubSections] = useState({
    indexed: false,
    inprogress: false,
    unindexed: false,
    errors: false,
  });
  const indexingProgress = state.indexingProgress;

  // Search results collapsible state
  const [expandedDirectories, setExpandedDirectories] = useState<Set<string>>(
    new Set(),
  );
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  const [expandedFileResults, setExpandedFileResults] = useState<Set<string>>(
    new Set(),
  );

  // Get real file statuses from global state (updated by worker callbacks)
  const realFileStatuses: FileIndexStatus[] = state.fileStatuses || [];

  // Track previous indexed count to detect changes
  const [previousIndexedCount, setPreviousIndexedCount] = useState(0);

  // Re-run search when new files are indexed
  useEffect(() => {
    const currentIndexedCount = realFileStatuses.filter(
      (fs) => fs.status === "indexed",
    ).length;

    // Only re-search if we have a meaningful change
    if (currentIndexedCount !== previousIndexedCount) {
      // If we have a previous search and the number of indexed files increased, re-run the search
      if (
        lastSearchQuery &&
        lastSearchQuery.trim() &&
        currentIndexedCount > previousIndexedCount &&
        currentIndexedCount > 0 &&
        !isSearching
      ) {
        console.log(
          "🔍 New files indexed, re-running search for:",
          lastSearchQuery,
        );

        // Run search asynchronously to avoid infinite loops
        setTimeout(async () => {
          if (state.workerManager && lastSearchQuery.trim()) {
            setIsSearching(true);
            try {
              const searchResults =
                await state.workerManager.searchLogs(lastSearchQuery);
              setResults(searchResults);
            } catch (error) {
              console.error("🔍 Auto re-search failed:", error);
            } finally {
              setIsSearching(false);
            }
          }
        }, 100);
      }

      // Update the previous count for next comparison
      setPreviousIndexedCount(currentIndexedCount);
    }
  }, [
    realFileStatuses,
    lastSearchQuery,
    isSearching,
    previousIndexedCount,
    state.workerManager,
  ]);

  // Get file lists ONLY from what the indexing worker has told us about
  const getFileLists = () => {
    // Only show files that the indexing worker has explicitly told us about
    const fileStatuses = Array.isArray(realFileStatuses)
      ? realFileStatuses
      : [];

    // Categorize files based ONLY on worker status
    const indexed = fileStatuses.filter((f) => f.status === "indexed");
    const indexing = fileStatuses.filter((f) => f.status === "indexing");
    const errors = fileStatuses.filter((f) => f.status === "error");
    const unindexed = fileStatuses.filter((f) => f.status === "unindexed");

    return { indexed, indexing, unindexed, errors };
  };

  const { indexed, indexing, unindexed, errors } = getFileLists();

  // SearchView now just tracks React state - the worker handles all indexing

  // TODO: Worker handles file registration now - remove this entire useEffect

  const toggleSection = (section: "search" | "indexing") => {
    if (section === "search") {
      setSearchExpanded(true);
      setIndexingExpanded(false);
    } else {
      setSearchExpanded(false);
      setIndexingExpanded(true);
    }
  };

  const toggleIndexingSubSection = (
    subSection: keyof typeof indexingSubSections,
  ) => {
    setIndexingSubSections((prev) => ({
      ...prev,
      [subSection]: !prev[subSection],
    }));
  };

  const handleSearch = async () => {
    if (!query.trim() || !state.workerManager || indexed.length === 0) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      // Use worker-based search
      const searchResults = await state.workerManager.searchLogs(query);
      setResults(searchResults);
      setLastSearchQuery(query); // Store the query that generated these results
    } catch (error) {
      console.error("🔍 SearchView: Search failed:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const openSearchResult = (result: SearchResult) => {
    // Find the correct fileId from the filesIndex by matching the file path
    const fileEntry = Object.values(state.filesIndex).find(
      (entry) => entry.path === result.file,
    );

    if (!fileEntry) {
      console.error(
        "Could not find file entry for search result:",
        result.file,
      );
      return;
    }

    const fileName = result.file.split("/").pop() || result.file;

    // Check if a tab for this file already exists
    const existingTab = state.openTabs.find(
      (tab) => tab.kind === "file" && tab.fileId === fileEntry.id,
    );

    if (existingTab) {
      // Switch to the existing tab first
      dispatch({ type: "SET_ACTIVE_TAB", id: existingTab.id });

      // Then update with the new line number
      dispatch({
        type: "OPEN_TAB",
        tab: {
          ...(existingTab as ViewerTab & { kind: "file" }),
          lineNumber: result.startLine,
        },
      });
    } else {
      // Create a new tab with just the filename as title
      const tabId = `file-${fileEntry.id}-${Date.now()}`;
      dispatch({
        type: "OPEN_TAB",
        tab: {
          kind: "file",
          id: tabId,
          fileId: fileEntry.id,
          title: fileName, // Just the filename, no line number
          lineNumber: result.startLine,
        },
      });
      dispatch({ type: "SET_ACTIVE_TAB", id: tabId });
    }
  };

  const handleIndexFile = async (file: FileIndexStatus) => {
    if (!state.workerManager) return;

    try {
      // Set status to indexing to show progress UI
      dispatch({
        type: "SET_INDEXING_STATUS",
        status: "indexing",
        ruleDescription: undefined,
      });

      await state.workerManager.indexSingleFile({
        path: file.path,
        name: file.name,
        size: file.size,
      });
      console.log("🔍 Single file indexing started:", file.path);

      // File statuses will be automatically refreshed by the useEffect when indexing progress changes
    } catch (error) {
      console.error("🔍 Failed to index file:", error);
    }
  };

  const handleAddAllFiles = async () => {
    if (!state.workerManager || unindexed.length === 0) return;

    // Filter to only indexable files
    const indexableFiles = unindexed.filter((file) =>
      isFileIndexable(file.name),
    );

    if (indexableFiles.length === 0) {
      console.log("🔍 No indexable files to add");
      return;
    }

    console.log(
      "🔍 SearchView: Adding all indexable unindexed files to index:",
      indexableFiles.length,
      "of",
      unindexed.length,
    );

    try {
      // Set status to indexing to show progress UI
      dispatch({
        type: "SET_INDEXING_STATUS",
        status: "indexing",
        ruleDescription: undefined,
      });

      // Start indexing the selected files (they should already be registered)
      const filePaths = indexableFiles.map((file) => file.path);

      await state.workerManager.startIndexing(filePaths);
      console.log(
        "🔍 Batch indexing started for all indexable unindexed files",
      );

      // File statuses will be automatically refreshed by the useEffect when indexing progress changes
    } catch (error) {
      console.error("🔍 Failed to add all files:", error);
    }
  };

  const highlightMatch = (text: string, searchTerms: string[]): string => {
    if (!searchTerms.length) return text;

    // Find the first match in the text
    let firstMatchIndex = -1;
    let matchLength = 0;

    for (const term of searchTerms) {
      const index = text.toLowerCase().indexOf(term.toLowerCase());
      if (index !== -1 && (firstMatchIndex === -1 || index < firstMatchIndex)) {
        firstMatchIndex = index;
        matchLength = term.length;
      }
    }

    if (firstMatchIndex === -1) {
      // No match found, return truncated text
      return text.length > 80 ? text.slice(0, 80) + "..." : text;
    }

    // Extract context around the match (~30 chars on each side)
    const contextStart = Math.max(0, firstMatchIndex - 30);
    const contextEnd = Math.min(
      text.length,
      firstMatchIndex + matchLength + 30,
    );

    let snippet = text.slice(contextStart, contextEnd);

    // Add ellipsis if we truncated
    if (contextStart > 0) snippet = "..." + snippet;
    if (contextEnd < text.length) snippet = snippet + "...";

    return snippet;
  };

  const getSearchTerms = (): string[] => {
    // Use the query that actually generated the results, not the current input
    const parsedQuery = QueryParser.parse(lastSearchQuery);
    return [...parsedQuery.keywords, ...parsedQuery.exactPhrases];
  };

  const toggleDirectory = (dirPath: string) => {
    const newExpanded = new Set(expandedDirectories);
    if (newExpanded.has(dirPath)) {
      newExpanded.delete(dirPath);
    } else {
      newExpanded.add(dirPath);
    }
    setExpandedDirectories(newExpanded);
  };

  const toggleFile = (filePath: string) => {
    const newExpanded = new Set(expandedFiles);
    if (newExpanded.has(filePath)) {
      newExpanded.delete(filePath);
    } else {
      newExpanded.add(filePath);
    }
    setExpandedFiles(newExpanded);
  };

  const toggleFileResults = (filePath: string) => {
    const newExpanded = new Set(expandedFileResults);
    if (newExpanded.has(filePath)) {
      newExpanded.delete(filePath);
    } else {
      newExpanded.add(filePath);
    }
    setExpandedFileResults(newExpanded);
  };

  const renderGroupedSearchResults = () => {
    // Group results by file
    const groupedResults = results.reduce(
      (groups, result) => {
        if (!groups[result.file]) {
          groups[result.file] = [];
        }
        groups[result.file].push(result);
        return groups;
      },
      {} as Record<string, SearchResult[]>,
    );

    // Group files by directory
    const directoriesMap = new Map<string, string[]>();

    Object.keys(groupedResults).forEach((filePath) => {
      const pathParts = filePath.split("/");
      const directory =
        pathParts.length > 1 ? pathParts.slice(0, -1).join("/") : "";

      if (!directoriesMap.has(directory)) {
        directoriesMap.set(directory, []);
      }
      directoriesMap.get(directory)!.push(filePath);
    });

    // Sort directories and files within each directory
    const sortedDirectories = Array.from(directoriesMap.keys()).sort();
    const totalFiles = Object.keys(groupedResults).length;
    const searchTerms = getSearchTerms();

    return (
      <>
        <div
          style={{
            marginBottom: "8px",
            fontSize: "12px",
            color: "var(--text-muted)",
          }}
        >
          {results.length} result{results.length !== 1 ? "s" : ""} in{" "}
          {totalFiles} file{totalFiles !== 1 ? "s" : ""}
        </div>

        {sortedDirectories.slice(0, 10).map((directory) => {
          const filesInDir = directoriesMap.get(directory)!.sort();
          const dirExpanded = !expandedDirectories.has(directory); // Default expanded, collapse on toggle
          const dirDisplayName = directory || "Root";

          // Count total matches in this directory
          const totalDirMatches = filesInDir.reduce(
            (sum, filePath) => sum + groupedResults[filePath].length,
            0,
          );

          return (
            <div key={directory} style={{ marginBottom: "8px" }}>
              {/* Directory header */}
              <div
                onClick={() => toggleDirectory(directory)}
                style={{
                  position: "sticky",
                  top: "0px",
                  zIndex: 10,
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 8px",
                  backgroundColor: "var(--bg-tertiary)",
                  border: "1px solid var(--border)",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontWeight: "bold",
                  userSelect: "none",
                }}
              >
                <span
                  style={{
                    marginRight: "6px",
                    transform: dirExpanded ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.1s",
                    fontSize: "10px",
                  }}
                >
                  ▶
                </span>
                <span style={{ flex: 1 }}>{dirDisplayName}</span>
                <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                  {totalDirMatches} match{totalDirMatches !== 1 ? "es" : ""} in{" "}
                  {filesInDir.length} file{filesInDir.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Files in directory */}
              {dirExpanded && (
                <div style={{ marginTop: "4px", marginLeft: "12px" }}>
                  {filesInDir.slice(0, 15).map((filePath) => {
                    const fileResults = groupedResults[filePath];
                    const sortedFileResults = fileResults.sort(
                      (a, b) => a.startLine - b.startLine,
                    );
                    const fileExpanded = !expandedFiles.has(filePath); // Default expanded, collapse on toggle
                    const fileResultsExpanded =
                      expandedFileResults.has(filePath);
                    const pathParts = filePath.split("/");
                    const fileName = pathParts[pathParts.length - 1];
                    const parentPath =
                      pathParts.length > 1
                        ? pathParts.slice(0, -1).join("/")
                        : "";

                    // Show first 5 results, then "show more" if needed
                    const initialResultsCount = 5;
                    const visibleResults = fileResultsExpanded
                      ? sortedFileResults
                      : sortedFileResults.slice(0, initialResultsCount);
                    const hasMoreResults =
                      sortedFileResults.length > initialResultsCount;

                    return (
                      <div
                        key={filePath}
                        style={{
                          marginBottom: "6px",
                          border: "1px solid var(--border)",
                          borderRadius: "3px",
                          backgroundColor: "var(--bg-secondary)",
                        }}
                      >
                        {/* File header */}
                        <div
                          onClick={() => toggleFile(filePath)}
                          style={{
                            position: "sticky",
                            top: "24px", // Below directory header with adjusted spacing
                            zIndex: 9, // Below directory header but above content
                            display: "flex",
                            alignItems: "center",
                            padding: "6px 8px",
                            cursor: "pointer",
                            userSelect: "none",
                            borderRadius: "3px 3px 0 0",
                            backgroundColor: "var(--bg-secondary)",
                            borderBottom: "1px solid var(--border)",
                          }}
                        >
                          <span
                            style={{
                              marginRight: "6px",
                              transform: fileExpanded
                                ? "rotate(90deg)"
                                : "rotate(0deg)",
                              transition: "transform 0.1s",
                              fontSize: "9px",
                            }}
                          >
                            ▶
                          </span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            {parentPath && (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  fontSize: "9px",
                                  color: "var(--text-muted)",
                                  overflow: "hidden",
                                  marginBottom: "2px",
                                }}
                              >
                                <div
                                  style={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    flex: 1,
                                  }}
                                >
                                  {parentPath}/
                                </div>
                                <span
                                  style={{
                                    fontSize: "9px",
                                    color: "var(--text-muted)",
                                    flexShrink: 0,
                                  }}
                                >
                                  {fileResults.length}
                                </span>
                              </div>
                            )}
                            <div
                              style={{
                                fontSize: "11px",
                                fontWeight: "bold",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {fileName}
                              {!parentPath && (
                                <span
                                  style={{
                                    fontSize: "9px",
                                    color: "var(--text-muted)",
                                    marginLeft: "6px",
                                    fontWeight: "normal",
                                  }}
                                >
                                  {fileResults.length}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* File results */}
                        {fileExpanded && (
                          <div style={{ padding: "4px 8px", paddingTop: 0 }}>
                            {visibleResults.map((result) => {
                              // Reconstruct line context from log entry fields
                              const lineContext = `${result.timestamp} ${result.level} ${result.goroutineId} ${result.message}`;
                              const snippet = highlightMatch(
                                lineContext,
                                searchTerms,
                              );

                              return (
                                <div
                                  key={result.id}
                                  onClick={() => openSearchResult(result)}
                                  style={{
                                    padding: "4px 6px",
                                    cursor: "pointer",
                                    borderRadius: "2px",
                                    fontSize: "10px",
                                    lineHeight: "1.3",
                                    marginBottom: "2px",
                                    backgroundColor: "transparent",
                                  }}
                                  onMouseEnter={(e) => {
                                    (
                                      e.target as HTMLElement
                                    ).style.backgroundColor =
                                      "var(--bg-primary)";
                                  }}
                                  onMouseLeave={(e) => {
                                    (
                                      e.target as HTMLElement
                                    ).style.backgroundColor = "transparent";
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "flex-start",
                                      gap: "6px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontWeight: "bold",
                                        fontSize: "9px",
                                        color: "var(--text-accent)",
                                        minWidth: "30px",
                                        textAlign: "right",
                                      }}
                                    >
                                      {result.startLine}:
                                    </span>
                                    <div
                                      style={{
                                        fontSize: "10px",
                                        color: "var(--text-primary)",
                                        fontFamily: "monospace",
                                        wordBreak: "break-word",
                                        lineHeight: "1.2",
                                      }}
                                    >
                                      {snippet}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}

                            {hasMoreResults && !fileResultsExpanded && (
                              <div
                                onClick={() => toggleFileResults(filePath)}
                                style={{
                                  padding: "6px",
                                  fontSize: "10px",
                                  color: "var(--accent-primary)",
                                  cursor: "pointer",
                                  textAlign: "center",
                                  borderTop: "1px solid var(--border)",
                                  backgroundColor: "var(--bg-tertiary)",
                                }}
                              >
                                Show{" "}
                                {sortedFileResults.length - initialResultsCount}{" "}
                                more matches
                              </div>
                            )}

                            {fileResultsExpanded && hasMoreResults && (
                              <div
                                onClick={() => toggleFileResults(filePath)}
                                style={{
                                  padding: "6px",
                                  fontSize: "10px",
                                  color: "var(--accent-primary)",
                                  cursor: "pointer",
                                  textAlign: "center",
                                  borderTop: "1px solid var(--border)",
                                  backgroundColor: "var(--bg-tertiary)",
                                }}
                              >
                                Show fewer matches
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {filesInDir.length > 15 && (
                    <div
                      style={{
                        padding: "6px 8px",
                        fontSize: "10px",
                        color: "var(--text-muted)",
                        fontStyle: "italic",
                      }}
                    >
                      ... and {filesInDir.length - 15} more files
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {sortedDirectories.length > 10 && (
          <div
            style={{
              padding: "8px",
              fontSize: "12px",
              color: "var(--text-muted)",
            }}
          >
            Showing first 10 directories of {sortedDirectories.length}
          </div>
        )}
      </>
    );
  };

  const renderIndexStatus = () => {
    switch (indexStatus) {
      case "none":
        // Check if we actually have indexed files despite status being "none"
        if (indexed.length > 0) {
          return (
            <div
              className="index-status"
              style={{
                padding: "8px",
                fontSize: "12px",
                color: "var(--text-success)",
              }}
            >
              {indexed.length} files
              {state.indexingRuleDescription
                ? ` (${state.indexingRuleDescription})`
                : ""}{" "}
              indexed
            </div>
          );
        }
        return (
          <div
            className="index-status"
            style={{
              padding: "8px",
              fontSize: "12px",
              color: "var(--text-muted)",
            }}
          >
            No log files indexed. Load log files to enable search.
          </div>
        );
      case "indexing":
        return (
          <div
            className="index-status"
            style={{
              padding: "8px",
              fontSize: "12px",
              color: "var(--text-warning)",
            }}
          >
            {indexingProgress ? (
              <div>
                <div>
                  Indexing file {indexingProgress.current}/
                  {indexingProgress.total}:
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    marginTop: "4px",
                    color: "var(--text-muted)",
                  }}
                >
                  {indexingProgress.fileName}
                </div>
              </div>
            ) : (
              "Indexing log files..."
            )}
          </div>
        );
      case "ready":
        return (
          <div
            className="index-status"
            style={{
              padding: "8px",
              fontSize: "12px",
              color: "var(--text-success)",
            }}
          >
            {indexed.length} files
            {state.indexingRuleDescription
              ? ` (${state.indexingRuleDescription})`
              : ""}{" "}
            indexed
          </div>
        );
    }
  };

  const renderFileList = (files: FileIndexStatus[], showAddButton = false) => {
    if (files.length === 0) {
      return (
        <div
          style={{
            padding: "8px",
            fontSize: "12px",
            color: "var(--text-muted)",
          }}
        >
          No files
        </div>
      );
    }

    // Group files by directory
    const groupedFiles = files.reduce(
      (groups, file) => {
        const pathParts = file.path.split("/");
        const dir =
          pathParts.length > 1 ? pathParts.slice(0, -1).join("/") : "/";
        if (!groups[dir]) {
          groups[dir] = [];
        }
        groups[dir].push(file);
        return groups;
      },
      {} as Record<string, FileIndexStatus[]>,
    );

    return (
      <div style={{ padding: "4px" }}>
        {Object.entries(groupedFiles).map(([dir, dirFiles]) => (
          <div key={dir} style={{ marginBottom: "8px" }}>
            <div
              style={{
                fontSize: "10px",
                color: "var(--text-muted)",
                fontWeight: "bold",
                marginBottom: "4px",
                paddingLeft: "4px",
              }}
            >
              {dir === "/" ? "Root" : dir}
            </div>
            {dirFiles.map((file) => (
              <div
                key={file.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "4px 8px",
                  marginBottom: "2px",
                  borderRadius: "2px",
                  backgroundColor: "var(--bg-tertiary)",
                  fontSize: "11px",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {file.name}
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: "10px" }}>
                    {(file.size / 1000).toFixed(1)} KB {/* Decimal (matches macOS/Safari) */}
                    {file.entries && ` • ${file.entries} entries`}
                  </div>
                </div>
                {showAddButton && isFileIndexable(file.name) && (
                  <button
                    onClick={() => handleIndexFile(file)}
                    style={{
                      marginLeft: "8px",
                      padding: "4px 8px",
                      fontSize: "12px",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--accent-primary)",
                      color: "white",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                    title={`Index ${file.name}`}
                  >
                    +
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderSectionHeader = (
    title: string,
    expanded: boolean,
    onClick: () => void,
  ) => (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "8px",
        backgroundColor: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border)",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: "bold",
        userSelect: "none",
      }}
    >
      <span
        style={{
          marginRight: "6px",
          transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform 0.1s",
        }}
      >
        ▶
      </span>
      {title}
    </div>
  );

  const renderSubSectionHeader = (
    title: string,
    count: number,
    expanded: boolean,
    onClick: () => void,
    showAddAll?: boolean,
  ) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "6px 16px",
        backgroundColor: "var(--bg-tertiary)",
        borderBottom: "1px solid var(--border)",
        fontSize: "11px",
        fontWeight: "500",
        userSelect: "none",
      }}
    >
      <div
        onClick={onClick}
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          flex: 1,
        }}
      >
        <span
          style={{
            marginRight: "4px",
            transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.1s",
          }}
        >
          ▶
        </span>
        {title} ({count})
      </div>
      {showAddAll && count > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddAllFiles();
          }}
          style={{
            marginLeft: "8px",
            padding: "4px 8px",
            fontSize: "12px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--accent-primary)",
            color: "white",
            borderRadius: "3px",
            cursor: "pointer",
          }}
          title="Add all indexable files (.txt, .log, .json) to search index"
        >
          Add All
        </button>
      )}
    </div>
  );

  return (
    <div
      className="search-view"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Top collapsed sections (above expanded) */}
      <div style={{ flexShrink: 0 }}>
        {!searchExpanded &&
          renderSectionHeader("SEARCH", searchExpanded, () =>
            toggleSection("search"),
          )}
      </div>

      {/* Expanded section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {searchExpanded && (
          <>
            <div style={{ flexShrink: 0 }}>
              {renderSectionHeader("SEARCH", searchExpanded, () =>
                toggleSection("search"),
              )}
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                overflow: "hidden",
              }}
            >
              {renderIndexStatus()}

              <div
                className="search-form"
                style={{
                  padding: "8px",
                  display: "flex",
                  gap: "4px",
                  flexShrink: 0,
                }}
              >
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search logs... (try: level:error database)"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setHasSearched(false); // Reset search state when query changes
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      console.log("🔍 Enter pressed, calling handleSearch");
                      handleSearch();
                    }
                  }}
                  disabled={!state.workerManager || indexed.length === 0}
                  style={{
                    flex: 1,
                    padding: "12px",
                    fontSize: "13px",
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "6px",
                    color: "var(--text-primary)",
                  }}
                />

                <button
                  className="btn search-btn"
                  onClick={handleSearch}
                  disabled={
                    !query.trim() ||
                    isSearching ||
                    !state.workerManager ||
                    indexed.length === 0
                  }
                  style={{
                    width: "40px",
                    height: "40px",
                    padding: "0",
                    fontSize: "16px",
                    background:
                      indexed.length > 0 && query.trim() && state.workerManager
                        ? "var(--accent-primary)"
                        : "var(--bg-tertiary)",
                    color:
                      indexed.length > 0 && query.trim() && state.workerManager
                        ? "white"
                        : "var(--text-muted)",
                    border: "none",
                    borderRadius: "6px",
                    cursor:
                      indexed.length > 0 && query.trim() && state.workerManager
                        ? "pointer"
                        : "not-allowed",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isSearching ? "⋯" : "▶"}
                </button>
              </div>

              {/* Search Results */}
              <div style={{ flex: 1, overflow: "auto" }}>
                {results.length > 0 ? (
                  <div className="search-results" style={{ padding: "8px" }}>
                    {renderGroupedSearchResults()}
                  </div>
                ) : (
                  hasSearched &&
                  query &&
                  !isSearching &&
                  indexed.length > 0 && (
                    <div className="empty-state" style={{ padding: "8px" }}>
                      <p
                        style={{ fontSize: "12px", color: "var(--text-muted)" }}
                      >
                        No results found for "{query}"
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        )}

        {indexingExpanded && (
          <>
            <div style={{ flexShrink: 0 }}>
              {renderSectionHeader(
                `Indexed ${indexed.length} of ${realFileStatuses.length} files${state.indexingRuleDescription ? ` (${state.indexingRuleDescription})` : ""}`,
                indexingExpanded,
                () => toggleSection("indexing"),
              )}
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                overflow: "hidden",
              }}
            >
              <div style={{ flex: 1, overflow: "auto" }}>
                {/* Indexed Files Subsection */}
                <div>
                  {renderSubSectionHeader(
                    "Indexed Files",
                    indexed.length,
                    indexingSubSections.indexed,
                    () => toggleIndexingSubSection("indexed"),
                  )}
                  {indexingSubSections.indexed && renderFileList(indexed)}
                </div>

                {/* In Progress Subsection */}
                <div>
                  {renderSubSectionHeader(
                    "In Progress",
                    indexing.length,
                    indexingSubSections.inprogress,
                    () => toggleIndexingSubSection("inprogress"),
                  )}
                  {indexingSubSections.inprogress && renderFileList(indexing)}
                </div>

                {/* Unindexed Files Subsection */}
                <div>
                  {renderSubSectionHeader(
                    "Unindexed Files",
                    unindexed.length,
                    indexingSubSections.unindexed,
                    () => toggleIndexingSubSection("unindexed"),
                    true,
                  )}
                  {indexingSubSections.unindexed &&
                    renderFileList(unindexed, true)}
                </div>

                {/* Errors Subsection */}
                <div>
                  {renderSubSectionHeader(
                    "Errors",
                    errors.length,
                    indexingSubSections.errors,
                    () => toggleIndexingSubSection("errors"),
                  )}
                  {indexingSubSections.errors && renderFileList(errors)}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom collapsed sections (below expanded) - sticky to bottom */}
      <div
        style={{
          flexShrink: 0,
          position: "sticky",
          bottom: 0,
          backgroundColor: "var(--bg-primary)",
          borderTop: indexingExpanded ? "none" : "1px solid var(--border)",
        }}
      >
        {!indexingExpanded &&
          renderSectionHeader(
            `Indexed ${indexed.length} of ${realFileStatuses.length} files${state.indexingRuleDescription ? ` (${state.indexingRuleDescription})` : ""}`,
            indexingExpanded,
            () => toggleSection("indexing"),
          )}
      </div>
    </div>
  );
}

export default SearchView;
