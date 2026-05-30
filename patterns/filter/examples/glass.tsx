import { useMemo, useState } from "react";

type Status = "Active" | "Paused" | "Archived";

interface Project {
  id: number;
  name: string;
  status: Status;
  category: string;
}

const STATUSES: Status[] = ["Active", "Paused", "Archived"];
const CATEGORIES = ["Marketing", "Engineering", "Design"] as const;

const SAMPLE: Project[] = [
  { id: 1, name: "Launch campaign", status: "Active", category: "Marketing" },
  { id: 2, name: "Billing service", status: "Active", category: "Engineering" },
  { id: 3, name: "Brand refresh", status: "Paused", category: "Design" },
  { id: 4, name: "SEO audit", status: "Archived", category: "Marketing" },
  { id: 5, name: "Mobile app", status: "Active", category: "Engineering" },
  { id: 6, name: "Design system", status: "Paused", category: "Design" },
  { id: 7, name: "Newsletter", status: "Archived", category: "Marketing" },
];

export default function FilterGlass() {
  const [statuses, setStatuses] = useState<Set<Status>>(new Set());
  const [category, setCategory] = useState<string>("");

  const hasFilters = statuses.size > 0 || category !== "";

  const results = useMemo(
    () =>
      SAMPLE.filter(
        (p) =>
          (statuses.size === 0 || statuses.has(p.status)) &&
          (category === "" || p.category === category)
      ),
    [statuses, category]
  );

  function toggleStatus(s: Status) {
    setStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  }

  function clearAll() {
    setStatuses(new Set());
    setCategory("");
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-500 p-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-end gap-6">
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-white">Status</legend>
            <div className="flex gap-4">
              {STATUSES.map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm text-white">
                  <input
                    type="checkbox"
                    checked={statuses.has(s)}
                    onChange={() => toggleStatus(s)}
                    className="h-4 w-4 rounded border-white/40 bg-white/20 text-white accent-white focus:outline-none focus:ring-2 focus:ring-white/60"
                  />
                  {s}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="space-y-2">
            <label htmlFor="category-filter-glass" className="block text-sm font-medium text-white">
              Category
            </label>
            <select
              id="category-filter-glass"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-white/40 bg-white/20 px-3 py-1.5 text-sm text-white backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {[...statuses].map((s) => (
              <Chip key={s} label={`Status: ${s}`} onRemove={() => toggleStatus(s)} />
            ))}
            {category !== "" && (
              <Chip label={`Category: ${category}`} onRemove={() => setCategory("")} />
            )}
            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl border border-white/50 bg-white/25 px-3 py-1.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/40"
            >
              Clear all
            </button>
          </div>
        )}

        <p className="text-sm text-white/70">
          <span className="font-medium text-white tabular-nums">{results.length}</span> of{" "}
          <span className="tabular-nums">{SAMPLE.length}</span> projects
        </p>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-white/40 bg-white/15 p-8 text-center text-white shadow-xl backdrop-blur-md">
            <p className="font-medium text-white">No projects match these filters</p>
            <p className="mt-1 text-sm text-white/70">Loosen a filter to see more.</p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-4 rounded-xl border border-white/50 bg-white/25 px-3 py-1.5 font-medium text-white backdrop-blur transition hover:bg-white/40"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-white/20 rounded-2xl border border-white/40 bg-white/15 text-white shadow-xl backdrop-blur-md">
            {results.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span className="font-medium text-white">{p.name}</span>
                <span className="flex items-center gap-2 text-white/70">
                  <span>{p.category}</span>
                  <span className="rounded-full border border-white/40 bg-white/25 px-2 py-0.5 text-xs font-medium text-white backdrop-blur">
                    {p.status}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/25 py-1 pl-3 pr-1 text-sm font-medium text-white backdrop-blur">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="flex h-5 w-5 items-center justify-center rounded-full text-white hover:bg-white/40 focus:outline-none focus:ring-2 focus:ring-white/60"
      >
        ×
      </button>
    </span>
  );
}
