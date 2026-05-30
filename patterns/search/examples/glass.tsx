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

export default function SearchGlass() {
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
    <div className="rounded-2xl bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-500 p-6">
      <div className="space-y-3">
        <label htmlFor="doc-search-glass" className="block text-sm font-medium text-white">
          Search docs
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            id="doc-search-glass"
            type="search"
            role="searchbox"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title…"
            className="w-full rounded-xl border border-white/40 bg-white/20 py-2 pl-3 pr-10 text-sm text-white placeholder:text-white/60 backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/60"
          />
          {query !== "" && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-white/50 bg-white/25 px-2 py-0.5 text-white backdrop-blur hover:bg-white/40 focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              ×
            </button>
          )}
        </div>

        <div aria-live="polite" className="min-h-[1.25rem] text-sm text-white/70">
          {pending
            ? "Searching…"
            : term === ""
            ? `${results.length} docs`
            : `${results.length} result${results.length === 1 ? "" : "s"} for “${debounced.trim()}”`}
        </div>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-white/40 bg-white/15 p-8 text-center text-white shadow-xl backdrop-blur-md">
            <p className="font-medium text-white">No docs match “{debounced.trim()}”</p>
            <p className="mt-1 text-sm text-white/70">Try a shorter or different keyword.</p>
            <button
              type="button"
              onClick={clearSearch}
              className="mt-4 rounded-xl border border-white/50 bg-white/25 px-3 py-1.5 font-medium text-white backdrop-blur transition hover:bg-white/40"
            >
              Clear search
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-white/20 rounded-2xl border border-white/40 bg-white/15 text-white shadow-xl backdrop-blur-md">
            {results.map((d) => (
              <li key={d.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span className="font-medium text-white">{d.title}</span>
                <span className="rounded-full border border-white/40 bg-white/25 px-2 py-0.5 text-xs font-medium text-white backdrop-blur">
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
