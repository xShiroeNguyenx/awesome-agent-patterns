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

export default function HeaderBrutalism() {
  const [menuOpen, setMenuOpen] = useState(false);
  const current = "#dashboard";

  return (
    <div className="bg-yellow-50 p-5">
      <header className="sticky top-0 z-10 rounded-none border-2 border-black bg-white shadow-[6px_6px_0_0_#000]">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:rounded-none focus:border-2 focus:border-black focus:bg-yellow-300 focus:px-3 focus:py-1 focus:text-sm focus:font-bold focus:text-black"
        >
          Skip to content
        </a>

        <div className="flex items-center gap-4 px-4 py-3">
          <a href="#home" className="flex items-center gap-2 font-extrabold uppercase tracking-tight text-black">
            <span className="grid h-8 w-8 place-items-center rounded-none border-2 border-black bg-pink-400 text-sm font-extrabold text-black">A</span>
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
                  className={`rounded-none border-2 px-3 py-1.5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                    active
                      ? "border-black bg-cyan-300 text-black"
                      : "border-transparent text-black hover:border-black hover:bg-lime-300"
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
                className="w-40 rounded-none border-2 border-black px-3 py-2 text-sm text-black placeholder:text-black/60 focus:outline-none focus:ring-2 focus:ring-black lg:w-56"
              />
            </label>
            <button
              className="grid h-9 w-9 place-items-center rounded-none border-2 border-black bg-pink-400 text-sm font-bold text-black transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#000]"
              aria-label="Account menu"
            >
              AN
            </button>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="grid h-9 w-9 place-items-center rounded-none border-2 border-black bg-yellow-300 text-black transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#000] md:hidden"
            >
              <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav id="mobile-menu" aria-label="Mobile" className="border-t-2 border-black px-4 py-3 md:hidden">
            <label className="mb-2 block">
              <span className="sr-only">Search</span>
              <input
                type="search"
                placeholder="Search…"
                className="w-full rounded-none border-2 border-black px-3 py-2 text-sm text-black placeholder:text-black/60 focus:outline-none focus:ring-2 focus:ring-black"
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
                      className={`block rounded-none border-2 px-3 py-2 text-sm font-bold ${
                        active
                          ? "border-black bg-cyan-300 text-black"
                          : "border-transparent text-black hover:border-black hover:bg-lime-300"
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
