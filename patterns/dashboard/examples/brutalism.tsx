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

export default function DashboardBrutalism() {
  return (
    <div className="bg-yellow-50 p-5">
      <div className="overflow-hidden border-2 border-black bg-white rounded-none shadow-[6px_6px_0_0_#000]">
        {/* Top bar — the [[header]] primitive */}
        <header className="flex items-center justify-between border-b-2 border-black bg-cyan-300 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center border-2 border-black bg-yellow-300 text-xs font-extrabold text-black">
              A
            </span>
            <span className="text-sm font-extrabold uppercase tracking-tight text-black">Acme Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center border-2 border-black bg-pink-400 text-xs font-extrabold text-black">
              AN
            </span>
          </div>
        </header>

        <div className="flex">
          {/* Left rail — the [[sidebar]] primitive */}
          <nav aria-label="Primary" className="hidden w-44 shrink-0 border-r-2 border-black bg-white p-3 sm:block">
            <ul className="space-y-2">
              {NAV.map((item, i) => (
                <li key={item}>
                  <a
                    href="#"
                    aria-current={i === 0 ? "page" : undefined}
                    className={`block border-2 border-black px-3 py-2 text-sm font-bold rounded-none transition ${
                      i === 0 ? "bg-yellow-300 text-black shadow-[3px_3px_0_0_#000]" : "bg-white text-black hover:bg-lime-300"
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
            <h1 className="text-lg font-extrabold uppercase tracking-tight text-black">Overview</h1>
            <p className="mt-0.5 text-sm font-bold text-black">Last 30 days vs. previous period</p>

            <h2 className="sr-only">Key metrics</h2>
            <section className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {KPIS.map((k) => (
                <KpiCard key={k.label} kpi={k} />
              ))}
            </section>

            <h2 className="mt-8 text-sm font-extrabold uppercase tracking-tight text-black">Recent activity</h2>
            <section className="mt-3 overflow-hidden border-2 border-black bg-white rounded-none shadow-[6px_6px_0_0_#000]">
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
    <div className="border-2 border-black bg-white p-4 rounded-none shadow-[4px_4px_0_0_#000]">
      <p className="text-xs font-extrabold uppercase tracking-wide text-black">{kpi.label}</p>
      <p className="mt-1 text-2xl font-extrabold tabular-nums text-black">{kpi.value}</p>
      <p
        className={`mt-2 inline-flex items-center gap-1 border-2 border-black px-1.5 py-0.5 text-xs font-bold text-black ${
          flat ? "bg-white" : up ? "bg-lime-300" : "bg-pink-400"
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
      <thead className="border-b-2 border-black bg-lime-300 text-black">
        <tr>
          <th scope="col" className="px-4 py-2.5 text-left font-extrabold uppercase tracking-tight">Member</th>
          <th scope="col" className="px-4 py-2.5 text-left font-extrabold uppercase tracking-tight">Activity</th>
          <th scope="col" className="px-4 py-2.5 text-right font-extrabold uppercase tracking-tight">When</th>
        </tr>
      </thead>
      <tbody className="divide-y-2 divide-black">
        {rows.map((r) => (
          <tr key={r.id} className="hover:bg-yellow-100">
            <td className="px-4 py-2.5 font-bold text-black">{r.who}</td>
            <td className="px-4 py-2.5 text-black">{r.action}</td>
            <td className="px-4 py-2.5 text-right font-bold tabular-nums text-black">{r.when}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
