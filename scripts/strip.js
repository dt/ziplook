#!/usr/bin/env ts-node

/**
 * Strip/neutralize methods using the TypeScript Compiler API.
 *
 * Usage examples:
 *  ts-node scripts/strip-methods.ts --method toBinary --method toJson src/gen/**/*.ts
 *  ts-node scripts/strip-methods.ts --method toJson --interface remove src/gen/foo.ts
 *  ts-node scripts/strip-methods.ts --method toBinary --throw --dry-run src/gen/a.ts src/gen/b.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";
import ts from "typescript";

type InterfaceMode = "keep" | "remove" | "optional";
type Behavior = "return" | "throw";

interface Options {
  methods: Set<string>;
  files: string[];
  interfaceMode: InterfaceMode;
  behavior: Behavior;
  dryRun: boolean;
}

function parseArgs(argv = process.argv.slice(2)): Options {
  const methods: string[] = [];
  let interfaceMode: InterfaceMode = "keep";
  let behavior: Behavior = "return";
  const files: string[] = [];
  let dryRun = false;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--method") {
      const name = argv[++i];
      if (!name) throw new Error("--method requires a name");
      methods.push(name);
    } else if (a === "--interface") {
      const v = (argv[++i] || "").toLowerCase();
      if (v !== "keep" && v !== "remove" && v !== "optional") {
        throw new Error("--interface must be keep|remove|optional");
      }
      interfaceMode = v as InterfaceMode;
    } else if (a === "--throw") {
      behavior = "throw";
    } else if (a === "--dry-run") {
      dryRun = true;
    } else if (a.startsWith("-")) {
      throw new Error(`Unknown flag: ${a}`);
    } else {
      files.push(a);
    }
  }

  if (!methods.length) throw new Error("Specify at least one --method name");
  if (!files.length) throw new Error("Provide one or more input files");
  return { methods: new Set(methods), files, interfaceMode, behavior, dryRun };
}

