import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === "production" ? "./" : "/",
  server: {
    hmr: false, // Disable hot module replacement but keep file watching for builds
  },
  worker: {
    format: "es",
  },
  define: {
    // Prevent Node.js globals from being included in browser build
    global: "globalThis",
  },
  resolve: {
    alias: {
      // Replace @protobufjs/inquire with a safe no-op version for browser builds
      // This eliminates the eval() usage that causes security warnings
      // Source: @protobufjs/inquire uses eval("quire".replace(/^/,"re")) to dynamically require() modules
      // Purpose: Allows protobufjs to conditionally load Node.js modules (like 'fs') without breaking bundlers
      // Browser safety: require() doesn't exist in browsers, so this always returns null anyway
      "@protobufjs/inquire": resolve(__dirname, "src/utils/inquire-noop.js"),
    },
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
