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

export default function FilterNeon() {
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
    <div className="rounded-xl bg-slate-950 p-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-end gap-6">
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-cyan-200 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]">
              Status
            </legend>
            <div className="flex gap-4">
              {STATUSES.map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm text-slate-100">
                  <input
                    type="checkbox"
                    checked={statuses.has(s)}
                    onChange={() => toggleStatus(s)}
                    className="h-4 w-4 rounded border-cyan-500/40 bg-slate-900 text-cyan-400 accent-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  {s}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="space-y-2">
            <label
              htmlFor="category-filter-neon"
              className="block text-sm font-medium text-cyan-200 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]"
            >
              Category
            </label>
            <select
              id="category-filter-neon"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-md border border-cyan-500/40 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
              className="rounded-md border border-cyan-400 bg-cyan-400/10 px-3 py-1.5 text-sm font-medium text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.5)] transition hover:bg-cyan-400/20"
            >
              Clear all
            </button>
          </div>
        )}

        <p className="text-sm text-slate-400">
          <span className="font-medium text-cyan-200 tabular-nums drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]">
            {results.length}
          </span>{" "}
          of <span className="tabular-nums">{SAMPLE.length}</span> projects
        </p>

        {results.length === 0 ? (
          <div className="rounded-lg border border-cyan-500/50 bg-slate-900 p-8 text-center text-slate-100 shadow-[0_0_18px_rgba(34,211,238,0.35)]">
            <p className="font-medium text-cyan-200 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]">
              No projects match these filters
            </p>
            <p className="mt-1 text-sm text-slate-400">Loosen a filter to see more.</p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-4 rounded-md border border-cyan-400 bg-cyan-400/10 px-3 py-1.5 font-medium text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.5)] transition hover:bg-cyan-400/20"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-cyan-500/20 rounded-lg border border-cyan-500/50 bg-slate-900 text-slate-100 shadow-[0_0_18px_rgba(34,211,238,0.35)]">
            {results.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span className="font-medium text-slate-100">{p.name}</span>
                <span className="flex items-center gap-2 text-slate-400">
                  <span>{p.category}</span>
                  <span className="rounded-md border border-fuchsia-400 px-2 py-0.5 text-xs font-medium text-fuchsia-300 shadow-[0_0_12px_rgba(232,121,249,0.5)]">
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
    <span className="inline-flex items-center gap-1 rounded-md border border-fuchsia-400 py-1 pl-3 pr-1 text-sm font-medium text-fuchsia-300 shadow-[0_0_12px_rgba(232,121,249,0.5)]">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="flex h-5 w-5 items-center justify-center rounded-md text-fuchsia-300 hover:bg-fuchsia-400/20 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
      >
        ×
      </button>
    </span>
  );
}
