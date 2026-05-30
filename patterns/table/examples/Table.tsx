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

export default function TableExample() {
  const [status, setStatus] = useState<Status>("populated");
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["populated", "loading", "empty", "error"] as Status[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              status === s
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <DataTable status={status} rows={status === "empty" ? [] : SAMPLE} />
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
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  if (status === "loading") return <TableSkeleton />;
  if (status === "error")
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-medium text-red-800">Couldn&apos;t load users.</p>
        <button className="mt-3 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700">
          Retry
        </button>
      </div>
    );
  if (sorted.length === 0)
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
        <p className="font-medium text-slate-700">No users yet</p>
        <p className="mt-1 text-sm text-slate-500">Invite a teammate to get started.</p>
        <button className="mt-4 rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700">
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
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th scope="col" className="w-10 px-4 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                aria-label="Select all rows"
                className="h-4 w-4 rounded border-slate-300"
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
                  className="inline-flex items-center gap-1 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                  {h.label}
                  <span className="text-xs text-slate-400">
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
        <tbody className="divide-y divide-slate-100">
          {sorted.map((u) => (
            <tr key={u.id} className={selected.has(u.id) ? "bg-sky-50" : "hover:bg-slate-50"}>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.has(u.id)}
                  onChange={() => toggleOne(u.id)}
                  aria-label={`Select ${u.name}`}
                  className="h-4 w-4 rounded border-slate-300"
                />
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-slate-900">{u.name}</div>
                <div className="text-slate-500">{u.email}</div>
              </td>
              <td className="px-4 py-3 text-slate-700">{u.role}</td>
              <td className="px-4 py-3 text-right tabular-nums text-slate-700">{u.signups}</td>
              <td className="px-4 py-3 text-right">
                <button className="text-sky-700 hover:underline">Edit</button>
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
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <div className="h-11 bg-slate-50" />
      <div className="divide-y divide-slate-100">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3.5">
            <div className="h-4 w-4 rounded bg-slate-200" />
            <div className="h-4 flex-1 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-10 animate-pulse rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
