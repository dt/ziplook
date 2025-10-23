import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useApp } from "../../state/AppContext";
import { useKeyboardNavigation } from "../../hooks/useKeyboardNavigation";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1000; // Decimal (matches macOS/Safari)
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

function parseTableName(name: string): {
  cluster?: string;
  prefix?: string;
  mainName: string;
} {
  // Check for cluster.system. or cluster.crdb_internal. pattern
  // Examples: tenant1.system.jobs, mixed-version-tenant-ikhut.crdb_internal.active_range_feeds_by_node
  // Allow alphanumeric, underscores, and hyphens in cluster names
  const clusterMatch = name.match(/^([a-zA-Z0-9_-]+)\.(system|crdb_internal)\.(.+)$/);
  if (clusterMatch) {
    return {
      cluster: clusterMatch[1],
      prefix: clusterMatch[2],
      mainName: clusterMatch[3],
    };
  }

  // Check for system. or crdb_internal. prefix (root cluster)
  if (name.startsWith("system.")) {
    return { prefix: "system", mainName: name.substring(7) };
  }
  if (name.startsWith("crdb_internal.")) {
    return { prefix: "crdb_internal", mainName: name.substring(14) };
  }

  // Check for per-node schemas like n1_system. or n1_crdb_internal.
  if (name.match(/^n\d+_system\./)) {
    const dotIndex = name.indexOf(".");
    return {
      prefix: name.substring(0, dotIndex),
      mainName: name.substring(dotIndex + 1),
    };
  }
  if (name.match(/^n\d+_crdb_internal\./)) {
    const dotIndex = name.indexOf(".");
    return {
      prefix: name.substring(0, dotIndex),
      mainName: name.substring(dotIndex + 1),
    };
  }

  return { mainName: name };
}

