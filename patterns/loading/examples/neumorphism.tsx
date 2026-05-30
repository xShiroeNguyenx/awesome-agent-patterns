import { useEffect, useState } from "react";

type Mode = "spinner" | "skeleton" | "progress" | "button-loading";

const MODES: Mode[] = ["spinner", "skeleton", "progress", "button-loading"];

export default function LoadingNeumorphism() {
  const [mode, setMode] = useState<Mode>("spinner");
  return (
    <div className="bg-slate-200 p-6 rounded-3xl">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={
                mode === m
                  ? "bg-slate-200 rounded-2xl shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff] text-slate-700 font-semibold px-4 py-2"
                  : "bg-slate-200 rounded-2xl shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] text-slate-700 font-semibold px-4 py-2 active:shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]"
              }
            >
              {m}
            </button>
          ))}
        </div>
        <div className="bg-slate-200 rounded-2xl shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] p-6">
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
    <div role="status" aria-live="polite" className="flex items-center gap-3 text-slate-600">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-500 motion-reduce:animate-none" />
      <span className="text-sm">Loading…</span>
    </div>
  );
}

function Skeleton() {
  return (
    <div aria-busy="true" className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200 shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff] motion-reduce:animate-none" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 animate-pulse rounded-full bg-slate-200 shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff] motion-reduce:animate-none" />
            <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-200 shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff] motion-reduce:animate-none" />
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
      <div className="flex justify-between text-sm text-slate-600">
        <span>Uploading files…</span>
        <span className="tabular-nums text-slate-700">{pct}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]">
        <div
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-full rounded-full bg-slate-400 transition-all duration-500"
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
      className="inline-flex w-40 items-center justify-center gap-2 bg-slate-200 rounded-2xl shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] text-slate-700 font-semibold px-4 py-2 active:shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff] disabled:opacity-70"
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-500 motion-reduce:animate-none" />
      )}
      {loading ? "Saving…" : "Save changes"}
    </button>
  );
}
