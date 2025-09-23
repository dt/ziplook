import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AppState, ViewerTab, ZipEntryMeta, TableMeta, PerfMeta, MemoryReports } from './types';
import { getWorkerManager } from '../services/WorkerManager';
import { setWorkerManager } from '../services/monacoConfig';
import { getPerfMeta } from '../utils/memoryReporting';

export type AppAction =
  | { type: 'SET_ZIP'; name: string; size: number; entries: ZipEntryMeta[] }
  | { type: 'OPEN_TAB'; tab: ViewerTab }
  | { type: 'OPEN_NEW_FILE_TAB'; fileId: string; fileName: string }
  | { type: 'OPEN_FILE_AT_LINE'; fileId: string; fileName: string; lineNumber: number }
  | { type: 'CLOSE_TAB'; id: string }
  | { type: 'SET_ACTIVE_TAB'; id: string }
  | { type: 'UPDATE_TAB'; id: string; updates: Partial<ViewerTab> }
  | { type: 'CACHE_FILE'; id: string; content: { text?: string; bytes?: Uint8Array } }
  | { type: 'REGISTER_TABLE'; table: TableMeta }
  | { type: 'UPDATE_TABLE'; name: string; updates: Partial<TableMeta> }
  | { type: 'SET_TABLES_LOADING'; loading: boolean }
  | { type: 'SET_STACK_DATA'; stackData: Record<string, string> }
  | { type: 'SET_WORKER_MANAGER'; workerManager: any }
  | { type: 'SET_WORKERS_READY'; ready: boolean }
  | { type: 'SET_INDEXING_STATUS'; status: 'none' | 'indexing' | 'ready'; ruleDescription?: string }
  | { type: 'SET_INDEXING_PROGRESS'; progress: { current: number; total: number; fileName: string } | null }
  | { type: 'UPDATE_MEMORY_REPORT'; workerId: 'main' | 'db' | 'indexing' | 'zip'; perfMeta: PerfMeta };

