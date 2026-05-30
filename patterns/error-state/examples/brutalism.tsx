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
      className="inline-flex items-center gap-2 rounded-none border-2 border-black bg-yellow-300 px-4 py-2 text-sm font-bold text-black shadow-[4px_4px_0_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#000] focus:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-70"
    >
      {retrying && <Spinner />}
      {retrying ? "Retrying…" : "Retry"}
    </button>
  );
}

export default function ErrorStateBrutalism() {
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
    <div className="bg-yellow-50 p-5">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-none border-2 border-black px-3 py-1.5 text-sm font-bold text-black transition ${
                mode === m
                  ? "bg-pink-400 shadow-[4px_4px_0_0_#000]"
                  : "bg-white shadow-[2px_2px_0_0_#000] hover:bg-lime-300"
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
            className="flex flex-col items-center rounded-none border-2 border-black bg-white px-6 py-16 text-center shadow-[6px_6px_0_0_#000] focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-none border-2 border-black bg-pink-400 text-black">
              <AlertIcon />
            </div>
            <h3 className="mt-4 text-lg font-extrabold uppercase tracking-tight text-black">Something went wrong</h3>
            <p className="mt-1 max-w-sm text-sm font-medium text-black">
              We couldn&apos;t load this page. Check your connection and try again.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <RetryButton retrying={false} onRetry={handleRetry} />
              <button className="rounded-none border-2 border-black bg-cyan-300 px-4 py-2 text-sm font-bold text-black shadow-[4px_4px_0_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#000] focus:outline-none focus-visible:ring-2 focus-visible:ring-black">
                Go back
              </button>
            </div>
          </div>
        ) : (
          <div
            ref={alertRef}
            role="alert"
            tabIndex={-1}
            className="flex items-start gap-3 rounded-none border-2 border-black bg-pink-400 p-4 shadow-[6px_6px_0_0_#000] focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <span className="mt-0.5 text-black">
              <AlertIcon />
            </span>
            <div className="flex-1">
              <p className="font-extrabold uppercase tracking-tight text-black">We couldn&apos;t load your orders.</p>
              <p className="mt-0.5 text-sm font-medium text-black">
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
