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

export default function SearchBrutalism() {
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
    <div className="bg-yellow-50 p-5">
      <div className="space-y-3">
        <label htmlFor="doc-search-brutalism" className="block text-sm font-extrabold uppercase tracking-tight text-black">
          Search docs
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            id="doc-search-brutalism"
            type="search"
            role="searchbox"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title…"
            className="w-full rounded-none border-2 border-black bg-white py-2 pl-3 pr-10 text-sm text-black placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-black"
          />
          {query !== "" && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-none border-2 border-black bg-pink-400 px-2 py-0.5 font-bold text-black hover:bg-pink-300 focus:outline-none focus:ring-2 focus:ring-black"
            >
              ×
            </button>
          )}
        </div>

        <div aria-live="polite" className="min-h-[1.25rem] text-sm font-bold text-black">
          {pending
            ? "Searching…"
            : term === ""
            ? `${results.length} docs`
            : `${results.length} result${results.length === 1 ? "" : "s"} for “${debounced.trim()}”`}
        </div>

        {results.length === 0 ? (
          <div className="rounded-none border-2 border-black bg-white p-8 text-center shadow-[6px_6px_0_0_#000]">
            <p className="font-extrabold text-black">No docs match “{debounced.trim()}”</p>
            <p className="mt-1 text-sm text-black/70">Try a shorter or different keyword.</p>
            <button
              type="button"
              onClick={clearSearch}
              className="mt-4 rounded-none border-2 border-black bg-yellow-300 px-3 py-1.5 font-bold text-black shadow-[4px_4px_0_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#000]"
            >
              Clear search
            </button>
          </div>
        ) : (
          <ul className="rounded-none border-2 border-black bg-white shadow-[6px_6px_0_0_#000]">
            {results.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between border-b-2 border-black px-4 py-2.5 text-sm last:border-b-0"
              >
                <span className="font-bold text-black">{d.title}</span>
                <span className="rounded-none border-2 border-black bg-cyan-300 px-2 py-0.5 text-xs font-bold text-black">
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
