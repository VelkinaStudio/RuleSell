import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    globalSetup: "./tests/global-setup.ts",
    testTimeout: 15000,
    hookTimeout: 30000,
    fileParallelism: false,
    sequence: { concurrent: false },
    exclude: ["tests/ui/**", "node_modules/**"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
