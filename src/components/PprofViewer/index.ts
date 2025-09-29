// Main component
export { PprofViewer } from './PprofViewer';

// Types
export type {
  PprofViewerProps,
  FlameGraphNode,
  FlameGraphData,
  ColorFunction,
  PprofTheme,
} from './types';

export type { Profile } from '../../utils/pprof-format';

// Pre-built color schemes
export { flamegraphColorSchemes } from './hooks/useColorFunction';

// Hooks (for advanced usage)
export { useFlameGraphData, useSampleTypes } from './hooks/useFlameGraphData';
export { useFlameGraphInteraction } from './hooks/useFlameGraphInteraction';
export { useColorFunction } from './hooks/useColorFunction';