import React, { useState, useCallback } from "react";
import { useApp } from "../state/AppContext";
// import { createSendSafelyClient } from "../utils/sendSafelyClient";

function DropZone() {
  const { dispatch, state, waitForWorkers } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  // const [sendSafelyUrl, setSendSafelyUrl] = useState("");
  // const [showApiModal, setShowApiModal] = useState(false);
  // const [apiHost, setApiHost] = useState("");
  // const [apiKey, setApiKey] = useState("");
  // const [apiSecret, setApiSecret] = useState("");
  // const [validationStatus, setValidationStatus] = useState<{
  //   isValid: boolean;
  //   message: string;
  //   email?: string;
  // } | null>(null);
  // const [isValidating, setIsValidating] = useState(false);
  // const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  // Check if we should show loading state (either local loading or tables loading)
  const isLoading = loading || state.tablesLoading;

  // localStorage helpers
  // const getSavedCredentials = () => {
  //   try {
  //     const saved = localStorage.getItem('sendsafely_config');
  //     if (saved) {
  //       const config = JSON.parse(saved);
  //       return {
  //         host: config.host || 'https://upload.cockroachlabs.com',
  //         key: config.key || '',
  //         secret: config.secret || ''
  //       };
  //     }
  //   } catch (e) {
  //     console.error('Failed to parse SendSafely config:', e);
  //   }
  //   return { host: 'https://upload.cockroachlabs.com', key: '', secret: '' };
  // };

  // const saveCredentials = (host: string, key: string, secret: string) => {
  //   try {
  //     localStorage.setItem('sendsafely_config', JSON.stringify({ host, key, secret }));
  //   } catch (e) {
  //     console.error('Failed to save SendSafely config:', e);
  //   }
  // };

  // const hasValidCredentials = () => {
  //   const { host, key, secret } = getSavedCredentials();
  //   return host && key.length === 22 && secret.length === 22;
  // };

  // const isValidSendSafelyUrl = (url: string) => {
  //   return url.includes('keyCode');
  // };

  // const validateCredentials = async (host: string, key: string, secret: string) => {
  //   if (!host || key.length !== 22 || secret.length !== 22) {
  //     return;
  //   }

  //   setIsValidating(true);
  //   setValidationStatus(null);

  //   try {
  //     const client = createSendSafelyClient(host, key, secret);
  //     const userInfo = await client.verifyCredentials();

  //     setValidationStatus({
  //       isValid: true,
  //       message: `✅ Valid credentials`,
  //       email: userInfo.email
  //     });
  //   } catch (error) {
  //     setValidationStatus({
  //       isValid: false,
  //       message: `❌ Invalid credentials: ${error instanceof Error ? error.message : 'Unknown error'}`
  //     });
  //   } finally {
  //     setIsValidating(false);
  //   }
  // };

  // const handleSendSafelyUrlChange = (url: string) => {
  //   setSendSafelyUrl(url);

  //   if (debounceTimeout.current) {
  //     clearTimeout(debounceTimeout.current);
  //   }

  //   debounceTimeout.current = setTimeout(() => {
  //     if (isValidSendSafelyUrl(url)) {
  //       if (!hasValidCredentials()) {
  //         setShowApiModal(true);
  //       } else {
  //         alert('File loading from SendSafely not yet implemented');
  //       }
  //     }
  //   }, 500);
  // };

  // Load saved credentials when modal opens
  // useEffect(() => {
  //   if (showApiModal) {
  //     const { host, key, secret } = getSavedCredentials();
  //     setApiHost(host);
  //     setApiKey(key);
  //     setApiSecret(secret);
  //     // setValidationStatus(null);

  //     // Auto-validate if we have saved credentials
  //     if (host && key && secret) {
  //       // validateCredentials(host, key, secret);
  //     }
  //   }
  // }, [showApiModal]);

  // Auto-validate when all fields look valid
  // useEffect(() => {
  //   if (apiHost && apiKey.length === 22 && apiSecret.length === 22) {
  //     // validateCredentials(apiHost, apiKey, apiSecret);
  //   } else {
  //     // setValidationStatus(null);
  //   }
  // }, [apiHost, apiKey, apiSecret]);


  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".zip")) {
      setError("Please select a .zip file");
      return;
    }

    setLoading(true);
    setLoadingMessage(
      `Reading ${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)...`,
    );
    setError(null);

    try {
      setLoadingMessage("Loading file into memory...");

      // Read file with progress tracking
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Wait for workers to be ready (they're initializing eagerly in background)
      let workerManager = state.workerManager;
      if (!state.workersReady || !workerManager) {
        console.log("⏳ Waiting for workers to finish initializing...");
        setLoadingMessage("Setting up background processing...");

        // Wait for workers that are already initializing
        workerManager = await waitForWorkers();

        if (!workerManager) {
          throw new Error("WorkerManager not available after initialization");
        }
      }

      // Set up callbacks to listen for controller notifications BEFORE starting load
      workerManager.updateCallbacks({
        onLoadingStage: (stage: string, message: string) => {
          setLoadingMessage(message);

          if (stage === "complete" || stage === "error") {
            setLoading(false);
          }

          // Stack data is now sent directly by controller via onSendStackDataToIframe callback
        },
        onSendStackFileToIframe: (path: string, content: string) => {
          // Send directly to iframe immediately - no storage needed
          const preloadedIframe = document.getElementById("stackgazer-preload") as HTMLIFrameElement;
          if (preloadedIframe?.contentWindow) {
            setTimeout(() => {
              try {
                preloadedIframe.contentWindow!.postMessage(
                  {
                    type: "LOAD_STACK_FILE",
                    path: path,
                    content: content,
                  },
                  window.location.origin,
                );
              } catch (error) {
                console.error("Error sending stack file to iframe:", error);
              }
            }, 10); // Shorter delay since we're sending one file at a time
          }
        },
        onStackProcessingComplete: (_stackFilesCount: number) => {

          // Enable stackgazer UI - all files have been streamed to iframe
          dispatch({ type: "SET_STACK_DATA", stackData: {} });
        },
        onFileList: (entries: any[], totalFiles: number) => {
          console.log(`🎯 Received file list: ${totalFiles} files`);

          // Store workerManager globally for later file reading
          (window as any).__zipReader = workerManager;

          dispatch({
            type: "SET_ZIP",
            name: file.name,
            size: file.size,
            entries,
          });

          // Set tables loading state - controller will start loading them
          dispatch({ type: "SET_TABLES_LOADING", loading: true });
        },
        onTableAdded: (table: any) => {
          // Controller already prepared the table, just register it
          dispatch({
            type: "REGISTER_TABLE",
            table: {
              name: table.name,
              sourceFile: table.sourceFile,
              loaded: table.loaded,
              size: table.size,
              nodeId: table.nodeId,
              originalName: table.originalName,
              isError: table.isError,
            },
          });
        },
        onIndexingProgress: (progress: { current: number; total: number; fileName: string }) => {
          setLoadingMessage(`Indexing log files: ${progress.current}/${progress.total} - ${progress.fileName}`);
        },
        onIndexingComplete: (success: boolean, _totalEntries: number, error?: string, ruleDescription?: string) => {

          // Update global indexing status for SearchView to access
          dispatch({
            type: "SET_INDEXING_STATUS",
            status: success ? "ready" : "none",
            ruleDescription,
          });

          if (success) {
            // Indexing completed successfully
            // Clear loading state since indexing is complete
            setLoading(false);
            setLoadingMessage("");
          } else {
            console.error(`❌ DropZone: Indexing failed: ${error}`);
            setLoading(false);
            setError(`Indexing failed: ${error}`);
          }
        },
        onFileStatusUpdate: (fileStatuses: any[]) => {
          // Store file statuses in global state for SearchView to access
          dispatch({
            type: "SET_FILE_STATUSES",
            fileStatuses
          });
        }
      });

      // Just trigger the loading - controller will drive everything from here
      console.log("🚀 Starting controller-driven pipeline...");
      await workerManager.loadZipData(uint8Array);

    } catch (err) {
      console.error("Failed to read zip:", err);
      setError(
        `Failed to read zip: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
      setLoading(false);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const loadDemoFile = useCallback(async () => {
    setLoading(true);
    setLoadingMessage("Loading demo file...");
    setError(null);

    try {
      // Use relative path that works in both dev and production
      const response = await fetch(
        `${import.meta.env.BASE_URL}debug_renamed.zip`,
      );
      if (!response.ok) {
        throw new Error("Failed to load demo file");
      }
      const arrayBuffer = await response.arrayBuffer();
      const file = new File([arrayBuffer], "debug_renamed.zip", {
        type: "application/zip",
      });
      handleFile(file);
    } catch (err) {
      console.error("Failed to load demo file:", err);
      setError(
        `Failed to load demo file: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
      setLoading(false);
    }
  }, []);

  return (
    <div
      className={`drop-zone ${isDragging ? "dragover" : ""}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => document.getElementById("file-input")?.click()}
      style={{ cursor: "pointer" }}
    >
      <input
        id="file-input"
        type="file"
        accept=".zip"
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />

      <div className="drop-message">
        {isLoading ? (
          <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="loading-spinner-small" />
            {loadingMessage || "Loading tables..."}
          </p>
        ) : error ? (
          <>
            <h2 style={{ color: "var(--accent-danger)" }}>Error</h2>
            <p>{error}</p>
            <button className="btn" onClick={() => setError(null)}>
              Try Again
            </button>
          </>
        ) : (
          <>
            <h2>📦 Drop a debug.zip here</h2>
            <p>or click to browse and select a file</p>
            {/* <div style={{ margin: "1rem 0", fontSize: "0.9rem" }}>
              <p style={{ marginBottom: "0.5rem" }}>or paste a SendSafely link to browse a remote zip:</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="text"
                  placeholder="https://company.sendsafely.com/receive/?packageCode=..."
                  value={sendSafelyUrl}
                  onChange={(e) => handleSendSafelyUrlChange(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    fontSize: "0.85rem",
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowApiModal(true);
                  }}
                  style={{
                    padding: "0.5rem",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    background: "var(--background)",
                    cursor: "pointer",
                  }}
                  title="Configure SendSafely API credentials"
                >
                  ⚙️
                </button>
              </div>
            </div> */}
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                marginTop: "0.5rem",
              }}
            >
              all processing is local and in-browser -- nothing is uploaded
            </p>
            <div style={{ marginTop: "1rem" }}>
              <button
                className="btn btn-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  loadDemoFile();
                }}
                style={{
                  fontSize: "0.9rem",
                  padding: "0.5rem 1rem",
                  background: "var(--accent-muted)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  cursor: "pointer",
                }}
              >
                🚀 Try Demo File
              </button>
            </div>
          </>
        )}
      </div>

      {/* SendSafely Modal - Commented out
      {showApiModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "var(--bg-overlay)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => {
            setShowApiModal(false);
            // setValidationStatus(null);
          }}
        >
          <div
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-primary)",
              borderRadius: "8px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "80vh",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid var(--border-primary)",
                backgroundColor: "var(--bg-tertiary)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "var(--accent-primary)",
                    margin: 0,
                  }}
                >
                  SendSafely API Configuration
                </h2>
                <button
                  onClick={() => {
                    setShowApiModal(false);
                    // setValidationStatus(null);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--text-secondary)",
                    fontSize: "18px",
                    cursor: "pointer",
                    padding: "0 4px",
                    lineHeight: "1",
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            <div
              style={{
                padding: "16px",
                overflow: "auto",
                maxHeight: "calc(80vh - 60px)",
              }}
            >
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "16px" }}>
                <p style={{ margin: "0 0 8px 0" }}>To set up SendSafely API access:</p>
                <ul style={{ margin: "0", paddingLeft: "16px" }}>
                  <li>Login to https://upload.cockroachlabs.com</li>
                  <li>Click your user in top right corner and select 'Edit Profile'</li>
                  <li>Go to 'API Keys' to generate a new key</li>
                  <li>Provide the Key ID and Secret below</li>
                </ul>
                <p style={{ margin: "8px 0 0 0", fontSize: "11px", fontStyle: "italic" }}>
                  (Keys never leave this tab's local storage)
                </p>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "var(--text-primary)"
                }}>
                  SendSafely Host:
                </label>
                <input
                  type="text"
                  placeholder="https://upload.cockroachlabs.com"
                  value={apiHost}
                  onChange={(e) => setApiHost(e.target.value)}
                  autoComplete="off"
                  spellCheck="false"
                  autoCorrect="off"
                  autoCapitalize="off"
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "4px",
                    backgroundColor: "var(--bg-tertiary)",
                    color: "var(--text-primary)",
                    fontSize: "12px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "var(--text-primary)"
                }}>
                  API Key ID:
                </label>
                <input
                  type="text"
                  placeholder="Enter your API Key ID"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  autoComplete="off"
                  spellCheck="false"
                  autoCorrect="off"
                  autoCapitalize="off"
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "4px",
                    backgroundColor: "var(--bg-tertiary)",
                    color: "var(--text-primary)",
                    fontSize: "12px",
                    boxSizing: "border-box",
                    fontFamily: "Monaco, Menlo, Ubuntu Mono, monospace",
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "var(--text-primary)"
                }}>
                  API Secret:
                </label>
                <input
                  type="password"
                  placeholder="Enter your API secret"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  autoComplete="off"
                  spellCheck="false"
                  autoCorrect="off"
                  autoCapitalize="off"
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "4px",
                    backgroundColor: "var(--bg-tertiary)",
                    color: "var(--text-primary)",
                    fontSize: "12px",
                    boxSizing: "border-box",
                    fontFamily: "Monaco, Menlo, Ubuntu Mono, monospace",
                  }}
                />
              </div>

              {isValidating && (
                <div
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "4px",
                    padding: "12px",
                    marginBottom: "16px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    🔄 Validating credentials...
                  </div>
                </div>
              )}

              {validationStatus && (
                <div
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    border: `1px solid ${validationStatus.isValid ? '#4ade80' : '#ef4444'}`,
                    borderRadius: "4px",
                    padding: "12px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      color: validationStatus.isValid ? '#4ade80' : '#ef4444',
                      fontSize: "12px",
                      fontWeight: "500",
                      marginBottom: validationStatus.email ? "4px" : "0",
                    }}
                  >
                    {validationStatus.message}
                  </div>
                  {validationStatus.email && (
                    <div style={{ color: "var(--text-secondary)", fontSize: "11px" }}>
                      Associated email: {validationStatus.email}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div
              style={{
                padding: "12px 16px",
                borderTop: "1px solid var(--border-primary)",
                backgroundColor: "var(--bg-tertiary)",
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <button
                onClick={() => {
                  setShowApiModal(false);
                  // setValidationStatus(null);
                }}
                style={{
                  padding: "6px 12px",
                  border: "1px solid var(--border-primary)",
                  borderRadius: "4px",
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text-secondary)",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                disabled={!validationStatus?.isValid}
                onClick={() => {
                  if (validationStatus?.isValid) {
                    saveCredentials(apiHost, apiKey, apiSecret);
                    setShowApiModal(false);
                    // setValidationStatus(null);
                  }
                }}
                style={{
                  padding: "6px 12px",
                  border: "1px solid var(--border-primary)",
                  borderRadius: "4px",
                  backgroundColor: validationStatus?.isValid ? "var(--accent-primary)" : "var(--bg-secondary)",
                  color: validationStatus?.isValid ? "white" : "var(--text-muted)",
                  fontSize: "12px",
                  cursor: validationStatus?.isValid ? "pointer" : "not-allowed",
                  opacity: validationStatus?.isValid ? 1 : 0.6,
                }}
              >
                Save and Close
              </button>
            </div>
          </div>
        </div>
      )}
      */}
    </div>
  );
}

export default DropZone;
