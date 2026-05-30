import { useEffect, useRef, useState } from "react";

type Mode = "inline" | "full-page" | "retrying";

const MODES: Mode[] = ["inline", "full-page", "retrying"];

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-6 w-6" aria-hidden="true">
      <path d="M12 9v4" strokeLinecap="round" />
      <path d="M12 17h.01" strokeLinecap="round" />
      <path d="M10.3 4.3 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z" strokeLinejoin="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 animate-spin" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={3} className="opacity-25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
}

function RetryButton({ retrying, onRetry }: { retrying: boolean; onRetry: () => void }) {
  return (
    <button
      onClick={onRetry}
      disabled={retrying}
      className="inline-flex items-center gap-2 rounded-md border border-cyan-400 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.5)] transition hover:bg-cyan-400/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {retrying && <Spinner />}
      {retrying ? "Retrying…" : "Retry"}
    </button>
  );
}

export default function ErrorStateNeon() {
  const [mode, setMode] = useState<Mode>("inline");
  const retrying = mode === "retrying";
  const alertRef = useRef<HTMLDivElement>(null);

  // SSR-safe: focus only happens after mount, inside an effect.
  useEffect(() => {
    alertRef.current?.focus();
  }, [mode]);

  function handleRetry() {
    setMode("retrying");
  }

  return (
    <div className="rounded-xl bg-slate-950 p-6">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
                mode === m
                  ? "border-cyan-400 bg-cyan-400/20 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                  : "border-cyan-500/40 bg-slate-900 text-slate-300 hover:bg-cyan-400/10"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {mode === "full-page" ? (
          <div
            ref={alertRef}
            role="alert"
            tabIndex={-1}
            className="flex flex-col items-center rounded-lg border border-fuchsia-400/50 bg-slate-900 px-6 py-16 text-center text-slate-100 shadow-[0_0_18px_rgba(232,121,249,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-fuchsia-400 bg-fuchsia-400/10 text-fuchsia-300 shadow-[0_0_12px_rgba(232,121,249,0.5)]">
              <AlertIcon />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-fuchsia-300 drop-shadow-[0_0_6px_rgba(232,121,249,0.8)]">
              Something went wrong
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-400">
              We couldn&apos;t load this page. Check your connection and try again.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <RetryButton retrying={false} onRetry={handleRetry} />
              <button className="rounded-md border border-cyan-500/40 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-cyan-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
                Go back
              </button>
            </div>
          </div>
        ) : (
          <div
            ref={alertRef}
            role="alert"
            tabIndex={-1}
            className="flex items-start gap-3 rounded-lg border border-fuchsia-400/50 bg-slate-900 p-4 text-slate-100 shadow-[0_0_18px_rgba(232,121,249,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400"
          >
            <span className="mt-0.5 text-fuchsia-300 drop-shadow-[0_0_6px_rgba(232,121,249,0.8)]">
              <AlertIcon />
            </span>
            <div className="flex-1">
              <p className="font-medium text-fuchsia-300 drop-shadow-[0_0_6px_rgba(232,121,249,0.8)]">
                We couldn&apos;t load your orders.
              </p>
              <p className="mt-0.5 text-sm text-slate-400">
                {retrying ? "Reconnecting and trying your request again…" : "The request failed. You can try again."}
              </p>
              <div className="mt-3">
                <RetryButton retrying={retrying} onRetry={handleRetry} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
