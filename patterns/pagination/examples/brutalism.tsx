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

export default function PaginationBrutalism() {
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
    <div className="bg-yellow-50 p-5">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 text-sm font-bold text-black">
          <p>
            Showing <span className="font-extrabold tabular-nums">{from}–{to}</span> of{" "}
            <span className="font-extrabold tabular-nums">{total}</span>
          </p>
          <label className="flex items-center gap-2">
            Per page
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-none border-2 border-black bg-white px-2 py-1 font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
            >
              {PAGE_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s === total ? "All" : s}
                </option>
              ))}
            </select>
          </label>
        </div>

        <ul className="divide-y-2 divide-black rounded-none border-2 border-black bg-white shadow-[6px_6px_0_0_#000]">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <span className="font-bold text-black tabular-nums">#{String(r.id).padStart(3, "0")}</span>
              <span className="font-extrabold text-black">{r.customer}</span>
              <span className="font-bold text-black tabular-nums">${r.amount}.00</span>
            </li>
          ))}
        </ul>

        {pageCount > 1 ? (
          <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
            <button
              onClick={() => goTo(current - 1)}
              disabled={current === 1}
              aria-label="Previous page"
              className="rounded-none border-2 border-black bg-white px-3 py-1.5 text-sm font-bold text-black shadow-[2px_2px_0_0_#000] transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>
            {pageWindow(current, pageCount).map((p, i) =>
              p === "gap" ? (
                <span key={`gap-${i}`} className="px-2 font-extrabold text-black" aria-hidden="true">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => goTo(p)}
                  aria-current={p === current ? "page" : undefined}
                  className={`min-w-[2.25rem] rounded-none border-2 border-black px-3 py-1.5 text-sm font-bold tabular-nums text-black transition ${
                    p === current
                      ? "bg-pink-400 shadow-[4px_4px_0_0_#000]"
                      : "bg-white shadow-[2px_2px_0_0_#000] hover:bg-cyan-300"
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
              className="rounded-none border-2 border-black bg-white px-3 py-1.5 text-sm font-bold text-black shadow-[2px_2px_0_0_#000] transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        ) : (
          <p className="text-center text-sm font-bold text-black">Single page — nothing to page through.</p>
        )}
      </div>
    </div>
  );
}
