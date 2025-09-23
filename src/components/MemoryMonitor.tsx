/**
 * Memory Monitor Modal - displays current memory usage across all workers
 */

import { useEffect, useState } from 'react';
import { useApp } from '../state/AppContext';
import { formatBytes, getMemoryPercentage } from '../utils/memoryReporting';
import type { PerfMeta } from '../state/types';

interface MemoryMonitorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MemoryMonitor({ isOpen, onClose }: MemoryMonitorProps) {
  const { state, updateMainMemory } = useApp();
  const [deviceMemory, setDeviceMemory] = useState<number | undefined>();

  // Update main thread memory and get device memory on mount
  useEffect(() => {
    if (isOpen) {
      updateMainMemory();

      // Get device memory if available
      if ('deviceMemory' in navigator) {
        setDeviceMemory((navigator as any).deviceMemory);
      }
    }
  }, [isOpen]);

  // Auto-refresh main memory every 2 seconds when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      updateMainMemory();
    }, 2000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const memoryReports = state.memoryReports || {
    main: null,
    db: null,
    indexing: null,
    zip: null
  };

  // Calculate totals
  const getTotalUsed = () => {
    let total = 0;
    Object.values(memoryReports).forEach(report => {
      if (report) {
        total += report.usedJSHeapSize + report.wasmMemorySize;
      }
    });
    return total;
  };

  const getTotalAvailable = () => {
    let total = 0;
    Object.values(memoryReports).forEach(report => {
      if (report) {
        total += report.totalJSHeapSize;
      }
    });
    return total;
  };

  const renderWorkerMemory = (workerId: string, report: PerfMeta | null) => {
    if (!report) {
      return (
        <div key={workerId} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '4px 0',
          borderBottom: '1px solid var(--border-primary)'
        }}>
          <span style={{
            textTransform: 'capitalize',
            fontSize: '12px',
            fontWeight: '500',
            color: 'var(--text-primary)'
          }}>{workerId}:</span>
          <span style={{
            fontSize: '12px',
            color: 'var(--text-muted)'
          }}>No data</span>
        </div>
      );
    }

    const jsUsage = report.usedJSHeapSize;
    const jsTotal = report.totalJSHeapSize;
    const wasmUsage = report.wasmMemorySize;
    const totalUsage = jsUsage + wasmUsage;
    const maxSeenJS = report.maxSeenJSHeapSize || jsUsage;
    const maxSeenWasm = report.maxSeenWasmSize || wasmUsage;

    // Calculate percentages based on JS heap limit as the scale
    const jsPercentage = jsTotal > 0 ? getMemoryPercentage(jsUsage, jsTotal) : 0;
    const wasmPercentage = jsTotal > 0 ? getMemoryPercentage(wasmUsage, jsTotal) : 0;
    const totalPercentage = jsPercentage + wasmPercentage;
    const maxSeenTotalPercentage = jsTotal > 0 ? getMemoryPercentage(maxSeenJS + maxSeenWasm, jsTotal) : 0;

    return (
      <div key={workerId} style={{
        padding: '4px 0',
        borderBottom: '1px solid var(--border-primary)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{
            textTransform: 'capitalize',
            fontSize: '12px',
            fontWeight: '500',
            color: 'var(--text-primary)'
          }}>{workerId}:</span>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-primary)' }}>
              {formatBytes(totalUsage)}
              {jsTotal > 0 && (
                <>
                  {' / '}
                  <span style={{ color: 'var(--text-secondary)' }}>{formatBytes(jsTotal)}</span>
                  <span style={{
                    marginLeft: '4px',
                    color: 'var(--text-muted)'
                  }}>
                    ({Math.min(totalPercentage, 999)}%)
                  </span>
                </>
              )}
            </div>
            {wasmUsage > 0 && (
              <div style={{
                fontSize: '10px',
                color: 'var(--text-muted)'
              }}>
                JS: {formatBytes(jsUsage)} + WASM: {formatBytes(wasmUsage)}
              </div>
            )}
          </div>
        </div>
        {/* Stacked progress bar showing JS + WASM as parts of combined total */}
        {jsTotal > 0 && (
          <div style={{
            marginTop: '4px',
            width: '100%',
            backgroundColor: 'var(--border-secondary)',
            borderRadius: '3px',
            height: '6px',
            position: 'relative'
          }}>
            {/* JS heap usage */}
            <div
              style={{
                height: '6px',
                borderRadius: '3px 0 0 3px',
                backgroundColor: 'var(--accent-primary)',
                width: `${Math.min(jsPercentage, 100)}%`,
                position: 'absolute',
                left: 0
              }}
            />
            {/* WASM usage stacked on top of JS */}
            {wasmUsage > 0 && (
              <div
                style={{
                  height: '6px',
                  borderRadius: '0 3px 3px 0',
                  backgroundColor: 'rgba(0, 122, 204, 0.6)',
                  width: `${Math.min(wasmPercentage, 100 - jsPercentage)}%`,
                  position: 'absolute',
                  left: `${Math.min(jsPercentage, 100)}%`
                }}
              />
            )}
            {/* Max seen tick mark for combined usage */}
            {(maxSeenJS + maxSeenWasm) > totalUsage && (
              <div
                style={{
                  position: 'absolute',
                  left: `${Math.min(maxSeenTotalPercentage, 100)}%`,
                  top: 0,
                  width: '2px',
                  height: '6px',
                  backgroundColor: 'var(--text-muted)',
                  transform: 'translateX(-1px)'
                }}
              />
            )}
          </div>
        )}
      </div>
    );
  };

  const totalUsed = getTotalUsed();
  const totalAvailable = getTotalAvailable();
  const overallPercentage = totalAvailable > 0 ? getMemoryPercentage(totalUsed, totalAvailable) : 0;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'var(--bg-overlay)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'hidden',
          fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-primary)',
          backgroundColor: 'var(--bg-tertiary)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--accent-primary)',
              margin: 0
            }}>Memory Monitor</h2>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '0 4px',
                lineHeight: '1'
              }}
            >
              ×
            </button>
          </div>
        </div>

        <div style={{
          padding: '10px',
          overflow: 'auto',
          maxHeight: 'calc(80vh - 60px)'
        }}>
          {/* Overall Summary */}
          <div style={{
            backgroundColor: 'var(--bg-tertiary)',
            padding: '8px',
            borderRadius: '4px',
            marginBottom: '12px',
            border: '1px solid var(--border-primary)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-primary)' }}>Total:</span>
              <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                {formatBytes(totalUsed)}
                {totalAvailable > 0 && (
                  <>
                    {' / '}
                    {formatBytes(totalAvailable)} <span style={{ color: 'var(--text-muted)' }}>({overallPercentage}%)</span>
                  </>
                )}
              </span>
            </div>
            {deviceMemory && (
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Device Memory: {deviceMemory}GB
              </div>
            )}
          </div>

          {/* Worker Details */}
          <div style={{ marginBottom: '12px' }}>
            {renderWorkerMemory('main', memoryReports.main)}
            {renderWorkerMemory('db', memoryReports.db)}
            {renderWorkerMemory('indexing', memoryReports.indexing)}
            {renderWorkerMemory('zip', memoryReports.zip)}
          </div>

        </div>
      </div>
    </div>
  );
}