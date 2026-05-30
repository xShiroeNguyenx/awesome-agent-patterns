import { useEffect, useState } from "react";

type Mode = "spinner" | "skeleton" | "progress" | "button-loading";

const MODES: Mode[] = ["spinner", "skeleton", "progress", "button-loading"];

export default function LoadingBrutalism() {
  const [mode, setMode] = useState<Mode>("spinner");
  return (
    <div className="bg-yellow-50 p-5">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={
                mode === m
                  ? "border-2 border-black bg-yellow-300 px-3 py-1.5 font-bold text-black rounded-none shadow-[4px_4px_0_0_#000]"
                  : "border-2 border-black bg-white px-3 py-1.5 font-bold text-black rounded-none shadow-[4px_4px_0_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#000]"
              }
            >
              {m}
            </button>
          ))}
        </div>
        <div className="border-2 border-black bg-white rounded-none shadow-[6px_6px_0_0_#000] p-6">
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
    <div role="status" aria-live="polite" className="flex items-center gap-3 text-black">
      <span className="h-6 w-6 animate-spin rounded-none border-2 border-black border-t-pink-400 motion-reduce:animate-none" />
      <span className="text-sm font-bold">Loading…</span>
    </div>
  );
}

function Skeleton() {
  return (
    <div aria-busy="true" className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-10 w-10 animate-pulse rounded-none border-2 border-black bg-cyan-300 motion-reduce:animate-none" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 animate-pulse rounded-none border-2 border-black bg-lime-300 motion-reduce:animate-none" />
            <div className="h-3 w-2/3 animate-pulse rounded-none border-2 border-black bg-white motion-reduce:animate-none" />
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
      <div className="flex justify-between text-sm font-bold text-black">
        <span>Uploading files…</span>
        <span className="tabular-nums">{pct}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-none border-2 border-black bg-white">
        <div
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-full rounded-none bg-pink-400 transition-all duration-500"
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
      className="inline-flex w-40 items-center justify-center gap-2 border-2 border-black bg-yellow-300 px-3 py-1.5 font-bold text-black rounded-none shadow-[4px_4px_0_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#000] disabled:opacity-70"
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-none border-2 border-black border-t-pink-400 motion-reduce:animate-none" />
      )}
      {loading ? "Saving…" : "Save changes"}
    </button>
  );
}
