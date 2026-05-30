// Copy patterns/ + recipes/ into mcp-server/content/ so the published npm package
// is self-contained (the loader reads this bundled copy when no repo checkout exists).
// Runs automatically via the "prepack" script before `npm pack` / `npm publish`.
import { cpSync, rmSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(here, ".."); // mcp-server/
const repoRoot = resolve(pkgRoot, ".."); // repo root
const contentDir = join(pkgRoot, "content");

rmSync(contentDir, { recursive: true, force: true });
mkdirSync(contentDir, { recursive: true });

for (const name of ["patterns", "recipes"]) {
  const src = join(repoRoot, name);
  if (!existsSync(src)) throw new Error(`bundle-content: source not found: ${src}`);
  cpSync(src, join(contentDir, name), {
    recursive: true,
    // skip the generated index.json artifacts; the server builds its index in-memory
    filter: (s) => !s.endsWith("index.json"),
  });
}

console.log("bundle-content: copied patterns + recipes into mcp-server/content");
