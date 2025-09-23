# ZipLook - CockroachDB Debug Explorer

A web application for exploring CockroachDB debug zip files. All processing happens locally in the browser.

## Summary

ZipLook loads CockroachDB debug zip files and provides SQL querying over system tables, full-text search through log files, and stack trace visualization. It automatically decodes binary protobuf fields and pretty-prints CockroachDB keys during data loading.

## Features

- **SQL Querying**: DuckDB WASM instance for running SQL queries against system tables. Includes Monaco editor with autocomplete for table names, columns, and DuckDB functions.
- **Data Processing**: Automatic decoding of hex-encoded protobuf fields to JSON. Pretty-printing of CockroachDB keys (e.g., `/Table/53/1/1` instead of raw hex).
- **Log Search**: Full-text indexing of log files using FlexSearch. Supports regex patterns, exact phrases, and field-specific filters (level, goroutine, file, tags).
- **File Navigation**: Tree view of zip contents with on-demand decompression.
- **File Viewer**: Lazy loading and decompression, syntax highlighting for logs, live filtering with include/exclude expressions, regex support. Multiple tabs can be opened with different filters on the same file.
- **Stack Analysis**: Goroutine stack trace browser using dt/stackgazer.
- **Memory Monitoring**: Built-in memory usage tracking.

## Usage

1. Drag and drop a CockroachDB debug zip file onto the application
2. Wait for system tables to load automatically
3. Use the Tables view for SQL queries
4. Use the Search view for log analysis
5. Use the Stackgazer view for goroutine stacks

### SQL Querying
- System and crdb_internal tables are loaded automatically
- Binary proto fields are decoded to JSON
- CockroachDB keys are pretty-printed
- Autocomplete available with Ctrl+Space
- Execute with Ctrl+Enter or Cmd+Enter

### Log Search
- `/` to focus search input
- Combine filters: `level:ERROR database connection`
- Regex patterns: `/error.*connection/i`
- Goroutine filter: `goroutine:123`
- Tag filter: `tag:job=456`
- File filter: `file:raft.log`
- Exact phrases: `"exact phrase"`

### File Viewer
- **Lazy Loading**: Files are decompressed and loaded on-demand for fast startup
- **Syntax Highlighting**: Automatic language detection and highlighting, specialized log syntax highlighting
- **Live Filtering**: Real-time filtering with boolean expressions:
  - Include terms: `database error` (lines containing both terms)
  - Exclude terms: `-connection` (lines not containing "connection")
  - Combined: `database -connection +error` (lines with "database" and "error" but not "connection")
  - Regex support: Use `/pattern/flags` syntax for complex patterns
- **Multiple Tabs**: Open the same file in multiple tabs with different filters applied

### Keyboard Shortcuts
- `Cmd+B`/`Ctrl+B`: Toggle sidebar
- `Cmd+1-9`: Switch tabs
- Arrow keys: Navigate search results
- `/`: Focus search input

## Contributing

### Architecture

ZipLook uses a multi-worker architecture:

#### Workers and Orchestration
- **WorkerManager**: Central orchestrator that manages communication between three specialized workers
- **ZipReader Worker**: Handles zip file reading, decompression, and file streaming using fflate
- **DB Worker**: Manages DuckDB WASM instance, SQL execution, and table loading
- **Indexing Worker**: Builds and manages FlexSearch indexes for log file search

Workers communicate via MessageChannels for direct data transfer. The WorkerManager coordinates operations and provides a unified API.

#### Data Processing Pipeline
1. **Text Preprocessor**: Sits before DuckDB loading and transforms raw CSV/TSV data:
   - Decodes hex-encoded protobuf fields using loaded CRDB descriptors
   - Pretty-prints CockroachDB keys (e.g., `/Table/53/1/1`)
   - Handles dynamic proto type resolution for job_info tables
   - Processes nested JSON with key prettification

2. **Protocol Buffer Handling**: Uses protobufjs with pre-built CRDB descriptors:
   - Automatically detects and decodes common proto fields (config, descriptor, payload, progress)
   - Supports dynamic type resolution based on context
   - Graceful fallback for unknown proto types

3. **Search Indexing**: FlexSearch-based full-text indexing:
   - Parses structured log entries (level, timestamp, goroutine, tags, message)
   - Builds searchable indexes with optimized tokenization
   - Supports complex query parsing with multiple filter types

#### Key Libraries
- **DuckDB WASM**: SQL engine for local data analysis
- **fflate**: Streaming zip decompression
- **Monaco Editor**: SQL editor with autocomplete
- **FlexSearch**: Full-text search
- **protobufjs**: Protocol buffer encoding/decoding
- **React**: UI framework with context-based state management

#### State Management
- **AppContext**: Centralized state using React Context and useReducer
- **Worker State**: Each worker maintains its own state, synchronized via WorkerManager
- **Memory Management**: Memory monitoring with cleanup capabilities

### Deployment

The application supports multiple deployment targets:

#### Development
```bash
npm install
npm run dev
```

#### Production Build
```bash
npm run build          # Standard build
npm run build:pages    # GitHub Pages (with base path)
npm run build:bundle   # Standalone bundle
```

#### GitHub Pages
Automatically deploys to GitHub Pages on pushes to main branch. Manual deployment:
```bash
npm run build:pages
```

### How to Build

#### Prerequisites
- Node.js 18+
- npm 9+

#### Development Setup
```bash
# Clone the repository
git clone <repository-url>
cd ziplook

# Install dependencies
npm install

# Start development server
npm run dev
```

#### Testing
```bash
npm run test                # Unit tests
npm run test:coverage       # Coverage report
npm run test:e2e           # End-to-end tests
npm run test:e2e:ui        # E2E tests with UI
```

#### Building for Production
```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Production build
npm run build

# Preview production build
npm run preview
```

The build process includes:
- TypeScript compilation
- Vite bundling with optimizations
- Worker inlining for standalone deployment
- Asset optimization and code splitting
