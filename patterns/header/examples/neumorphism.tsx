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

export default function HeaderNeumorphism() {
  const [menuOpen, setMenuOpen] = useState(false);
  const current = "#dashboard";

  return (
    <div className="rounded-3xl bg-slate-200 p-6">
      <header className="sticky top-0 z-10 rounded-2xl bg-slate-200 shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff]">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:rounded-2xl focus:bg-slate-200 focus:px-3 focus:py-1 focus:text-sm focus:font-semibold focus:text-slate-700 focus:shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]"
        >
          Skip to content
        </a>

        <div className="flex items-center gap-4 px-4 py-3">
          <a href="#home" className="flex items-center gap-2 font-semibold text-slate-700">
            <span className="grid h-8 w-8 place-items-center rounded-2xl bg-slate-200 text-sm font-semibold text-slate-700 shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff]">A</span>
            <span className="hidden sm:inline">Acme</span>
          </a>

          <nav aria-label="Main" className="hidden md:flex md:items-center md:gap-2">
            {LINKS.map((l) => {
              const active = l.href === current;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-2xl bg-slate-200 px-3 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
                    active
                      ? "text-slate-700 shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]"
                      : "text-slate-600 shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff]"
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
                className="w-40 rounded-2xl bg-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-500 shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff] focus:outline-none focus:ring-2 focus:ring-slate-400 lg:w-56"
              />
            </label>
            <button
              className="grid h-9 w-9 place-items-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700 shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] transition active:shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]"
              aria-label="Account menu"
            >
              AN
            </button>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-200 text-slate-700 shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] transition active:shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff] md:hidden"
            >
              <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav id="mobile-menu" aria-label="Mobile" className="px-4 py-3 md:hidden">
            <label className="mb-2 block">
              <span className="sr-only">Search</span>
              <input
                type="search"
                placeholder="Search…"
                className="w-full rounded-2xl bg-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-500 shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff] focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </label>
            <ul className="space-y-2">
              {LINKS.map((l) => {
                const active = l.href === current;
                return (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-2xl bg-slate-200 px-3 py-2 text-sm font-medium ${
                        active
                          ? "text-slate-700 shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]"
                          : "text-slate-600 shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff]"
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
