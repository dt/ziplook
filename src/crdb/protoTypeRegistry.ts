// Auto-register all protobuf types for Any field decoding
import type { IMessageType } from "@protobuf-ts/runtime";

// Import all message types from generated protobuf files
// This ensures Any fields can be properly decoded

// config
import { ZoneConfig } from "./pb/config/zonepb/zone";

// roachpb
import { SpanConfig } from "./pb/roachpb/span_config";
import * as roachpbData from "./pb/roachpb/data";
import * as roachpbMetadata from "./pb/roachpb/metadata";
import * as roachpbIoFormats from "./pb/roachpb/io-formats";

// kv
import * as kvpbApi from "./pb/kv/kvpb/api";
import * as kvpbErrors from "./pb/kv/kvpb/errors";
import * as lockWaiter from "./pb/kv/kvserver/concurrency/lock/lock_waiter";
import * as locking from "./pb/kv/kvserver/concurrency/lock/locking";

// storage
import * as enginepbMvcc from "./pb/storage/enginepb/mvcc";
import * as enginepbMvcc3 from "./pb/storage/enginepb/mvcc3";

// sql
import { Descriptor } from "./pb/sql/catalog/descpb/structured";
import * as jobspb from "./pb/jobs/jobspb/jobs";
import * as privilege from "./pb/sql/catalog/catpb/privilege";
import * as types from "./pb/sql/types/types";

// tracing
import * as recordedSpan from "./pb/util/tracing/tracingpb/recorded_span";
import * as tracing from "./pb/util/tracing/tracingpb/tracing";

// util
import * as hlcTimestamp from "./pb/util/hlc/timestamp";
import * as admission from "./pb/util/admission/admissionpb/io_threshold";

// multitenant
import * as capabilities from "./pb/multitenant/tenantcapabilitiespb/capabilities";
import * as mtinfo from "./pb/multitenant/mtinfopb/info";

// errorspb
import * as errorspb from "./pb/errorspb/errors";

// geo
import * as geopb from "./pb/geo/geopb/geopb";

// google protobuf well-known types
import * as googleWrappers from "./pb/google/protobuf/wrappers";
import { Any } from "./pb/google/protobuf/any";
import { Timestamp } from "./pb/google/protobuf/timestamp";
import { Duration } from "./pb/google/protobuf/duration";

// Collect all message types from the imported modules
function collectMessageTypes(): IMessageType<any>[] {
  const types: IMessageType<any>[] = [];

  // Helper to add types from a module
  function addTypesFromModule(module: any) {
    for (const key of Object.keys(module)) {
      const value = module[key];
      // Check if it's a protobuf message type (has typeName property)
      if (value && typeof value === 'object' && 'typeName' in value && typeof value.typeName === 'string') {
        types.push(value);
      }
    }
  }

  // Add individual types
  types.push(ZoneConfig, SpanConfig, Descriptor);

  // Add Google protobuf well-known types
  types.push(Any, Timestamp, Duration);
  addTypesFromModule(googleWrappers);

  // Add types from modules
  addTypesFromModule(roachpbData);
  addTypesFromModule(roachpbMetadata);
  addTypesFromModule(roachpbIoFormats);
  addTypesFromModule(kvpbApi);
  addTypesFromModule(kvpbErrors);
  addTypesFromModule(lockWaiter);
  addTypesFromModule(locking);
  addTypesFromModule(enginepbMvcc);
  addTypesFromModule(enginepbMvcc3);
  addTypesFromModule(jobspb);
  addTypesFromModule(privilege);
  addTypesFromModule(types);
  addTypesFromModule(recordedSpan);
  addTypesFromModule(tracing);
  addTypesFromModule(hlcTimestamp);
  addTypesFromModule(admission);
  addTypesFromModule(capabilities);
  addTypesFromModule(mtinfo);
  addTypesFromModule(errorspb);
  addTypesFromModule(geopb);

  return types;
}

// Create a comprehensive type registry with all available types
export const TYPE_REGISTRY = collectMessageTypes();

// Also create a map for quick lookup by type name
export const TYPE_MAP = new Map<string, IMessageType<any>>(
  TYPE_REGISTRY.map(type => [type.typeName, type])
);

// Export list of known missing types for documentation
export const KNOWN_MISSING_TYPES = [
  'cockroach.sql.distsqlrun.ComponentStats',
  'cockroach.kv.bulk.bulkpb.IngestionPerformanceStats',
  // Add more as discovered
];