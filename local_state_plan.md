# Local State Persistence Plan for ZipLook

## Overview

Implement localStorage-based state persistence for ZipLook that restores user's UI state (tabs, scroll positions, filters, etc.) when the same zip file is loaded again. State is keyed by a unique fingerprint of the zip file.

## Architecture

### 1. Zip File Fingerprinting

- **Primary**: Hash content of `crdb_internal.cluster_queries.txt` file (unique per CockroachDB cluster)
- **Fallback**: Hash of zip filename + size + first 5 file names (for non-CRDB zips)
- **Implementation**: In zip worker during load, send fingerprint back with zip data

### 2. LocalStorage Schema

```typescript
interface ZipSpecificState {
  zipHash: string;
  lastAccessed: number; // Date.now() timestamp
  createdAt: number; // When first created
  state: {
    // Tab state
    openTabs: Array<{
      id: string;
      kind: "file" | "sql" | "error" | "search";
      title: string;
      // For file tabs
      fileId?: string;
      lineNumber?: number;
      scrollPosition?: number;
      // For SQL tabs
      query?: string;
      sourceTable?: string;
      // For search tabs
      searchQuery?: string;
    }>;
    activeTabId?: string;

    // UI state (excluding stackgazer - it's independent)
    activeView: "files" | "tables" | "search";
    sidebarVisible: boolean;
    sidebarWidth: number;

    // Filter/search state
    fileFilters: Record<string, string>; // fileId -> filter text
    searchFilters: {
      lastQuery?: string;
      filters?: any; // SearchQuery['filters']
    };

    // Table view state
    tableScrollPositions: Record<string, number>;
    expandedTables: string[];
  };
}

interface ZipBrowserStorage {
  version: number;
  zipStates: Record<string, ZipSpecificState>; // zipHash -> state
  globalSettings: {
    defaultSidebarWidth: number;
    defaultActiveView: "files" | "tables" | "search";
  };
}
```

### 3. Cleanup Strategy

- **Expiration**: Remove states older than 30 days (based on `lastAccessed`)
- **LRU Limit**: Keep only 50 most recent zip states
- **Cleanup timing**: On app startup and when saving new states

## Implementation Plan

### Phase 1: Core Infrastructure

#### 1.1 Create Fingerprinting Utility (`src/utils/zipFingerprint.ts`)

```typescript
export async function calculateZipFingerprint(
  entries: ZipEntryMeta[],
): Promise<string> {
  // Try to find crdb_internal.cluster_queries.txt
  const clusterQueriesFile = entries.find((e) =>
    e.path.endsWith("crdb_internal.cluster_queries.txt"),
  );

  if (clusterQueriesFile) {
    // Read file content and hash it
    const content = await readZipEntry(clusterQueriesFile);
    return hashString(content);
  }

  // Fallback: hash zip metadata
  const fallbackData = [
    entries[0]?.name || "",
    entries.length.toString(),
    entries
      .slice(0, 5)
      .map((e) => e.name)
      .join("|"),
  ].join("::");

  return hashString(fallbackData);
}

function hashString(str: string): string {
  // Simple hash implementation or use crypto.subtle
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}
```

#### 1.2 Create State Persistence Service (`src/services/statePersistence.ts`)

