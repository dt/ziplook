import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import type {
  AppState,
  ViewerTab,
  ZipEntryMeta,
  TableMeta,
  IWorkerManager,
} from "./types";
import { getWorkerManager } from "../services/WorkerManager";
import { setWorkerManager } from "../services/monacoConfig";

export type AppAction =
  | { type: "SET_ZIP"; name: string; size: number; entries: ZipEntryMeta[] }
  | { type: "OPEN_TAB"; tab: ViewerTab; focusTab?: boolean }
  | { type: "OPEN_NEW_FILE_TAB"; fileId: string; fileName: string }
  | { type: "OPEN_PPROF_TAB"; fileId: string; fileName: string }
  | {
      type: "OPEN_FILE_AT_LINE";
      fileId: string;
      fileName: string;
      lineNumber: number;
    }
  | { type: "CLOSE_TAB"; id: string }
  | { type: "SET_ACTIVE_TAB"; id: string }
  | { type: "UPDATE_TAB"; id: string; updates: Partial<ViewerTab> }
  | { type: "REPLACE_TAB"; id: string; newTab: ViewerTab }
  | {
      type: "CACHE_FILE";
      id: string;
      content: { text?: string; bytes?: Uint8Array };
    }
  | { type: "REGISTER_TABLE"; table: TableMeta }
  | { type: "UPDATE_TABLE"; name: string; updates: Partial<TableMeta> }
  | { type: "SET_TABLES_LOADING"; loading: boolean }
  | { type: "SET_STACK_DATA"; stackData: Record<string, string> }
  | { type: "ADD_STACK_FILE"; filePath: string; content: string }
  | { type: "ADD_STACK_FILE_PER_G"; filePath: string; content: string }
  | { type: "ADD_STACK_FILE_LABELED"; filePath: string; content: string }
  | {
      type: "SET_STACK_FILES";
      stackFiles: Array<{ path: string; size: number; compressedSize: number }>;
    }
  | { type: "SET_STACKGAZER_READY"; ready: boolean }
  | { type: "SET_STACKGAZER_READY_PER_G"; ready: boolean }
  | { type: "SET_STACKGAZER_READY_LABELED"; ready: boolean }
  | { type: "SET_STACKGAZER_MODE"; mode: "per-goroutine" | "labeled" }
  | { type: "SET_WORKER_MANAGER"; workerManager: IWorkerManager }
  | { type: "SET_WORKERS_READY"; ready: boolean }
  | {
      type: "SET_INDEXING_STATUS";
      status: "none" | "indexing" | "ready";
      ruleDescription?: string;
    }
  | {
      type: "SET_INDEXING_PROGRESS";
      progress: { current: number; total: number; fileName: string } | null;
    }
  | {
      type: "SET_FILE_STATUSES";
      fileStatuses: import("./types").FileIndexStatus[];
    }
  | {
      type: "SET_RECOVERY_INFO";
      recoveryInfo: { entriesCount: number } | null;
    };

