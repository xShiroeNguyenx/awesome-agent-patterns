import { useEffect, useState } from "react";

type Mode = "spinner" | "skeleton" | "progress" | "button-loading";

const MODES: Mode[] = ["spinner", "skeleton", "progress", "button-loading"];

export default function LoadingNeon() {
  const [mode, setMode] = useState<Mode>("spinner");
  return (
    <div className="bg-slate-950 p-6 rounded-xl">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={
                mode === m
                  ? "border border-cyan-400 bg-cyan-400/20 px-3 py-1.5 font-medium text-cyan-200 rounded-md shadow-[0_0_12px_rgba(34,211,238,0.5)] transition hover:bg-cyan-400/20"
                  : "border border-cyan-400 bg-cyan-400/10 px-3 py-1.5 font-medium text-cyan-200 rounded-md shadow-[0_0_12px_rgba(34,211,238,0.5)] transition hover:bg-cyan-400/20"
              }
            >
              {m}
            </button>
          ))}
        </div>
        <div className="border border-cyan-500/50 bg-slate-900 rounded-lg text-slate-100 shadow-[0_0_18px_rgba(34,211,238,0.35)] p-6">
          {mode === "spinner" && <Spinner />}
          {mode === "skeleton" && <Skeleton />}
          {mode === "progress" && <Progress />}
          {mode === "button-loading" && <LoadingButton />}
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div role="status" aria-live="polite" className="flex items-center gap-3 text-slate-100">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)] motion-reduce:animate-none" />
      <span className="text-sm text-cyan-200 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]">Loading…</span>
    </div>
  );
}

function Skeleton() {
  return (
    <div aria-busy="true" className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-10 w-10 animate-pulse rounded-full bg-cyan-500/20 motion-reduce:animate-none" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 animate-pulse rounded bg-cyan-500/20 motion-reduce:animate-none" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-cyan-500/10 motion-reduce:animate-none" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Progress() {
  const [pct, setPct] = useState(12);
  useEffect(() => {
    const id = setInterval(() => {
      setPct((p) => (p >= 100 ? 12 : p + 11));
    }, 700);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-slate-100">
        <span>Uploading files…</span>
        <span className="tabular-nums text-cyan-200">{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-full rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function LoadingButton() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!loading) return;
    const id = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(id);
  }, [loading]);
  return (
    <button
      onClick={() => setLoading(true)}
      disabled={loading}
      aria-busy={loading}
      className="inline-flex w-40 items-center justify-center gap-2 border border-cyan-400 bg-cyan-400/10 px-3 py-1.5 font-medium text-cyan-200 rounded-md shadow-[0_0_12px_rgba(34,211,238,0.5)] transition hover:bg-cyan-400/20 disabled:opacity-70"
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400 motion-reduce:animate-none" />
      )}
      {loading ? "Saving…" : "Save changes"}
    </button>
  );
}
