import { useMemo, useState } from "react";

type Status = "populated" | "loading" | "empty" | "error";

interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  signups: number;
}

const SAMPLE: User[] = [
  { id: 1, name: "Ava Nguyen", email: "ava@example.com", role: "Admin", signups: 128 },
  { id: 2, name: "Minh Tran", email: "minh@example.com", role: "Editor", signups: 64 },
  { id: 3, name: "Linh Pham", email: "linh@example.com", role: "Viewer", signups: 12 },
  { id: 4, name: "Khoa Le", email: "khoa@example.com", role: "Editor", signups: 87 },
  { id: 5, name: "Mai Vo", email: "mai@example.com", role: "Viewer", signups: 5 },
];

type SortKey = "name" | "role" | "signups";
type SortDir = "ascending" | "descending";

export default function TableNeon() {
  const [status, setStatus] = useState<Status>("populated");
  return (
    <div className="bg-slate-950 p-6 rounded-xl">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(["populated", "loading", "empty", "error"] as Status[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`border px-3 py-1.5 text-sm font-medium rounded-md transition ${
                status === s
                  ? "border-cyan-400 bg-cyan-400/20 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                  : "border-cyan-500/40 bg-cyan-400/5 text-cyan-300 hover:bg-cyan-400/20"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <DataTable status={status} rows={status === "empty" ? [] : SAMPLE} />
      </div>
    </div>
  );
}

function DataTable({ status, rows }: { status: Status; rows: User[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("ascending");
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === "ascending" ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "ascending" ? "descending" : "ascending"));
    } else {
      setSortKey(key);
      setSortDir("ascending");
    }
  }

  function toggleAll() {
    setSelected((prev) => (prev.size === sorted.length ? new Set() : new Set(sorted.map((r) => r.id))));
  }

  function toggleOne(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (status === "loading") return <TableSkeleton />;
  if (status === "error")
    return (
      <div className="border border-fuchsia-400/60 bg-slate-900 rounded-lg p-6 text-center text-slate-100 shadow-[0_0_18px_rgba(232,121,249,0.35)]">
        <p className="font-medium text-fuchsia-300 drop-shadow-[0_0_6px_rgba(232,121,249,0.8)]">Couldn&apos;t load users.</p>
        <button className="mt-3 border border-fuchsia-400 bg-fuchsia-400/10 px-3 py-1.5 text-sm font-medium text-fuchsia-300 rounded-md shadow-[0_0_12px_rgba(232,121,249,0.5)] transition hover:bg-fuchsia-400/20">
          Retry
        </button>
      </div>
    );
  if (sorted.length === 0)
    return (
      <div className="border border-dashed border-cyan-500/50 bg-slate-900 rounded-lg p-10 text-center text-slate-100 shadow-[0_0_18px_rgba(34,211,238,0.35)]">
        <p className="font-medium text-cyan-200 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]">No users yet</p>
        <p className="mt-1 text-sm text-slate-400">Invite a teammate to get started.</p>
        <button className="mt-4 border border-cyan-400 bg-cyan-400/10 px-3 py-1.5 text-sm font-medium text-cyan-200 rounded-md shadow-[0_0_12px_rgba(34,211,238,0.5)] transition hover:bg-cyan-400/20">
          Invite user
        </button>
      </div>
    );

  const allSelected = selected.size === sorted.length;
  const headers: Array<{ key: SortKey; label: string; numeric?: boolean }> = [
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "signups", label: "Signups", numeric: true },
  ];

  return (
    <div className="overflow-x-auto border border-cyan-500/50 bg-slate-900 rounded-lg text-slate-100 shadow-[0_0_18px_rgba(34,211,238,0.35)]">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-slate-900 text-cyan-300">
          <tr className="border-b border-cyan-500/40">
            <th scope="col" className="w-10 px-4 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                aria-label="Select all rows"
                className="h-4 w-4 rounded border-cyan-500/50 bg-slate-900 accent-cyan-400"
              />
            </th>
            {headers.map((h) => (
              <th
                key={h.key}
                scope="col"
                aria-sort={sortKey === h.key ? sortDir : "none"}
                className={`px-4 py-3 font-medium ${h.numeric ? "text-right" : "text-left"}`}
              >
                <button
                  onClick={() => toggleSort(h.key)}
                  className="inline-flex items-center gap-1 hover:text-cyan-200 hover:drop-shadow-[0_0_6px_rgba(34,211,238,0.8)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  {h.label}
                  <span className="text-xs text-cyan-500">
                    {sortKey === h.key ? (sortDir === "ascending" ? "▲" : "▼") : "↕"}
                  </span>
                </button>
              </th>
            ))}
            <th scope="col" className="px-4 py-3 text-right font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cyan-500/20">
          {sorted.map((u) => (
            <tr
              key={u.id}
              className={
                selected.has(u.id)
                  ? "bg-cyan-400/10 shadow-[inset_0_0_18px_rgba(34,211,238,0.25)]"
                  : "hover:bg-cyan-400/5"
              }
            >
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.has(u.id)}
                  onChange={() => toggleOne(u.id)}
                  aria-label={`Select ${u.name}`}
                  className="h-4 w-4 rounded border-cyan-500/50 bg-slate-900 accent-cyan-400"
                />
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-slate-100">{u.name}</div>
                <div className="text-slate-400">{u.email}</div>
              </td>
              <td className="px-4 py-3 text-slate-300">{u.role}</td>
              <td className="px-4 py-3 text-right tabular-nums text-slate-300">{u.signups}</td>
              <td className="px-4 py-3 text-right">
                <button className="text-cyan-300 hover:text-cyan-200 hover:drop-shadow-[0_0_6px_rgba(34,211,238,0.8)] hover:underline">
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="overflow-hidden border border-cyan-500/50 bg-slate-900 rounded-lg shadow-[0_0_18px_rgba(34,211,238,0.35)]">
      <div className="h-11 border-b border-cyan-500/40 bg-slate-900" />
      <div className="divide-y divide-cyan-500/20">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3.5">
            <div className="h-4 w-4 rounded bg-slate-700" />
            <div className="h-4 flex-1 animate-pulse rounded bg-slate-700" />
            <div className="h-4 w-16 animate-pulse rounded bg-slate-700" />
            <div className="h-4 w-10 animate-pulse rounded bg-slate-700" />
          </div>
        ))}
      </div>
    </div>
  );
}
