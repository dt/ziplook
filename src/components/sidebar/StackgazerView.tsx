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

function StackgazerView() {
  const { state } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [loadedFiles, setLoadedFiles] = useState<Set<string>>(new Set());

  // Track loaded files when stackData changes
  useEffect(() => {
    if (state.stackData) {
      setLoadedFiles(new Set(Object.keys(state.stackData)));
    }
  }, [state.stackData]);

  // Reset loaded files when stack files are discovered
  useEffect(() => {
    if (state.stackFiles) {
      setLoadedFiles(new Set());
    }
  }, [state.stackFiles]);

  // Reset loading state when stackgazer is ready
  useEffect(() => {
    if (state.stackgazerReady) {
      setIsLoading(false);
    }
  }, [state.stackgazerReady]);

  const handleLoadStacks = async () => {
    setIsLoading(true);
    setLoadedFiles(new Set()); // Clear any previously loaded files
    try {
      const workerManager = await getWorkerManager();
      await workerManager.loadStackFiles();
    } catch (error) {
      console.error("Failed to load stack files:", error);
      setIsLoading(false);
    }
    // Note: setIsLoading(false) is handled by the useEffect above when stackgazerReady becomes true
  };

  // Note: Removed global loading state - loading is now handled in the button area only

  // Show loaded state if stackgazer is ready
  if (
    state.stackgazerReady &&
    state.stackData &&
    Object.keys(state.stackData).length > 0
  ) {
    const stackFiles = Object.keys(state.stackData);
    return (
      <div className="stackgazer-sidebar">
        <div className="loaded-state">
          <div className="state-header">
            <h4>Stack Browser Active</h4>
            <div className="file-count">{stackFiles.length} files loaded</div>
          </div>
          <div className="loaded-files">
            {stackFiles.map((filePath, index) => (
              <div key={index} className="loaded-file-item">
                <div className="file-icon">📄</div>
                <div className="file-name">
                  {filePath.split("/").pop() || filePath}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show discovery state if stack files are discovered but not loaded
  if (state.stackFiles && state.stackFiles.length > 0) {
    const totalSize = state.stackFiles.reduce(
      (sum, file) => sum + file.size,
      0,
    );

    return (
      <div className="stackgazer-sidebar">
        <div className="discovery-state">
          <div className="state-header">
            <h4>Stack Files Found</h4>
            <div className="file-count">
              {state.stackFiles.length} files discovered
            </div>
          </div>

          <div className="summary-info">
            <div className="summary-stat">
              <span className="label">Total size:</span>
              <span className="value">{formatFileSize(totalSize)}</span>
            </div>
          </div>

          <div className="discovered-files">
            {state.stackFiles.map((file, index) => {
              const isFileLoaded = loadedFiles.has(file.path);
              const isFileLoading = isLoading && !isFileLoaded;

              return (
                <div key={index} className="discovered-file-item">
                  <div className="file-icon">📄</div>
                  <div className="file-details">
                    <div className="file-name">{file.path}</div>
                    <div className="file-size">{formatFileSize(file.size)}</div>
                  </div>
                  <div className="file-status-indicator">
                    {isFileLoaded ? (
                      <div className="file-checkmark">✓</div>
                    ) : isFileLoading ? (
                      <div className="file-spinner"></div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="load-action">
            {isLoading ? (
              <div className="loading-action">
                <div className="loading-spinner"></div>
                <span>Loading {state.stackFiles.length} files...</span>
              </div>
            ) : (
              <button className="load-stacks-btn" onClick={handleLoadStacks}>
                Load and Launch Stack Browser
              </button>
            )}
          </div>
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
