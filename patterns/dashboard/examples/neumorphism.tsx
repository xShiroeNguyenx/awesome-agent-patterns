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

export default function DashboardNeumorphism() {
  return (
    <div className="bg-slate-200 p-6 rounded-3xl">
      <div className="bg-slate-200 rounded-2xl shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] p-4 sm:p-5">
        {/* Top bar — the [[header]] primitive */}
        <header className="flex items-center justify-between bg-slate-200 rounded-2xl shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-2xl bg-slate-200 text-xs font-semibold text-slate-700 shadow-[3px_3px_6px_#b0b6c0,-3px_-3px_6px_#ffffff]">
              A
            </span>
            <span className="text-sm font-semibold text-slate-700">Acme Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600 shadow-[3px_3px_6px_#b0b6c0,-3px_-3px_6px_#ffffff]">
              AN
            </span>
          </div>
        </header>

        <div className="mt-4 flex gap-4">
          {/* Left rail — the [[sidebar]] primitive */}
          <nav aria-label="Primary" className="hidden w-44 shrink-0 sm:block">
            <ul className="space-y-3">
              {NAV.map((item, i) => (
                <li key={item}>
                  <a
                    href="#"
                    aria-current={i === 0 ? "page" : undefined}
                    className={`block rounded-2xl bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition ${
                      i === 0
                        ? "shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]"
                        : "shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff]"
                    }`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main content region */}
          <main className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-slate-700">Overview</h1>
            <p className="mt-0.5 text-sm text-slate-600">Last 30 days vs. previous period</p>

            <h2 className="sr-only">Key metrics</h2>
            <section className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {KPIS.map((k) => (
                <KpiCard key={k.label} kpi={k} />
              ))}
            </section>

            <h2 className="mt-8 text-sm font-semibold text-slate-700">Recent activity</h2>
            <section className="mt-3 overflow-hidden bg-slate-200 rounded-2xl shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff]">
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
    <div className="bg-slate-200 rounded-2xl shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-600">{kpi.label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-700">{kpi.value}</p>
      <p className="mt-2 inline-flex items-center gap-1 rounded-xl bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600 shadow-[inset_3px_3px_6px_#b0b6c0,inset_-3px_-3px_6px_#ffffff]">
        <span aria-hidden>{flat ? "→" : up ? "▲" : "▼"}</span>
        {flat ? "no change" : `${up ? "+" : ""}${kpi.delta}% vs. prev`}
      </p>
    </div>
  );
}

function ActivityTable({ rows }: { rows: Activity[] }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead className="text-slate-600">
        <tr>
          <th scope="col" className="px-4 py-2.5 text-left font-medium">Member</th>
          <th scope="col" className="px-4 py-2.5 text-left font-medium">Activity</th>
          <th scope="col" className="px-4 py-2.5 text-right font-medium">When</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            <td className="px-4 py-2.5 font-medium text-slate-700">{r.who}</td>
            <td className="px-4 py-2.5 text-slate-600">{r.action}</td>
            <td className="px-4 py-2.5 text-right tabular-nums text-slate-500">{r.when}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
