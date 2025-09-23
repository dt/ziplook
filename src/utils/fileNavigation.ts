import type { AppAction } from '../state/AppContext';

/**
 * Utility function to open a file at a specific line number
 * This is designed to be used by search results and other components
 * that need to navigate to specific locations in files.
 */
export function openFileAtLine(
  dispatch: React.Dispatch<AppAction>,
  fileId: string,
  fileName: string,
  lineNumber: number
) {
  dispatch({
    type: 'OPEN_FILE_AT_LINE',
    fileId,
    fileName,
    lineNumber
  });
}

/**
 * Utility function to open a file normally (without jumping to a line)
 * For consistency with the new line-jumping functionality
 */
export function openFile(
  dispatch: React.Dispatch<AppAction>,
  fileId: string,
  fileName: string
) {
  dispatch({
    type: 'OPEN_NEW_FILE_TAB',
    fileId,
    fileName
  });
}

/**
 * Extract file path and line number from common search result formats
 * Supports formats like:
 * - "path/to/file:123" (grep style)
 * - "path/to/file.txt:45:content here" (ripgrep style)
 * - "file.log(123): message" (log style)
 */
export function parseFileReference(reference: string): { filePath: string; lineNumber?: number } {
  // Try grep/ripgrep style: "path:line"
  const grepMatch = reference.match(/^([^:]+):(\d+)(?::|$)/);
  if (grepMatch) {
    return {
      filePath: grepMatch[1],
      lineNumber: parseInt(grepMatch[2], 10)
    };
  }

  // Try log style: "file(line)"
  const logMatch = reference.match(/^([^(]+)\((\d+)\)/);
  if (logMatch) {
    return {
      filePath: logMatch[1],
      lineNumber: parseInt(logMatch[2], 10)
    };
  }

  // Default to just the file path
  return { filePath: reference };
}