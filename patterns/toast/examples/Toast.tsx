import { useEffect, useState } from "react";

type Variant = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  variant: Variant;
  message: string;
}

const VARIANTS: Variant[] = ["success", "error", "info", "warning"];

const MESSAGES: Record<Variant, string> = {
  success: "Changes saved successfully.",
  error: "Couldn't save changes. Try again.",
  info: "A new version is available.",
  warning: "You're offline; changes will sync later.",
};

const STYLES: Record<Variant, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-red-200 bg-red-50 text-red-800",
  info: "border-sky-200 bg-sky-50 text-sky-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
};

const ICONS: Record<Variant, string> = {
  success: "✓",
  error: "✕",
  info: "i",
  warning: "!",
};

export default function ToastExample() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function push(variant: Variant) {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, variant, message: MESSAGES[variant] }]);
  }

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="relative min-h-[12rem]">
      <div className="flex flex-wrap gap-2">
        {VARIANTS.map((v) => (
          <button
            key={v}
            onClick={() => push(v)}
            className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Show {v}
          </button>
        ))}
      </div>

      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed right-4 top-4 z-50 flex w-80 max-w-[90vw] flex-col gap-2"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  // Auto-dismiss timer lives in an effect so SSR never schedules it; cleared on unmount.
  useEffect(() => {
    const timer: ReturnType<typeof setTimeout> = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 shadow-sm ${STYLES[toast.variant]}`}
    >
      <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-white/70 text-xs font-bold">
        {ICONS[toast.variant]}
      </span>
      <p className="flex-1 text-sm">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss"
        className="flex-none rounded text-lg leading-none opacity-70 transition hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      >
        ×
      </button>
    </div>
  );
}
