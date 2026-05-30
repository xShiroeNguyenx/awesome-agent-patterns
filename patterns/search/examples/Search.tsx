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

export default function SearchExample() {
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
    <div className="space-y-3">
      <label htmlFor="doc-search" className="block text-sm font-medium text-slate-700">
        Search docs
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id="doc-search"
          type="search"
          role="searchbox"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title…"
          className="w-full rounded-md border border-slate-300 bg-white py-2 pl-3 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        />
        {query !== "" && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-2 py-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            ×
          </button>
        )}
      </div>

      <div aria-live="polite" className="min-h-[1.25rem] text-sm text-slate-500">
        {pending
          ? "Searching…"
          : term === ""
          ? `${results.length} docs`
          : `${results.length} result${results.length === 1 ? "" : "s"} for “${debounced.trim()}”`}
      </div>

      {results.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="font-medium text-slate-700">No docs match “{debounced.trim()}”</p>
          <p className="mt-1 text-sm text-slate-500">Try a shorter or different keyword.</p>
          <button
            type="button"
            onClick={clearSearch}
            className="mt-4 rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
          >
            Clear search
          </button>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
          {results.map((d) => (
            <li key={d.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <span className="font-medium text-slate-900">{d.title}</span>
              <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700">
                {d.kind}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
