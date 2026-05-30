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

export default function TableBrutalism() {
  const [status, setStatus] = useState<Status>("populated");
  return (
    <div className="bg-yellow-50 p-5">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(["populated", "loading", "empty", "error"] as Status[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`border-2 border-black rounded-none px-3 py-1.5 text-sm font-bold uppercase tracking-tight text-black transition ${
                status === s
                  ? "bg-yellow-300 shadow-[4px_4px_0_0_#000]"
                  : "bg-white shadow-[2px_2px_0_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#000]"
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
      <div className="border-2 border-black bg-pink-400 rounded-none p-6 text-center shadow-[6px_6px_0_0_#000]">
        <p className="font-extrabold uppercase tracking-tight text-black">Couldn&apos;t load users.</p>
        <button className="mt-3 border-2 border-black bg-yellow-300 rounded-none px-3 py-1.5 text-sm font-bold text-black shadow-[4px_4px_0_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#000]">
          Retry
        </button>
      </div>
    );
  if (sorted.length === 0)
    return (
      <div className="border-2 border-black bg-cyan-300 rounded-none p-10 text-center shadow-[6px_6px_0_0_#000]">
        <p className="font-extrabold uppercase tracking-tight text-black">No users yet</p>
        <p className="mt-1 text-sm font-bold text-black">Invite a teammate to get started.</p>
        <button className="mt-4 border-2 border-black bg-yellow-300 rounded-none px-3 py-1.5 text-sm font-bold text-black shadow-[4px_4px_0_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#000]">
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
    <div className="overflow-x-auto border-2 border-black bg-white rounded-none shadow-[6px_6px_0_0_#000]">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-lime-300 text-black">
          <tr className="border-b-2 border-black">
            <th scope="col" className="w-10 px-4 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                aria-label="Select all rows"
                className="h-4 w-4 rounded-none border-2 border-black accent-black"
              />
            </th>
            {headers.map((h) => (
              <th
                key={h.key}
                scope="col"
                aria-sort={sortKey === h.key ? sortDir : "none"}
                className={`px-4 py-3 font-extrabold uppercase tracking-tight ${h.numeric ? "text-right" : "text-left"}`}
              >
                <button
                  onClick={() => toggleSort(h.key)}
                  className="inline-flex items-center gap-1 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  {h.label}
                  <span className="text-xs">
                    {sortKey === h.key ? (sortDir === "ascending" ? "▲" : "▼") : "↕"}
                  </span>
                </button>
              </th>
            ))}
            <th scope="col" className="px-4 py-3 text-right font-extrabold uppercase tracking-tight">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-black">
          {sorted.map((u) => (
            <tr key={u.id} className={selected.has(u.id) ? "bg-yellow-300" : "bg-white hover:bg-yellow-100"}>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.has(u.id)}
                  onChange={() => toggleOne(u.id)}
                  aria-label={`Select ${u.name}`}
                  className="h-4 w-4 rounded-none border-2 border-black accent-black"
                />
              </td>
              <td className="px-4 py-3">
                <div className="font-bold text-black">{u.name}</div>
                <div className="text-black/70">{u.email}</div>
              </td>
              <td className="px-4 py-3 font-bold text-black">{u.role}</td>
              <td className="px-4 py-3 text-right font-bold tabular-nums text-black">{u.signups}</td>
              <td className="px-4 py-3 text-right">
                <button className="border-2 border-black bg-cyan-300 rounded-none px-2 py-1 text-xs font-bold text-black shadow-[2px_2px_0_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0_0_#000]">
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
    <div className="overflow-hidden border-2 border-black bg-white rounded-none shadow-[6px_6px_0_0_#000]">
      <div className="h-11 border-b-2 border-black bg-lime-300" />
      <div className="divide-y-2 divide-black">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3.5">
            <div className="h-4 w-4 border-2 border-black bg-slate-300" />
            <div className="h-4 flex-1 animate-pulse border-2 border-black bg-slate-300" />
            <div className="h-4 w-16 animate-pulse border-2 border-black bg-slate-300" />
            <div className="h-4 w-10 animate-pulse border-2 border-black bg-slate-300" />
          </div>
        ))}
      </div>
    </div>
  );
}
