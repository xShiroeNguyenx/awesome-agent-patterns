import { useMemo, useState, type ComponentType, type ReactNode } from "react";
import patternsIndex from "../../patterns/index.json";
import recipesIndex from "../../recipes/index.json";

interface PatternMeta {
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
  examples: string[];
}
interface RecipeMeta {
  task: string;
  title: string;
  patterns: string[];
  tags: string[];
}

const patterns = patternsIndex as PatternMeta[];
const recipes = recipesIndex as RecipeMeta[];

// Auto-discover every example component, its raw source, and the pattern docs.
const componentMods = import.meta.glob("../../patterns/*/examples/*.tsx", {
  eager: true,
}) as Record<string, { default: ComponentType }>;
const sourceMods = import.meta.glob("../../patterns/*/examples/*.tsx", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;
const docMods = import.meta.glob("../../patterns/*/pattern.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const CREATIVE_KEYS = ["brutalism", "glass", "neon", "neumorphism"] as const;
type VariantKey = "standard" | (typeof CREATIVE_KEYS)[number];
const VARIANT_ORDER: VariantKey[] = ["standard", "brutalism", "glass", "neon", "neumorphism"];
const VARIANT_LABEL: Record<VariantKey, string> = {
  standard: "Standard",
  brutalism: "Brutalism",
  glass: "Glass",
  neon: "Neon",
  neumorphism: "Neumorphism",
};

function idFromPath(path: string): string {
  const m = path.match(/patterns\/([^/]+)\//);
  return m ? m[1] : path;
}
function variantFromPath(path: string): VariantKey {
  const file = (path.split("/").pop() ?? "").replace(/\.tsx$/, "").toLowerCase();
  return (CREATIVE_KEYS as readonly string[]).includes(file) ? (file as VariantKey) : "standard";
}

interface VariantAssets {
  Component?: ComponentType;
  source?: string;
}
interface PatternAssets {
  variants: Partial<Record<VariantKey, VariantAssets>>;
  doc?: string;
}
const assets: Record<string, PatternAssets> = {};
function ensure(id: string): PatternAssets {
  return (assets[id] ??= { variants: {} });
}
for (const [path, mod] of Object.entries(componentMods)) {
  const v = (ensure(idFromPath(path)).variants[variantFromPath(path)] ??= {});
  v.Component = mod.default;
}
for (const [path, src] of Object.entries(sourceMods)) {
  const v = (ensure(idFromPath(path)).variants[variantFromPath(path)] ??= {});
  v.source = src;
}
for (const [path, doc] of Object.entries(docMods)) ensure(idFromPath(path)).doc = doc;

const CATEGORY_ORDER = ["primitive", "feedback", "data-display", "navigation", "page", "auth", "commerce"];
const catRank = (c: string) => {
  const i = CATEGORY_ORDER.indexOf(c);
  return i < 0 ? CATEGORY_ORDER.length : i;
};

function stripFrontmatter(md: string): string {
  const m = md.match(/^---[\s\S]*?---\r?\n/);
  return (m ? md.slice(m[0].length) : md).trim();
}

type Tab = "preview" | "code" | "docs";
type Selection = { kind: "pattern"; id: string } | { kind: "recipes" };

export default function App() {
  const [selection, setSelection] = useState<Selection>({ kind: "pattern", id: "table" });
  const [tab, setTab] = useState<Tab>("preview");
  const [variant, setVariant] = useState<VariantKey>("standard");

  const grouped = useMemo(() => {
    const byCat = new Map<string, PatternMeta[]>();
    for (const p of patterns) {
      if (!byCat.has(p.category)) byCat.set(p.category, []);
      byCat.get(p.category)!.push(p);
    }
    return [...byCat.entries()].sort((a, b) => catRank(a[0]) - catRank(b[0]));
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <aside className="sticky top-0 flex h-screen w-64 flex-col overflow-y-auto border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-4">
          <h1 className="text-sm font-bold tracking-tight">awesome-agent-patterns</h1>
          <p className="mt-0.5 text-xs text-slate-500">{patterns.length} patterns · {recipes.length} recipes</p>
        </div>
        <nav className="flex-1 px-2 py-3">
          {grouped.map(([cat, items]) => (
            <div key={cat} className="mb-3">
              <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{cat}</div>
              {items.map((p) => {
                const active = selection.kind === "pattern" && selection.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => { setSelection({ kind: "pattern", id: p.id }); setTab("preview"); setVariant("standard"); }}
                    className={`block w-full rounded-md px-2 py-1.5 text-left text-sm ${
                      active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {p.title}
                  </button>
                );
              })}
            </div>
          ))}
          <div className="mt-2 border-t border-slate-200 pt-3">
            <button
              onClick={() => setSelection({ kind: "recipes" })}
              className={`block w-full rounded-md px-2 py-1.5 text-left text-sm font-medium ${
                selection.kind === "recipes" ? "bg-sky-600 text-white" : "text-sky-700 hover:bg-sky-50"
              }`}
            >
              📑 Recipes
            </button>
          </div>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-6 py-8">
          {selection.kind === "recipes" ? (
            <RecipesView />
          ) : (
            <PatternView id={selection.id} tab={tab} setTab={setTab} variant={variant} setVariant={setVariant} />
          )}
        </div>
      </main>
    </div>
  );
}

function Badge({ children, tone = "slate" }: { children: ReactNode; tone?: "slate" | "sky" | "amber" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    sky: "bg-sky-100 text-sky-700",
    amber: "bg-amber-100 text-amber-800",
  };
  return <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

function PatternView({
  id, tab, setTab, variant, setVariant,
}: {
  id: string; tab: Tab; setTab: (t: Tab) => void; variant: VariantKey; setVariant: (v: VariantKey) => void;
}) {
  const meta = patterns.find((p) => p.id === id);
  const a = assets[id];
  if (!meta) return <p>Unknown pattern.</p>;

  const available = VARIANT_ORDER.filter((v) => a?.variants[v]?.Component);
  const current: VariantKey = a?.variants[variant]?.Component ? variant : available[0] ?? "standard";
  const active = a?.variants[current];
  const Component = active?.Component;

  return (
    <div>
      <div className="mb-1 flex items-center gap-2">
        <h2 className="text-2xl font-bold">{meta.title}</h2>
        <Badge tone="sky">{meta.category}</Badge>
      </div>
      <p className="mb-4 text-slate-600">{meta.when_to_use}</p>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {meta.states.map((s) => <Badge key={s}>{s}</Badge>)}
        {meta.composes.length > 0 && <Badge tone="amber">composes: {meta.composes.join(", ")}</Badge>}
        {meta.related.length > 0 && <Badge>related: {meta.related.join(", ")}</Badge>}
      </div>

      {/* Variant selector */}
      {available.length > 1 && (
        <div className="mb-4 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Variant</span>
          {available.map((v) => (
            <button
              key={v}
              onClick={() => setVariant(v)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                current === v ? "bg-fuchsia-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {VARIANT_LABEL[v]}
            </button>
          ))}
        </div>
      )}

      <div className="mb-4 flex gap-1 border-b border-slate-200">
        {(["preview", "code", "docs"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium capitalize ${
              tab === t ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "preview" && (
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          {Component ? <Component /> : <p className="text-slate-500">No example for this variant.</p>}
        </div>
      )}
      {tab === "code" && (
        <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-950 p-4 text-xs leading-relaxed text-slate-100">
          <code>{active?.source ?? "// no source"}</code>
        </pre>
      )}
      {tab === "docs" && (
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-800">
          {a?.doc ? stripFrontmatter(a.doc) : "No docs."}
        </pre>
      )}
    </div>
  );
}

function RecipesView() {
  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold">Recipes</h2>
      <p className="mb-6 text-slate-600">Common UI tasks mapped to an ordered set of patterns to compose.</p>
      <div className="space-y-4">
        {recipes.map((r) => (
          <div key={r.task} className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-semibold">{r.title}</h3>
              <code className="text-xs text-slate-400">{r.task}</code>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {r.patterns.map((p, i) => (
                <span key={p} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-slate-300">→</span>}
                  <Badge tone="sky">{p}</Badge>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
