import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === "production" ? "./" : "/",
  server: {
    hmr: false, // Disable hot module replacement but keep file watching for builds
  },
  resolve: {
    alias: {
      // exact-match so only the bare 'openpgp' specifier maps to the ESM file
      openpgp$: resolve(__dirname, "node_modules/openpgp/dist/openpgp.min.mjs"),
    },
  },
  optimizeDeps: {
    // ⚠️ keep React optimizable; only exclude openpgp
    exclude: ["openpgp"],
  },
  worker: {
    format: "es",
    rollupOptions: {
      // avoids runtime chunk fetches from the worker in build
      output: { inlineDynamicImports: true },
    },
  },
  ssr: {
    noExternal: ["openpgp"],
  },
  define: {
    // Prevent Node.js globals from being included in browser build
    global: "globalThis",
  },
  build: {
    minify: process.env.NODE_ENV === "production",
    sourcemap: false, // Disable source maps to prevent 404s for .js.map files
    // Ensure proper asset handling for GitHub Pages
    assetsDir: "assets",
    rollupOptions: {
      treeshake: {
        moduleSideEffects: (id) => {
          // Mark protobuf files as side-effect free for better tree shaking
          return !id.includes("src/crdb/pb/");
        },
      },
      output: {
        // Ensure consistent file naming for caching
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
        manualChunks(id) {
          // Split Monaco Editor into separate chunk
          if (id.includes("@monaco-editor/react") || id.includes("monaco-editor")) {
            return "monaco";
          }
          // Split React vendor dependencies
          if (id.includes("react") || id.includes("react-dom")) {
            return "vendor";
          }
        },
      },
    },
  },
});
