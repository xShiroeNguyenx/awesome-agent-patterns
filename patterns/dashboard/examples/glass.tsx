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

export default function DashboardGlass() {
  return (
    <div className="bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-500 p-6 rounded-2xl">
      <div className="overflow-hidden border border-white/40 bg-white/15 backdrop-blur-md rounded-2xl shadow-xl text-white">
        {/* Top bar — the [[header]] primitive */}
        <header className="flex items-center justify-between border-b border-white/40 bg-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-xl border border-white/50 bg-white/25 text-xs font-bold text-white backdrop-blur">
              A
            </span>
            <span className="text-sm font-semibold text-white">Acme Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-white/50 bg-white/25 text-xs font-semibold text-white backdrop-blur">
              AN
            </span>
          </div>
        </header>

        <div className="flex">
          {/* Left rail — the [[sidebar]] primitive */}
          <nav aria-label="Primary" className="hidden w-44 shrink-0 border-r border-white/40 bg-white/5 p-3 sm:block">
            <ul className="space-y-1">
              {NAV.map((item, i) => (
                <li key={item}>
                  <a
                    href="#"
                    aria-current={i === 0 ? "page" : undefined}
                    className={`block rounded-xl px-3 py-2 text-sm transition ${
                      i === 0 ? "border border-white/50 bg-white/40 text-white" : "text-white/70 hover:bg-white/20"
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
            <h1 className="text-lg font-semibold text-white">Overview</h1>
            <p className="mt-0.5 text-sm text-white/70">Last 30 days vs. previous period</p>

            <h2 className="sr-only">Key metrics</h2>
            <section className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {KPIS.map((k) => (
                <KpiCard key={k.label} kpi={k} />
              ))}
            </section>

            <h2 className="mt-8 text-sm font-semibold text-white">Recent activity</h2>
            <section className="mt-3 overflow-hidden border border-white/40 bg-white/15 backdrop-blur-md rounded-2xl shadow-xl">
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
    <div className="border border-white/40 bg-white/15 backdrop-blur-md rounded-2xl shadow-xl p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-white/70">{kpi.label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-white">{kpi.value}</p>
      <p
        className={`mt-1 inline-flex items-center gap-1 text-xs font-medium ${
          flat ? "text-white/60" : up ? "text-emerald-200" : "text-rose-200"
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
      <thead className="bg-white/10 text-white/70">
        <tr>
          <th scope="col" className="px-4 py-2.5 text-left font-medium">Member</th>
          <th scope="col" className="px-4 py-2.5 text-left font-medium">Activity</th>
          <th scope="col" className="px-4 py-2.5 text-right font-medium">When</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/20">
        {rows.map((r) => (
          <tr key={r.id} className="hover:bg-white/10">
            <td className="px-4 py-2.5 font-medium text-white">{r.who}</td>
            <td className="px-4 py-2.5 text-white/80">{r.action}</td>
            <td className="px-4 py-2.5 text-right tabular-nums text-white/70">{r.when}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