```typescript
const STORAGE_KEY = "ziplook-states";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_ZIP_STATES = 50;

export class StatePersistenceService {
  private static instance: StatePersistenceService;

  static getInstance(): StatePersistenceService {
    if (!this.instance) {
      this.instance = new StatePersistenceService();
    }
    return this.instance;
  }

  private getStorage(): ZipBrowserStorage {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to parse stored state:", e);
    }

    return {
      version: 1,
      zipStates: {},
      globalSettings: {
        defaultSidebarWidth: 360,
        defaultActiveView: "tables",
      },
    };
  }

  private saveStorage(storage: ZipBrowserStorage): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
    } catch (e) {
      console.warn("Failed to save state to localStorage:", e);
    }
  }

  private cleanupExpiredStates(storage: ZipBrowserStorage): ZipBrowserStorage {
    const now = Date.now();
    const cutoff = now - THIRTY_DAYS_MS;

    const validStates = Object.entries(storage.zipStates)
      .filter(([_, state]) => state.lastAccessed > cutoff)
      .sort(([_, a], [__, b]) => b.lastAccessed - a.lastAccessed)
      .slice(0, MAX_ZIP_STATES);

    return {
      ...storage,
      zipStates: Object.fromEntries(validStates),
    };
  }

  saveZipState(zipHash: string, state: ZipSpecificState["state"]): void {
    const storage = this.getStorage();
    const now = Date.now();

    storage.zipStates[zipHash] = {
      zipHash,
      lastAccessed: now,
      createdAt: storage.zipStates[zipHash]?.createdAt || now,
      state,
    };

    const cleanedStorage = this.cleanupExpiredStates(storage);
    this.saveStorage(cleanedStorage);
  }

  loadZipState(zipHash: string): ZipSpecificState["state"] | null {
    const storage = this.getStorage();
    const zipState = storage.zipStates[zipHash];

    if (zipState) {
      // Update last accessed
      zipState.lastAccessed = Date.now();
      this.saveStorage(storage);
      return zipState.state;
    }

    return null;
  }

  cleanupOnStartup(): void {
    const storage = this.getStorage();
    const cleaned = this.cleanupExpiredStates(storage);
    if (
      Object.keys(cleaned.zipStates).length !==
      Object.keys(storage.zipStates).length
    ) {
      this.saveStorage(cleaned);
    }
  }
}
```

### Phase 2: Integration Points

#### 2.1 Update AppState Types (`src/state/types.ts`)

Add fingerprint to zip state:

```typescript
export interface AppState {
  zip?: {
    name: string;
    size: number;
    entries: ZipEntryMeta[];
    fingerprint?: string; // Add this field
  };
  // ... rest unchanged
}
```

#### 2.2 Update Zip Worker

Modify zip worker to calculate and return fingerprint:

```typescript
// In src/workers/zip.worker.ts or relevant worker
async function loadZip(file: File) {
  // ... existing zip loading logic ...

  // Calculate fingerprint
  const fingerprint = await calculateZipFingerprint(zipEntries);

  postMessage({
    type: "ZIP_LOADED",
    data: {
      name: file.name,
      size: file.size,
      entries: zipEntries,
      fingerprint: fingerprint,
    },
  });
}
```

#### 2.3 Update AppContext (`src/state/AppContext.tsx`)

Add fingerprint handling:

```typescript
case 'SET_ZIP': {
  return {
    ...state,
    zip: {
      name: action.name,
      size: action.size,
      entries: action.entries,
      fingerprint: action.fingerprint
    },
    filesIndex,
  };
}
```

Add state restoration effect:

```typescript
// Add after existing useEffects
useEffect(() => {
  if (!state.zip?.fingerprint) return;

  // Load saved state for this zip
  const persistenceService = StatePersistenceService.getInstance();
  const savedState = persistenceService.loadZipState(state.zip.fingerprint);

  if (savedState) {
    // Restore tabs
    savedState.openTabs.forEach((tab) => {
      dispatch({ type: "OPEN_TAB", tab: tab as ViewerTab });
    });

    // Restore active tab
    if (savedState.activeTabId) {
      dispatch({ type: "SET_ACTIVE_TAB", id: savedState.activeTabId });
    }

    // Restore other UI state would be handled in App.tsx
  }
}, [state.zip?.fingerprint]);
```

Add debounced state saving:

```typescript
useEffect(() => {
  if (!state.zip?.fingerprint) return;

  const debouncedSave = debounce(() => {
    const persistenceService = StatePersistenceService.getInstance();

    // Extract current state
    const currentState: ZipSpecificState["state"] = {
      openTabs: state.openTabs.map((tab) => ({
        id: tab.id,
        kind: tab.kind,
        title: tab.title,
        ...(tab.kind === "file" && {
          fileId: (tab as any).fileId,
          lineNumber: (tab as any).lineNumber,
        }),
        ...(tab.kind === "sql" && {
          query: (tab as any).query,
          sourceTable: (tab as any).sourceTable,
        }),
        ...(tab.kind === "search" && {
          searchQuery: (tab as any).query,
        }),
      })),
      activeTabId: state.activeTabId,
      // UI state will be passed from App.tsx
      activeView: "tables", // placeholder
      sidebarVisible: true, // placeholder
      sidebarWidth: 360, // placeholder
      fileFilters: {},
      searchFilters: {},
      tableScrollPositions: {},
      expandedTables: [],
    };

    persistenceService.saveZipState(state.zip.fingerprint, currentState);
  }, 5000);

  debouncedSave();

  return () => debouncedSave.cancel();
}, [state.openTabs, state.activeTabId, state.zip?.fingerprint]);
```

