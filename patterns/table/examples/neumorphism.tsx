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

export default function TableNeumorphism() {
  const [status, setStatus] = useState<Status>("populated");
  return (
    <div className="bg-slate-200 p-6 rounded-3xl">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          {(["populated", "loading", "empty", "error"] as Status[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`bg-slate-200 rounded-2xl px-4 py-2 text-sm font-semibold text-slate-700 transition ${
                status === s
                  ? "shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]"
                  : "shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] active:shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]"
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
      <div className="bg-slate-200 rounded-2xl p-6 text-center shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff]">
        <p className="font-semibold text-slate-700">Couldn&apos;t load users.</p>
        <button className="mt-3 bg-slate-200 rounded-2xl px-4 py-2 text-sm font-semibold text-slate-700 shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] transition active:shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]">
          Retry
        </button>
      </div>
    );
  if (sorted.length === 0)
    return (
      <div className="bg-slate-200 rounded-2xl p-10 text-center shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]">
        <p className="font-semibold text-slate-700">No users yet</p>
        <p className="mt-1 text-sm text-slate-600">Invite a teammate to get started.</p>
        <button className="mt-4 bg-slate-200 rounded-2xl px-4 py-2 text-sm font-semibold text-slate-700 shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] transition active:shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]">
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
    <div className="overflow-x-auto bg-slate-200 rounded-2xl shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff]">
      <table className="w-full border-collapse text-sm">
        <thead className="text-slate-700">
          <tr>
            <th scope="col" className="w-10 px-4 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                aria-label="Select all rows"
                className="h-4 w-4 rounded accent-slate-500"
              />
            </th>
            {headers.map((h) => (
              <th
                key={h.key}
                scope="col"
                aria-sort={sortKey === h.key ? sortDir : "none"}
                className={`px-4 py-3 font-semibold ${h.numeric ? "text-right" : "text-left"}`}
              >
                <button
                  onClick={() => toggleSort(h.key)}
                  className="inline-flex items-center gap-1 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                  {h.label}
                  <span className="text-xs text-slate-500">
                    {sortKey === h.key ? (sortDir === "ascending" ? "▲" : "▼") : "↕"}
                  </span>
                </button>
              </th>
            ))}
            <th scope="col" className="px-4 py-3 text-right font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((u) => (
            <tr key={u.id} className="align-top">
              <td className="px-4 py-3">
                <div
                  className={
                    selected.has(u.id)
                      ? "inline-flex rounded-xl p-1 shadow-[inset_3px_3px_6px_#b0b6c0,inset_-3px_-3px_6px_#ffffff]"
                      : "inline-flex rounded-xl p-1"
                  }
                >
                  <input
                    type="checkbox"
                    checked={selected.has(u.id)}
                    onChange={() => toggleOne(u.id)}
                    aria-label={`Select ${u.name}`}
                    className="h-4 w-4 rounded accent-slate-500"
                  />
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="font-semibold text-slate-700">{u.name}</div>
                <div className="text-slate-500">{u.email}</div>
              </td>
              <td className="px-4 py-3 text-slate-600">{u.role}</td>
              <td className="px-4 py-3 text-right tabular-nums text-slate-600">{u.signups}</td>
              <td className="px-4 py-3 text-right">
                <button className="bg-slate-200 rounded-xl px-3 py-1 text-xs font-semibold text-slate-700 shadow-[3px_3px_6px_#b0b6c0,-3px_-3px_6px_#ffffff] transition active:shadow-[inset_3px_3px_6px_#b0b6c0,inset_-3px_-3px_6px_#ffffff]">
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
    <div className="overflow-hidden bg-slate-200 rounded-2xl shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff]">
      <div className="h-11 bg-slate-200" />
      <div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3.5">
            <div className="h-4 w-4 rounded-lg bg-slate-200 shadow-[inset_2px_2px_4px_#b0b6c0,inset_-2px_-2px_4px_#ffffff]" />
            <div className="h-4 flex-1 animate-pulse rounded-lg bg-slate-200 shadow-[inset_2px_2px_4px_#b0b6c0,inset_-2px_-2px_4px_#ffffff]" />
            <div className="h-4 w-16 animate-pulse rounded-lg bg-slate-200 shadow-[inset_2px_2px_4px_#b0b6c0,inset_-2px_-2px_4px_#ffffff]" />
            <div className="h-4 w-10 animate-pulse rounded-lg bg-slate-200 shadow-[inset_2px_2px_4px_#b0b6c0,inset_-2px_-2px_4px_#ffffff]" />
          </div>
        ))}
      </div>
    </div>
  );
}
