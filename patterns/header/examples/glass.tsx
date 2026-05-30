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

export default function HeaderGlass() {
  const [menuOpen, setMenuOpen] = useState(false);
  const current = "#dashboard";

  return (
    <div className="rounded-2xl bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-500 p-6">
      <header className="sticky top-0 z-10 rounded-2xl border border-white/40 bg-white/15 text-white shadow-xl backdrop-blur-md">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:rounded-xl focus:border focus:border-white/50 focus:bg-white/25 focus:px-3 focus:py-1 focus:text-sm focus:text-white focus:backdrop-blur"
        >
          Skip to content
        </a>

        <div className="flex items-center gap-4 px-4 py-3">
          <a href="#home" className="flex items-center gap-2 font-semibold text-white">
            <span className="grid h-8 w-8 place-items-center rounded-xl border border-white/50 bg-white/25 text-sm text-white backdrop-blur">A</span>
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
                  className={`rounded-xl px-3 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                    active ? "bg-white/40 text-white" : "text-white/70 hover:bg-white/25 hover:text-white"
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
                className="w-40 rounded-xl border border-white/40 bg-white/20 px-3 py-2 text-sm text-white placeholder:text-white/60 backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/60 lg:w-56"
              />
            </label>
            <button
              className="grid h-9 w-9 place-items-center rounded-full border border-white/50 bg-white/25 text-sm font-medium text-white backdrop-blur transition hover:bg-white/40"
              aria-label="Account menu"
            >
              AN
            </button>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="grid h-9 w-9 place-items-center rounded-xl border border-white/50 bg-white/25 text-white backdrop-blur transition hover:bg-white/40 md:hidden"
            >
              <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav id="mobile-menu" aria-label="Mobile" className="border-t border-white/30 px-4 py-3 md:hidden">
            <label className="mb-2 block">
              <span className="sr-only">Search</span>
              <input
                type="search"
                placeholder="Search…"
                className="w-full rounded-xl border border-white/40 bg-white/20 px-3 py-2 text-sm text-white placeholder:text-white/60 backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/60"
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
                      className={`block rounded-xl px-3 py-2 text-sm font-medium ${
                        active ? "bg-white/40 text-white" : "text-white/70 hover:bg-white/25 hover:text-white"
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