function isTargetName(name: ts.PropertyName | ts.BindingName | ts.Identifier, targets: Set<string>): boolean {
  if (ts.isIdentifier(name)) return targets.has(name.text);
  if (ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return targets.has(name.text);
  // computed names not supported
  return false;
}

function createNoopBody(factory: ts.NodeFactory, behavior: Behavior, returnType?: ts.TypeNode): ts.Block {
  if (behavior === "throw") {
    return factory.createBlock([
      factory.createThrowStatement(
        factory.createNewExpression(factory.createIdentifier("Error"), undefined, [
          factory.createStringLiteral("stripped"),
        ])
      ),
    ], true);
  }
  // default: return/return undefined as any
  const returnsVoid = returnType && returnType.kind === ts.SyntaxKind.VoidKeyword;
  if (returnsVoid) {
    return factory.createBlock([factory.createReturnStatement()], true);
  }
  return factory.createBlock([
    factory.createReturnStatement(
      factory.createAsExpression(
        factory.createIdentifier("undefined"),
        factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
      )
    ),
  ], true);
}

function transformFile(fileName: string, opts: Options) {
  const srcText = fs.readFileSync(fileName, "utf8");
  const sourceFile = ts.createSourceFile(
    fileName,
    srcText,
    ts.ScriptTarget.Latest,
    true,
    fileName.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );

  const transformer: ts.TransformerFactory<ts.SourceFile> = (ctx) => {
    const f = ctx.factory;

    const visit: ts.Visitor = (node) => {
      // ---- Class methods ----
      if (ts.isMethodDeclaration(node) && node.name && isTargetName(node.name, opts.methods)) {
        const body = createNoopBody(f, opts.behavior, node.type);
        return f.updateMethodDeclaration(
          node,
          node.modifiers,
          node.asteriskToken,
          node.name,
          node.questionToken,
          node.typeParameters,
          node.parameters,
          node.type,
          body
        );
      }

      // ---- Object literal methods (shorthand) ----
      if (ts.isMethodSignature(node)) {
        // handled later only inside InterfaceDeclaration
        return ts.visitEachChild(node, visit, ctx);
      }

      if (ts.isMethodDeclaration(node) && ts.isObjectLiteralExpression(node.parent)) {
        // already covered by the MethodDeclaration branch above
        return ts.visitEachChild(node, visit, ctx);
      }

      // ---- Property assignments with function/arrow initializers ----
      if (ts.isPropertyAssignment(node) && isTargetName(node.name, opts.methods)) {
        const init = node.initializer;
        if (ts.isFunctionExpression(init) || ts.isArrowFunction(init)) {
          const body = createNoopBody(f, opts.behavior, init.type);
          const emptyFn =
            ts.isFunctionExpression(init)
              ? f.updateFunctionExpression(
                  init,
                  init.modifiers,
                  init.asteriskToken,
                  init.name,
                  init.typeParameters,
                  init.parameters,
                  init.type,
                  body
                )
              : f.updateArrowFunction(
                  init,
                  init.modifiers,
                  init.typeParameters,
                  init.parameters,
                  init.type,
                  init.equalsGreaterThanToken,
                  // ensure a block body
                  f.createBlock(body.statements, true)
                );
          return f.updatePropertyAssignment(node, node.name, emptyFn);
        }
      }

      // ---- Top-level function declarations ----
      if (ts.isFunctionDeclaration(node) && node.name && opts.methods.has(node.name.text)) {
        const body = createNoopBody(f, opts.behavior, node.type);
        return f.updateFunctionDeclaration(
          node,
          node.modifiers,
          node.asteriskToken,
          node.name,
          node.typeParameters,
          node.parameters,
          node.type,
          body
        );
      }

      // ---- Interface method stripping/loosening ----
      if (ts.isInterfaceDeclaration(node) && opts.interfaceMode !== "keep") {
        const newMembers: ts.TypeElement[] = [];
        for (const m of node.members) {
          if (ts.isMethodSignature(m) && m.name && isTargetName(m.name, opts.methods)) {
            if (opts.interfaceMode === "remove") {
              // skip
              continue;
            }
            if (opts.interfaceMode === "optional") {
              // Convert method to optional property: name?: (params) => returnType
              const fnType = f.createFunctionTypeNode(
                m.typeParameters,
                // Convert MethodSignature parameters → ParameterDeclarations
                m.parameters.map((p) =>
                  f.createParameterDeclaration(
                    p.modifiers,
                    p.dotDotDotToken,
                    p.name,
                    p.questionToken,
                    p.type,
                    undefined
                  )
                ),
                m.type ?? f.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
              );
              const prop = f.createPropertySignature(
                m.modifiers,
                m.name,
                f.createToken(ts.SyntaxKind.QuestionToken),
                fnType
              );
              newMembers.push(prop);
              continue;
            }
          }
          newMembers.push(m);
        }
        return f.updateInterfaceDeclaration(
          node,
          node.modifiers,
          node.name,
          node.typeParameters,
          node.heritageClauses,
          newMembers
        );
      }

      return ts.visitEachChild(node, visit, ctx);
    };

    return (root) => ts.visitNode(root, visit);
  };

  const result = ts.transform(sourceFile, [transformer]);
  const transformed = result.transformed[0] as ts.SourceFile;
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const out = printer.printFile(transformed);
  result.dispose();

  if (opts.dryRun) {
    console.log(`\n----- ${path.relative(process.cwd(), fileName)} -----\n${out}`);
  } else {
    fs.writeFileSync(fileName, out);
  }
}

(async function main() {
  try {
    const opts = parseArgs();
    for (const f of opts.files) {
      // rely on shell glob expansion; just ensure the file exists
      if (!fs.existsSync(f) || !fs.statSync(f).isFile()) {
        console.error(`Skip (not a file): ${f}`);
        continue;
      }
      transformFile(f, opts);
    }
    if (!opts.dryRun) console.log("Done.");
  } catch (e: any) {
    console.error(String(e?.message ?? e));
    process.exit(1);
  }
})();
