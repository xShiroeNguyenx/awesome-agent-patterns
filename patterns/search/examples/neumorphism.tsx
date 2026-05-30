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

export default function SearchNeumorphism() {
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
    <div className="rounded-3xl bg-slate-200 p-6">
      <div className="space-y-3">
        <label htmlFor="doc-search-neumorphism" className="block text-sm font-semibold text-slate-700">
          Search docs
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            id="doc-search-neumorphism"
            type="search"
            role="searchbox"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title…"
            className="w-full rounded-2xl bg-slate-200 py-2 pl-3 pr-10 text-sm text-slate-700 placeholder:text-slate-400 shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff] focus:outline-none"
          />
          {query !== "" && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-2xl bg-slate-200 px-2 py-0.5 font-semibold text-slate-600 shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] transition active:shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff] focus:outline-none"
            >
              ×
            </button>
          )}
        </div>

        <div aria-live="polite" className="min-h-[1.25rem] text-sm text-slate-600">
          {pending
            ? "Searching…"
            : term === ""
            ? `${results.length} docs`
            : `${results.length} result${results.length === 1 ? "" : "s"} for “${debounced.trim()}”`}
        </div>

        {results.length === 0 ? (
          <div className="rounded-2xl bg-slate-200 p-8 text-center shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]">
            <p className="font-semibold text-slate-700">No docs match “{debounced.trim()}”</p>
            <p className="mt-1 text-sm text-slate-600">Try a shorter or different keyword.</p>
            <button
              type="button"
              onClick={clearSearch}
              className="mt-4 rounded-2xl bg-slate-200 px-4 py-2 font-semibold text-slate-700 shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] transition active:shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]"
            >
              Clear search
            </button>
          </div>
        ) : (
          <ul className="space-y-2 rounded-2xl bg-slate-200 p-3 shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff]">
            {results.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between rounded-2xl bg-slate-200 px-4 py-2.5 text-sm shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]"
              >
                <span className="font-semibold text-slate-700">{d.title}</span>
                <span className="rounded-2xl bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600 shadow-[inset_3px_3px_6px_#b0b6c0,inset_-3px_-3px_6px_#ffffff]">
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
