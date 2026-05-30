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

export default function FilterNeumorphism() {
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
    <div className="rounded-3xl bg-slate-200 p-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-end gap-6">
          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold text-slate-700">Status</legend>
            <div className="flex gap-4">
              {STATUSES.map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={statuses.has(s)}
                    onChange={() => toggleStatus(s)}
                    className="h-4 w-4 rounded border-0 bg-slate-200 text-slate-600 accent-slate-500 shadow-[inset_2px_2px_4px_#b0b6c0,inset_-2px_-2px_4px_#ffffff] focus:outline-none"
                  />
                  {s}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="space-y-2">
            <label htmlFor="category-filter-neumorphism" className="block text-sm font-semibold text-slate-700">
              Category
            </label>
            <select
              id="category-filter-neumorphism"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-2xl bg-slate-200 px-3 py-1.5 text-sm text-slate-700 shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff] focus:outline-none"
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
              className="rounded-2xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] transition active:shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]"
            >
              Clear all
            </button>
          </div>
        )}

        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-700 tabular-nums">{results.length}</span> of{" "}
          <span className="tabular-nums">{SAMPLE.length}</span> projects
        </p>

        {results.length === 0 ? (
          <div className="rounded-2xl bg-slate-200 p-8 text-center shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]">
            <p className="font-semibold text-slate-700">No projects match these filters</p>
            <p className="mt-1 text-sm text-slate-600">Loosen a filter to see more.</p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-4 rounded-2xl bg-slate-200 px-4 py-2 font-semibold text-slate-700 shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] transition active:shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <ul className="space-y-2 rounded-2xl bg-slate-200 p-3 shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff]">
            {results.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-2xl bg-slate-200 px-4 py-2.5 text-sm shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]"
              >
                <span className="font-semibold text-slate-700">{p.name}</span>
                <span className="flex items-center gap-2 text-slate-600">
                  <span>{p.category}</span>
                  <span className="rounded-2xl bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600 shadow-[inset_3px_3px_6px_#b0b6c0,inset_-3px_-3px_6px_#ffffff]">
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
    <span className="inline-flex items-center gap-1 rounded-2xl bg-slate-200 py-1 pl-3 pr-1 text-sm font-semibold text-slate-600 shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-600 shadow-[2px_2px_4px_#b0b6c0,-2px_-2px_4px_#ffffff] transition active:shadow-[inset_2px_2px_4px_#b0b6c0,inset_-2px_-2px_4px_#ffffff] focus:outline-none"
      >
        ×
      </button>
    </span>
  );
}
