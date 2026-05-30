import { useState } from "react";

interface Item {
  id: string;
  label: string;
  icon: string;
}

interface Group {
  heading: string;
  items: Item[];
}

const GROUPS: Group[] = [
  {
    heading: "Workspace",
    items: [
      { id: "home", label: "Dashboard", icon: "🏠" },
      { id: "projects", label: "Projects", icon: "📁" },
      { id: "tasks", label: "Tasks", icon: "✅" },
    ],
  },
  {
    heading: "Insights",
    items: [
      { id: "reports", label: "Reports", icon: "📊" },
      { id: "team", label: "Team", icon: "👥" },
      { id: "settings", label: "Settings", icon: "⚙️" },
    ],
  },
];

export default function SidebarGlass() {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [active, setActive] = useState("home");

  return (
    <div className="rounded-2xl bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-500 p-6">
      <div className="relative flex h-80 overflow-hidden rounded-2xl border border-white/40 shadow-xl">
        {drawerOpen && (
          <button
            aria-label="Close navigation"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 z-10 bg-slate-900/30 backdrop-blur-sm md:hidden"
          />
        )}

        <nav
          aria-label="Sidebar"
          className={`absolute inset-y-0 left-0 z-20 flex flex-col border-r border-white/40 bg-white/15 text-white backdrop-blur-md transition-all md:relative md:translate-x-0 ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          } ${collapsed ? "w-16" : "w-56"}`}
        >
          <div className="flex items-center justify-between px-3 py-3">
            {!collapsed && <span className="font-semibold text-white">Acme</span>}
            <button
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="grid h-8 w-8 place-items-center rounded-xl border border-white/50 bg-white/25 text-white backdrop-blur transition hover:bg-white/40"
            >
              <span aria-hidden="true">{collapsed ? "»" : "«"}</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-2">
            {GROUPS.map((group) => (
              <div key={group.heading} className="mb-4">
                {!collapsed && (
                  <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-white/70">
                    {group.heading}
                  </p>
                )}
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = item.id === active;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => setActive(item.id)}
                          aria-current={isActive ? "page" : undefined}
                          aria-label={collapsed ? item.label : undefined}
                          title={collapsed ? item.label : undefined}
                          className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                            isActive ? "bg-white/40 text-white" : "text-white/70 hover:bg-white/25 hover:text-white"
                          } ${collapsed ? "justify-center" : ""}`}
                        >
                          <span aria-hidden="true" className="text-base leading-none">{item.icon}</span>
                          {!collapsed && <span>{item.label}</span>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        <div className="flex min-w-0 flex-1 flex-col bg-white/15 text-white backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-white/30 px-4 py-3">
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation"
              className="grid h-8 w-8 place-items-center rounded-xl border border-white/50 bg-white/25 text-white backdrop-blur transition hover:bg-white/40 md:hidden"
            >
              <span aria-hidden="true">☰</span>
            </button>
            <h2 className="text-sm font-semibold capitalize text-white">{active}</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 text-sm text-white/70">
            <p>Content for the “{active}” section. Toggle the « button to collapse the rail to icons.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
