import React, { useState, useCallback } from "react";
import { useApp } from "../state/AppContext";

function DropZone() {
  const { dispatch, state, waitForWorkers } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  // Check if we should show loading state (either local loading or tables loading)
  const isLoading = loading || state.tablesLoading;

  const prepareTablesForLoading = (
    entries: any[],
  ): Array<{
    name: string;
    path: string;
    size: number;
    nodeId?: number;
    originalName?: string;
    isError?: boolean;
  }> => {
    // Find system and crdb_internal tables
    const rootTables = entries.filter(
      (entry) =>
        !entry.isDir &&
        (entry.path.includes("system.") ||
          entry.path.includes("crdb_internal.")) &&
        (entry.path.endsWith(".txt") || entry.path.endsWith(".csv")) &&
        !entry.path.endsWith(".err.txt") &&
        !entry.path.includes("/nodes/"),
    );

    const nodeTables = entries.filter(
      (entry) =>
        !entry.isDir &&
        entry.path.includes("/nodes/") &&
        (entry.path.includes("system.") ||
          entry.path.includes("crdb_internal.")) &&
        (entry.path.endsWith(".txt") || entry.path.endsWith(".csv")) &&
        !entry.path.endsWith(".err.txt"),
    );

    const tablesToLoad = [...rootTables, ...nodeTables];
    const preparedTables: Array<{
      name: string;
      path: string;
      size: number;
      nodeId?: number;
      originalName?: string;
      isError?: boolean;
    }> = [];

    for (const entry of tablesToLoad) {
      // Check if it's a node-specific table
      // Extract just the filename from the path
      const filename = entry.name.split("/").pop() || entry.name;
      let tableName = filename.replace(/\.(err\.txt|txt|csv)$/, "");
      let nodeId: number | undefined;
      let originalName: string | undefined;

      // Parse node ID from path like /nodes/1/system.jobs.txt
      const nodeMatch = entry.path.match(/\/nodes\/(\d+)\//);
      if (nodeMatch) {
        nodeId = parseInt(nodeMatch[1], 10);
        originalName = tableName;

        // For schema.table format, create per-node schema: system.job_info -> n1_system.job_info
        if (tableName.includes(".")) {
          const [schema, table] = tableName.split(".", 2);
          tableName = `n${nodeId}_${schema}.${table}`;
        } else {
          // For regular tables, prefix as before
          tableName = `n${nodeId}_${tableName}`;
        }
      }

      // Check if it's an error file
      const isErrorFile = entry.path.endsWith(".err.txt");

      preparedTables.push({
        name: tableName,
        path: entry.path,
        size: entry.size,
        nodeId,
        originalName,
        isError: isErrorFile,
      });
    }

    return preparedTables;
  };

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

      setLoadingMessage("Scanning zip contents...");
      const entries = await workerManager.loadZipData(uint8Array);

      setLoadingMessage(`Processing ${entries.length} files...`);

      // Store workerManager globally for later file reading
      (window as any).__zipReader = workerManager;

      dispatch({
        type: "SET_ZIP",
        name: file.name,
        size: file.size,
        entries,
      });

      // Start the orchestrated pipeline
      console.log("🚀 Starting orchestrated pipeline...");

      // Step 1: Prepare tables for loading
      setLoadingMessage("Preparing tables...");
      const tablesToLoad = prepareTablesForLoading(entries);

      // Set tables loading state
      dispatch({ type: "SET_TABLES_LOADING", loading: true });

      // Step 2: Start table loading in DB worker
      setLoadingMessage("Loading tables...");
      try {
        await workerManager.startTableLoading(tablesToLoad);
        console.log("📤 Table loading started in DB worker");

        // Table loading completion will be handled by WorkerManager callbacks
        // Stack data loading will happen after tables complete
        setLoading(false);
      } catch (err) {
        console.error("Failed to start table loading:", err);
        dispatch({ type: "SET_TABLES_LOADING", loading: false });
        setLoading(false);
        setError(
          `Failed to load tables: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
      }

      // Register tables that will be loaded
      tablesToLoad.forEach((table) => {
        dispatch({
          type: "REGISTER_TABLE",
          table: {
            name: table.name,
            sourceFile: table.path,
            loaded: false,
            size: table.size,
            nodeId: table.nodeId,
            originalName: table.originalName,
            isError: table.isError,
          },
        });
      });
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
    </div>
  );
}

export default DropZone;
