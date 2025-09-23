/**
 * Memory reporting utilities for workers and main thread
 */

import type { PerfMeta } from '../state/types';

/**
 * Get current performance metrics for a worker or main thread
 */
export function getPerfMeta(workerId: PerfMeta['workerId'], wasmMemorySize: number = 0): PerfMeta {
  // Check if performance.memory is available (works in main thread and potentially workers)
  const memory = typeof performance !== 'undefined' && (performance as any).memory;

  // Chrome requires cross-origin isolation for precise memory measurements
  const hasMemoryAPI = memory && memory.usedJSHeapSize > 0;

  return {
    usedJSHeapSize: hasMemoryAPI ? memory.usedJSHeapSize : -1,
    totalJSHeapSize: hasMemoryAPI ? memory.totalJSHeapSize : -1,
    wasmMemorySize: wasmMemorySize > 0 ? wasmMemorySize : -1,
    timestamp: Date.now(),
    workerId
  };
}

/**
 * Try to get comprehensive memory usage using the newer API
 * This can report memory usage across workers and contexts
 */
export async function measureComprehensiveMemory(): Promise<any> {
  if (typeof performance !== 'undefined' && 'measureUserAgentSpecificMemory' in performance) {
    try {
      const result = await (performance as any).measureUserAgentSpecificMemory();
      console.log('🧠 Comprehensive memory measurement:', result);
      return result; // { bytes, breakdown: [...] } includes workers/iframes
    } catch (error) {
      console.log('🧠 measureUserAgentSpecificMemory failed:', error);
      return null;
    }
  }
  return null;
}

/**
 * Get WASM memory size for DuckDB worker
 */
export function getDuckDBWasmMemorySize(db: any): number {
  try {
    // Try to get WASM memory size from DuckDB instance
    if (db && typeof db.getWasmMemorySize === 'function') {
      return db.getWasmMemorySize();
    }

    // Alternative: check if we can access WebAssembly memory directly
    if (typeof WebAssembly !== 'undefined' && WebAssembly.Memory) {
      // This would need access to the actual memory instance
      // For now, return 0 and we'll implement this when we have access to the memory object
    }

    // Return -1 when we can't get real WASM memory data
    return -1;
  } catch (error) {
    console.warn('Failed to get WASM memory size:', error);
    return -1;
  }
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Calculate percentage of memory used
 */
export function getMemoryPercentage(used: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((used / total) * 100);
}

/**
 * Get memory usage color based on percentage
 */
export function getMemoryColor(percentage: number): string {
  if (percentage < 50) return '#4caf50';
  if (percentage < 80) return '#ff9800';
  return '#f44336';
}