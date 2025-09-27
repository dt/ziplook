#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";

if (process.argv.length < 4) {
  console.error("Usage: node proto-gen.js <fds.bin> <outDir>");
  process.exit(1);
}

const [, , fdsPath, outDir] = process.argv;

// Ensure output directory exists
if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

console.log("Generating TypeScript code from CRDB descriptor set...");

// Generate minimal proto files - all the types we actually need
const crdbProtoFiles = [
  "config/zonepb/zone.proto",
  "roachpb/span_config.proto",
  "sql/catalog/descpb/structured.proto",
  "jobs/jobspb/jobs.proto",
];

const baseArgs = [
  `--descriptor_set_in=${fdsPath}`,
  `--ts_out=${outDir}`,
  "--ts_opt=server_none,client_none,generate_dependencies,optimize_code_size"
];

let successCount = 0;
let failCount = 0;

for (const protoFile of crdbProtoFiles) {
  console.log(`Generating: ${protoFile}`);

  const result = spawnSync("protoc", [...baseArgs, protoFile], {
    stdio: ["inherit", "inherit", "pipe"],
    env: { ...process.env, PATH: `${process.env.PATH}:${process.cwd()}/node_modules/.bin` }
  });

  if (result.status === 0) {
    console.log(`✅ ${protoFile}`);
    successCount++;
  } else {
    const error = result.stderr?.toString() || 'unknown error';
    console.log(`❌ ${protoFile}: ${error.split('\n')[0]}`);
    failCount++;
  }
}

async function main() {
  console.log(`\nResults: ${successCount} succeeded, ${failCount} failed`);

  if (successCount > 0) {
    console.log(`\n✅ Generated TypeScript code in ${outDir}/`);

    // Add @ts-nocheck to all generated files to avoid unused parameter warnings
    console.log("🔧 Adding @ts-nocheck to generated files...");
    await addTsNoCheckToGeneratedFiles(outDir);

    // Remove write methods to reduce bundle size
    console.log("🔧 Removing write methods from generated files...");
    await removeWriteMethodsFromGeneratedFiles(outDir);

    // Fix CRDB types.T to be an alias for InternalType
    console.log("🔧 Fixing CRDB types.T to be an alias for InternalType...");
    await fixCrdbTypesFile(outDir);

    // Remove comments to reduce bundle size
    console.log("🔧 Removing comments from generated files...");
    await removeCommentsFromGeneratedFiles(outDir);

    // Add PURE annotations for tree shaking
    console.log("🔧 Adding PURE annotations to exported message types...");
    await addPureAnnotationsToGeneratedFiles(outDir);

    // Fix google.protobuf.Any to handle missing types gracefully
    console.log("🔧 Fixing google.protobuf.Any to handle missing types gracefully...");
    await fixGoogleProtobufAnyFile(outDir);

    console.log("You can now replace protobufjs with these generated files!");
  } else {
    console.log("\n❌ No files were generated. Check if the descriptor set contains the expected proto files.");
  }
}

main().catch(console.error);

async function addTsNoCheckToGeneratedFiles(outDir) {
  const { readFileSync, writeFileSync } = await import("node:fs");
  const { glob } = await import("glob");

  try {
    const files = await glob(`${outDir}/**/*.ts`);
    let processedCount = 0;

    for (const file of files) {
      const content = readFileSync(file, "utf8");
      if (!content.startsWith("// @ts-nocheck")) {
        const newContent = "// @ts-nocheck\n" + content;
        writeFileSync(file, newContent);
        processedCount++;
      }
    }

    console.log(`✅ Added @ts-nocheck to ${processedCount} files`);
  } catch (error) {
    console.log(`❌ Failed to add @ts-nocheck: ${error.message}`);
  }
}

async function removeWriteMethodsFromGeneratedFiles(outDir) {
  const { readFileSync, writeFileSync } = await import("node:fs");
  const { glob } = await import("glob");

  try {
    const files = await glob(`${outDir}/**/*.ts`);
    let processedCount = 0;

    for (const file of files) {
      let content = readFileSync(file, "utf8");
      let modified = false;

      // Remove internalBinaryWrite method - more precise regex
      const writeMethodRegex = /internalBinaryWrite\(message: [^,]+, writer: [^,]+, options: [^)]+\): [^{]+\{[\s\S]*?\n    \}/g;
      if (writeMethodRegex.test(content)) {
        content = content.replace(writeMethodRegex, '');
        modified = true;
      }

      // Remove internalJsonRead method since we only decode from binary
      const jsonReadMethodRegex = /internalJsonRead\(json: [^,]+, options: [^,]+, target\?: [^)]+\): [^{]+\{[\s\S]*?\n    \}/g;
      if (jsonReadMethodRegex.test(content)) {
        content = content.replace(jsonReadMethodRegex, '');
        modified = true;
      }

      // Remove BinaryWriteOptions and IBinaryWriter imports if they exist
      const originalLength = content.length;
      content = content.replace(/import.*?BinaryWriteOptions.*?from.*?;\n/g, '');
      content = content.replace(/import.*?IBinaryWriter.*?from.*?;\n/g, '');

      // Remove all options from field definitions since we only decode
      content = content.replace(/, options: \{[^}]*\}/g, '');

      if (content.length !== originalLength) {
        modified = true;
      }

      if (modified) {
        writeFileSync(file, content);
        processedCount++;
      }
    }

    console.log(`✅ Removed write methods from ${processedCount} files`);
  } catch (error) {
    console.log(`❌ Failed to remove write methods: ${error.message}`);
  }
}

