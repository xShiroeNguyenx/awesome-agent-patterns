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

export default function HeaderExample() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const current = "#dashboard";

  return (
    <div className="space-y-3">
      <button
        onClick={() => setScrolled((s) => !s)}
        className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
      >
        {scrolled ? "Show default state" : "Simulate scrolled state"}
      </button>

      <header
        className={`sticky top-0 z-10 rounded-lg border border-slate-200 bg-white transition ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:rounded focus:bg-sky-600 focus:px-3 focus:py-1 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>

        <div className={`flex items-center gap-4 px-4 ${scrolled ? "py-2" : "py-3"}`}>
          <a href="#home" className="flex items-center gap-2 font-semibold text-slate-900">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-sky-600 text-sm text-white">A</span>
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
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                    active ? "bg-sky-50 text-sky-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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
                className="w-40 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 lg:w-56"
              />
            </label>
            <button
              className="grid h-9 w-9 place-items-center rounded-full bg-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-300"
              aria-label="Account menu"
            >
              AN
            </button>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="grid h-9 w-9 place-items-center rounded-md text-slate-700 hover:bg-slate-100 md:hidden"
            >
              <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav id="mobile-menu" aria-label="Mobile" className="border-t border-slate-100 px-4 py-3 md:hidden">
            <label className="mb-2 block">
              <span className="sr-only">Search</span>
              <input
                type="search"
                placeholder="Search…"
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
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
                        active ? "bg-sky-50 text-sky-700" : "text-slate-700 hover:bg-slate-100"
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
