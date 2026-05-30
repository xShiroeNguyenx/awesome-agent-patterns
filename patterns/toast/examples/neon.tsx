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
  success: "border-cyan-400 bg-slate-900 text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.35)]",
  error: "border-fuchsia-400 bg-slate-900 text-fuchsia-300 shadow-[0_0_18px_rgba(232,121,249,0.35)]",
  info: "border-cyan-400 bg-slate-900 text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.35)]",
  warning: "border-fuchsia-400 bg-slate-900 text-fuchsia-300 shadow-[0_0_18px_rgba(232,121,249,0.35)]",
};

const ICONS: Record<Variant, string> = {
  success: "✓",
  error: "✕",
  info: "i",
  warning: "!",
};

export default function ToastNeon() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function push(variant: Variant) {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, variant, message: MESSAGES[variant] }]);
  }

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="relative min-h-[12rem] bg-slate-950 p-6 rounded-xl">
      <div className="flex flex-wrap gap-2">
        {VARIANTS.map((v) => (
          <button
            key={v}
            onClick={() => push(v)}
            className="border border-cyan-400 bg-cyan-400/10 px-3 py-1.5 font-medium text-cyan-200 rounded-md shadow-[0_0_12px_rgba(34,211,238,0.5)] transition hover:bg-cyan-400/20"
          >
            Show {v}
          </button>
        ))}
      </div>

      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none absolute right-4 top-4 z-50 flex w-80 max-w-[90vw] flex-col gap-2"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timer: ReturnType<typeof setTimeout> = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 ${STYLES[toast.variant]}`}
    >
      <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border border-current bg-slate-950 text-xs font-bold drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]">
        {ICONS[toast.variant]}
      </span>
      <p className="flex-1 text-sm">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss"
        className="flex-none rounded text-lg leading-none opacity-70 transition hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      >
        ×
      </button>
    </div>
  );
}