async function fixCrdbTypesFile(outDir) {
  const { readFileSync, writeFileSync, existsSync } = await import("node:fs");
  const { join } = await import("node:path");

  try {
    const typesFile = join(outDir, "sql/types/types.ts");

    if (!existsSync(typesFile)) {
      console.log(`⚠️  CRDB types file not found at ${typesFile}, skipping`);
      return;
    }

    let content = readFileSync(typesFile, "utf8");

    // Check if we need to modify this file (look for the T interface with just internalType field)
    const tInterfaceRegex = /export interface T \{[\s\S]*?\n\}/;
    const tInterfaceMatch = content.match(tInterfaceRegex);

    if (!tInterfaceMatch) {
      console.log(`⚠️  Could not find T interface in ${typesFile}, skipping`);
      return;
    }

    // Check if T only contains internalType field
    if (!tInterfaceMatch[0].includes('internalType?: InternalType')) {
      console.log(`⚠️  T interface doesn't match expected pattern (should have internalType field), skipping`);
      return;
    }

    // Count actual field declarations (lines with '?: ' indicating optional field declarations)
    const fieldCount = tInterfaceMatch[0].split('\n').filter(line => line.includes('?: ')).length;
    if (fieldCount > 1) {
      console.log(`⚠️  T interface has ${fieldCount} fields, expected only 1 (internalType), skipping`);
      return;
    }

    // Replace the T interface and its related MessageType class with a type alias
    let newContent = content;

    // Remove the T interface
    newContent = newContent.replace(tInterfaceRegex, '');

    // Replace the T$Type class to reference InternalType instead of T
    const tClassRegex = /\/\/ @generated message type with reflection information, may provide speed optimized methods\nclass T\$Type extends MessageType<T> \{[\s\S]*?\n\}\n\/\*\*[\s\S]*?\*\/\nexport const T = new T\$Type\(\);\n/;
    const tClassMatch = newContent.match(tClassRegex);
    if (tClassMatch) {
      // Replace T$Type to extend MessageType<InternalType> and delegate to InternalType
      const newTClass = `// @generated message type with reflection information, may provide speed optimized methods
// CRDB never actually writes types.T, it writes the fields of types.InternalType when a field is of type T.
class T$Type extends MessageType<InternalType> {
    constructor() {
        super("cockroach.sql.sem.types.T", []);
    }
    create(value?: PartialMessage<InternalType>): InternalType {
        return InternalType.create(value);
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: InternalType): InternalType {
        return InternalType.internalBinaryRead(reader, length, options, target);
    }
}
/**
 * @generated MessageType for protobuf message cockroach.sql.sem.types.T
 */
export const T = new T$Type();
`;
      newContent = newContent.replace(tClassRegex, newTClass);
    }

    // Add the comment and type alias at the appropriate location (after InternalType interface)
    const internalTypeInterfaceRegex = /(export interface InternalType \{[\s\S]*?\n\})/;
    const internalTypeMatch = newContent.match(internalTypeInterfaceRegex);

    if (!internalTypeMatch) {
      console.log(`⚠️  Could not find InternalType interface, skipping`);
      return;
    }

    const typeAliasComment = `
// CRDB never actually writes types.T, it writes the fields of types.InternalType when a field is of type T.
export type T = InternalType;`;

    newContent = newContent.replace(internalTypeInterfaceRegex, `$1${typeAliasComment}`);

    // Update any references to T.internalBinaryRead to use InternalType.internalBinaryRead
    newContent = newContent.replace(/T\.internalBinaryRead/g, 'InternalType.internalBinaryRead');

    // Update the tupleContents field type reference and arrayContents field type reference
    newContent = newContent.replace(/T: \(\) => T/g, 'T: () => InternalType');

    writeFileSync(typesFile, newContent);
    console.log(`✅ Fixed CRDB types.T to be an alias for InternalType`);
  } catch (error) {
    console.log(`❌ Failed to fix CRDB types file: ${error.message}`);
  }
}

