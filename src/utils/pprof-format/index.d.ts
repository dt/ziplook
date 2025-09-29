/**
 * Type declarations for optimized pprof parser
 * This file provides TypeScript types without modifying the performance-optimized implementation
 */

export interface Profile {
  sampleType?: ValueType[];
  sample?: Sample[];
  mapping?: Mapping[];
  location?: Location[];
  function?: Function[];
  stringTable: StringTable;
  dropFrames?: bigint;
  keepFrames?: bigint;
  timeNanos?: bigint;
  durationNanos?: bigint;
  periodType?: ValueType;
  period?: bigint;
  comment?: bigint[];
  defaultSampleType?: bigint;
}

export interface ValueType {
  type?: bigint;
  unit?: bigint;
}

export interface Sample {
  locationId?: bigint[];
  value?: bigint[];
  label?: Label[];
}

export interface Label {
  key?: bigint;
  str?: bigint;
  num?: bigint;
  numUnit?: bigint;
}

export interface Mapping {
  id?: bigint;
  memoryStart?: bigint;
  memoryLimit?: bigint;
  fileOffset?: bigint;
  filename?: bigint;
  buildId?: bigint;
  hasFunctions?: boolean;
  hasFilenames?: boolean;
  hasLineNumbers?: boolean;
  hasInlineFrames?: boolean;
}

export interface Location {
  id?: bigint;
  mappingId?: bigint;
  address?: bigint;
  line?: Line[];
  isFolded?: boolean;
}

export interface Line {
  functionId?: bigint;
  line?: bigint;
}

export interface Function {
  id?: bigint;
  name?: bigint;
  systemName?: bigint;
  filename?: bigint;
  startLine?: bigint;
}

export interface StringTable {
  strings?: string[];
}

export class Profile {
  static decode(buffer: Uint8Array): Profile;
  static encode(profile: Profile): Uint8Array;
}