const initialState: AppState = {
  openTabs: [],
  activeTabId: undefined,
  filesIndex: {},
  fileCache: new Map(),
  tables: {},
  stackData: {}, // Initialize as empty object so stackgazer can be enabled when stacks are loaded
  stackDataPerG: {},
  stackDataLabeled: {},
  stackgazerMode: "per-goroutine",
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_ZIP": {
      const filesIndex: Record<string, ZipEntryMeta> = {};
      action.entries.forEach((entry) => {
        filesIndex[entry.id] = entry;
      });
      return {
        ...state,
        zip: {
          name: action.name,
          size: action.size,
          entries: action.entries,
        },
        filesIndex,
      };
    }

    case "OPEN_TAB": {
      // Default focusTab to true for backward compatibility
      const shouldFocus = action.focusTab !== false;

      // First check for exact ID match
      const existingTabById = state.openTabs.find(
        (t) => t.id === action.tab.id,
      );
      if (existingTabById) {
        // If the action has a line number, update the tab; otherwise just activate if focusing
        if (action.tab.kind === "file" && action.tab.lineNumber) {
          const updatedTab = { ...action.tab };
          const updatedTabs = state.openTabs.map((tab) =>
            tab.id === action.tab.id ? updatedTab : tab,
          );
          return {
            ...state,
            openTabs: updatedTabs,
            activeTabId: shouldFocus ? action.tab.id : state.activeTabId,
          };
        }
        return {
          ...state,
          activeTabId: shouldFocus ? action.tab.id : state.activeTabId
        };
      }

      // For file tabs, check if a tab with the same fileId already exists
      if (action.tab.kind === "file" && action.tab.fileId) {
        const existingFileTab = state.openTabs.find((tab) => {
          return (
            tab.kind === "file" &&
            action.tab.kind === "file" &&
            tab.fileId === action.tab.fileId
          );
        }) as (ViewerTab & { kind: "file" }) | undefined;

        if (existingFileTab) {
          // If jumping to a specific line, update the existing tab
          if (action.tab.lineNumber) {
            const updatedTab = {
              ...existingFileTab,
              lineNumber: action.tab.lineNumber,
            };
            const updatedTabs = state.openTabs.map((tab) =>
              tab.id === existingFileTab.id ? updatedTab : tab,
            );
            return {
              ...state,
              openTabs: updatedTabs,
              activeTabId: shouldFocus ? existingFileTab.id : state.activeTabId,
            };
          }
          // Otherwise just activate the existing tab if focusing
          return {
            ...state,
            activeTabId: shouldFocus ? existingFileTab.id : state.activeTabId
          };
        }
      }

      // For file tabs, ensure fileId is set if not provided
      const tabToAdd =
        action.tab.kind === "file"
          ? { ...action.tab, fileId: action.tab.fileId || action.tab.id }
          : action.tab;
      return {
        ...state,
        openTabs: [...state.openTabs, tabToAdd],
        activeTabId: shouldFocus ? action.tab.id : state.activeTabId,
      };
    }

    case "OPEN_NEW_FILE_TAB": {
      // Check if a tab for this file already exists
      const existingTab = state.openTabs.find(
        (tab) => tab.kind === "file" && tab.fileId === action.fileId,
      );

      if (existingTab) {
        // Activate existing tab instead of creating duplicate
        return {
          ...state,
          activeTabId: existingTab.id,
        };
      }

      // Generate a unique ID for this new tab instance
      const timestamp = Date.now();
      const uniqueId = `${action.fileId}_${timestamp}`;
      const newTab: ViewerTab = {
        kind: "file",
        id: uniqueId,
        fileId: action.fileId,
        title: action.fileName,
      };
      return {
        ...state,
        openTabs: [...state.openTabs, newTab],
        activeTabId: uniqueId,
      };
    }

    case "OPEN_PPROF_TAB": {
      // Check if a tab for this pprof file already exists
      const existingTab = state.openTabs.find(
        (tab) => tab.kind === "pprof" && tab.fileId === action.fileId,
      );

      if (existingTab) {
        // Activate existing tab instead of creating duplicate
        return {
          ...state,
          activeTabId: existingTab.id,
        };
      }

      // Generate a unique ID for this new tab instance
      const timestamp = Date.now();
      const uniqueId = `pprof_${action.fileId}_${timestamp}`;
      const newTab: ViewerTab = {
        kind: "pprof",
        id: uniqueId,
        fileId: action.fileId,
        title: action.fileName,
      };
      return {
        ...state,
        openTabs: [...state.openTabs, newTab],
        activeTabId: uniqueId,
      };
    }

    case "OPEN_FILE_AT_LINE": {
      // Check if a tab for this file already exists
      const existingTab = state.openTabs.find(
        (tab) => tab.kind === "file" && tab.fileId === action.fileId,
      );

      if (existingTab) {
        // Update existing tab with line number and activate it
        const tabIndex = state.openTabs.findIndex(
          (t) => t.id === existingTab.id,
        );
        const newTabs = [...state.openTabs];
        newTabs[tabIndex] = {
          ...newTabs[tabIndex],
          lineNumber: action.lineNumber,
        } as ViewerTab;

        return {
          ...state,
          openTabs: newTabs,
          activeTabId: existingTab.id,
        };
      }

      // Generate a unique ID for this new tab instance
      const timestamp = Date.now();
      const uniqueId = `${action.fileId}_${timestamp}`;
      const newTab: ViewerTab = {
        kind: "file",
        id: uniqueId,
        fileId: action.fileId,
        title: action.fileName,
        lineNumber: action.lineNumber,
      };
      return {
        ...state,
        openTabs: [...state.openTabs, newTab],
        activeTabId: uniqueId,
      };
    }

    case "CLOSE_TAB": {
      const newTabs = state.openTabs.filter((t) => t.id !== action.id);
      let newActiveId = state.activeTabId;

      if (state.activeTabId === action.id) {
        const closedIndex = state.openTabs.findIndex((t) => t.id === action.id);
        if (newTabs.length > 0) {
          const newIndex = Math.min(closedIndex, newTabs.length - 1);
          newActiveId = newTabs[newIndex].id;
        } else {
          newActiveId = undefined;
        }
      }

      return {
        ...state,
        openTabs: newTabs,
        activeTabId: newActiveId,
      };
    }

    case "SET_ACTIVE_TAB": {
      return { ...state, activeTabId: action.id };
    }

    case "UPDATE_TAB": {
      const tabIndex = state.openTabs.findIndex((t) => t.id === action.id);
      if (tabIndex === -1) return state;

      const newTabs = [...state.openTabs];
      newTabs[tabIndex] = {
        ...newTabs[tabIndex],
        ...action.updates,
      } as ViewerTab;

      return { ...state, openTabs: newTabs };
    }

    case "REPLACE_TAB": {
      const tabIndex = state.openTabs.findIndex((t) => t.id === action.id);
      if (tabIndex === -1) return state;

      const newTabs = [...state.openTabs];
      newTabs[tabIndex] = action.newTab;

      return { ...state, openTabs: newTabs };
    }

    case "CACHE_FILE": {
      const newCache = new Map(state.fileCache);
      newCache.set(action.id, action.content);
      return { ...state, fileCache: newCache };
    }

    case "REGISTER_TABLE": {
      return {
        ...state,
        tables: { ...state.tables, [action.table.name]: action.table },
      };
    }

    case "UPDATE_TABLE": {
      const existing = state.tables[action.name];
      if (!existing) {
        return state;
      }

      return {
        ...state,
        tables: {
          ...state.tables,
          [action.name]: { ...existing, ...action.updates },
        },
      };
    }

    case "SET_TABLES_LOADING": {
      return {
        ...state,
        tablesLoading: action.loading,
      };
    }

    case "SET_STACK_DATA": {
      return {
        ...state,
        stackData: action.stackData,
      };
    }

    case "ADD_STACK_FILE": {
      const newStackData = {
        ...state.stackData,
        [action.filePath]: action.content,
      };
      return {
        ...state,
        stackData: newStackData,
      };
    }

    case "ADD_STACK_FILE_PER_G": {
      const newStackData = {
        ...state.stackDataPerG,
        [action.filePath]: action.content,
      };
      return {
        ...state,
        stackDataPerG: newStackData,
      };
    }

    case "ADD_STACK_FILE_LABELED": {
      const newStackData = {
        ...state.stackDataLabeled,
        [action.filePath]: action.content,
      };
      return {
        ...state,
        stackDataLabeled: newStackData,
      };
    }

    case "SET_STACK_FILES": {
      return {
        ...state,
        stackFiles: action.stackFiles,
      };
    }

    case "SET_STACKGAZER_READY": {
      return {
        ...state,
        stackgazerReady: action.ready,
      };
    }

    case "SET_STACKGAZER_READY_PER_G": {
      return {
        ...state,
        stackgazerReadyPerG: action.ready,
      };
    }

    case "SET_STACKGAZER_READY_LABELED": {
      return {
        ...state,
        stackgazerReadyLabeled: action.ready,
      };
    }

    case "SET_STACKGAZER_MODE": {
      return {
        ...state,
        stackgazerMode: action.mode,
      };
    }

    case "SET_WORKER_MANAGER": {
      return {
        ...state,
        workerManager: action.workerManager,
      };
    }

    case "SET_WORKERS_READY": {
      return {
        ...state,
        workersReady: action.ready,
      };
    }

    case "SET_INDEXING_STATUS": {
      return {
        ...state,
        indexingStatus: action.status,
        indexingRuleDescription: action.ruleDescription,
      };
    }

    case "SET_INDEXING_PROGRESS": {
      return {
        ...state,
        indexingProgress: action.progress,
      };
    }

    case "SET_FILE_STATUSES": {
      return {
        ...state,
        fileStatuses: action.fileStatuses,
      };
    }

    case "SET_RECOVERY_INFO": {
      return {
        ...state,
        recoveryInfo: action.recoveryInfo,
      };
    }

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  waitForWorkers: () => Promise<IWorkerManager>;
}

