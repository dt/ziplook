import { useApp } from "../state/AppContext";
import { useState } from "react";

interface ErrorViewerProps {
  tabId: string;
  error: string;
  sourceFile: string;
  tableName: string;
  fullTableName?: string;
  isPreLoadError?: boolean;
  errorFiles?: Array<{ path: string; nodeId: number; size: number; isError: boolean }>;
  availableFiles?: Array<{ path: string; nodeId: number; size: number; isError: boolean }>;
}

function ErrorViewer({
  tabId,
  error,
  sourceFile,
  tableName,
  fullTableName,
  isPreLoadError,
  errorFiles,
  availableFiles,
}: ErrorViewerProps) {
  const { state, dispatch } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  const handleViewFile = (filePath?: string) => {
    const pathToOpen = filePath || sourceFile;
    dispatch({
      type: "OPEN_TAB",
      tab: {
        kind: "file",
        id: pathToOpen,
        fileId: pathToOpen,
        title: pathToOpen.split("/").pop() || pathToOpen,
      },
    });
  };

  const handleLoadAvailableData = async () => {
    if (!availableFiles || availableFiles.length === 0 || !state.workerManager) {
      return;
    }

    // Use fullTableName (with _by_node) for loading, fallback to tableName
    const tableNameForLoading = fullTableName || tableName;

    setIsLoading(true);
    try {
      // Load the table with only the non-error files
      await state.workerManager.loadSingleTable({
        name: tableNameForLoading,
        path: availableFiles[0].path, // Required but not used for multi-node
        size: 0, // Will be calculated from nodeFiles
        originalName: tableName, // Original name without _by_node
        isError: false,
        nodeFiles: availableFiles,
      });

      // Close this error tab and open the SQL tab for the loaded table
      dispatch({ type: "CLOSE_TAB", id: tabId });
      setTimeout(() => {
        dispatch({
          type: "OPEN_TAB",
          tab: {
            kind: "sql",
            id: `sql-${tableNameForLoading}`,
            title: tableNameForLoading,
            query: `SELECT * FROM "${tableNameForLoading}" LIMIT 100`,
            sourceTable: tableNameForLoading,
            isCustomQuery: false,
          },
        });
      }, 100);
    } catch (err) {
      console.error("Failed to load available data:", err);
      alert(`Failed to load data: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Parse the error message to extract useful information
  const parseError = (errorMsg: string) => {
    // Look for line number in error
    const lineMatch = errorMsg.match(/Line:\s*(\d+)/i);
    const lineNumber = lineMatch ? lineMatch[1] : null;

    // Look for "Original Line" content if present
    const originalLineMatch = errorMsg.match(
      /Original Line[:\s]+(.+?)(?:\n|$)/i,
    );
    const originalLine = originalLineMatch ? originalLineMatch[1] : null;

    return { lineNumber, originalLine, fullError: errorMsg };
  };

  // Handle pre-load errors (.err.txt files)
  if (isPreLoadError) {
    const isSingleFile = !errorFiles || errorFiles.length === 1;
    const hasAvailableFiles = availableFiles && availableFiles.length > 0;

    // Helper to format file sizes
    const formatSize = (bytes?: number) => {
      if (!bytes) return "";
      const kb = bytes / 1024;
      const mb = kb / 1024;
      if (mb >= 1) return `${mb.toFixed(1)} MB`;
      if (kb >= 1) return `${kb.toFixed(1)} KB`;
      return `${bytes} B`;
    };

    // Calculate total size of available files
    const totalSize = availableFiles?.reduce((sum, file) => sum + (file.size || 0), 0) || 0;

    return (
      <div className="error-viewer">
        <div className="error-header">
          <h2>⚠️ Failed to Load Table: {tableName}</h2>
        </div>

        <div className="error-content">
          <div className="error-section">
            <h3>{isSingleFile ? "Error File Found" : `Error Files (${errorFiles?.length}${hasAvailableFiles ? `/${errorFiles!.length + availableFiles.length}` : ""} nodes)`}</h3>
            <p style={{ marginBottom: "12px" }}>
              {isSingleFile
                ? "An error file was encountered while attempting to load this table:"
                : "Some nodes encountered errors while attempting to load this table:"}
            </p>
            <ul className="error-file-list" style={{ paddingLeft: "24px" }}>
              {errorFiles?.map((file, idx) => (
                <li key={idx} className="error-file-item">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleViewFile(file.path);
                    }}
                    style={{ color: "var(--link-color, #61afef)", cursor: "pointer", textDecoration: "none" }}
                  >
                    {file.path}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {hasAvailableFiles && (
            <div className="error-section">
              <h3>Available Files ({availableFiles.length} nodes)</h3>
              <p style={{ marginBottom: "12px" }}>
                The following nodes have valid data files:
              </p>
              <ul className="available-file-list" style={{ paddingLeft: "24px" }}>
                {availableFiles.map((file, idx) => (
                  <li key={idx} className="available-file-item">
                    <span className="file-path">{file.path}</span>
                    <span className="file-size" style={{ marginLeft: "8px", color: "var(--text-muted)" }}>
                      ({formatSize(file.size)})
                    </span>
                  </li>
                ))}
              </ul>
              <button
                className="btn btn-primary"
                onClick={handleLoadAvailableData}
                disabled={isLoading}
                style={{ marginTop: "16px" }}
              >
                {isLoading ? "Loading..." : `Load Available Data (${availableFiles.length} nodes, ${formatSize(totalSize)})`}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Handle DuckDB load errors (original behavior)
  const { lineNumber, originalLine, fullError } = parseError(error);

  return (
    <div className="error-viewer">
      <div className="error-header">
        <h2>Failed to Load Table: {tableName}</h2>
        <button className="btn btn-sm" onClick={() => handleViewFile()}>
          📄 View Source File
        </button>
      </div>

      <div className="error-content">
        <div className="error-section">
          <h3>Error Details</h3>
          <div className="error-box">
            {lineNumber && (
              <div className="error-field">
                <span className="error-label">Line Number:</span>
                <span className="error-value">{lineNumber}</span>
              </div>
            )}
            {originalLine && (
              <div className="error-field">
                <span className="error-label">Problematic Line:</span>
                <pre className="error-line-content">{originalLine}</pre>
              </div>
            )}
          </div>
        </div>

        <div className="error-section">
          <h3>Full Error Message</h3>
          <pre className="error-message">{fullError}</pre>
        </div>

        <div className="error-section">
          <h3>Troubleshooting</h3>
          <div className="error-hints">
            <p>This error typically occurs when:</p>
            <ul>
              <li>The CSV/TSV file has inconsistent column counts</li>
              <li>There are unescaped quotes or special characters</li>
              <li>The delimiter is not correctly detected</li>
              <li>The file encoding is not UTF-8</li>
            </ul>
            <p className="hint-action">
              Click "View Source File" above to inspect the raw data and
              identify the issue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorViewer;