const initialState: AppState = {
  openTabs: [],
  activeTabId: undefined,
  filesIndex: {},
  fileCache: new Map(),
  tables: {},
  memoryReports: {
    main: null,
    db: null,
    indexing: null,
    zip: null
  }
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ZIP': {
      const filesIndex: Record<string, ZipEntryMeta> = {};
      action.entries.forEach(entry => {
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

    case 'OPEN_TAB': {
      // First check for exact ID match
      const existingTabById = state.openTabs.find(t => t.id === action.tab.id);
      if (existingTabById) {
        // If the action has a line number, update the tab; otherwise just activate
        if (action.tab.kind === 'file' && action.tab.lineNumber) {
          const updatedTab = { ...action.tab };
          const updatedTabs = state.openTabs.map(tab =>
            tab.id === action.tab.id ? updatedTab : tab
          );
          return {
            ...state,
            openTabs: updatedTabs,
            activeTabId: action.tab.id,
          };
        }
        return { ...state, activeTabId: action.tab.id };
      }

      // For file tabs, check if a tab with the same fileId already exists
      if (action.tab.kind === 'file' && action.tab.fileId) {
        const existingFileTab = state.openTabs.find((tab) => {
          return tab.kind === 'file' && (tab as any).fileId === (action.tab as any).fileId;
        }) as (ViewerTab & { kind: 'file' }) | undefined;

        if (existingFileTab) {
          // If jumping to a specific line, update the existing tab
          if (action.tab.lineNumber) {
            const updatedTab = {
              ...existingFileTab,
              lineNumber: action.tab.lineNumber
            };
            const updatedTabs = state.openTabs.map(tab =>
              tab.id === existingFileTab.id ? updatedTab : tab
            );
            return {
              ...state,
              openTabs: updatedTabs,
              activeTabId: existingFileTab.id,
            };
          }
          // Otherwise just activate the existing tab
          return { ...state, activeTabId: existingFileTab.id };
        }
      }

      // For file tabs, ensure fileId is set if not provided
      const tabToAdd = action.tab.kind === 'file'
        ? { ...action.tab, fileId: action.tab.fileId || action.tab.id }
        : action.tab;
      return {
        ...state,
        openTabs: [...state.openTabs, tabToAdd],
        activeTabId: action.tab.id,
      };
    }

    case 'OPEN_NEW_FILE_TAB': {
      // Check if a tab for this file already exists
      const existingTab = state.openTabs.find(tab =>
        tab.kind === 'file' && tab.fileId === action.fileId
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
        kind: 'file',
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

    case 'OPEN_FILE_AT_LINE': {
      // Check if a tab for this file already exists
      const existingTab = state.openTabs.find(tab =>
        tab.kind === 'file' && tab.fileId === action.fileId
      );

      if (existingTab) {
        // Update existing tab with line number and activate it
        const tabIndex = state.openTabs.findIndex(t => t.id === existingTab.id);
        const newTabs = [...state.openTabs];
        newTabs[tabIndex] = { ...newTabs[tabIndex], lineNumber: action.lineNumber } as ViewerTab;

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
        kind: 'file',
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

    case 'CLOSE_TAB': {
      const newTabs = state.openTabs.filter(t => t.id !== action.id);
      let newActiveId = state.activeTabId;

      if (state.activeTabId === action.id) {
        const closedIndex = state.openTabs.findIndex(t => t.id === action.id);
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

    case 'SET_ACTIVE_TAB': {
      return { ...state, activeTabId: action.id };
    }

    case 'UPDATE_TAB': {
      const tabIndex = state.openTabs.findIndex(t => t.id === action.id);
      if (tabIndex === -1) return state;

      const newTabs = [...state.openTabs];
      newTabs[tabIndex] = { ...newTabs[tabIndex], ...action.updates } as ViewerTab;

      return { ...state, openTabs: newTabs };
    }

    case 'CACHE_FILE': {
      const newCache = new Map(state.fileCache);
      newCache.set(action.id, action.content);
      return { ...state, fileCache: newCache };
    }

    case 'REGISTER_TABLE': {
      return {
        ...state,
        tables: { ...state.tables, [action.table.name]: action.table },
      };
    }

    case 'UPDATE_TABLE': {
      const existing = state.tables[action.name];
      if (!existing) return state;

      return {
        ...state,
        tables: {
          ...state.tables,
          [action.name]: { ...existing, ...action.updates },
        },
      };
    }

    case 'SET_TABLES_LOADING': {
      return {
        ...state,
        tablesLoading: action.loading,
      };
    }

    case 'SET_STACK_DATA': {
      return {
        ...state,
        stackData: action.stackData,
      };
    }

    case 'SET_WORKER_MANAGER': {
      return {
        ...state,
        workerManager: action.workerManager,
      };
    }

    case 'SET_WORKERS_READY': {
      return {
        ...state,
        workersReady: action.ready,
      };
    }

    case 'SET_INDEXING_STATUS': {
      return {
        ...state,
        indexingStatus: action.status,
        indexingRuleDescription: action.ruleDescription,
      };
    }

    case 'SET_INDEXING_PROGRESS': {
      return {
        ...state,
        indexingProgress: action.progress,
      };
    }

    case 'UPDATE_MEMORY_REPORT': {
      const currentReport = state.memoryReports?.[action.workerId];
      const newPerfMeta = {
        ...action.perfMeta,
        maxSeenJSHeapSize: Math.max(
          action.perfMeta.usedJSHeapSize,
          currentReport?.maxSeenJSHeapSize || 0
        ),
        maxSeenWasmSize: Math.max(
          action.perfMeta.wasmMemorySize,
          currentReport?.maxSeenWasmSize || 0
        )
      };

      return {
        ...state,
        memoryReports: {
          ...state.memoryReports,
          [action.workerId]: newPerfMeta
        } as MemoryReports
      };
    }

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  waitForWorkers: () => Promise<any>;
  updateMemoryReport: (workerId: 'main' | 'db' | 'indexing' | 'zip', perfMeta: PerfMeta) => void;
  updateMainMemory: () => void;
}

export const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Auto-start indexing when conditions are met
  useEffect(() => {

    if (state.zip && !state.tablesLoading && state.stackData && state.workerManager && state.workersReady && state.indexingStatus !== 'indexing' && state.indexingStatus !== 'ready') {
      // Send all files to indexing worker - let it decide which ones to index
      const allFiles = state.zip.entries.filter((entry: any) => !entry.isDir);

      if (allFiles.length > 0) {
        // Mark indexing as started
        dispatch({ type: 'SET_INDEXING_STATUS', status: 'indexing', ruleDescription: undefined });

        // Register all files with indexing worker (it will auto-queue log files)
        state.workerManager.registerFiles(allFiles.map((f: any) => ({
          path: f.path,
          name: f.name,
          size: f.size
        }))).catch((error: any) => {
          console.error('❌ Failed to register files:', error);
          dispatch({ type: 'SET_INDEXING_STATUS', status: 'none', ruleDescription: undefined });
        });
      } else {
        dispatch({ type: 'SET_INDEXING_STATUS', status: 'ready' });
      }
    }
  }, [state.zip, state.tablesLoading, state.stackData, state.workerManager, state.workersReady, state.indexingStatus]);

  // Handle stack data loading when table loading completes
  useEffect(() => {
    const shouldLoadStackData = (
      !state.tablesLoading &&
      !state.stackData &&
      state.workerManager &&
      state.zip &&
      Object.keys(state.filesIndex).length > 0
    );

    if (shouldLoadStackData) {
      // Find stack files in the zip entries
      const stackFiles = state.zip?.entries.filter(entry =>
        entry.path.endsWith('stacks.txt')
      ) || [];

      if (stackFiles.length > 0) {
        dispatch({ type: 'SET_INDEXING_STATUS', status: 'indexing', ruleDescription: undefined });

        // Request stack file content from zip worker
        const stackPromises = stackFiles.map(async (entry) => {
          try {
            const response = await state.workerManager.readFile(entry.path);
            if (response.text) {
              return {
                [entry.path]: response.text
              };
            }
          } catch (err) {
            console.warn(`Failed to read stack file ${entry.path}:`, err);
          }
          return null;
        });

        Promise.all(stackPromises).then(results => {
          const stackData: Record<string, string> = {};
          results.forEach(result => {
            if (result) {
              Object.assign(stackData, result);
            }
          });

          dispatch({ type: 'SET_STACK_DATA', stackData });
          dispatch({ type: 'SET_INDEXING_STATUS', status: 'none', ruleDescription: undefined }); // Reset to allow log indexing
        }).catch(error => {
          console.error('Failed to load stack data:', error);
          dispatch({ type: 'SET_INDEXING_STATUS', status: 'none', ruleDescription: undefined });
        });
      } else {
        dispatch({ type: 'SET_INDEXING_STATUS', status: 'none' });
      }
    }
  }, [state.tablesLoading, state.stackData, state.workerManager, state.zip, state.filesIndex]);


  // Function to wait for workers to be ready
  const waitForWorkers = async () => {
    // Just get the singleton WorkerManager directly - it handles initialization
    return await getWorkerManager();
  };

  // Get the already-initialized WorkerManager singleton from main.tsx
  useEffect(() => {
    let mounted = true;

    getWorkerManager().then((workerManager) => {
      if (!mounted) return;

      // Set up React-specific callbacks
      workerManager.updateCallbacks({
        onIndexingProgress: (progress: any) => {
          if (!mounted) return;
          dispatch({ type: 'SET_INDEXING_PROGRESS', progress });
        },
        onIndexingComplete: (success: any, _totalEntries: any, _error: any, ruleDescription: any) => {
          if (!mounted) return;
          dispatch({ type: 'SET_INDEXING_PROGRESS', progress: null });
          if (success) {
            dispatch({ type: 'SET_INDEXING_STATUS', status: 'ready', ruleDescription });
          } else {
            dispatch({ type: 'SET_INDEXING_STATUS', status: 'none', ruleDescription: undefined });
          }
        },
        onIndexingFileResult: (_filePath: any, _entries: any) => {
          if (!mounted) return;
          // These entries need to be added to a search index
          // For now, just log them - SearchView will handle the actual indexing
        },
        onMemoryReport: (workerId: 'main' | 'db' | 'indexing' | 'zip', perfMeta: any) => {
          if (!mounted) return;
          dispatch({ type: 'UPDATE_MEMORY_REPORT', workerId, perfMeta });
        },
        onTableLoadProgress: (tableName: string, status: string, rowCount?: number, error?: string) => {
          if (!mounted) return;

          // Update table status in app state
          const updates: any = {};

          switch (status) {
            case 'loading':
              updates.loading = true;
              updates.loaded = false;
              break;
            case 'completed':
              updates.loading = false;
              updates.loaded = true;
              if (rowCount !== undefined) {
                updates.rowCount = rowCount;
              }
              updates.deferred = false;
              break;
            case 'error':
              updates.loading = false;
              updates.loaded = false;
              updates.loadError = error;
              break;
            case 'deferred':
              updates.loading = false;
              updates.loaded = false;
              updates.deferred = true;
              break;
          }

          dispatch({
            type: 'UPDATE_TABLE',
            name: tableName,
            updates
          });
        },
        onTableLoadingComplete: (_success: boolean, _tablesLoaded: number, _error?: string) => {
          if (!mounted) return;

          // Set tables loading state to false
          dispatch({ type: 'SET_TABLES_LOADING', loading: false });
        },
        onDatabaseInitialized: (success: boolean, error?: string) => {
          if (!mounted) return;
          if (!success && error) {
            console.error('❌ Database initialization failed:', error);
          }
        }
      });

      // Store WorkerManager in app state
      dispatch({
        type: 'SET_WORKER_MANAGER',
        workerManager
      });

      // Set WorkerManager for Monaco autocomplete
      setWorkerManager(workerManager);

      // Mark workers as ready
      dispatch({
        type: 'SET_WORKERS_READY',
        ready: true
      });

    }).catch((error) => {
      if (!mounted) return;
      console.error('❌ React: Failed to get WorkerManager:', error);
      dispatch({
        type: 'SET_WORKERS_READY',
        ready: false
      });
    });

    return () => {
      mounted = false;
    };
  }, []);

  // Function to update memory report from a worker
  const updateMemoryReport = (workerId: 'main' | 'db' | 'indexing' | 'zip', perfMeta: PerfMeta) => {
    dispatch({ type: 'UPDATE_MEMORY_REPORT', workerId, perfMeta });
  };

  // Function to update main thread memory
  const updateMainMemory = () => {
    const mainPerfMeta = getPerfMeta('main', 0);
    updateMemoryReport('main', mainPerfMeta);
  };

  return (
    <AppContext.Provider value={{ state, dispatch, waitForWorkers, updateMemoryReport, updateMainMemory }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}