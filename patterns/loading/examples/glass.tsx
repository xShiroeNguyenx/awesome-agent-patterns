import { useEffect, useState } from "react";

type Mode = "spinner" | "skeleton" | "progress" | "button-loading";

const MODES: Mode[] = ["spinner", "skeleton", "progress", "button-loading"];

export default function LoadingGlass() {
  const [mode, setMode] = useState<Mode>("spinner");
  return (
    <div className="bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-500 p-6 rounded-2xl">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={
                mode === m
                  ? "border border-white/50 bg-white/40 px-3 py-1.5 font-medium text-white rounded-xl backdrop-blur transition hover:bg-white/40"
                  : "border border-white/50 bg-white/25 px-3 py-1.5 font-medium text-white rounded-xl backdrop-blur transition hover:bg-white/40"
              }
            >
              {m}
            </button>
          ))}
        </div>
        <div className="border border-white/40 bg-white/15 backdrop-blur-md rounded-2xl shadow-xl text-white p-6">
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
    <div role="status" aria-live="polite" className="flex items-center gap-3 text-white">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none" />
      <span className="text-sm">Loading…</span>
    </div>
  );
}

function Skeleton() {
  return (
    <div aria-busy="true" className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-10 w-10 animate-pulse rounded-full bg-white/30 motion-reduce:animate-none" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 animate-pulse rounded bg-white/30 motion-reduce:animate-none" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-white/20 motion-reduce:animate-none" />
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
      <div className="flex justify-between text-sm text-white/70">
        <span>Uploading files…</span>
        <span className="tabular-nums">{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
        <div
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-full rounded-full bg-white transition-all duration-500"
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
      className="inline-flex w-40 items-center justify-center gap-2 border border-white/50 bg-white/25 px-3 py-1.5 font-medium text-white rounded-xl backdrop-blur transition hover:bg-white/40 disabled:opacity-70"
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none" />
      )}
      {loading ? "Saving…" : "Save changes"}
    </button>
  );
}
