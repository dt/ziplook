import { useState, useEffect } from "react";
import { useApp } from "../../state/AppContext";
import { getWorkerManager } from "../../services/WorkerManager";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

interface StackgazerViewProps {
  onCollapse?: () => void;
}

type StackMode = "per-goroutine" | "labeled";

function StackgazerView({ onCollapse }: StackgazerViewProps) {
  const { state, dispatch } = useApp();
  const mode = state.stackgazerMode || "per-goroutine";
  const [loadedFiles, setLoadedFiles] = useState<Set<string>>(new Set());
  const [filterText, setFilterText] = useState("");

  // Track loaded files when stackData changes (use mode-specific data)
  useEffect(() => {
    const stackData = mode === "per-goroutine" ? state.stackDataPerG : state.stackDataLabeled;
    if (stackData) {
      setLoadedFiles(new Set(Object.keys(stackData)));
    }
  }, [state.stackDataPerG, state.stackDataLabeled, mode]);

  const handleLoadSingleFile = async (filePath: string, shouldCollapse = true) => {
    try {
      const workerManager = await getWorkerManager();
      await workerManager.loadSingleStackFile(filePath);
      // Collapse sidebar after loading a file
      if (shouldCollapse) {
        setTimeout(() => {
          onCollapse?.();
        }, 300);
      }
    } catch (error) {
      console.error("Failed to load stack file:", error);
    }
  };

  const handleLoadAll = async (filesToLoad: Array<{ path: string; size: number; compressedSize: number }>) => {
    // Load all filtered files by calling handleLoadSingleFile for each one
    for (const file of filesToLoad) {
      if (!loadedFiles.has(file.path)) {
        await handleLoadSingleFile(file.path, false);
      }
    }
    // Collapse sidebar after loading all files
    setTimeout(() => {
      onCollapse?.();
    }, 300);
  };

  // Note: Removed global loading state - loading is now handled in the button area only

  // If we have stackFiles available, show the full list
  if (state.stackFiles && state.stackFiles.length > 0) {
    // Filter files based on selected mode
    const modeFilteredFiles = state.stackFiles.filter((file) => {
      if (mode === "per-goroutine") {
        return file.path.endsWith("stacks.txt");
      } else {
        return file.path.endsWith("stacks_with_labels.txt");
      }
    });

    const totalSize = modeFilteredFiles.reduce(
      (sum, file) => sum + file.size,
      0,
    );
    const totalSizeMB = totalSize / (1024 * 1024);
    const showLoadAllButton = totalSizeMB < 50;
    const showFilter = modeFilteredFiles.length > 10;

    // Sort files by path
    const sortedFiles = [...modeFilteredFiles].sort((a, b) =>
      a.path.localeCompare(b.path)
    );

    // Filter files based on search text
    const filteredFiles = filterText
      ? sortedFiles.filter((file) =>
          file.path.toLowerCase().includes(filterText.toLowerCase())
        )
      : sortedFiles;

    const loadedCount = loadedFiles.size;
    const isStackgazerActive = state.stackgazerReady && loadedCount > 0;

    return (
      <div className="stackgazer-sidebar">
        <div className="discovery-state">
          {/* Mode toggle */}
          <div style={{
            padding: "8px 0",
            borderBottom: "1px solid var(--border-primary)",
            marginBottom: "8px"
          }}>
            <div style={{
              display: "flex",
              gap: "4px",
              backgroundColor: "var(--bg-tertiary)",
              borderRadius: "4px",
              padding: "2px",
            }}>
              <button
                onClick={() => dispatch({ type: "SET_STACKGAZER_MODE", mode: "per-goroutine" })}
                style={{
                  flex: 1,
                  padding: "6px 8px",
                  fontSize: "12px",
                  border: "none",
                  borderRadius: "3px",
                  backgroundColor: mode === "per-goroutine" ? "var(--accent-primary)" : "transparent",
                  color: mode === "per-goroutine" ? "white" : "var(--text-primary)",
                  cursor: "pointer",
                  fontWeight: mode === "per-goroutine" ? "500" : "normal",
                }}
              >
                Per-Goroutine
              </button>
              <button
                onClick={() => dispatch({ type: "SET_STACKGAZER_MODE", mode: "labeled" })}
                style={{
                  flex: 1,
                  padding: "6px 8px",
                  fontSize: "12px",
                  border: "none",
                  borderRadius: "3px",
                  backgroundColor: mode === "labeled" ? "var(--accent-primary)" : "transparent",
                  color: mode === "labeled" ? "white" : "var(--text-primary)",
                  cursor: "pointer",
                  fontWeight: mode === "labeled" ? "500" : "normal",
                }}
              >
                Labeled Groups
              </button>
            </div>
          </div>

          <div className="state-header">
            <h4>{isStackgazerActive ? "Stack Browser Active" : "Stack Files Found"}</h4>
            <div className="file-count">
              {isStackgazerActive
                ? `${loadedCount} of ${modeFilteredFiles.length} files loaded`
                : `${modeFilteredFiles.length} files discovered`}
            </div>
          </div>

          {!isStackgazerActive && (
            <div className="summary-info">
              <div className="summary-stat">
                <span className="label">Total size:</span>
                <span className="value">{formatFileSize(totalSize)}</span>
              </div>
            </div>
          )}

          {showFilter && (
            <div className="filter-container" style={{ padding: "8px 0" }}>
              <input
                type="text"
                className="filter-input"
                placeholder="Filter files..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  fontSize: "12px",
                  border: "1px solid var(--border-primary)",
                  borderRadius: "4px",
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-primary)",
                }}
              />
              {filterText && (
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    marginTop: "4px",
                  }}
                >
                  Showing {filteredFiles.length} of {state.stackFiles.length} files
                </div>
              )}
            </div>
          )}

          <div className="discovered-files">
            {filteredFiles.map((file, index) => {
              const isFileLoaded = loadedFiles.has(file.path);
              // Remove "debug/" prefix from display name
              const displayName = file.path.startsWith("debug/")
                ? file.path.substring(6)
                : file.path;

              return (
                <div
                  key={index}
                  className="discovered-file-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div className="file-icon">📄</div>
                  <div className="file-details" style={{ flex: 1 }}>
                    <div className="file-name">{displayName}</div>
                    <div className="file-size">{formatFileSize(file.size)}</div>
                  </div>
                  <button
                    onClick={() => handleLoadSingleFile(file.path)}
                    disabled={isFileLoaded}
                    style={{
                      padding: "4px 8px",
                      fontSize: "11px",
                      border: "1px solid var(--border-primary)",
                      borderRadius: "3px",
                      backgroundColor: isFileLoaded
                        ? "var(--bg-secondary)"
                        : "var(--accent-primary)",
                      color: isFileLoaded ? "var(--text-muted)" : "white",
                      cursor: isFileLoaded ? "not-allowed" : "pointer",
                      opacity: isFileLoaded ? 0.6 : 1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {isFileLoaded ? "Loaded" : "Load"}
                  </button>
                </div>
              );
            })}
          </div>

          {showLoadAllButton && (
            <div className="load-action">
              <button
                className="load-stacks-btn"
                onClick={() => handleLoadAll(filteredFiles)}
                disabled={filteredFiles.every(file => loadedFiles.has(file.path))}
              >
                {filteredFiles.every(file => loadedFiles.has(file.path))
                  ? `All ${filteredFiles.length} File${filteredFiles.length !== 1 ? 's' : ''} Loaded`
                  : `Load All ${filteredFiles.length} File${filteredFiles.length !== 1 ? 's' : ''}`}
              </button>
            </div>
          )}

          {!showLoadAllButton && (
            <div
              style={{
                padding: "12px",
                backgroundColor: "var(--bg-tertiary)",
                borderRadius: "4px",
                fontSize: "11px",
                color: "var(--text-muted)",
                textAlign: "center",
                marginTop: "8px",
              }}
            >
              Total size is {formatFileSize(totalSize)}. Load files individually above.
            </div>
          )}
        </div>
      </div>
    );
  }


  // Show empty state
  return (
    <div className="stackgazer-sidebar">
      <div className="empty-state">
        <div className="empty-icon">📄</div>
        <h4>No Stack Files</h4>
        <p>No stack trace files were found in this archive.</p>
      </div>
    </div>
  );
}

export default StackgazerView;
