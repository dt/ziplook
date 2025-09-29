/**
 * Utility functions for detecting pprof files
 */

export function isPprofFile(fileName: string): boolean {
  const lowerName = fileName.toLowerCase();

  // Check common pprof extensions
  if (lowerName.endsWith('.pprof') ||
      lowerName.endsWith('.prof') ||
      lowerName.endsWith('.pprof.gz') ||
      lowerName.endsWith('.prof.gz')) {
    return true;
  }

  // Check common pprof file patterns (like from Go's net/http/pprof)
  const pprofPatterns = [
    /profile$/i,
    /heap$/i,
    /allocs$/i,
    /block$/i,
    /mutex$/i,
    /goroutine$/i,
    /threadcreate$/i,
  ];

  return pprofPatterns.some(pattern => pattern.test(fileName));
}

export function getPprofFileType(fileName: string): string | null {
  if (!isPprofFile(fileName)) {
    return null;
  }

  const lowerName = fileName.toLowerCase();

  if (lowerName.includes('heap')) return 'Heap Profile';
  if (lowerName.includes('allocs')) return 'Allocation Profile';
  if (lowerName.includes('block')) return 'Block Profile';
  if (lowerName.includes('mutex')) return 'Mutex Profile';
  if (lowerName.includes('goroutine')) return 'Goroutine Profile';
  if (lowerName.includes('threadcreate')) return 'Thread Creation Profile';
  if (lowerName.includes('profile')) return 'CPU Profile';

  return 'Profile';
}