// Render gate: enforce the demo contract (default-export, zero required props, SSR-safe render).
// Imports every example component and renders it to static markup in Node. Run via `tsx`.
import { readdirSync, existsSync, statSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const here = dirname(fileURLToPath(import.meta.url));
const PATTERNS_DIR = resolve(here, "..", "patterns");

const failures: string[] = [];
let checked = 0;

const dirs = readdirSync(PATTERNS_DIR).filter((d) => statSync(join(PATTERNS_DIR, d)).isDirectory());

for (const d of dirs) {
  const examplesDir = join(PATTERNS_DIR, d, "examples");
  if (!existsSync(examplesDir)) continue;
  for (const f of readdirSync(examplesDir).filter((f) => /\.tsx$/.test(f))) {
    const rel = `patterns/${d}/examples/${f}`;
    try {
      const mod = await import(pathToFileURL(join(examplesDir, f)).href);
      const Comp = mod.default;
      if (typeof Comp !== "function") {
        failures.push(`${rel}: no default-exported component`);
        continue;
      }
      renderToStaticMarkup(createElement(Comp));
      checked++;
    } catch (err) {
      failures.push(`${rel}: ${(err as Error)?.message ?? String(err)}`);
    }
  }
}

console.log(`render-check: ${checked} example(s) rendered OK`);
if (failures.length) {
  console.error("\n❌ render failures:");
  for (const f of failures) console.error("  - " + f);
  process.exit(1);
}
console.log("✅ all examples render");
