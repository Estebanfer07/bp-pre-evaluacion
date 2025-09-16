/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    include: ["./src/**/*.test.tsx", "./src/**/*.test.ts"],
    css: true,
    coverage: {
      enabled: true,
      provider: "v8", // or 'c8' if you prefer
      reportsDirectory: "coverage",
      reporter: ["text", "html"],
    },
  },
});
