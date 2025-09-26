# ZipLook TODO List

## Features

### Download Links

Quick win: add a download links, e.g. for binary pprof files we don't support displaying.

- Can zip worker directly make a blob URL and pass it back for us to just show? or do we need to pull bytes back to main thread to make a blob URL?

### pprof integration

It would be nice to render cpu and mem profiles inline, without needing to download and use pprof.

- Is there a js version? should we just parse the proto ourselves?
- iframe polar signals/something hosted?

### Notetaking and persistent investigation sessions

- Store tab state, filters, queries, etc in a localstorage using a unique fingerprint based on zip so we can restore the investigation state if we reload the same zip.
- Add ability to pin/bookmark and/or record free form notes on any query result, file/line, log search, etc, and/or export all bookmarked things as a single docuemnt for pasting into an issue/thread?
- Set url path/fragment to reflect content within the zip, i.e. file/line or encoded query, to make browser nav work and enable "shareable links" (assuming recipient has same zip, unique fingerprint is in the URL to ensure it, etc)
- Offer to cache the zip in local storage for coming back to later?

### On-demand, Configurable Search Indexing
An enhanced interface for selectively indexing files from large ZIP archives, providing better control and visualization of the indexing process.

**Components:**
- **Enhanced Search/Indexing Navigation**
  - Add filtering interface to search and indexing nav
  - Live filter preview showing matching files
  - Aggregate statistics display (count, total size)
  - Queue-all button for current filter matches

- **Advanced Filtering**
  - Text-based filename filtering with regex support
  - File size range filtering
  - File type/extension filtering
  - Automatic time-range filter generator
    - Input: Start and end timestamps
    - Logic: Analyze filename patterns to identify files covering the time range
    - Challenge: Infer file end times from creation patterns and subsequent files
    - Example: `2024-01-15-node1.log` covers until `2024-01-16-node1.log` is found

- **Queue Management**
  - Visual queue display showing pending/processing/completed files
  - Progress indicators with estimated completion times
  - Ability to pause/resume/cancel indexing
  - Priority-based processing options

- **Live Statistics**
  - Real-time display of:
    - Total files matching current filter
    - Combined file sizes
    - Estimated indexing time
    - Current queue depth and processing rate

### Dedicated Jobs UI
A comprehensive job inspection interface for browsing and analyzing CockroachDB job data from debug bundles.

**Components:**
- **Job Browser Navigation**
  - Top-level "Jobs" navigation section / browser
  - Job type categorization (BACKUP, RESTORE, SCHEMA_CHANGE, etc.)
  - Filtering by:
    - status (running, succeeded, failed, cancelled)
    - User/description, error or message text search

- **Job Detail Tab**
  - **Overview Section**
  - Job ID, type, status, creation/modification times
  - User, description, and high-level progress
  - Duration and performance metrics
  - **Job Message Log**
  - Show all messages for the job

  - **Detailed view of raw Info & Payload**
  - Job info rows with structured data display
  - Payload details with JSON formatting

  - **Progress History**
    - Visualization of job progress history over time
  
 - **Additional Enhancements**
  - **Deeplink to job-scoped log search**
    - NB: Depends on log indexing.

  - **Messages & Events**
    - Identify key changes in progress (stall points/jumps)
    - Augment timeline from eventlog
    - Deeplink to time-scope log search (optionally triggers time-scoped indexing).
  
  - **Job Trace Analysis** 

  - **Job Specific Analysis Toolkits**
    - e.g. rangefeed debug tables for CDC, PCR and LDR
    - descriptor state for schema changes

**Data Sources:**
- `system.jobs*` table
- Log files (filtered by job ID)
- Progress and error message tables

**Implementation Notes:**
- Leverage duckDB tables -- query them for data by job ID.
- Integrate with current search/indexing system for log correlation
- Consider performance implications for large job datasets.

## Cleanups

### TypeScript Type Safety
### Bundle Size Optimization
- **Code splitting improvements**
  - Lazy load Monaco Editor and related dependencies
  - Split worker code into separate chunks
  - Route-based code splitting for different views

- **Dependency optimization**
  - Audit and remove unused dependencies
  - Replace heavy libraries with lighter alternatives where possible
    - E.g. what proto defs do we _actually need_ vs the 73kb we bundle now.
  - Tree-shake unused protobuf descriptors
  - Optimize DuckDB bundle loading

- **Asset optimization**
  - Compress and optimize WASM files
  - Implement proper caching strategies
  - Minimize CSS and remove unused styles
  - Optimize worker script sizes

### Performance Improvements
- **Parallelized file loading**
  - Implement concurrent ZIP entry processing
  - Parallel decompression for multiple files
  - Worker pool for CPU-intensive operations
  - Stream processing for large files

- **Chunk-based processing**
  - Implement backpressure for memory management (estimate size loaded so far)
  - Progressive loading with user feedback
  - Cancellable operations with cleanup
  - Option to evit things no longer deemed relevant

- **Memory optimization**
  - Implement proper cleanup in workers
  - Reduce memory footprint of large datasets
  - Streaming CSV processing for huge tables
  - Garbage collection optimization

### Architecture & State Management

- **Clean up worker communication**
  - Replace bracket notation property access on worker objects
  - Remove type casting hacks like `(workerProtoDecoder as any).root = root`
  - Implement proper initialization protocols
  - Use structured message passing instead of shared references
  - Establish clear ownership boundaries between workers

## Testing

### Unit Testing Infrastructure
- **Component restructuring for testability**
  - Extract business logic from React components
  - Create pure functions for data processing
  - Separate concerns (UI, state, data manipulation)
  - Implement dependency injection patterns
  - Create mockable service interfaces

- **Test coverage measurement**
  - Set up Jest with coverage reporting
  - Target 80%+ coverage for critical paths
  - Focus on business logic and data processing
  - Test edge cases and error conditions
  - Implement coverage gates in CI

### Unit Test Priorities
- **Core functionality**
  - CSV processing and parsing logic
  - Protobuf decoding and message handling
  - ZIP file reading and decompression
  - Database query building and execution
  - Search and indexing algorithms

- **Worker communication**
  - Message passing protocols
  - Error handling and recovery
  - Worker lifecycle management
  - Data serialization/deserialization

- **Data transformation**
  - Table schema detection
  - Column type inference
  - Data formatting and display
  - Search result ranking and filtering

### End-to-End Testing
- **Playwright test suite**
  - File upload and ZIP processing workflows
  - Table browsing and SQL query execution
  - Search functionality across different file types
  - SendSafely integration (with mocked API)
  - Cross-browser compatibility testing

- **Performance testing**
  - Large file processing benchmarks
  - Memory usage profiling
  - Worker startup and initialization timing
  - Database query performance testing

- **Integration testing**
  - Worker communication reliability
  - Error recovery scenarios
  - Concurrent operation handling
  - Resource cleanup verification

### Test Data and Mocking
- **Create representative test data**
  - Sample debug ZIP files of various sizes
  - Mock SendSafely API responses
  - Generated CSV files with edge cases
  - Protobuf test messages

- **Testing infrastructure**
  - Docker-based test environment
  - CI/CD pipeline integration
  - Automated performance regression detection
  - Visual regression testing for UI components