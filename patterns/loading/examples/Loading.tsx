import { useEffect, useState } from "react";

type Mode = "spinner" | "skeleton" | "progress" | "button-loading";

const MODES: Mode[] = ["spinner", "skeleton", "progress", "button-loading"];

export default function LoadingExample() {
  const [mode, setMode] = useState<Mode>("spinner");
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              mode === m
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="rounded-lg border border-slate-200 p-6">
        {mode === "spinner" && <Spinner />}
        {mode === "skeleton" && <Skeleton />}
        {mode === "progress" && <Progress />}
        {mode === "button-loading" && <LoadingButton />}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div role="status" aria-live="polite" className="flex items-center gap-3 text-slate-600">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-sky-600 motion-reduce:animate-none" />
      <span className="text-sm">Loading…</span>
    </div>
  );
}

function Skeleton() {
  return (
    <div aria-busy="true" className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200 motion-reduce:animate-none" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100 motion-reduce:animate-none" />
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
        <span className="tabular-nums">{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-full rounded-full bg-sky-600 transition-all duration-500"
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
      className="inline-flex w-36 items-center justify-center gap-2 rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-700 disabled:opacity-70"
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-sky-200 border-t-white motion-reduce:animate-none" />
      )}
      {loading ? "Saving…" : "Save changes"}
    </button>
  );
}
