import { useMemo } from 'react';
import type { ColorFunction } from '../types';

export function useColorFunction(customColorFunction?: ColorFunction): ColorFunction {
  return useMemo(() => {
    if (customColorFunction) {
      return customColorFunction;
    }
    return createDefaultColorFunction();
  }, [customColorFunction]);
}

function createDefaultColorFunction(): ColorFunction {
  const functionColors = new Map<string, string>();

  return (name: string) => {
    if (!functionColors.has(name)) {
      // Generate a deterministic hash from the function name
      const hash = hashString(name);
      functionColors.set(name, makeColor(hash));
    }
    return functionColors.get(name)!;
  };
}

// Go pprof makeColor function (exact copy)
function makeColor(index: number): string {
  const PHI = 1.618033988;
  const hue = (index + 1) * PHI * 2 * Math.PI;
  return `hsl(${hue}rad 50% 80%)`;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Predefined color functions that users can import and use
export const flamegraphColorSchemes = {
  // Default pastel colors (current implementation)
  pastel: createDefaultColorFunction(),

  // Classic flame graph orange/brown gradient - darker for better text contrast
  classic: (functionName: string): string => {
    const hash = hashString(functionName);
    const hue = 5 + (hash % 25); // Orange to burnt orange range (5-30 degrees) - more red/orange, less yellow
    const saturation = 75 + (hash % 20); // 75-95% - richer colors
    const lightness = 25 + (hash % 20); // 25-45% - much darker for white text
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  },

  // Blue-based color scheme
  blue: (functionName: string): string => {
    const hash = hashString(functionName);
    const hue = 200 + (hash % 60); // Blue range (200-260 degrees)
    const saturation = 50 + (hash % 40); // 50-90%
    const lightness = 60 + (hash % 30); // 60-90%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  },

  // Green-based color scheme
  green: (functionName: string): string => {
    const hash = hashString(functionName);
    const hue = 90 + (hash % 60); // Green range (90-150 degrees)
    const saturation = 50 + (hash % 40); // 50-90%
    const lightness = 60 + (hash % 30); // 60-90%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  },

  // High contrast monochrome
  monochrome: (functionName: string): string => {
    const hash = hashString(functionName);
    const lightness = 30 + (hash % 50); // 30-80% lightness
    return `hsl(0, 0%, ${lightness}%)`;
  },
};