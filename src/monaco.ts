// src/monaco.ts
// 1) Import the *lean* API (doesn't auto-pull languages/features)
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

// 2) Import workers
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import JsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";

// 3) Configure Monaco environment for local workers
(self as any).MonacoEnvironment = {
  getWorker(_id: string, label: string) {
    if (label === "json") {
      return new JsonWorker();
    }
    return new EditorWorker();
  },
};

// 4) Import only the specific language contributions we need
import "monaco-editor/esm/vs/language/json/monaco.contribution";
// Note: DuckDB SQL language is custom-defined in monacoConfig.ts, not using basic SQL

// 5) Import suggest functionality for autocomplete
import "monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestController";
import "monaco-editor/esm/vs/editor/contrib/suggest/browser/suggest";
import "monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestWidget";

// Export the configured monaco instance
export { monaco };
export default monaco;
