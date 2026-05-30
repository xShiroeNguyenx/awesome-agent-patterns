import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");

// The demo lives in /demo but renders example components and JSON from /patterns and /recipes,
// which sit outside the Vite root — allow the dev server to read the repo root.
export default defineConfig({
  plugins: [react()],
  server: {
    fs: { allow: [repoRoot] },
  },
});
