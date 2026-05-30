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

export default function DashboardNeon() {
  return (
    <div className="bg-slate-950 p-6 rounded-xl">
      <div className="overflow-hidden border border-cyan-500/50 bg-slate-900 rounded-lg text-slate-100 shadow-[0_0_18px_rgba(34,211,238,0.35)]">
        {/* Top bar — the [[header]] primitive */}
        <header className="flex items-center justify-between border-b border-cyan-500/50 bg-slate-900 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md border border-cyan-400 bg-cyan-400/10 text-xs font-bold text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.5)]">
              A
            </span>
            <span className="text-sm font-semibold text-cyan-200 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]">Acme Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-fuchsia-400 text-xs font-semibold text-fuchsia-300 shadow-[0_0_12px_rgba(232,121,249,0.5)]">
              AN
            </span>
          </div>
        </header>

        <div className="flex">
          {/* Left rail — the [[sidebar]] primitive */}
          <nav aria-label="Primary" className="hidden w-44 shrink-0 border-r border-cyan-500/50 bg-slate-900 p-3 sm:block">
            <ul className="space-y-1">
              {NAV.map((item, i) => (
                <li key={item}>
                  <a
                    href="#"
                    aria-current={i === 0 ? "page" : undefined}
                    className={`block rounded-md px-3 py-2 text-sm transition ${
                      i === 0
                        ? "border border-cyan-400 bg-cyan-400/10 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                        : "text-slate-400 hover:bg-slate-800 hover:text-cyan-200"
                    }`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main content region */}
          <main className="min-w-0 flex-1 p-4 sm:p-6">
            <h1 className="text-lg font-semibold text-cyan-200 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]">Overview</h1>
            <p className="mt-0.5 text-sm text-slate-400">Last 30 days vs. previous period</p>

            <h2 className="sr-only">Key metrics</h2>
            <section className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {KPIS.map((k) => (
                <KpiCard key={k.label} kpi={k} />
              ))}
            </section>

            <h2 className="mt-8 text-sm font-semibold text-cyan-200 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]">Recent activity</h2>
            <section className="mt-3 overflow-hidden border border-cyan-500/50 bg-slate-900 rounded-lg shadow-[0_0_18px_rgba(34,211,238,0.35)]">
              <ActivityTable rows={ACTIVITY} />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ kpi }: { kpi: Kpi }) {
  const up = kpi.delta > 0;
  const flat = kpi.delta === 0;
  return (
    <div className="border border-cyan-500/50 bg-slate-900 rounded-lg p-4 shadow-[0_0_18px_rgba(34,211,238,0.35)]">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{kpi.label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-cyan-200 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]">{kpi.value}</p>
      <p
        className={`mt-1 inline-flex items-center gap-1 text-xs font-medium ${
          flat ? "text-slate-500" : up ? "text-emerald-300" : "text-fuchsia-300"
        }`}
      >
        <span aria-hidden>{flat ? "→" : up ? "▲" : "▼"}</span>
        {flat ? "no change" : `${up ? "+" : ""}${kpi.delta}% vs. prev`}
      </p>
    </div>
  );
}

function ActivityTable({ rows }: { rows: Activity[] }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead className="bg-slate-800 text-slate-300">
        <tr>
          <th scope="col" className="px-4 py-2.5 text-left font-medium">Member</th>
          <th scope="col" className="px-4 py-2.5 text-left font-medium">Activity</th>
          <th scope="col" className="px-4 py-2.5 text-right font-medium">When</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-cyan-500/20">
        {rows.map((r) => (
          <tr key={r.id} className="hover:bg-slate-800">
            <td className="px-4 py-2.5 font-medium text-slate-100">{r.who}</td>
            <td className="px-4 py-2.5 text-slate-300">{r.action}</td>
            <td className="px-4 py-2.5 text-right tabular-nums text-slate-400">{r.when}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
