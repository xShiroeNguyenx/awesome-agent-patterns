import { useEffect, useMemo, useRef, useState } from "react";

interface Doc {
  id: number;
  title: string;
  kind: string;
}

const SAMPLE: Doc[] = [
  { id: 1, title: "Onboarding checklist", kind: "Guide" },
  { id: 2, title: "Billing & invoices", kind: "Help" },
  { id: 3, title: "API authentication", kind: "Reference" },
  { id: 4, title: "Keyboard shortcuts", kind: "Guide" },
  { id: 5, title: "Export your data", kind: "Help" },
  { id: 6, title: "Rate limits", kind: "Reference" },
  { id: 7, title: "Inviting teammates", kind: "Guide" },
  { id: 8, title: "Webhook events", kind: "Reference" },
];

export default function SearchNeon() {
  const [query, setQuery] = useState<string>("");
  const [debounced, setDebounced] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const pending = query.trim() !== debounced.trim();

  function clearSearch() {
    setQuery("");
    inputRef.current?.focus();
  }

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const term = debounced.trim().toLowerCase();
  const results = useMemo(
    () => (term === "" ? SAMPLE : SAMPLE.filter((d) => d.title.toLowerCase().includes(term))),
    [term]
  );

  return (
    <div className="rounded-xl bg-slate-950 p-6">
      <div className="space-y-3">
        <label
          htmlFor="doc-search-neon"
          className="block text-sm font-medium text-cyan-200 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]"
        >
          Search docs
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            id="doc-search-neon"
            type="search"
            role="searchbox"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title…"
            className="w-full rounded-md border border-cyan-500/40 bg-slate-900 py-2 pl-3 pr-10 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          {query !== "" && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-cyan-400 bg-cyan-400/10 px-2 py-0.5 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.5)] transition hover:bg-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              ×
            </button>
          )}
        </div>

        <div aria-live="polite" className="min-h-[1.25rem] text-sm text-slate-400">
          {pending
            ? "Searching…"
            : term === ""
            ? `${results.length} docs`
            : `${results.length} result${results.length === 1 ? "" : "s"} for “${debounced.trim()}”`}
        </div>

        {results.length === 0 ? (
          <div className="rounded-lg border border-cyan-500/50 bg-slate-900 p-8 text-center text-slate-100 shadow-[0_0_18px_rgba(34,211,238,0.35)]">
            <p className="font-medium text-cyan-200 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]">
              No docs match “{debounced.trim()}”
            </p>
            <p className="mt-1 text-sm text-slate-400">Try a shorter or different keyword.</p>
            <button
              type="button"
              onClick={clearSearch}
              className="mt-4 rounded-md border border-cyan-400 bg-cyan-400/10 px-3 py-1.5 font-medium text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.5)] transition hover:bg-cyan-400/20"
            >
              Clear search
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-cyan-500/20 rounded-lg border border-cyan-500/50 bg-slate-900 text-slate-100 shadow-[0_0_18px_rgba(34,211,238,0.35)]">
            {results.map((d) => (
              <li key={d.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span className="font-medium text-slate-100">{d.title}</span>
                <span className="rounded-md border border-fuchsia-400 px-2 py-0.5 text-xs font-medium text-fuchsia-300 shadow-[0_0_12px_rgba(232,121,249,0.5)]">
                  {d.kind}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