#### 2.4 Update App.tsx

Add UI state restoration and saving:

```typescript
// Add state for restoration
const [isRestoringState, setIsRestoringState] = useState(false);

// Restore UI state when fingerprint available
useEffect(() => {
  if (!state.zip?.fingerprint || isRestoringState) return;

  const persistenceService = StatePersistenceService.getInstance();
  const savedState = persistenceService.loadZipState(state.zip.fingerprint);

  if (savedState) {
    setIsRestoringState(true);

    // Restore UI state
    setActiveView(savedState.activeView);
    setSidebarVisible(savedState.sidebarVisible);
    setSidebarWidth(savedState.sidebarWidth);

    // Mark restoration complete
    setTimeout(() => setIsRestoringState(false), 100);
  }
}, [state.zip?.fingerprint]);

// Save UI state changes (debounced)
useEffect(() => {
  if (!state.zip?.fingerprint || isRestoringState) return;

  const debouncedSaveUI = debounce(() => {
    const persistenceService = StatePersistenceService.getInstance();
    const currentState = persistenceService.loadZipState(
      state.zip.fingerprint,
    ) || {
      openTabs: [],
      activeTabId: undefined,
      fileFilters: {},
      searchFilters: {},
      tableScrollPositions: {},
      expandedTables: [],
    };

    // Update with current UI state
    const updatedState = {
      ...currentState,
      activeView,
      sidebarVisible,
      sidebarWidth,
    };

    persistenceService.saveZipState(state.zip.fingerprint, updatedState);
  }, 5000);

  debouncedSaveUI();

  return () => debouncedSaveUI.cancel();
}, [
  activeView,
  sidebarVisible,
  sidebarWidth,
  state.zip?.fingerprint,
  isRestoringState,
]);
```

### Phase 3: Additional Features

#### 3.1 Add Cleanup on App Startup

In `src/main.tsx`:

```typescript
// Add before ReactDOM.render
StatePersistenceService.getInstance().cleanupOnStartup();
```

#### 3.2 Add File Scroll Position Tracking

Update file viewers to save/restore scroll positions.

#### 3.3 Add Search State Persistence

Save and restore search queries and filters.

## Testing Strategy

1. **Unit Tests**: Test fingerprinting logic with mock zip entries
2. **Integration Tests**: Test state save/restore cycle
3. **Manual Testing**:
   - Load zip, make changes, reload page
   - Load different zip, verify clean state
   - Load same zip again, verify state restored

## Migration Strategy

- Version field in storage allows future schema changes
- Graceful fallback for corrupted or incompatible stored data
- Progressive enhancement - app works fine without localStorage

## Files to Create/Modify

### New Files:

- `src/utils/zipFingerprint.ts`
- `src/services/statePersistence.ts`
- `local_state_plan.md` (this file)

### Files to Modify:

- `src/state/types.ts` - Add fingerprint to AppState
- `src/state/AppContext.tsx` - Add restoration and saving logic
- `src/App.tsx` - Add UI state restoration and saving
- `src/workers/zip.worker.ts` (or relevant worker) - Add fingerprinting
- `src/main.tsx` - Add cleanup on startup

## Implementation Order

1. Create `zipFingerprint.ts` utility
2. Create `statePersistence.ts` service
3. Update types to include fingerprint
4. Update zip worker to calculate fingerprint
5. Add state restoration to AppContext
6. Add UI state restoration to App.tsx
7. Add debounced state saving
8. Add startup cleanup
9. Test and refine

## Notes

- Excludes stackgazer state (it's independent in iframe)
- 5-second debounce prevents excessive localStorage writes
- Graceful degradation if localStorage unavailable
- Cleanup prevents localStorage bloat
- Fingerprinting ensures state is truly zip-specific
