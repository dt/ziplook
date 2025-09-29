import { useState, useMemo, useCallback, useEffect } from 'react';
import type { CSSProperties } from 'react';
import type { PprofViewerProps, FlameGraphNode, FlameGraphData } from './types';
import { ProfileHeader } from './ProfileHeader';
import { FlameGraph } from './FlameGraph';
import { useFlameGraphData, useSampleTypes } from './hooks/useFlameGraphData';
import { useFlameGraphInteraction } from './hooks/useFlameGraphInteraction';
import { useColorFunction } from './hooks/useColorFunction';
import styles from './PprofViewer.module.css';

export function PprofViewer({
  profile,
  colorFunction: customColorFunction,
  className,
  style,
  headerStyle = 'default',
  theme,
  initialSampleType,
  showDropZone = false,
  width = '100%',
  height = '100%',
}: PprofViewerProps) {
  const sampleTypes = useSampleTypes(profile);
  const [selectedSampleType, setSelectedSampleType] = useState(() => {
    if (initialSampleType !== undefined && initialSampleType < sampleTypes.length) {
      return initialSampleType;
    }
    // Default to the last sample type (usually most informative)
    return Math.max(0, sampleTypes.length - 1);
  });

  const [searchValue, setSearchValue] = useState('');
  const [currentHover, setCurrentHover] = useState<FlameGraphNode | null>(null);

  // Update selected sample type when sampleTypes changes
  useEffect(() => {
    if (sampleTypes.length > 0 && selectedSampleType >= sampleTypes.length) {
      setSelectedSampleType(Math.max(0, sampleTypes.length - 1));
    }
  }, [sampleTypes.length, selectedSampleType]);

  const flameGraphData = useFlameGraphData(profile, selectedSampleType);
  const colorFunction = useColorFunction(customColorFunction);

  const {
    currentFocus,
    displayData,
    focusOnNode,
    setHighlight,
  } = useFlameGraphInteraction(flameGraphData);

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!displayData || !searchValue.trim()) return displayData;
    return filterNodes(displayData, searchValue.toLowerCase());
  }, [displayData, searchValue]);

  // Helper function to format values consistently with FlameGraph
  const getHumanizedValue = useCallback((value: number, unitName: string) => {
    if (unitName === 'nanoseconds') {
      const seconds = value / 1e9;
      return `${seconds.toFixed(2)}s`;
    } else if (unitName === 'bytes') {
      const mb = value / (1024 * 1024);
      return `${mb.toFixed(2)}MB`;
    } else if (unitName === 'count' || unitName === '') {
      return value.toLocaleString();
    } else {
      return `${value} ${unitName}`;
    }
  }, []);

  // Helper function to calculate aggregate value for a function across all call paths
  const calculateFunctionAggregate = useCallback((targetNode: FlameGraphNode, rootData: FlameGraphData | null): number => {
    if (!rootData) return 0;

    const uniqueName = targetNode.uniqueName || targetNode.fullName || targetNode.name;
    let aggregate = 0;

    function traverse(node: FlameGraphNode) {
      const nodeUniqueName = node.uniqueName || node.fullName || node.name;
      if (nodeUniqueName === uniqueName && nodeUniqueName !== 'root') {
        aggregate += node.originalValue || node.value;
      }
      if (node.children) {
        node.children.forEach(traverse);
      }
    }

    traverse(rootData);
    return aggregate;
  }, []);

  // Calculate focus display info
  const focusDisplayInfo = useMemo(() => {
    const currentSampleType = sampleTypes[selectedSampleType];
    const isNanoseconds = currentSampleType?.unitName === 'nanoseconds';

    if (currentHover) {
      const fullName = currentHover.fullName || currentHover.uniqueName || currentHover.name;
      const nodeValue = currentHover.originalValue || currentHover.value;
      const rootTotal = flameGraphData?.actualTotalSampleValue || flameGraphData?.value || 1;
      const thisFramePercent = ((nodeValue / rootTotal) * 100).toFixed(1);

      // For root node, show total value like the flame box
      if (currentHover === flameGraphData) {
        const humanizedValue = getHumanizedValue(nodeValue, currentSampleType?.unitName || '');
        return {
          currentFocus: `${fullName} (${humanizedValue})`,
          focusStats: isNanoseconds && profile?.durationNanos ?
            `${(nodeValue / 1e9).toFixed(2)}s / ${(Number(profile.durationNanos) / 1e9).toFixed(2)}s profiled (${((nodeValue / Number(profile.durationNanos)) * 100).toFixed(0)}%)` :
            `${thisFramePercent}%`,
        };
      }

      // Calculate aggregate percentage (sum of all instances of this function)
      const aggregateValue = calculateFunctionAggregate(currentHover, flameGraphData);
      const aggregatePercent = ((aggregateValue / rootTotal) * 100).toFixed(1);

      return {
        currentFocus: fullName,
        focusStats: `${thisFramePercent}% (${aggregatePercent}% agg)`,
      };
    }

    if (currentFocus) {
      const fullName = currentFocus.fullName || currentFocus.uniqueName || currentFocus.name;
      const nodeValue = currentFocus.originalValue || currentFocus.value;
      const rootTotal = flameGraphData?.actualTotalSampleValue || flameGraphData?.value || 1;
      const thisFramePercent = ((nodeValue / rootTotal) * 100).toFixed(1);

      // For root node, show total value like the flame box
      if (currentFocus === flameGraphData) {
        const humanizedValue = getHumanizedValue(nodeValue, currentSampleType?.unitName || '');
        return {
          currentFocus: `${fullName} (${humanizedValue})`,
          focusStats: isNanoseconds && profile?.durationNanos ?
            `${(nodeValue / 1e9).toFixed(2)}s / ${(Number(profile.durationNanos) / 1e9).toFixed(2)}s profiled (${((nodeValue / Number(profile.durationNanos)) * 100).toFixed(0)}%)` :
            `${thisFramePercent}%`,
        };
      }

      // Calculate aggregate percentage (sum of all instances of this function)
      const aggregateValue = calculateFunctionAggregate(currentFocus, flameGraphData);
      const aggregatePercent = ((aggregateValue / rootTotal) * 100).toFixed(1);

      return {
        currentFocus: fullName,
        focusStats: `${thisFramePercent}% (${aggregatePercent}% agg)`,
      };
    }

    return {
      currentFocus: '',
      focusStats: '',
    };
  }, [currentHover, currentFocus, flameGraphData, sampleTypes, selectedSampleType, profile, getHumanizedValue, calculateFunctionAggregate]);

  const handleNodeClick = useCallback((node: FlameGraphNode) => {
    focusOnNode(node);
  }, [focusOnNode]);

  const handleNodeHover = useCallback((node: FlameGraphNode | null) => {
    setCurrentHover(node);
    setHighlight(node?.name || null);
  }, [setHighlight]);

  // Apply theme CSS custom properties
  const containerStyle = useMemo((): CSSProperties => {
    const themeVars: Record<string, string> = {};

    if (theme) {
      if (theme.backgroundColor) themeVars['--pprof-background-color'] = theme.backgroundColor;
      if (theme.borderColor) themeVars['--pprof-border-color'] = theme.borderColor;
      if (theme.textColor) themeVars['--pprof-text-color'] = theme.textColor;
      if (theme.headerBackgroundColor) themeVars['--pprof-header-background-color'] = theme.headerBackgroundColor;
      if (theme.headerTextColor) themeVars['--pprof-header-text-color'] = theme.headerTextColor;
      if (theme.dropZoneBackgroundColor) themeVars['--pprof-dropzone-background-color'] = theme.dropZoneBackgroundColor;
      if (theme.dropZoneBorderColor) themeVars['--pprof-dropzone-border-color'] = theme.dropZoneBorderColor;
      if (theme.tooltipBackgroundColor) themeVars['--pprof-tooltip-background-color'] = theme.tooltipBackgroundColor;
      if (theme.tooltipTextColor) themeVars['--pprof-tooltip-text-color'] = theme.tooltipTextColor;
      if (theme.highlightColor) themeVars['--pprof-highlight-color'] = theme.highlightColor;
      if (theme.focusedFontWeight) themeVars['--pprof-focused-font-weight'] = theme.focusedFontWeight;
    }

    return {
      ...themeVars,
      ...style,
      width,
      height,
    };
  }, [theme, style, width, height]);

  if (!flameGraphData || sampleTypes.length === 0) {
    return (
      <div className={`${styles.container} ${className || ''}`} style={containerStyle}>
        <div className={styles.error}>
          {!profile ? 'No profile provided' : 'Unable to parse profile data'}
        </div>
      </div>
    );
  }

  const dataToRender = (filteredData as FlameGraphData) || flameGraphData;

  return (
    <div className={`${styles.container} ${className || ''}`} style={containerStyle}>
      <ProfileHeader
        sampleTypes={sampleTypes}
        selectedSampleType={selectedSampleType}
        onSampleTypeChange={setSelectedSampleType}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        currentFocus={focusDisplayInfo.currentFocus}
        focusStats={focusDisplayInfo.focusStats}
        headerStyle={headerStyle}
      />

      {showDropZone && (
        <div className={styles.dropZone}>
          📁 Drop profile file here or click to browse
        </div>
      )}

      <div className={styles.flameGraph}>
        <FlameGraph
          data={dataToRender}
          width={typeof width === 'string' ? 800 : width}
          height={typeof height === 'string' ? 400 : height}
          currentFocus={currentFocus}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          colorFunction={colorFunction}
          profile={profile}
          selectedSampleType={selectedSampleType}
        />
      </div>
    </div>
  );
}

function filterNodes(node: FlameGraphNode, searchTerm: string): FlameGraphNode | null {
  const matches = node.name.toLowerCase().includes(searchTerm);
  const filteredChildren = node.children
    .map(child => filterNodes(child, searchTerm))
    .filter((child): child is FlameGraphNode => child !== null);

  if (matches || filteredChildren.length > 0) {
    return {
      ...node,
      children: filteredChildren
    };
  }
  return null;
}