function TablesView() {
  const { state, dispatch } = useApp();
  const navigation = useKeyboardNavigation();
  const [filter, setFilter] = useState("");
  const [loadingTables, setLoadingTables] = useState<Set<string>>(new Set());
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    () => {
      // Default collapse empty table section
      const initial = new Set<string>();
      initial.add("empty"); // Collapse empty tables by default
      return initial;
    },
  );
  const tables = Object.values(state.tables);
  const elementRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Throttled debug logging - starts after 10s, then every 10s
  const lastDebugLogTime = useRef<number>(0);
  const debugLogStartTime = useRef<number>(Date.now());

  // Register element with refs
  const registerElement = useCallback(
    (id: string, element: HTMLElement | null) => {
      if (element) {
        elementRefs.current.set(id, element);
      } else {
        elementRefs.current.delete(id);
      }
    },
    [],
  );

  // Calculate loading progress
  const loadingProgress = useMemo(() => {
    const loadableTables = tables.filter((t) => !t.isError);
    if (loadableTables.length === 0) return null;

    // Only count non-deferred tables for loading progress (deferred tables aren't auto-loaded)
    const autoLoadTables = loadableTables.filter((t) => !t.deferred);
    // Show loading progress even if no auto-load tables (deferred tables should still be visible)
    if (loadableTables.length === 0) return null;

    // Count tables that are either loaded or failed
    const completedCount = autoLoadTables.filter(
      (t) => t.loaded || t.loadError,
    ).length;
    const totalCount = autoLoadTables.length;

    // Debug: Log incomplete tables when we're close to completion (throttled)
    if (completedCount >= totalCount - 5) {
      const incomplete = autoLoadTables.filter(
        (t) => !t.loaded && !t.loadError,
      );
      if (incomplete.length > 0) {
        const now = Date.now();
        const timeSinceStart = now - debugLogStartTime.current;
        const timeSinceLastLog = now - lastDebugLogTime.current;

        // Only log if it's been at least 10s since start AND at least 10s since last log
        if (timeSinceStart >= 10000 && timeSinceLastLog >= 10000) {
          console.log(
            `Progress debug: ${completedCount}/${totalCount} complete. Incomplete tables:`,
            incomplete.map((t) => ({
              name: t.name,
              loading: t.loading,
              loaded: t.loaded,
              loadError: t.loadError,
            })),
          );
          lastDebugLogTime.current = now;
        }
      }
    }

    // Hide the progress bar when complete
    if (completedCount === totalCount) return null;

    // Calculate size-weighted progress
    const totalSize = autoLoadTables.reduce((sum, t) => sum + (t.size || 0), 0);
    const completedSize = autoLoadTables
      .filter((t) => t.loaded || t.loadError)
      .reduce((sum, t) => sum + (t.size || 0), 0);

    // Weight by size for more accurate progress
    const progressPercent =
      totalSize > 0 ? Math.min(100, (completedSize / totalSize) * 100) : 0;

    return {
      completedCount,
      totalCount,
      progressPercent,
      isLoading: autoLoadTables.some((t) => t.loading),
    };
  }, [tables]);

  // Get custom query tabs and filter them
  const customQueryTabs = useMemo(() => {
    const queryTabs = state.openTabs.filter(
      (tab) => tab.kind === "sql" && tab.isCustomQuery === true,
    );
    if (!filter) return queryTabs;
    return queryTabs.filter((tab) =>
      tab.title.toLowerCase().includes(filter.toLowerCase()),
    );
  }, [state.openTabs, filter]);

  // Filter tables based on search input
  const filteredTables = tables.filter(
    (table) =>
      table.name.toLowerCase().includes(filter.toLowerCase()) ||
      (table.originalName &&
        table.originalName.toLowerCase().includes(filter.toLowerCase())),
  );

  // Sort all tables by name
  const allTables = filteredTables.sort((a, b) => a.name.localeCompare(b.name));

  // Group tables by cluster
  const tablesByCluster = useMemo(() => {
    const groups = new Map<string, typeof allTables>();

    for (const table of allTables) {
      const { cluster } = parseTableName(table.name);
      const clusterKey = cluster || "_root"; // Use _root for root cluster

      if (!groups.has(clusterKey)) {
        groups.set(clusterKey, []);
      }
      groups.get(clusterKey)!.push(table);
    }

    return groups;
  }, [allTables]);

  // Separate zero-row tables from regular tables (for each cluster)
  const clusterGroups = useMemo(() => {
    const groups: Array<{
      clusterKey: string;
      clusterName: string;
      regularTables: typeof allTables;
      emptyTables: typeof allTables;
    }> = [];

    for (const [clusterKey, tables] of tablesByCluster.entries()) {
      const regularTables = tables.filter(
        (t) => !t.loaded || t.rowCount === undefined || t.rowCount > 0,
      );
      const emptyTables = tables.filter(
        (t) => t.loaded && t.rowCount === 0,
      );

      groups.push({
        clusterKey,
        clusterName: clusterKey === "_root" ? "System Cluster" : clusterKey,
        regularTables,
        emptyTables,
      });
    }

    // Sort: root cluster first, then others alphabetically
    groups.sort((a, b) => {
      if (a.clusterKey === "_root") return -1;
      if (b.clusterKey === "_root") return 1;
      return a.clusterName.localeCompare(b.clusterName);
    });

    return groups;
  }, [tablesByCluster]);

  // Auto-expand sections when filtering
  useEffect(() => {
    if (!filter) return; // Don't expand when no filter

    setCollapsedSections((prev) => {
      const next = new Set(prev);
      let hasChanges = false;

      // Expand custom queries section if there are matches
      if (customQueryTabs.length > 0 && next.has("custom-queries")) {
        next.delete("custom-queries");
        hasChanges = true;
      }

      // Expand tables section if there are matches
      if (allTables.length > 0 && next.has("tables")) {
        next.delete("tables");
        hasChanges = true;
      }

      // Only update state if there are actual changes
      return hasChanges ? next : prev;
    });
  }, [filter, customQueryTabs.length, allTables.length]);

  // Update navigation items when filtered results change
  // Temporarily disabled to fix infinite loop
  // useEffect(() => {
  //   const items: NavigationItem[] = [];
  //   // ... navigation setup code ...
  //   navigation.setItems(items);
  // }, [navigation.setItems, customQueryTabs, regularClusterTables, emptyClusterTables, sortedNodeGroups, collapsedSections]);

  const loadDeferredTable = useCallback(
    async (table: (typeof tables)[0]) => {
      if (loadingTables.has(table.name)) return;

      if (!state.workerManager) {
        console.error("WorkerManager not available");
        return;
      }

      setLoadingTables((prev) => new Set([...prev, table.name]));

      // Update status to loading
      dispatch({
        type: "UPDATE_TABLE",
        name: table.name,
        updates: { loading: true },
      });

      try {
        // Load single table through WorkerManager
        console.log(
          `Loading deferred table ${table.name} from ${table.sourceFile}...`,
        );

        await state.workerManager.loadSingleTable({
          name: table.name,
          path: table.sourceFile,
          size: table.size || 0,
          nodeId: table.nodeId,
          originalName: table.originalName,
          isError: table.isError,
          nodeFiles: table.nodeFiles,
        });

        // The table progress will be updated via the WorkerManager callbacks
        // which are handled in AppContext
      } catch (err) {
        console.error(`Failed to load deferred table ${table.name}:`, err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        dispatch({
          type: "UPDATE_TABLE",
          name: table.name,
          updates: {
            loading: false,
            loadError: errorMessage,
          },
        });
      } finally {
        setLoadingTables((prev) => {
          const next = new Set(prev);
          next.delete(table.name);
          return next;
        });
      }
    },
    [dispatch, state.workerManager, loadingTables],
  );

  const handleTableClick = async (table: (typeof tables)[0]) => {
    // If it's an .err.txt file, open error viewer to explain the situation
    if (table.isError) {
      const baseName = table.originalName || table.name;
      const errorFiles = table.nodeFiles?.filter(f => f.isError) ||
        [{ path: table.sourceFile, nodeId: table.nodeId, size: table.size, isError: true }];
      const availableFiles = table.nodeFiles?.filter(f => !f.isError) || [];

      dispatch({
        type: "OPEN_TAB",
        tab: {
          kind: "error",
          id: `error-${table.name}`,
          title: `Error: ${baseName}`,
          error: "", // Will be populated by ErrorViewer
          sourceFile: table.sourceFile,
          tableName: baseName,
          fullTableName: table.name, // Full name with _by_node suffix if applicable
          isPreLoadError: true,
          errorFiles,
          availableFiles,
        },
      });
      return;
    }

    // If it has a load error, open the error viewer
    if (table.loadError) {
      dispatch({
        type: "OPEN_TAB",
        tab: {
          kind: "error",
          id: `error-${table.name}`,
          title: `Error: ${table.originalName || table.name}`,
          error: table.loadError,
          sourceFile: table.sourceFile,
          tableName: table.originalName || table.name,
        },
      });
      return;
    }

    // Check if we have an existing tab for this table that's not custom
    const existingTab = state.openTabs.find(
      (tab) =>
        tab.kind === "sql" &&
        tab.sourceTable === table.name &&
        !tab.isCustomQuery,
    );

    // If table is deferred and not loaded, load it first
    if (table.deferred && !table.loaded && !table.loading) {
      await loadDeferredTable(table);
      // After loading, open the SQL tab
      setTimeout(() => {
        const query = `SELECT * FROM ${table.name} LIMIT 100`;
        dispatch({
          type: "OPEN_TAB",
          tab: {
            kind: "sql",
            id: existingTab ? existingTab.id : `sql-${table.name}`,
            title: table.name,
            query,
            sourceTable: table.name,
            isCustomQuery: false,
          },
        });
      }, 100);
    } else if (table.loaded) {
      // Table is already loaded
      const query = `SELECT * FROM ${table.name} LIMIT 100`;

      if (
        existingTab &&
        existingTab.kind === "sql" &&
        existingTab.isCustomQuery
      ) {
        // Existing tab has been modified, create a new one
        const newId = `sql-${table.name}-${Date.now()}`;
        dispatch({
          type: "OPEN_TAB",
          tab: {
            kind: "sql",
            id: newId,
            title: table.name,
            query,
            sourceTable: table.name,
            isCustomQuery: false,
          },
        });
      } else {
        // Open or switch to existing tab
        dispatch({
          type: "OPEN_TAB",
          tab: {
            kind: "sql",
            id: existingTab ? existingTab.id : `sql-${table.name}`,
            title: table.name,
            query,
            sourceTable: table.name,
            isCustomQuery: false,
          },
        });
      }
    }
  };

  const handleQueryClick = (tabId: string) => {
    dispatch({ type: "SET_ACTIVE_TAB", id: tabId });
  };

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  // Early return for empty state (after all hooks)
  if (tables.length === 0) {
    return (
      <div className="empty-state">
        <p>No tables detected</p>
        <p
          style={{
            fontSize: "11px",
            color: "var(--text-muted)",
            marginTop: "8px",
          }}
        >
          Tables will appear here when system.* CSV/TXT files are found
        </p>
      </div>
    );
  }

  return (
    <div className="tables-view">
      {/* Loading Progress - subtle bar at the very top */}
      {loadingProgress && loadingProgress.totalCount > 0 && (
        <div className="loading-progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${loadingProgress.progressPercent}%`,
              backgroundColor: "#007acc",
              height: "100%",
              position: "absolute",
              left: 0,
              top: 0,
              transition: "width 0.3s ease",
            }}
          />
        </div>
      )}

      {/* Filter */}
      <div className="filter-section">
        <input
          type="text"
          className="filter-input"
          placeholder="Filter tables..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* Custom Queries Section */}
      {customQueryTabs.length > 0 && (
        <div className="table-section">
          <div
            className="section-header sub-header clickable"
            onClick={() => toggleSection("custom-queries")}
          >
            <span className="section-chevron">
              {collapsedSections.has("custom-queries") ? "▶" : "▼"}
            </span>
            Custom Queries
          </div>
          {!collapsedSections.has("custom-queries") &&
            customQueryTabs.map((tab) => {
              const isHighlighted =
                navigation.state.isNavigating &&
                navigation.state.items[navigation.state.highlightedIndex]
                  ?.id === `query-${tab.id}`;
              return (
                <div
                  key={tab.id}
                  ref={(el) => registerElement(`query-${tab.id}`, el)}
                  className={`query-item ${isHighlighted ? "keyboard-highlighted" : ""}`}
                  onClick={() => handleQueryClick(tab.id)}
                >
                  <span className="query-name">{tab.title}</span>
                </div>
              );
            })}
        </div>
      )}

      {/* Cluster Sections - each cluster is a top-level section when there are multiple clusters */}
      {clusterGroups.length > 1 ? (
        <>
          {clusterGroups.map((group) => (
            <div key={group.clusterKey} className="table-section">
              {/* Cluster Header */}
              <div
                className="section-header sub-header clickable"
                onClick={() => toggleSection(`cluster-${group.clusterKey}`)}
              >
                <span className="section-chevron">
                  {collapsedSections.has(`cluster-${group.clusterKey}`) ? "▶" : "▼"}
                </span>
                {group.clusterName} ({group.regularTables.length + group.emptyTables.length})
              </div>

              {/* Tables in this cluster */}
              {!collapsedSections.has(`cluster-${group.clusterKey}`) && (
                    <>
                      {group.regularTables.map((table) => {
                        const { prefix, mainName } = parseTableName(table.name);
                        const isHighlighted =
                          navigation.state.isNavigating &&
                          navigation.state.items[navigation.state.highlightedIndex]
                            ?.id === `table-${table.name}`;
                        return (
                          <div
                            key={table.name}
                            ref={(el) => registerElement(`table-${table.name}`, el)}
                            className={`table-item-compact ${table.loading ? "loading" : ""} ${table.deferred ? "deferred" : ""} ${table.isError ? "error-file" : ""} ${table.loadError ? "load-failed" : ""} ${table.rowCount === 0 ? "empty-table" : ""} ${!table.loaded && !table.loading && !table.deferred ? "unloaded" : ""} ${isHighlighted ? "keyboard-highlighted" : ""}`}
                            onClick={() => handleTableClick(table)}
                          >
                            {table.loaded &&
                              table.rowCount !== undefined &&
                              !table.isError &&
                              !table.loadError &&
                              !table.deferred && (
                                <span className="table-row-count">
                                  {table.rowCount.toLocaleString()} rows
                                </span>
                              )}
                            {table.loading && (
                              <span className="loading-spinner-small" />
                            )}
                            <div className="table-name-compact">
                              {prefix && <span className="table-prefix">{prefix}</span>}
                              <span className="table-main-name">{mainName}</span>
                            </div>
                            {(table.isError || table.loadError || table.deferred || (table.nodeFiles && table.nodeFiles.some(f => f.isError))) && (
                              <div className="table-status-compact">
                                {(table.isError || (table.loaded && table.nodeFiles && table.nodeFiles.some(f => f.isError))) && (
                                  <span className="status-icon">
                                    ⚠️
                                    {table.nodeFiles && table.nodeFiles.length > 1 && ` ${table.nodeFiles.filter(f => f.isError).length}/${table.nodeFiles.length}`}
                                  </span>
                                )}
                                {table.loadError && (
                                  <span className="status-icon">❌</span>
                                )}
                                {table.deferred && (
                                  <span className="status-text">
                                    {formatFileSize(table.size || 0)}
                                  </span>
                                )}
                              </div>
                            )}
                            {/* Chunk progress bar */}
                            {table.chunkProgress && (
                              <div className="chunk-progress-bar">
                                <div
                                  className="chunk-progress-fill"
                                  style={{
                                    width: `${table.chunkProgress.percentage}%`,
                                    height: "3px",
                                    backgroundColor: "#007acc",
                                    transition: "width 0.3s ease",
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Empty Tables Section for this cluster */}
                      {group.emptyTables.length > 0 && (
                        <>
                          <div
                            className="subsection-header clickable"
                            onClick={() => toggleSection(`empty-${group.clusterKey}`)}
                          >
                            <span className="section-chevron">
                              {collapsedSections.has(`empty-${group.clusterKey}`) ? "▶" : "▼"}
                            </span>
                            Empty Tables ({group.emptyTables.length})
                          </div>
                          {!collapsedSections.has(`empty-${group.clusterKey}`) &&
                            group.emptyTables.map((table) => {
                              const { prefix, mainName } = parseTableName(table.name);
                              const isHighlighted =
                                navigation.state.isNavigating &&
                                navigation.state.items[
                                  navigation.state.highlightedIndex
                                ]?.id === `table-${table.name}`;
                              return (
                                <div
                                  key={table.name}
                                  ref={(el) =>
                                    registerElement(`table-${table.name}`, el)
                                  }
                                  className={`table-item-compact empty-table ${isHighlighted ? "keyboard-highlighted" : ""}`}
                                  onClick={() => handleTableClick(table)}
                                >
                                  <span className="table-row-count">0 rows</span>
                                  <div className="table-name-compact">
                                    {prefix && (
                                      <span className="table-prefix">{prefix}</span>
                                    )}
                                    <span className="table-main-name">{mainName}</span>
                                  </div>
                                </div>
                              );
                            })}
                        </>
                      )}
                    </>
                  )}
            </div>
          ))}
        </>
      ) : clusterGroups.length === 1 ? (
        /* Single cluster - show tables directly under a "Tables" section */
        <div className="table-section">
          <div
            className="section-header sub-header clickable"
            onClick={() => toggleSection("tables")}
          >
            <span className="section-chevron">
              {collapsedSections.has("tables") ? "▶" : "▼"}
            </span>
            Tables ({clusterGroups[0].regularTables.length + clusterGroups[0].emptyTables.length})
          </div>
          {!collapsedSections.has("tables") && (
            <>
              {clusterGroups[0].regularTables.map((table) => {
                const { prefix, mainName } = parseTableName(table.name);
                const isHighlighted =
                  navigation.state.isNavigating &&
                  navigation.state.items[navigation.state.highlightedIndex]
                    ?.id === `table-${table.name}`;
                return (
                  <div
                    key={table.name}
                    ref={(el) => registerElement(`table-${table.name}`, el)}
                    className={`table-item-compact ${table.loading ? "loading" : ""} ${table.deferred ? "deferred" : ""} ${table.isError ? "error-file" : ""} ${table.loadError ? "load-failed" : ""} ${table.rowCount === 0 ? "empty-table" : ""} ${!table.loaded && !table.loading && !table.deferred ? "unloaded" : ""} ${isHighlighted ? "keyboard-highlighted" : ""}`}
                    onClick={() => handleTableClick(table)}
                  >
                    {table.loaded &&
                      table.rowCount !== undefined &&
                      !table.isError &&
                      !table.loadError &&
                      !table.deferred && (
                        <span className="table-row-count">
                          {table.rowCount.toLocaleString()} rows
                        </span>
                      )}
                    {table.loading && (
                      <span className="loading-spinner-small" />
                    )}
                    <div className="table-name-compact">
                      {prefix && <span className="table-prefix">{prefix}</span>}
                      <span className="table-main-name">{mainName}</span>
                    </div>
                    {(table.isError || table.loadError || table.deferred || (table.nodeFiles && table.nodeFiles.some(f => f.isError))) && (
                      <div className="table-status-compact">
                        {(table.isError || (table.loaded && table.nodeFiles && table.nodeFiles.some(f => f.isError))) && (
                          <span className="status-icon">
                            ⚠️
                            {table.nodeFiles && table.nodeFiles.length > 1 && ` ${table.nodeFiles.filter(f => f.isError).length}/${table.nodeFiles.length}`}
                          </span>
                        )}
                        {table.loadError && (
                          <span className="status-icon">❌</span>
                        )}
                        {table.deferred && (
                          <span className="status-text">
                            {formatFileSize(table.size || 0)}
                          </span>
                        )}
                      </div>
                    )}
                    {table.chunkProgress && (
                      <div className="chunk-progress-bar">
                        <div
                          className="chunk-progress-fill"
                          style={{
                            width: `${table.chunkProgress.percentage}%`,
                            height: "3px",
                            backgroundColor: "#007acc",
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Empty Tables Section */}
              {clusterGroups[0].emptyTables.length > 0 && (
                <>
                  <div
                    className="subsection-header clickable"
                    onClick={() => toggleSection("empty")}
                  >
                    <span className="section-chevron">
                      {collapsedSections.has("empty") ? "▶" : "▼"}
                    </span>
                    Empty Tables ({clusterGroups[0].emptyTables.length})
                  </div>
                  {!collapsedSections.has("empty") &&
                    clusterGroups[0].emptyTables.map((table) => {
                      const { prefix, mainName } = parseTableName(table.name);
                      const isHighlighted =
                        navigation.state.isNavigating &&
                        navigation.state.items[
                          navigation.state.highlightedIndex
                        ]?.id === `table-${table.name}`;
                      return (
                        <div
                          key={table.name}
                          ref={(el) =>
                            registerElement(`table-${table.name}`, el)
                          }
                          className={`table-item-compact empty-table ${isHighlighted ? "keyboard-highlighted" : ""}`}
                          onClick={() => handleTableClick(table)}
                        >
                          <span className="table-row-count">0 rows</span>
                          <div className="table-name-compact">
                            {prefix && (
                              <span className="table-prefix">{prefix}</span>
                            )}
                            <span className="table-main-name">{mainName}</span>
                          </div>
                        </div>
                      );
                    })}
                </>
              )}
            </>
          )}
        </div>
      ) : null}

      {/* Show message if everything is filtered out */}
      {filter &&
        customQueryTabs.length === 0 &&
        allTables.length === 0 && (
          <div className="empty-state">
            <p>No matching items</p>
          </div>
        )}
    </div>
  );
}

export default TablesView;
