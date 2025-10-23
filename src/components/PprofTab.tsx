import { useState, useEffect, useCallback, useRef } from 'react';
import { Profile } from '../utils/pprof-format';
import { PprofViewer, flamegraphColorSchemes } from './PprofViewer';
import { useApp } from '../state/AppContext';
import type { ViewerTab } from '../state/types';
import { getPprofFileType } from '../utils/pprofDetection';
import { FileInfoBar } from './FileInfoBar';

interface PprofTabProps {
  tab: ViewerTab & { kind: 'pprof' };
}

export function PprofTab({ tab }: PprofTabProps) {
  const { state } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progress, setProgress] = useState({ loaded: 0, total: 0, percent: 0 });
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const loadingInitiated = useRef(false);

  const loadProfile = useCallback(async () => {
    if (!state.workerManager) {
      setError('WorkerManager not available');
      return;
    }

    if (loadingInitiated.current) {
      return; // Already loading or loaded
    }
    loadingInitiated.current = true;

    setLoading(true);
    setError(null);
    setProfile(null);
    setProgress({ loaded: 0, total: 0, percent: 0 });

    try {
      // Get file entry from index
      const fileEntry = state.filesIndex[tab.fileId];
      if (!fileEntry) {
        throw new Error('File not found in index');
      }

      // Check if file is gzipped by extension - many pprof files are gzipped without .gz extension
      const isGzipped = fileEntry.name.toLowerCase().endsWith('.gz') ||
                       fileEntry.path.toLowerCase().endsWith('.gz') ||
                       fileEntry.name.toLowerCase().endsWith('.pprof') ||  // pprof files are often gzipped
                       fileEntry.path.toLowerCase().includes('.pprof');

      let accumulatedData = new Uint8Array(0);

      // Use worker's decompress option for gzipped files
      await state.workerManager.readFileStream(
          fileEntry.path,
          (
            chunk: Uint8Array,
            progressInfo: { loaded: number; total: number; done: boolean },
          ) => {
            // Accumulate binary data directly
            const newData = new Uint8Array(accumulatedData.length + chunk.length);
            newData.set(accumulatedData);
            newData.set(chunk, accumulatedData.length);
            accumulatedData = newData;

            // Update progress
            const percent = progressInfo.total > 0
              ? Math.round((progressInfo.loaded / progressInfo.total) * 100)
              : 0;
            setProgress({
              loaded: progressInfo.loaded,
              total: progressInfo.total,
              percent,
            });

            if (progressInfo.done) {
              // Parse the profile data (already decompressed by worker if needed)
              // Keep loading=true during Profile.decode() as it can be slow
              try {
                const parsedProfile = Profile.decode(accumulatedData);
                setProfile(parsedProfile);
                setLoading(false); // Only set loading=false after successful decode
              } catch (parseError) {
                console.error('PprofTab: Error parsing pprof file:', parseError);
                setError(`Failed to parse profile: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
                setLoading(false); // Set loading=false on error
              }
            }
          },
          { decompress: isGzipped }
        );
    } catch (err) {
      console.error('Failed to load pprof file:', err);
      setError(`Failed to load profile: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setLoading(false);
    }
  }, [tab.fileId, state.filesIndex, state.workerManager]);

  const handleDownload = useCallback(async () => {
    if (!state.workerManager) return;

    const fileEntry = state.filesIndex[tab.fileId];
    if (!fileEntry) return;

    setDownloading(true);
    setDownloadProgress(0);

    try {
      const isGzipped = fileEntry.name.toLowerCase().endsWith('.gz') ||
                       fileEntry.path.toLowerCase().endsWith('.gz') ||
                       fileEntry.name.toLowerCase().endsWith('.pprof') ||
                       fileEntry.path.toLowerCase().includes('.pprof');

      let accumulatedData = new Uint8Array(0);

      await state.workerManager.readFileStream(
        fileEntry.path,
        (chunk: Uint8Array, progressInfo: { loaded: number; total: number; done: boolean }) => {
          const newData = new Uint8Array(accumulatedData.length + chunk.length);
          newData.set(accumulatedData);
          newData.set(chunk, accumulatedData.length);
          accumulatedData = newData;

          const percent = progressInfo.total > 0
            ? Math.round((progressInfo.loaded / progressInfo.total) * 100)
            : 0;
          setDownloadProgress(percent);

          if (progressInfo.done) {
            // Create blob and download
            const blob = new Blob([accumulatedData], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileEntry.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setTimeout(() => {
              setDownloading(false);
              setDownloadProgress(0);
            }, 500);
          }
        },
        { decompress: isGzipped }
      );
    } catch (err) {
      console.error('Download failed:', err);
      setDownloading(false);
      setDownloadProgress(0);
    }
  }, [tab.fileId, state.filesIndex, state.workerManager]);

  useEffect(() => {
    if (state.workerManager && !loading && !profile && !error && !loadingInitiated.current) {
      loadProfile();
    }
  }, [state.workerManager, tab.fileId]); // Only depend on workerManager and fileId

  // Helper function for formatting file sizes
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const fileType = getPprofFileType(tab.title);

  // Loading state
  if (loading) {
    const fileEntry = state.filesIndex[tab.fileId];
    const fullPath = fileEntry?.path || tab.fileId;

    return (
      <div className="file-viewer loading">
        <div className="loading-container">
          <div className="loading-message">
            Loading {fileType || 'Profile'}...
          </div>
          <div className="file-path" title={fullPath} style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
            {fullPath}
          </div>
          {progress.total > 0 && (
            <>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
              <div className="progress-text">
                {formatFileSize(progress.loaded)} /{" "}
                {formatFileSize(progress.total)} ({progress.percent}%)
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Error state - show in content area
  if (error) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="error-message" style={{ textAlign: 'center', padding: '40px', maxWidth: '600px' }}>
          <h3 style={{ color: '#e74c3c', marginBottom: '16px' }}>Failed to Load Profile</h3>
          <p style={{ marginBottom: '20px', color: 'var(--text-color, #ffffff)' }}>{error}</p>
          <p style={{ fontSize: '14px', color: 'var(--text-color-secondary, #cccccc)', marginBottom: '20px' }}>
            This file may not be a valid pprof profile, or it may be corrupted.
          </p>
          <button
            className="btn btn-primary"
            onClick={loadProfile}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007acc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Profile loaded - render the PprofViewer taking full content area
  if (profile) {
    const fileEntry = state.filesIndex[tab.fileId];
    const fullPath = fileEntry?.path || tab.fileId;

    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <FileInfoBar
          filePath={fullPath}
          onDownload={handleDownload}
          downloading={downloading}
          downloadProgress={downloadProgress}
        />
        <PprofViewer
          profile={profile}
          headerStyle="compact"
          colorFunction={flamegraphColorSchemes.classic}
          theme={{
            borderColor: 'transparent',
            headerBackgroundColor: 'var(--header-bg-color, #2d2d2d)',
            backgroundColor: 'var(--bg-color, #1a1a1a)',
            textColor: 'var(--text-color, #ffffff)',
          }}
          width="100%"
          height="100%"
        />
      </div>
    );
  }

  // Fallback state - only show if we're definitely not loading and have tried loading
  if (loadingInitiated.current) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3 style={{ color: 'var(--text-color-secondary, #cccccc)', marginBottom: '16px' }}>No Profile Data</h3>
          <p style={{ color: 'var(--text-color, #ffffff)' }}>The profile file appears to be empty or invalid.</p>
        </div>
      </div>
    );
  }

  // Initial state - show loading message
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h3 style={{ color: 'var(--text-color-secondary, #cccccc)', marginBottom: '16px' }}>Preparing Profile</h3>
        <p style={{ color: 'var(--text-color, #ffffff)' }}>Initializing profile viewer...</p>
      </div>
    </div>
  );
}