import { useMemo, useState } from "react";

interface Invoice {
  id: number;
  customer: string;
  amount: number;
}

const SAMPLE: Invoice[] = Array.from({ length: 42 }, (_, i) => ({
  id: i + 1,
  customer: ["Ava Nguyen", "Minh Tran", "Linh Pham", "Khoa Le", "Mai Vo"][i % 5],
  amount: 50 + ((i * 37) % 950),
}));

const PAGE_SIZES = [5, 10, 42] as const;

function pageWindow(current: number, total: number): Array<number | "gap"> {
  const out: Array<number | "gap"> = [];
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || (p >= current - 1 && p <= current + 1)) {
      out.push(p);
    } else if (out[out.length - 1] !== "gap") {
      out.push("gap");
    }
  }
  return out;
}

export default function PaginationGlass() {
  const [pageSize, setPageSize] = useState<number>(5);
  const [page, setPage] = useState<number>(1);

  const total = SAMPLE.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * pageSize;
  const rows = useMemo(() => SAMPLE.slice(start, start + pageSize), [start, pageSize]);
  const from = total === 0 ? 0 : start + 1;
  const to = Math.min(start + pageSize, total);

  function goTo(p: number) {
    setPage(Math.min(Math.max(1, p), pageCount));
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-500 p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 text-sm text-white/70">
          <p>
            Showing <span className="font-medium text-white tabular-nums">{from}–{to}</span> of{" "}
            <span className="font-medium text-white tabular-nums">{total}</span>
          </p>
          <label className="flex items-center gap-2">
            Per page
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-xl border border-white/40 bg-white/20 px-2 py-1 text-white backdrop-blur focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              {PAGE_SIZES.map((s) => (
                <option key={s} value={s} className="text-slate-800">
                  {s === total ? "All" : s}
                </option>
              ))}
            </select>
          </label>
        </div>

        <ul className="divide-y divide-white/20 rounded-2xl border border-white/40 bg-white/15 text-white shadow-xl backdrop-blur-md">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <span className="text-white/70 tabular-nums">#{String(r.id).padStart(3, "0")}</span>
              <span className="font-medium text-white">{r.customer}</span>
              <span className="text-white/90 tabular-nums">${r.amount}.00</span>
            </li>
          ))}
        </ul>

        {pageCount > 1 ? (
          <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
            <button
              onClick={() => goTo(current - 1)}
              disabled={current === 1}
              aria-label="Previous page"
              className="rounded-xl border border-white/40 px-3 py-1.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>
            {pageWindow(current, pageCount).map((p, i) =>
              p === "gap" ? (
                <span key={`gap-${i}`} className="px-2 text-white/60" aria-hidden="true">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => goTo(p)}
                  aria-current={p === current ? "page" : undefined}
                  className={`min-w-[2.25rem] rounded-xl border border-white/40 px-3 py-1.5 text-sm font-medium tabular-nums text-white backdrop-blur transition ${
                    p === current ? "bg-white/40" : "bg-white/15 hover:bg-white/30"
                  }`}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => goTo(current + 1)}
              disabled={current === pageCount}
              aria-label="Next page"
              className="rounded-xl border border-white/40 px-3 py-1.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        ) : (
          <p className="text-center text-sm text-white/60">Single page — nothing to page through.</p>
        )}
      </div>
    </div>
  );
}
