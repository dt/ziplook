import { useState, useCallback, useMemo, useEffect } from 'react';
import type { FlameGraphNode, FlameGraphData, FadeOutSection } from '../types';

export function useFlameGraphInteraction(rootData: FlameGraphData | null) {
  const [currentFocus, setCurrentFocus] = useState<FlameGraphNode | null>(null);
  const [highlightedFunction, setHighlightedFunction] = useState<string | null>(null);

  // Set initial focus to root when data is available
  useEffect(() => {
    if (rootData && !currentFocus) {
      setCurrentFocus(rootData);
    }
  }, [rootData, currentFocus]);

  const displayData = useMemo(() => {
    if (!rootData) return null;
    if (!currentFocus) return rootData;
    return buildIcicleView(rootData, currentFocus);
  }, [rootData, currentFocus]);

  const fadeOutSections = useMemo(() => {
    if (!rootData || !currentFocus) return [];
    return calculateFadeOutSections(rootData, currentFocus);
  }, [rootData, currentFocus]);

  const focusOnNode = useCallback((node: FlameGraphNode) => {
    if (!rootData) return;

    // Find the original node in rootData to ensure consistent object references
    const originalNode = findNodeInRoot(rootData, node);
    const newFocus = originalNode || node;

    if (currentFocus &&
        currentFocus.name === newFocus.name &&
        (currentFocus.uniqueName || currentFocus.name) === (newFocus.uniqueName || newFocus.name) &&
        currentFocus.value === (newFocus.originalValue || newFocus.value)) {
      // If clicking current focus, go back to full view
      setCurrentFocus(null);
    } else {
      // Focus on this node (classic icicle)
      setCurrentFocus(newFocus);
    }
  }, [rootData, currentFocus]);

  const clearFocus = useCallback(() => {
    setCurrentFocus(null);
  }, []);

  const setHighlight = useCallback((functionName: string | null) => {
    setHighlightedFunction(functionName);
  }, []);

  return {
    currentFocus,
    displayData,
    fadeOutSections,
    highlightedFunction,
    focusOnNode,
    clearFocus,
    setHighlight,
  };
}

function buildIcicleView(rootData: FlameGraphData, focusNode: FlameGraphNode): FlameGraphData {
  if (!focusNode) return rootData;

  // Find path from root to focus node
  const path = findPathToNode(rootData, focusNode);
  if (!path) return rootData;

  // Build icicle view: path to focus + focus children
  // Each parent in the path gets the focused node's value (for full width)
  const result: FlameGraphNode = {
    ...path[0],
    value: focusNode.value, // Root gets focus width for display
    originalValue: path[0].value, // Preserve original value for percentage calculations
    children: []
  };
  let current = result;

  // Build the path (each parent gets full width)
  for (let i = 1; i < path.length; i++) {
    const pathNode = path[i];
    const child: FlameGraphNode = {
      ...pathNode,
      value: focusNode.value, // Each parent gets focus width for display
      originalValue: pathNode.value, // Preserve original value for percentage calculations
      children: []
    };
    current.children = [child];
    current = child;
  }

  // Add the focused node's children normally (keep their original values)
  if (focusNode.children) {
    current.children = [...focusNode.children];
  }

  return result as FlameGraphData;
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

function findNodeInRoot(root: FlameGraphNode, targetNode: FlameGraphNode): FlameGraphNode | null {
  // Find a node in the root data that matches the target node
  function searchNode(node: FlameGraphNode): FlameGraphNode | null {
    // Use originalValue if available (for icicle view nodes), otherwise use value
    const targetValue = targetNode.originalValue || targetNode.value;
    const nodeValue = node.originalValue || node.value;

    if (node.name === targetNode.name &&
        (node.uniqueName || node.name) === (targetNode.uniqueName || targetNode.name) &&
        nodeValue === targetValue) {
      return node;
    }
    if (node.children) {
      for (const child of node.children) {
        const result = searchNode(child);
        if (result) return result;
      }
    }
    return null;
  }
  return searchNode(root);
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