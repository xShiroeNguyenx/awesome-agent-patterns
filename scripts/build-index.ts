// Generate patterns/index.json and recipes/index.json from frontmatter. Run via `tsx`.
import { readdirSync, existsSync, statSync, readFileSync, writeFileSync } from "node:fs";
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

const patterns = [];
for (const d of readdirSync(PATTERNS_DIR)) {
  const dir = join(PATTERNS_DIR, d);
  if (!statSync(dir).isDirectory()) continue;
  const md = join(dir, "pattern.md");
  if (!existsSync(md)) continue;
  const { data } = matter(readFileSync(md, "utf8"));
  const examples: string[] = [];
  const exDir = join(dir, "examples");
  if (existsSync(exDir)) for (const f of readdirSync(exDir)) if (/\.tsx?$/.test(f)) examples.push(f);
  patterns.push({
    id: String(data.id ?? d),
    title: String(data.title ?? d),
    category: String(data.category ?? "uncategorized"),
    when_to_use: String(data.when_to_use ?? ""),
    tags: arr(data.tags),
    composes: arr(data.composes),
    related: arr(data.related),
    states: arr(data.states),
    a11y: arr(data.a11y),
    stack: String(data.stack ?? "react-ts-tailwind"),
    examples,
  });
}
patterns.sort((a, b) => a.id.localeCompare(b.id));

const recipes = [];
if (existsSync(RECIPES_DIR)) {
  for (const f of readdirSync(RECIPES_DIR)) {
    if (!f.endsWith(".md")) continue;
    const { data } = matter(readFileSync(join(RECIPES_DIR, f), "utf8"));
    recipes.push({
      task: String(data.task ?? f.replace(/\.md$/, "")),
      title: String(data.title ?? ""),
      patterns: arr(data.patterns),
      tags: arr(data.tags),
    });
  }
}
recipes.sort((a, b) => a.task.localeCompare(b.task));

writeFileSync(join(PATTERNS_DIR, "index.json"), JSON.stringify(patterns, null, 2) + "\n");
writeFileSync(join(RECIPES_DIR, "index.json"), JSON.stringify(recipes, null, 2) + "\n");
console.log(`Wrote patterns/index.json (${patterns.length}) and recipes/index.json (${recipes.length}).`);
