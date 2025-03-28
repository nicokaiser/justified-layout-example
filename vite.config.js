import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  build: {
    target: 'esnext' ,
  },
  plugins: [wasm(), topLevelAwait()],
  optimizeDeps: {
    exclude: ['@immich/justified-layout-wasm'],
  },
  base: '/justified-layout-example/'
});
