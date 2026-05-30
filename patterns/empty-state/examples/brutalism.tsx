import { useState } from "react";
import type { ReactElement } from "react";

type Variant = "first-use" | "no-results" | "cleared";

interface EmptyConfig {
  icon: ReactElement;
  heading: string;
  body: string;
  cta: string;
  ctaTone: "primary" | "neutral";
}

const FolderIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7" aria-hidden="true">
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
  </svg>
);

const SearchIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7" aria-hidden="true">
    <circle cx="11" cy="11" r="6" />
    <path d="m20 20-3.2-3.2" strokeLinecap="round" />
  </svg>
);

const CheckIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" />
    <path d="m8.5 12 2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CONFIG: Record<Variant, EmptyConfig> = {
  "first-use": {
    icon: FolderIcon,
    heading: "No projects yet",
    body: "Projects keep your work organized. Create your first one to get started.",
    cta: "Create project",
    ctaTone: "primary",
  },
  "no-results": {
    icon: SearchIcon,
    heading: "No matches for your filters",
    body: "We couldn't find any projects matching the current search and filters.",
    cta: "Clear filters",
    ctaTone: "neutral",
  },
  cleared: {
    icon: CheckIcon,
    heading: "You're all caught up",
    body: "Every task here is done. Nothing needs your attention right now.",
    cta: "View archive",
    ctaTone: "neutral",
  },
};

const VARIANTS: Variant[] = ["first-use", "no-results", "cleared"];

export default function EmptyStateBrutalism() {
  const [variant, setVariant] = useState<Variant>("first-use");
  const cfg = CONFIG[variant];

  return (
    <div className="space-y-4 bg-yellow-50 p-5">
      <div className="flex flex-wrap gap-2">
        {VARIANTS.map((v) => (
          <button
            key={v}
            onClick={() => setVariant(v)}
            className={`rounded-none border-2 border-black px-3 py-1.5 text-sm font-bold text-black transition ${
              variant === v ? "bg-yellow-300" : "bg-white hover:bg-cyan-300"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center rounded-none border-2 border-black bg-white px-6 py-12 text-center shadow-[6px_6px_0_0_#000]">
        <div className="flex h-14 w-14 items-center justify-center rounded-none border-2 border-black bg-lime-300 text-black">
          {cfg.icon}
        </div>
        <h3 className="mt-4 text-base font-extrabold uppercase tracking-tight text-black">{cfg.heading}</h3>
        <p className="mt-1 max-w-sm text-sm font-medium text-black">{cfg.body}</p>
        <button
          className={`mt-5 rounded-none border-2 border-black px-3 py-1.5 text-sm font-bold text-black shadow-[4px_4px_0_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#000] focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${
            cfg.ctaTone === "primary" ? "bg-yellow-300" : "bg-cyan-300"
          }`}
        >
          {cfg.cta}
        </button>
      </div>
    </div>
  );
}
