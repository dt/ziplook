import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import type { FlameGraphProps, FlameGraphNode, FadeOutSection } from './types';
import styles from './FlameGraph.module.css';

export function FlameGraph({
  data,
  width: _width, // width handled by ResizeObserver
  height: _height, // height handled by CSS
  currentFocus,
  onNodeClick,
  onNodeHover,
  colorFunction,
  profile,
  selectedSampleType,
  className,
}: FlameGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1000);

  // Use ResizeObserver to get actual container width
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(container);

    // Set initial width
    setContainerWidth(container.clientWidth);

    return () => resizeObserver.disconnect();
  }, []);

  // Constants from original Go pprof
  const ROW = 20;
  const PADDING = 2;
  const MIN_WIDTH = 4;
  const MIN_TEXT_WIDTH = 16;

  const fadeOutSections = useMemo(() => {
    if (!currentFocus) return [];
    return calculateFadeOutSections(data, currentFocus);
  }, [data, currentFocus]);

  const hasFadeOuts = fadeOutSections.length > 0;
  const mainWidth = hasFadeOuts ? containerWidth * 0.98 : containerWidth - 2 * PADDING;
  const fadeWidth = hasFadeOuts ? containerWidth * 0.01 : 0;

  // Function to get humanized values for tooltips
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

  // Get current sample type info for tooltips
  const currentSampleTypeInfo = useMemo(() => {
    const sampleTypes = profile.sampleType || [];
    const stringTable = profile.stringTable.strings || [];
    const currentSampleType = sampleTypes[selectedSampleType];
    return {
      typeName: currentSampleType ? stringTable[Number(currentSampleType.type)] || '' : '',
      unitName: currentSampleType ? stringTable[Number(currentSampleType.unit)] || '' : '',
    };
  }, [profile, selectedSampleType]);

  // Render flame graph boxes recursively
  const renderFlameBoxes = useCallback((
    node: FlameGraphNode,
    x: number,
    y: number,
    frameWidth: number,
    totalValue: number,
    _parentValue?: number | null,
    depth: number = 0,
    boxes: React.JSX.Element[] = []
  ): React.JSX.Element[] => {
    if (frameWidth < MIN_WIDTH) return boxes;

    const adjustedX = hasFadeOuts ? x + fadeWidth : x;
    const boxWidth = frameWidth - 1; // -1 for border like Go pprof

    // Create the main flame box
    const isFocused = currentFocus &&
      currentFocus.name === node.name &&
      (currentFocus.uniqueName || currentFocus.name) === (node.uniqueName || node.name) &&
      (currentFocus.originalValue || currentFocus.value) === (node.originalValue || node.value) &&
      node.name !== 'root';

    const isFullWidthParent = hasFadeOuts && fadeOutSections.some(f => f.depth === depth);

    let boxClasses = styles.flameBox;
    if (isFocused) boxClasses += ` ${styles.flameBoxFocused}`;
    if (isFullWidthParent) boxClasses += ` ${styles.flameBoxNoSideBorders}`;

    const backgroundColor = colorFunction(node.name);

    // Create tooltip content
    const fullName = node.fullName || node.uniqueName || node.name;
    const nodeValue = node.originalValue || node.value;
    const rootTotal = data.actualTotalSampleValue || data.value;
    const overallPercent = ((nodeValue / rootTotal) * 100).toFixed(1);

    let tooltipText: string;
    if (node.name === 'root') {
      const actualTotal = data.actualTotalSampleValue || node.value;
      const { unitName } = currentSampleTypeInfo;

      if (unitName === 'nanoseconds') {
        const profileDurationNanos = profile.durationNanos || profile.timeNanos;
        if (profileDurationNanos) {
          const sampleTimeStr = getHumanizedValue(actualTotal, unitName);
          const profileTimeStr = getHumanizedValue(Number(profileDurationNanos), unitName);
          const percentage = ((actualTotal / Number(profileDurationNanos)) * 100).toFixed(2);
          tooltipText = `${fullName}: ${sampleTimeStr} / ${profileTimeStr} profiled (${percentage}%)`;
        } else {
          const sampleTimeStr = getHumanizedValue(actualTotal, unitName);
          tooltipText = `${fullName}: Total ${sampleTimeStr}`;
        }
      } else {
        const totalStr = getHumanizedValue(actualTotal, unitName);
        tooltipText = `${fullName}: Total ${totalStr}`;
      }
    } else {
      tooltipText = `${fullName}: ${overallPercent}%`;
    }

    // Create display text
    let displayText = '';
    if (frameWidth >= MIN_TEXT_WIDTH) {
      const displayName = node.displayName || node.name;
      if (node.name === 'root') {
        const actualTotal = data.actualTotalSampleValue || node.value;
        const { typeName, unitName } = currentSampleTypeInfo;
        const valueStr = getHumanizedValue(actualTotal, unitName);
        displayText = `${displayName} (${typeName} ${valueStr})`;
      } else {
        displayText = displayName;
      }

      // Truncate text to fit
      const maxChars = Math.floor((frameWidth - 4) / 7); // rough char width
      if (displayText.length > maxChars) {
        displayText = displayText.substring(0, Math.max(0, maxChars - 3)) + "...";
      }
    }

    const boxKey = `${node.uniqueName || node.name}-${depth}-${x}-${y}`;

    boxes.push(
      <div
        key={boxKey}
        className={boxClasses}
        style={{
          left: adjustedX,
          top: y,
          width: boxWidth,
          height: ROW,
          backgroundColor,
        }}
        title={tooltipText}
        onClick={() => onNodeClick(node)}
        onMouseEnter={() => onNodeHover(node)}
        onMouseLeave={() => onNodeHover(null)}
      >
        {displayText}
      </div>
    );

    // Add fade-out sections for this depth
    if (hasFadeOuts) {
      const relevantFadeOuts = fadeOutSections.filter(f => f.depth === depth);
      relevantFadeOuts.forEach((fadeOut, index) => {
        const fadeColor = colorFunction(fadeOut.node.name);

        // Left fade-out
        boxes.push(
          <div
            key={`fade-left-${depth}-${index}`}
            className={styles.fadeOutLeft}
            style={{
              left: PADDING,
              top: y,
              width: fadeWidth,
              height: ROW,
              background: `linear-gradient(to left, ${fadeColor}, color-mix(in srgb, ${fadeColor} 30%, transparent))`,
              borderTop: `1px solid var(--pprof-border-color, #ffffff)`,
              borderBottom: `1px solid var(--pprof-border-color, #ffffff)`,
            }}
          />
        );

        // Right fade-out
        boxes.push(
          <div
            key={`fade-right-${depth}-${index}`}
            className={styles.fadeOutRight}
            style={{
              left: PADDING + fadeWidth + mainWidth - 1,
              top: y,
              width: fadeWidth,
              height: ROW,
              background: `linear-gradient(to right, ${fadeColor}, color-mix(in srgb, ${fadeColor} 30%, transparent))`,
              borderTop: `1px solid var(--pprof-border-color, #ffffff)`,
              borderBottom: `1px solid var(--pprof-border-color, #ffffff)`,
            }}
          />
        );
      });
    }

    // Render children
    if (node.children && node.children.length > 0) {
      let childX = x;
      node.children.forEach(child => {
        const childWidth = (child.value / node.value) * frameWidth;
        renderFlameBoxes(child, childX, y + ROW, childWidth, totalValue, node.value, depth + 1, boxes);
        childX += childWidth;
      });
    }

    return boxes;
  }, [
    data,
    currentFocus,
    fadeOutSections,
    hasFadeOuts,
    fadeWidth,
    mainWidth,
    colorFunction,
    onNodeClick,
    onNodeHover,
    profile,
    currentSampleTypeInfo,
    getHumanizedValue,
  ]);

  const flameBoxes = useMemo(() => {
    return renderFlameBoxes(data, PADDING, 0, mainWidth, data.value);
  }, [data, mainWidth, renderFlameBoxes]);

  const maxDepth = useMemo(() => {
    function getMaxDepth(node: FlameGraphNode, depth = 1): number {
      if (!node.children || node.children.length === 0) {
        return depth;
      }
      return Math.max(...node.children.map(child => getMaxDepth(child, depth + 1)));
    }
    return getMaxDepth(data);
  }, [data]);

  const containerHeight = maxDepth * ROW + 4 * ROW;

  return (
    <div
      ref={containerRef}
      className={`${styles.flameGraph} ${className || ''}`}
      style={{
        // Let CSS handle width/height for responsiveness
        minHeight: containerHeight,
      }}
    >
      {flameBoxes}
    </div>
  );
}

function calculateFadeOutSections(rootData: FlameGraphNode, focusNode: FlameGraphNode): FadeOutSection[] {
  if (!focusNode) return [];

  // Find path from root to focus node
  const path = findPathToNode(rootData, focusNode);
  if (!path) return [];

  const fadeOutSections: FadeOutSection[] = [];

  // For each parent frame in the path (including root), check if it has larger value than focus
  for (let i = 0; i < path.length - 1; i++) { // Exclude the focus node itself
    const parentNode = path[i];
    if (parentNode.value > focusNode.value) {
      fadeOutSections.push({
        node: parentNode,
        depth: i,
        color: '#d8d8d8' // Default color, will be overridden by colorFunction
      });
    }
  }

  return fadeOutSections;
}

function findPathToNode(root: FlameGraphNode, target: FlameGraphNode, path: FlameGraphNode[] = []): FlameGraphNode[] | null {
  const newPath = [...path, root];

  if (root === target) {
    return newPath;
  }

  if (root.children) {
    for (const child of root.children) {
      const result = findPathToNode(child, target, newPath);
      if (result) return result;
    }
  }

  return null;
}