/**
 * Memory Monitor Modal - displays memory usage using performance.measureUserAgentSpecificMemory
 */

import { useEffect, useState } from "react";
import { formatBytes } from "../utils/memoryReporting";

interface MemoryMonitorProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MemoryMeasurement {
  bytes: number;
  breakdown: Array<{
    bytes: number;
    attribution: Array<{
      url: string;
      scope: string;
    }>;
  }>;
}

export function MemoryMonitor({ isOpen, onClose }: MemoryMonitorProps) {
  const [memoryData, setMemoryData] = useState<MemoryMeasurement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deviceMemory, setDeviceMemory] = useState<number | undefined>();

  const measureMemory = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (
        typeof performance !== "undefined" &&
        "measureUserAgentSpecificMemory" in performance
      ) {
        // TODO: This API requires cross-origin isolation (COOP/COEP headers).
        // We'll need to use coi-serviceworker to enable this, or alternatively
        // explore counting index sizes and DuckDB table sizes ourselves.
        const result = await (
          performance as { measureUserAgentSpecificMemory?: () => Promise<unknown> }
        ).measureUserAgentSpecificMemory?.();
        setMemoryData(result as MemoryMeasurement | null);
      } else {
        setError("measureUserAgentSpecificMemory not available");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to measure memory");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Get device memory if available
      if ("deviceMemory" in navigator) {
        setDeviceMemory((navigator as { deviceMemory?: number }).deviceMemory);
      }

      measureMemory();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
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
      onClick={onClose}
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
          fontFamily: "Monaco, Menlo, Ubuntu Mono, monospace",
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
              Memory Monitor
            </h2>
            <button
              onClick={onClose}
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
          {deviceMemory && (
            <div
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                marginBottom: "16px",
                textAlign: "center",
              }}
            >
              Device Memory: {deviceMemory}GB
            </div>
          )}

          {isLoading && (
            <div
              style={{
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: "14px",
              }}
            >
              Measuring memory usage...
            </div>
          )}

          {error && (
            <div
              style={{
                backgroundColor: "var(--bg-tertiary)",
                border: "1px solid #ff6b6b",
                borderRadius: "4px",
                padding: "12px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  color: "#ff6b6b",
                  fontSize: "12px",
                  fontWeight: "500",
                  marginBottom: "4px",
                }}
              >
                Error
              </div>
              <div style={{ color: "var(--text-secondary)", fontSize: "11px" }}>
                {error}
              </div>
              {error.includes("not available") && (
                <div
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "10px",
                    marginTop: "8px",
                  }}
                >
                  This API requires Chrome with cross-origin isolation enabled.
                </div>
              )}
            </div>
          )}

          {memoryData && (
            <div>
              <div
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  padding: "12px",
                  borderRadius: "4px",
                  marginBottom: "16px",
                  border: "1px solid var(--border-primary)",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "var(--text-primary)",
                    marginBottom: "8px",
                  }}
                >
                  Total Memory Usage
                </div>
                <div
                  style={{ fontSize: "18px", color: "var(--accent-primary)" }}
                >
                  {formatBytes(memoryData.bytes)}
                </div>
              </div>

              {memoryData.breakdown && memoryData.breakdown.length > 0 && (
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "var(--text-primary)",
                      marginBottom: "8px",
                    }}
                  >
                    Breakdown by Context
                  </div>
                  {memoryData.breakdown.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "var(--bg-tertiary)",
                        padding: "8px",
                        borderRadius: "4px",
                        marginBottom: "8px",
                        border: "1px solid var(--border-primary)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--text-primary)",
                        }}
                      >
                        {formatBytes(item.bytes)}
                      </div>
                      {item.attribution &&
                        item.attribution.map((attr, attrIndex) => (
                          <div
                            key={attrIndex}
                            style={{
                              fontSize: "10px",
                              color: "var(--text-muted)",
                              marginTop: "2px",
                            }}
                          >
                            {attr.scope}: {attr.url}
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