export const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Auto-start indexing when conditions are met
  useEffect(() => {
    if (
      state.zip &&
      !state.tablesLoading &&
      state.stackData &&
      state.workerManager &&
      state.workersReady &&
      state.indexingStatus !== "indexing" &&
      state.indexingStatus !== "ready"
    ) {
      // Controller drives all business logic including file registration and indexing
      // Main thread should be purely reactive - no proactive calls to workers
    }
  }, [
    state.zip,
    state.tablesLoading,
    state.stackData,
    state.workerManager,
    state.workersReady,
    state.indexingStatus,
  ]);

  // Stack data is now loaded by the controller and sent via stackFileContent notifications
  // UI is purely reactive - no direct file reading

  // Function to wait for workers to be ready
  const waitForWorkers = async () => {
    // Just get the singleton WorkerManager directly - it handles initialization
    return await getWorkerManager();
  };

  // Get the already-initialized WorkerManager singleton from main.tsx
  useEffect(() => {
    let mounted = true;

    getWorkerManager()
      .then((workerManager) => {
        if (!mounted) return;

        // Set up React-specific callbacks
        workerManager.updateCallbacks({
          onIndexingProgress: (progress: {
            current: number;
            total: number;
            fileName: string;
          }) => {
            if (!mounted) return;
            dispatch({ type: "SET_INDEXING_PROGRESS", progress });
          },
          onIndexingComplete: (
            success: boolean,
            _totalEntries: number,
            _error?: string,
            ruleDescription?: string,
          ) => {
            if (!mounted) return;
            dispatch({ type: "SET_INDEXING_PROGRESS", progress: null });
            if (success) {
              dispatch({
                type: "SET_INDEXING_STATUS",
                status: "ready",
                ruleDescription,
              });
            } else {
              dispatch({
                type: "SET_INDEXING_STATUS",
                status: "none",
                ruleDescription: undefined,
              });
            }
          },
          onIndexingFileResult: () => {
            if (!mounted) return;
            // These entries need to be added to a search index
            // For now, just log them - SearchView will handle the actual indexing
          },
          onTableLoadProgress: (
            tableName: string,
            status: string,
            rowCount?: number,
            error?: string,
            chunkProgress?: {
              current: number;
              total: number;
              percentage: number;
            },
            fileProgress?: {
              current: number;
              total: number;
              percentage: number;
            },
          ) => {
            if (!mounted) return;

            // Update table status in app state
            const updates: Partial<TableMeta> = {};

            switch (status) {
              case "loading":
                updates.loading = true;
                updates.loaded = false;
                // Add chunk progress if provided
                if (chunkProgress) {
                  updates.chunkProgress = chunkProgress;
                }
                // Add file progress if provided
                if (fileProgress) {
                  updates.fileProgress = fileProgress;
                }
                break;
              case "completed":
                updates.loading = false;
                updates.loaded = true;
                if (rowCount !== undefined) {
                  updates.rowCount = rowCount;
                }
                updates.deferred = false;
                updates.chunkProgress = undefined; // Clear chunk progress
                updates.fileProgress = undefined; // Clear file progress
                updates.isError = false; // Clear error flag since we successfully loaded
                break;
              case "error":
                updates.loading = false;
                updates.loaded = false;
                updates.loadError = error;
                break;
              case "deferred":
                updates.loading = false;
                updates.loaded = false;
                updates.deferred = true;
                break;
            }

            dispatch({
              type: "UPDATE_TABLE",
              name: tableName,
              updates,
            });
          },
          onTableLoadingComplete: () => {
            if (!mounted) return;

            // Set tables loading state to false
            dispatch({ type: "SET_TABLES_LOADING", loading: false });
          },
          onDatabaseInitialized: (success: boolean, error?: string) => {
            if (!mounted) return;
            if (!success && error) {
              console.error("❌ Database initialization failed:", error);
            }
          },
        });

        // Store WorkerManager in app state
        dispatch({
          type: "SET_WORKER_MANAGER",
          workerManager,
        });

        // Set WorkerManager for Monaco autocomplete
        setWorkerManager(workerManager);

        // Mark workers as ready
        dispatch({
          type: "SET_WORKERS_READY",
          ready: true,
        });
      })
      .catch((error) => {
        if (!mounted) return;
        console.error("❌ React: Failed to get WorkerManager:", error);
        dispatch({
          type: "SET_WORKERS_READY",
          ready: false,
        });
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, waitForWorkers }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
