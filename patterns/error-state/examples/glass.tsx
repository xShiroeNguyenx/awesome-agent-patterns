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
      className="inline-flex items-center gap-2 rounded-xl border border-white/50 bg-white/25 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {retrying && <Spinner />}
      {retrying ? "Retrying…" : "Retry"}
    </button>
  );
}

export default function ErrorStateGlass() {
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
    <div className="rounded-2xl bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-500 p-6">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-xl border border-white/50 px-3 py-1.5 text-sm font-medium text-white backdrop-blur transition ${
                mode === m ? "bg-white/40" : "bg-white/20 hover:bg-white/30"
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
            className="flex flex-col items-center rounded-2xl border border-white/40 bg-white/15 px-6 py-16 text-center text-white shadow-xl backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/50 bg-white/25 text-white backdrop-blur">
              <AlertIcon />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">Something went wrong</h3>
            <p className="mt-1 max-w-sm text-sm text-white/70">
              We couldn&apos;t load this page. Check your connection and try again.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <RetryButton retrying={false} onRetry={handleRetry} />
              <button className="rounded-xl border border-white/40 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
                Go back
              </button>
            </div>
          </div>
        ) : (
          <div
            ref={alertRef}
            role="alert"
            tabIndex={-1}
            className="flex items-start gap-3 rounded-2xl border border-white/40 bg-white/15 p-4 text-white shadow-xl backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <span className="mt-0.5 text-white">
              <AlertIcon />
            </span>
            <div className="flex-1">
              <p className="font-medium text-white">We couldn&apos;t load your orders.</p>
              <p className="mt-0.5 text-sm text-white/70">
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
