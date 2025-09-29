import type { CSSProperties } from 'react';
import type { Profile } from '../../utils/pprof-format';

export interface FlameGraphNode {
  name: string;
  displayName: string;
  fullName: string;
  uniqueName: string;
  value: number;
  originalValue?: number; // Used in icicle view
  children: FlameGraphNode[];
}

export interface FlameGraphData extends FlameGraphNode {
  actualTotalSampleValue: number;
}

export interface SampleTypeInfo {
  index: number;
  typeName: string;
  unitName: string;
}

export interface FadeOutSection {
  node: FlameGraphNode;
  depth: number;
  color: string;
}

export type ColorFunction = (functionName: string) => string;

export interface PprofTheme {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  headerBackgroundColor?: string;
  headerTextColor?: string;
  dropZoneBackgroundColor?: string;
  dropZoneBorderColor?: string;
  tooltipBackgroundColor?: string;
  tooltipTextColor?: string;
  highlightColor?: string;
  focusedFontWeight?: string;
}

export interface PprofViewerProps {
  /** Pre-parsed profile from pprof-format */
  profile: Profile;

  /** Custom color function for flame graph boxes */
  colorFunction?: ColorFunction;

  /** CSS class name for the root container */
  className?: string;

  /** Inline styles for the root container */
  style?: CSSProperties;

  /** Header layout style */
  headerStyle?: 'compact' | 'default';

  /** Theme customization */
  theme?: PprofTheme;

  /** Initial sample type index to display */
  initialSampleType?: number;

  /** Whether to show the file drop zone (for standalone use) */
  showDropZone?: boolean;

  /** Custom width for the flame graph container */
  width?: number | string;

  /** Custom height for the flame graph container */
  height?: number | string;
}

export interface ProfileHeaderProps {
  sampleTypes: SampleTypeInfo[];
  selectedSampleType: number;
  onSampleTypeChange: (index: number) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  currentFocus: string;
  focusStats: string;
  headerStyle: 'compact' | 'default';
  className?: string;
}

export interface FlameGraphProps {
  data: FlameGraphData;
  width: number;
  height: number;
  currentFocus: FlameGraphNode | null;
  onNodeClick: (node: FlameGraphNode) => void;
  onNodeHover: (node: FlameGraphNode | null) => void;
  colorFunction: ColorFunction;
  profile: Profile;
  selectedSampleType: number;
  className?: string;
}

export interface TooltipInfo {
  content: string;
  x: number;
  y: number;
  visible: boolean;
}