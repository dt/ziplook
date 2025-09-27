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
      // Replace @protobufjs/inquire with our browser-safe version
      "@protobufjs/inquire": resolve(
        __dirname,
        "src/utils/inquire-replacement.js",
      ),
      // exact-match so only the bare 'openpgp' specifier maps to the ESM file
      openpgp$: resolve(__dirname, "node_modules/openpgp/dist/openpgp.min.mjs"),
    },
  },
  optimizeDeps: {
    // ⚠️ keep React optimizable; only exclude openpgp
    exclude: ["openpgp"],
    include: ["protobufjs"],
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
      output: {
        // Ensure consistent file naming for caching
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
        manualChunks: {
          // Split Monaco Editor into separate chunk
          monaco: ["@monaco-editor/react", "monaco-editor"],
          // Split protobuf libraries
          protobuf: ["protobufjs"],
          // Split React vendor dependencies
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
});
