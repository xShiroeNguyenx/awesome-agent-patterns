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

export default function EmptyStateExample() {
  const [variant, setVariant] = useState<Variant>("first-use");
  const cfg = CONFIG[variant];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {VARIANTS.map((v) => (
          <button
            key={v}
            onClick={() => setVariant(v)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              variant === v ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-400 ring-1 ring-slate-200">
          {cfg.icon}
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900">{cfg.heading}</h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500">{cfg.body}</p>
        <button
          className={`mt-5 rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
            cfg.ctaTone === "primary"
              ? "bg-slate-900 text-white hover:bg-slate-700"
              : "bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-100"
          }`}
        >
          {cfg.cta}
        </button>
      </div>
    </div>
  );
}
