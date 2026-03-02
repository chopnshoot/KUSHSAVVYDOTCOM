import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";

export default defineConfig({
  plugins: [crx({ manifest })],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      // Ensure content scripts and service worker are not code-split
      output: {
        chunkFileNames: "chunks/[name]-[hash].js",
      },
    },
  },
});
