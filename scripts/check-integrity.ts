// Integrity check: frontmatter completeness + no dangling composes/related/recipe references.
import { readdirSync, existsSync, statSync, readFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, "..");
const PATTERNS_DIR = join(ROOT, "patterns");
const RECIPES_DIR = join(ROOT, "recipes");

function arr(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (v == null || v === "") return [];
  return [String(v)];
}

const problems: string[] = [];
const meta = new Map<string, Record<string, unknown>>();

for (const d of readdirSync(PATTERNS_DIR)) {
  const dir = join(PATTERNS_DIR, d);
  if (!statSync(dir).isDirectory()) continue;
  const md = join(dir, "pattern.md");
  if (!existsSync(md)) continue;
  const { data } = matter(readFileSync(md, "utf8"));
  const id = String(data.id ?? "");
  meta.set(id, data);
  if (id !== d) problems.push(`patterns/${d}: id "${id}" does not match folder name`);
  for (const field of ["id", "title", "category", "when_to_use", "stack"]) {
    if (!data[field]) problems.push(`patterns/${d}: missing frontmatter "${field}"`);
  }
  const exDir = join(dir, "examples");
  const hasExample = existsSync(exDir) && readdirSync(exDir).some((f) => /\.tsx?$/.test(f));
  if (!hasExample) problems.push(`patterns/${d}: no example component in examples/`);
}

const ids = new Set(meta.keys());
for (const [id, data] of meta) {
  for (const field of ["composes", "related"]) {
    for (const ref of arr(data[field])) {
      if (!ids.has(ref)) problems.push(`pattern "${id}".${field} -> missing pattern "${ref}"`);
    }
  }
}

if (existsSync(RECIPES_DIR)) {
  for (const f of readdirSync(RECIPES_DIR)) {
    if (!f.endsWith(".md")) continue;
    const { data } = matter(readFileSync(join(RECIPES_DIR, f), "utf8"));
    const task = String(data.task ?? f);
    const refs = arr(data.patterns);
    if (refs.length === 0) problems.push(`recipe "${task}": empty patterns list`);
    for (const ref of refs) {
      if (!ids.has(ref)) problems.push(`recipe "${task}" -> missing pattern "${ref}"`);
    }
  }
}

console.log(`Checked ${ids.size} patterns.`);
if (problems.length) {
  console.error(`\n❌ ${problems.length} integrity problem(s):`);
  for (const p of problems) console.error("  - " + p);
  process.exit(1);
}
console.log("✅ no dangling references; frontmatter complete");
