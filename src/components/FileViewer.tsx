import { useEffect, useState, memo, useCallback, useRef } from "react";
import type { ViewerTab } from "../state/types";
import EnhancedFileViewer from "./EnhancedFileViewer";

interface FileViewerProps {
  tab: ViewerTab & { kind: "file" };
}

// Feature flag - set to true to enable enhanced viewer
const USE_ENHANCED_VIEWER = true;

// Memoize just the content rendering - let the browser handle large text
const FileContent = memo(({ content }: { content: string }) => {
  return (
    <pre className="file-content">
      <code>{content}</code>
    </pre>
  );
});

FileContent.displayName = "FileContent";

function FileViewer({ tab }: FileViewerProps) {
  // Move all hooks to the top to avoid conditional hook calls
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");
  const [progress, setProgress] = useState({ loaded: 0, total: 0, percent: 0 });
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<(() => void) | null>(null);
  const loadInitiatedRef = useRef(false);

  const loadFile = useCallback(async () => {
    setLoading(true);
    setError(null);
    setContent("");
    setProgress({ loaded: 0, total: 0, percent: 0 });
    setIsStreaming(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const reader = (window as any).__zipReader;
      if (!reader) {
        throw new Error("No zip file loaded");
      }

      // Store abort function
      abortRef.current = () => reader.cancelStream();

      let accumulatedContent = "";
      const startTime = Date.now();
      let lastUpdateTime = startTime;

      // Use streaming API
      await reader.readFileStream(
        tab.fileId || tab.id, // Use fileId if available, fallback to id for backwards compatibility
        (
          chunk: string,
          info: { loaded: number; total: number; done: boolean },
        ) => {
          accumulatedContent += chunk;

          // Update progress
          const percent =
            info.total > 0 ? Math.round((info.loaded / info.total) * 100) : 0;
          setProgress({ loaded: info.loaded, total: info.total, percent });

          // Update content periodically (every 100ms) or when done
          const now = Date.now();
          if (now - lastUpdateTime > 100 || info.done) {
            setContent(accumulatedContent);
            lastUpdateTime = now;
          }

          if (info.done) {
            setLoading(false);
            setIsStreaming(false);
            abortRef.current = null;
            loadInitiatedRef.current = false; // Reset for potential future loads
          }
        },
        (loaded: number, total: number) => {
          // Additional progress callback
          const percent = total > 0 ? Math.round((loaded / total) * 100) : 0;
          setProgress({ loaded, total, percent });
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
      loadInitiatedRef.current = false; // Reset on error for potential retry
    }
  }, [tab.fileId, tab.id]);

  useEffect(() => {
    // Load once on mount - prevent double loading during React StrictMode double mount
    if (!content && !loading && !loadInitiatedRef.current) {
      console.log(`Loading file from zip: ${tab.id}`);
      loadInitiatedRef.current = true;
      loadFile();
    }

    // Cleanup on unmount
    return () => {
      if (abortRef.current) {
        abortRef.current();
      }
    };
  }, [content, loading, loadFile, tab.id]);

  // Use enhanced viewer if enabled
  if (USE_ENHANCED_VIEWER) {
    return <EnhancedFileViewer tab={tab} />;
  }

  console.log(`FileViewer RENDER for ${tab.id}`);

  // Helper function for formatting file sizes
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  // Show loading state only when no content yet
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

  return (
    <div className="file-viewer">
      {isStreaming && (
        <div className="streaming-header">
          <div className="streaming-progress">
            <span className="streaming-text">
              Loading... {formatFileSize(progress.loaded)} /{" "}
              {formatFileSize(progress.total)} ({progress.percent}%)
            </span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>
        </div>
      )}
      <FileContent content={content} />
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

export default FileViewer;
