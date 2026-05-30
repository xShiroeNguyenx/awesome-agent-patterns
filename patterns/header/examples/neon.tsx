import { useState } from "react";

interface NavLink {
  href: string;
  label: string;
}

const LINKS: NavLink[] = [
  { href: "#dashboard", label: "Dashboard" },
  { href: "#projects", label: "Projects" },
  { href: "#reports", label: "Reports" },
  { href: "#settings", label: "Settings" },
];

export default function HeaderNeon() {
  const [menuOpen, setMenuOpen] = useState(false);
  const current = "#dashboard";

  return (
    <div className="rounded-xl bg-slate-950 p-6">
      <header className="sticky top-0 z-10 rounded-lg border border-cyan-500/50 bg-slate-900 text-slate-100 shadow-[0_0_18px_rgba(34,211,238,0.35)]">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:rounded-md focus:border focus:border-cyan-400 focus:bg-cyan-400/10 focus:px-3 focus:py-1 focus:text-sm focus:text-cyan-200 focus:shadow-[0_0_12px_rgba(34,211,238,0.5)]"
        >
          Skip to content
        </a>

        <div className="flex items-center gap-4 px-4 py-3">
          <a href="#home" className="flex items-center gap-2 font-semibold text-cyan-200 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]">
            <span className="grid h-8 w-8 place-items-center rounded-md border border-cyan-400 bg-cyan-400/10 text-sm text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.5)]">A</span>
            <span className="hidden sm:inline">Acme</span>
          </a>

          <nav aria-label="Main" className="hidden md:flex md:items-center md:gap-1">
            {LINKS.map((l) => {
              const active = l.href === current;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    active
                      ? "border border-cyan-400 bg-cyan-400/20 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                      : "text-slate-300 hover:bg-cyan-400/10 hover:text-cyan-200"
                  }`}
                >
                  {l.label}
                </a>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <label className="hidden sm:block">
              <span className="sr-only">Search</span>
              <input
                type="search"
                placeholder="Search…"
                className="w-40 rounded-md border border-cyan-500/40 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 lg:w-56"
              />
            </label>
            <button
              className="grid h-9 w-9 place-items-center rounded-full border border-fuchsia-400 bg-slate-900 text-sm font-medium text-fuchsia-300 shadow-[0_0_12px_rgba(232,121,249,0.5)] transition hover:bg-fuchsia-400/10"
              aria-label="Account menu"
            >
              AN
            </button>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="grid h-9 w-9 place-items-center rounded-md border border-cyan-400 bg-cyan-400/10 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.5)] transition hover:bg-cyan-400/20 md:hidden"
            >
              <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav id="mobile-menu" aria-label="Mobile" className="border-t border-cyan-500/30 px-4 py-3 md:hidden">
            <label className="mb-2 block">
              <span className="sr-only">Search</span>
              <input
                type="search"
                placeholder="Search…"
                className="w-full rounded-md border border-cyan-500/40 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </label>
            <ul className="space-y-1">
              {LINKS.map((l) => {
                const active = l.href === current;
                return (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-md px-3 py-2 text-sm font-medium ${
                        active
                          ? "border border-cyan-400 bg-cyan-400/20 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                          : "text-slate-300 hover:bg-cyan-400/10 hover:text-cyan-200"
                      }`}
                    >
                      {l.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </header>
    </div>
  );
}
