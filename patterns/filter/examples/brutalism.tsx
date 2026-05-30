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

export default function FilterBrutalism() {
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
    <div className="bg-yellow-50 p-5">
      <div className="space-y-4">
        <div className="flex flex-wrap items-end gap-6">
          <fieldset className="space-y-2">
            <legend className="text-sm font-extrabold uppercase tracking-tight text-black">Status</legend>
            <div className="flex gap-4">
              {STATUSES.map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm font-bold text-black">
                  <input
                    type="checkbox"
                    checked={statuses.has(s)}
                    onChange={() => toggleStatus(s)}
                    className="h-4 w-4 rounded-none border-2 border-black text-black accent-pink-400 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  {s}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="space-y-2">
            <label htmlFor="category-filter-brutalism" className="block text-sm font-extrabold uppercase tracking-tight text-black">
              Category
            </label>
            <select
              id="category-filter-brutalism"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-none border-2 border-black bg-white px-3 py-2 text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
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
              className="rounded-none border-2 border-black bg-yellow-300 px-3 py-1.5 text-sm font-bold text-black shadow-[4px_4px_0_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#000]"
            >
              Clear all
            </button>
          </div>
        )}

        <p className="text-sm font-bold text-black">
          <span className="tabular-nums">{results.length}</span> of{" "}
          <span className="tabular-nums">{SAMPLE.length}</span> projects
        </p>

        {results.length === 0 ? (
          <div className="rounded-none border-2 border-black bg-white p-8 text-center shadow-[6px_6px_0_0_#000]">
            <p className="font-extrabold text-black">No projects match these filters</p>
            <p className="mt-1 text-sm text-black/70">Loosen a filter to see more.</p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-4 rounded-none border-2 border-black bg-yellow-300 px-3 py-1.5 font-bold text-black shadow-[4px_4px_0_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#000]"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <ul className="rounded-none border-2 border-black bg-white shadow-[6px_6px_0_0_#000]">
            {results.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between border-b-2 border-black px-4 py-2.5 text-sm last:border-b-0"
              >
                <span className="font-bold text-black">{p.name}</span>
                <span className="flex items-center gap-2 text-black">
                  <span className="font-bold">{p.category}</span>
                  <span className="rounded-none border-2 border-black bg-cyan-300 px-2 py-0.5 text-xs font-bold text-black">
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
    <span className="inline-flex items-center gap-1 rounded-none border-2 border-black bg-lime-300 py-1 pl-3 pr-1 text-sm font-bold text-black">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="flex h-5 w-5 items-center justify-center rounded-none border-2 border-black bg-pink-400 text-black hover:bg-pink-300 focus:outline-none focus:ring-2 focus:ring-black"
      >
        ×
      </button>
    </span>
  );
}
