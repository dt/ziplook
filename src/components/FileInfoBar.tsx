interface FileInfoBarProps {
  filePath: string;
  onDownload: () => void;
  downloading: boolean;
  downloadProgress: number;
}

export function FileInfoBar({ filePath, onDownload, downloading, downloadProgress }: FileInfoBarProps) {
  return (
    <div
      className="file-info-bar"
      style={{
        padding: '4px 12px',
        backgroundColor: 'var(--header-bg-color, #2d2d2d)',
        borderBottom: '1px solid var(--border-color, #3d3d3d)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <span className="file-path" title={filePath} style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
        {filePath}
      </span>
      <button
        className={`download-button ${downloading ? 'downloading' : ''}`}
        onClick={onDownload}
        disabled={downloading}
        title={downloading ? `Downloading... ${downloadProgress}%` : "Download file"}
        style={{
          padding: '2px 8px',
          fontSize: '14px',
          backgroundColor: downloading ? 'var(--button-disabled-bg, #555)' : 'var(--button-bg, #007acc)',
          color: 'var(--button-text, #fff)',
          border: 'none',
          borderRadius: '3px',
          cursor: downloading ? 'not-allowed' : 'pointer',
          opacity: downloading ? 0.6 : 1
        }}
      >
        {downloading ? `${downloadProgress}%` : '⬇'}
      </button>
    </div>
  );
}
