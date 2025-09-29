import { useMemo } from 'react';
import type { Profile } from '../../../utils/pprof-format';
import type { FlameGraphData, FlameGraphNode, SampleTypeInfo } from '../types';

export function useFlameGraphData(profile: Profile, sampleIndex: number): FlameGraphData | null {
  return useMemo(() => {
    if (!profile) return null;
    return buildFlameGraphData(profile, sampleIndex);
  }, [profile, sampleIndex]);
}

export function useSampleTypes(profile: Profile): SampleTypeInfo[] {
  return useMemo(() => {
    if (!profile?.sampleType || !profile?.stringTable?.strings) return [];

    const stringTable = profile.stringTable.strings;
    return profile.sampleType.map((type, index) => ({
      index,
      typeName: stringTable[Number(type.type)] || `type_${index}`,
      unitName: stringTable[Number(type.unit)] || '',
    }));
  }, [profile]);
}

function buildFlameGraphData(profile: Profile, sampleIndex = 0): FlameGraphData {
  const stringTable = profile.stringTable.strings || [];
  const functions = profile["function"] || [];
  const locations = profile.location || [];
  const samples = profile.sample || [];

  // Helper to get string from table
  const getString = (idx: number) => stringTable[Number(idx)] || "";

  // Create a map of function names with proper display logic
  const functionMap = new Map();
  functions.forEach((func) => {
    const funcId = Number(func.id);
    const fullName = getString(Number(func.name)) || `func_${funcId}`;
    const filename = getString(Number(func.filename));
    const systemName = getString(Number(func.systemName));

    // Split on last / and show what's to the right (removes deep package paths)
    let displayName = fullName;
    const lastSlashIndex = displayName.lastIndexOf('/');
    if (lastSlashIndex !== -1) {
      displayName = displayName.substring(lastSlashIndex + 1);
    }

    functionMap.set(funcId, {
      displayName: displayName,
      fullName: fullName,
      uniqueName: fullName, // Use full name for matching
      filename: filename,
      systemName: systemName
    });
  });

  // Create a map of locations to function info
  const locationMap = new Map();
  locations.forEach((loc) => {
    const locId = Number(loc.id);
    if (loc.line && loc.line.length > 0) {
      const funcId = Number(loc.line[0].functionId);
      const func = functionMap.get(funcId);
      if (func) {
        locationMap.set(locId, {
          displayName: func.displayName,
          fullName: func.fullName,
          uniqueName: func.uniqueName
        });
      } else {
        const unknownName = `unknown_func_${funcId}`;
        locationMap.set(locId, {
          displayName: unknownName,
          fullName: unknownName,
          uniqueName: unknownName
        });
      }
    } else {
      const unknownName = `no_line_info_${locId}`;
      locationMap.set(locId, {
        displayName: unknownName,
        fullName: unknownName,
        uniqueName: unknownName
      });
    }
  });

  // Build the call tree
  const root = { name: "root", value: 0, children: new Map() };

  samples.forEach((sample) => {
    const locationIds = sample.locationId;

    if (!locationIds || locationIds.length === 0) {
      return;
    }

    // Handle different sample type selection
    let value;
    if (sample.value && sample.value.length > sampleIndex) {
      // Direct indexing for heap profiles (multiple values per sample)
      value = Number(sample.value[sampleIndex]);
    } else if (sample.value && sample.value.length === 1) {
      // CPU profile: raw values are nanoseconds, need to map to sample types
      const nanoseconds = Number(sample.value[0]);

      // Check what the current sample type wants
      const sampleTypes = profile.sampleType || [];
      const stringTable = profile.stringTable.strings || [];
      const currentSampleType = sampleTypes[sampleIndex];
      const unitName = currentSampleType ? stringTable[Number(currentSampleType.unit)] || '' : '';

      if (unitName === 'nanoseconds') {
        // Want nanoseconds: use raw value
        value = nanoseconds;
      } else if (unitName === 'count') {
        // Want count: convert nanoseconds to count using period
        const period = Number(profile.period) || 10000000;
        value = Math.round(nanoseconds / period);
      } else {
        // Unknown: use raw value
        value = nanoseconds;
      }
    } else {
      value = 1;
    }

    // Build the stack trace from the sample
    // Reverse because pprof stores deepest first, but we want root-to-leaf
    const stack = [];
    for (let i = locationIds.length - 1; i >= 0; i--) {
      const locationId = Number(locationIds[i]);
      const funcInfo = locationMap.get(locationId);
      if (funcInfo) {
        stack.push(funcInfo);
      }
    }

    // Add this sample to the tree
    let current = root;
    current.value += value;

    stack.forEach(funcInfo => {
      const displayName = funcInfo.displayName;
      if (!current.children.has(displayName)) {
        current.children.set(displayName, {
          name: displayName,
          displayName: displayName,
          fullName: funcInfo.fullName,
          uniqueName: funcInfo.uniqueName,
          value: 0,
          children: new Map()
        });
      }
      current = current.children.get(displayName);
      current.value += value;
    });
  });

  // Calculate the actual total sample value (sum of all sample values)
  let actualTotalSampleValue = 0;
  samples.forEach((sample) => {
    // Handle different sample type selection
    let value;
    if (sample.value && sample.value.length > sampleIndex) {
      // Direct indexing for heap profiles (multiple values per sample)
      value = Number(sample.value[sampleIndex]);
    } else if (sample.value && sample.value.length === 1) {
      // CPU profile: raw values are nanoseconds, need to map to sample types
      const nanoseconds = Number(sample.value[0]);

      // Check what the current sample type wants
      const sampleTypes = profile.sampleType || [];
      const stringTable = profile.stringTable.strings || [];
      const currentSampleType = sampleTypes[sampleIndex];
      const unitName = currentSampleType ? stringTable[Number(currentSampleType.unit)] || '' : '';

      if (unitName === 'nanoseconds') {
        // Want nanoseconds: use raw value
        value = nanoseconds;
      } else if (unitName === 'count') {
        // Want count: convert nanoseconds to count using period
        const period = Number(profile.period) || 10000000;
        value = Math.round(nanoseconds / period);
      } else {
        // Unknown: use raw value
        value = nanoseconds;
      }
    } else {
      value = 1;
    }
    actualTotalSampleValue += value;
  });

  // Convert Maps to Arrays for React
  function convertToArray(node: {
    name: string;
    displayName: string;
    fullName: string;
    uniqueName: string;
    value: number;
    children: Map<string, unknown>;
  }): FlameGraphNode {
    const result: FlameGraphNode = {
      name: node.name,
      displayName: node.displayName,
      fullName: node.fullName,
      uniqueName: node.uniqueName,
      value: node.value,
      children: Array.from(node.children.values())
        .map((childNode: any) => convertToArray(childNode))
        .sort((a, b) => b.value - a.value) // Sort by size descending (Go pprof behavior)
    };
    return result;
  }

  const result = convertToArray({
    name: root.name,
    displayName: root.name,
    fullName: root.name,
    uniqueName: root.name,
    value: root.value,
    children: root.children
  }) as FlameGraphData;
  result.actualTotalSampleValue = actualTotalSampleValue;
  return result;
}