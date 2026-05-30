import { useEffect, useState } from "react";

type DataState = "loading" | "populated" | "empty";

interface Kpi {
  label: string;
  value: string;
  delta: number; // percent vs. previous period
}

interface Activity {
  id: number;
  who: string;
  action: string;
  when: string;
}

const KPIS: Kpi[] = [
  { label: "Active users", value: "1,284", delta: 12.5 },
  { label: "New signups", value: "318", delta: 4.2 },
  { label: "Revenue", value: "$24.7k", delta: -2.1 },
  { label: "Open tickets", value: "27", delta: -8.0 },
];

const ACTIVITY: Activity[] = [
  { id: 1, who: "Ava Nguyen", action: "Upgraded to Pro", when: "2m ago" },
  { id: 2, who: "Minh Tran", action: "Invited 3 teammates", when: "18m ago" },
  { id: 3, who: "Linh Pham", action: "Closed ticket #482", when: "1h ago" },
  { id: 4, who: "Khoa Le", action: "Updated billing", when: "3h ago" },
];

const NAV = ["Overview", "Members", "Billing", "Reports", "Settings"];

export default function DashboardExample() {
  const [state, setState] = useState<DataState>("loading");

  // Simulate the initial data fetch: skeleton -> populated.
  useEffect(() => {
    if (state !== "loading") return;
    const t = setTimeout(() => setState("populated"), 1100);
    return () => clearTimeout(t);
  }, [state]);

  const kpis = state === "populated" ? KPIS : state === "empty" ? KPIS.map((k) => ({ ...k, value: "0", delta: 0 })) : [];
  const activity = state === "populated" ? ACTIVITY : [];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      {/* Top bar — the [[header]] primitive, slimmed down */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-slate-900 text-xs font-bold text-white">A</span>
          <span className="text-sm font-semibold text-slate-900">Acme Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setState("loading")}
            className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
          >
            Reload
          </button>
          <button
            onClick={() => setState((s) => (s === "empty" ? "populated" : "empty"))}
            className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
          >
            {state === "empty" ? "Show data" : "Empty account"}
          </button>
          <span className="grid h-7 w-7 place-items-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">AN</span>
        </div>
      </header>

      <div className="flex">
        {/* Left rail — the [[sidebar]] primitive */}
        <nav aria-label="Primary" className="hidden w-44 shrink-0 border-r border-slate-200 bg-white p-3 sm:block">
          <ul className="space-y-1">
            {NAV.map((item, i) => (
              <li key={item}>
                <a
                  href="#"
                  aria-current={i === 0 ? "page" : undefined}
                  className={`block rounded-md px-3 py-2 text-sm transition ${
                    i === 0 ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main content region */}
        <main aria-busy={state === "loading"} className="min-w-0 flex-1 p-4 sm:p-6">
          <h1 className="text-lg font-semibold text-slate-900">Overview</h1>
          <p className="mt-0.5 text-sm text-slate-500">Last 30 days vs. previous period</p>

          <h2 className="sr-only">Key metrics</h2>
          <section className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {state === "loading"
              ? Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)
              : kpis.map((k) => <KpiCard key={k.label} kpi={k} />)}
          </section>

          <h2 className="mt-8 text-sm font-semibold text-slate-900">Recent activity</h2>
          <section className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white">
            {state === "loading" ? (
              <ActivitySkeleton />
            ) : activity.length === 0 ? (
              <EmptyActivity />
            ) : (
              <ActivityTable rows={activity} />
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

function KpiCard({ kpi }: { kpi: Kpi }) {
  const up = kpi.delta > 0;
  const flat = kpi.delta === 0;
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{kpi.label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{kpi.value}</p>
      <p
        className={`mt-1 inline-flex items-center gap-1 text-xs font-medium ${
          flat ? "text-slate-400" : up ? "text-emerald-600" : "text-red-600"
        }`}
      >
        <span aria-hidden>{flat ? "→" : up ? "▲" : "▼"}</span>
        {flat ? "no change" : `${up ? "+" : ""}${kpi.delta}% vs. prev`}
      </p>
    </div>
  );
}

function KpiSkeleton() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="h-3 w-20 rounded bg-slate-200" />
      <div className="mt-2 h-7 w-16 animate-pulse rounded bg-slate-200" />
      <div className="mt-2 h-3 w-24 animate-pulse rounded bg-slate-200" />
    </div>
  );
}

function ActivityTable({ rows }: { rows: Activity[] }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead className="bg-slate-50 text-slate-600">
        <tr>
          <th scope="col" className="px-4 py-2.5 text-left font-medium">Member</th>
          <th scope="col" className="px-4 py-2.5 text-left font-medium">Activity</th>
          <th scope="col" className="px-4 py-2.5 text-right font-medium">When</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {rows.map((r) => (
          <tr key={r.id} className="hover:bg-slate-50">
            <td className="px-4 py-2.5 font-medium text-slate-900">{r.who}</td>
            <td className="px-4 py-2.5 text-slate-700">{r.action}</td>
            <td className="px-4 py-2.5 text-right tabular-nums text-slate-500">{r.when}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ActivitySkeleton() {
  return (
    <div className="divide-y divide-slate-100">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3">
          <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
          <div className="h-4 flex-1 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-12 animate-pulse rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

function EmptyActivity() {
  return (
    <div className="px-6 py-10 text-center">
      <p className="font-medium text-slate-700">No activity yet</p>
      <p className="mt-1 text-sm text-slate-500">Once members start using the app, their actions show up here.</p>
      <button className="mt-4 rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700">
        Invite members
      </button>
    </div>
  );
}