async function removeCommentsFromGeneratedFiles(outDir) {
  try {
    const { readFileSync, writeFileSync } = await import("node:fs");
    const { glob } = await import("glob");

    const files = await glob(`${outDir}/**/*.ts`);
    let processedCount = 0;

    for (const file of files) {
      const content = readFileSync(file, "utf8");
      let processedContent = content;

      // Remove multi-line comments /** ... */
      processedContent = processedContent.replace(/\/\*\*[\s\S]*?\*\//g, '');

      // Remove inline comments like /*ScalarType.INT32*/
      processedContent = processedContent.replace(/\/\*[^*]*\*\//g, '');

      // Remove single-line comments starting with /** or * (but preserve @ts-nocheck)
      processedContent = processedContent.replace(/^(?!\/\/ @ts-nocheck)[\s]*\*.*$/gm, '');
      processedContent = processedContent.replace(/^[\s]*\/\*\*.*$/gm, '');

      // Remove @generated comments
      processedContent = processedContent.replace(/^[\s]*\/\/[\s]*@generated.*$/gm, '');

      // Remove tslint:disable comments
      processedContent = processedContent.replace(/^[\s]*\/\/[\s]*tslint:disable.*$/gm, '');

      // Clean up excessive blank lines (more than 2 consecutive)
      processedContent = processedContent.replace(/\n\s*\n\s*\n/g, '\n\n');

      // Remove leading/trailing whitespace from lines but preserve indentation structure
      processedContent = processedContent.replace(/[ \t]+$/gm, '');

      if (processedContent !== content) {
        writeFileSync(file, processedContent);
        processedCount++;
      }
    }

    console.log(`✅ Removed comments from ${processedCount} files`);
  } catch (error) {
    console.log(`❌ Failed to remove comments: ${error.message}`);
  }
}

async function addPureAnnotationsToGeneratedFiles(outDir) {
  try {
    const { readFileSync, writeFileSync } = await import("node:fs");
    const { glob } = await import("glob");

    const files = await glob(`${outDir}/**/*.ts`);
    let processedCount = 0;

    for (const file of files) {
      const content = readFileSync(file, "utf8");
      let processedContent = content;

      // Add /*#__PURE__*/ annotation to all exported message type instances
      // Pattern: export const SomeName = new SomeName$Type();
      processedContent = processedContent.replace(
        /^export const (\w+) = new (\w+)\$Type\(\);$/gm,
        'export const $1 = /*#__PURE__*/ new $2$Type();'
      );

      if (processedContent !== content) {
        writeFileSync(file, processedContent);
        processedCount++;
      }
    }

    console.log(`✅ Added PURE annotations to ${processedCount} files`);
  } catch (error) {
    console.log(`❌ Failed to add PURE annotations: ${error.message}`);
  }
}

async function fixGoogleProtobufAnyFile(outDir) {
  try {
    const { readFileSync, writeFileSync, existsSync } = await import("node:fs");
    const { join } = await import("node:path");

    const anyFile = join(outDir, "google/protobuf/any.ts");

    if (!existsSync(anyFile)) {
      console.log(`⚠️  google.protobuf.Any file not found at ${anyFile}, skipping`);
      return;
    }

    let content = readFileSync(anyFile, "utf8");
    let modified = false;

    // Replace error throws for missing types with graceful returns
    // Pattern 1: internalJsonWrite method
    const jsonWriteErrorPattern = /(\s+if \(!type\)\s+)throw new globalThis\.Error\("Unable to convert google\.protobuf\.Any with typeUrl '" \+ any\.typeUrl \+ "' to JSON\. The specified type " \+ typeName \+ " is not available in the type registry\."\);/g;
    if (jsonWriteErrorPattern.test(content)) {
      content = content.replace(jsonWriteErrorPattern, '$1return any;');
      modified = true;
    }

    // Pattern 2: internalJsonRead method
    const jsonReadErrorPattern = /(\s+if \(!type\)\s+)throw new globalThis\.Error\("Unable to parse google\.protobuf\.Any from JSON\. The specified type " \+ typeName \+ " is not available in the type registry\."\);/g;
    if (jsonReadErrorPattern.test(content)) {
      content = content.replace(jsonReadErrorPattern, '$1return any;');
      modified = true;
    }

    if (modified) {
      writeFileSync(anyFile, content);
      console.log(`✅ Fixed google.protobuf.Any to handle missing types gracefully`);
    } else {
      console.log(`⚠️  No error throws found in google.protobuf.Any file, already fixed or pattern changed`);
    }
  } catch (error) {
    console.log(`❌ Failed to fix google.protobuf.Any file: ${error.message}`);
  }
}