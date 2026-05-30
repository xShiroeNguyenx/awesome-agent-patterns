import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const here = dirname(fileURLToPath(import.meta.url));
// When built: <root>/mcp-server/dist/loader.js  -> repo root is ../../
// When run via tsx: <root>/mcp-server/src/loader.ts -> repo root is ../../
const REPO_ROOT = process.env.AAP_ROOT ?? resolve(here, "..", "..");
const PATTERNS_DIR = process.env.AAP_PATTERNS_DIR ?? join(REPO_ROOT, "patterns");
const RECIPES_DIR = process.env.AAP_RECIPES_DIR ?? join(REPO_ROOT, "recipes");

export interface PatternMeta {
  id: string;
  title: string;
  category: string;
  when_to_use: string;
  tags: string[];
  composes: string[];
  related: string[];
  states: string[];
  a11y: string[];
  stack: string;
}

export interface PatternExample {
  file: string;
  code: string;
}

export interface Pattern extends PatternMeta {
  body: string;
  examples: PatternExample[];
}

export interface RecipeMeta {
  task: string;
  title: string;
  patterns: string[];
  tags: string[];
}

export interface Recipe extends RecipeMeta {
  body: string;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v));
  if (value == null || value === "") return [];
  return [String(value)];
}

function listDirs(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory();
  });
}

function readExamples(patternDir: string): PatternExample[] {
  const examplesDir = join(patternDir, "examples");
  if (!existsSync(examplesDir)) return [];
  return readdirSync(examplesDir)
    .filter((f) => /\.(tsx?|jsx?)$/.test(f))
    .sort()
    .map((file) => ({
      file,
      code: readFileSync(join(examplesDir, file), "utf8"),
    }));
}

let patternsCache: Pattern[] | null = null;
let recipesCache: Recipe[] | null = null;

export function loadPatterns(): Pattern[] {
  if (patternsCache) return patternsCache;
  const patterns: Pattern[] = [];
  for (const dirName of listDirs(PATTERNS_DIR)) {
    const patternDir = join(PATTERNS_DIR, dirName);
    const mdPath = join(patternDir, "pattern.md");
    if (!existsSync(mdPath)) continue;
    const parsed = matter(readFileSync(mdPath, "utf8"));
    const data = parsed.data as Record<string, unknown>;
    patterns.push({
      id: String(data.id ?? dirName),
      title: String(data.title ?? dirName),
      category: String(data.category ?? "uncategorized"),
      when_to_use: String(data.when_to_use ?? ""),
      tags: asStringArray(data.tags),
      composes: asStringArray(data.composes),
      related: asStringArray(data.related),
      states: asStringArray(data.states),
      a11y: asStringArray(data.a11y),
      stack: String(data.stack ?? "react-ts-tailwind"),
      body: parsed.content.trim(),
      examples: readExamples(patternDir),
    });
  }
  patterns.sort((a, b) => a.id.localeCompare(b.id));
  patternsCache = patterns;
  return patterns;
}

export function loadRecipes(): Recipe[] {
  if (recipesCache) return recipesCache;
  const recipes: Recipe[] = [];
  if (existsSync(RECIPES_DIR)) {
    for (const file of readdirSync(RECIPES_DIR)) {
      if (!file.endsWith(".md")) continue;
      const parsed = matter(readFileSync(join(RECIPES_DIR, file), "utf8"));
      const data = parsed.data as Record<string, unknown>;
      recipes.push({
        task: String(data.task ?? file.replace(/\.md$/, "")),
        title: String(data.title ?? file.replace(/\.md$/, "")),
        patterns: asStringArray(data.patterns),
        tags: asStringArray(data.tags),
        body: parsed.content.trim(),
      });
    }
  }
  recipes.sort((a, b) => a.task.localeCompare(b.task));
  recipesCache = recipes;
  return recipes;
}

export function patternSummary(p: Pattern): PatternMeta {
  const { body, examples, ...meta } = p;
  return meta;
}

export function getPattern(id: string): Pattern | undefined {
  return loadPatterns().find((p) => p.id === id);
}

export function getRecipe(task: string): Recipe | undefined {
  return loadRecipes().find((r) => r.task === task);
}

export interface SearchHit {
  id: string;
  title: string;
  category: string;
  when_to_use: string;
  score: number;
}

export function searchPatterns(query: string, limit = 8): SearchHit[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  const hits: SearchHit[] = [];
  for (const p of loadPatterns()) {
    const haystacks: Array<[string, number]> = [
      [p.id, 6],
      [p.title.toLowerCase(), 5],
      [p.tags.join(" "), 4],
      [p.when_to_use.toLowerCase(), 3],
      [p.category, 2],
      [p.body.toLowerCase(), 1],
    ];
    let score = 0;
    for (const term of terms) {
      for (const [text, weight] of haystacks) {
        if (text.includes(term)) score += weight;
      }
    }
    if (score > 0) {
      hits.push({
        id: p.id,
        title: p.title,
        category: p.category,
        when_to_use: p.when_to_use,
        score,
      });
    }
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

/** Returns dangling ids referenced by composes/related/recipe patterns. */
export function findDanglingReferences(): Array<{ source: string; field: string; missing: string }> {
  const ids = new Set(loadPatterns().map((p) => p.id));
  const problems: Array<{ source: string; field: string; missing: string }> = [];
  for (const p of loadPatterns()) {
    for (const ref of p.composes) if (!ids.has(ref)) problems.push({ source: p.id, field: "composes", missing: ref });
    for (const ref of p.related) if (!ids.has(ref)) problems.push({ source: p.id, field: "related", missing: ref });
  }
  for (const r of loadRecipes()) {
    for (const ref of r.patterns) if (!ids.has(ref)) problems.push({ source: r.task, field: "recipe.patterns", missing: ref });
  }
  return problems;
}

export const paths = { REPO_ROOT, PATTERNS_DIR, RECIPES_DIR };
