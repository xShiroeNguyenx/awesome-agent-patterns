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

const ICONS: Record<Variant, string> = {
  success: "✓",
  error: "✕",
  info: "i",
  warning: "!",
};

export default function ToastGlass() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function push(variant: Variant) {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, variant, message: MESSAGES[variant] }]);
  }

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="relative min-h-[12rem] bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-500 p-6 rounded-2xl">
      <div className="flex flex-wrap gap-2">
        {VARIANTS.map((v) => (
          <button
            key={v}
            onClick={() => push(v)}
            className="border border-white/50 bg-white/25 px-3 py-1.5 font-medium text-white rounded-xl backdrop-blur transition hover:bg-white/40"
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
    <div className="pointer-events-auto flex items-start gap-3 border border-white/40 bg-white/15 backdrop-blur-md rounded-2xl shadow-xl text-white px-4 py-3">
      <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border border-white/50 bg-white/25 text-xs font-bold backdrop-blur">
        {ICONS[toast.variant]}
      </span>
      <p className="flex-1 text-sm">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss"
        className="flex-none rounded text-lg leading-none text-white/70 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      >
        ×
      </button>
    </div>
  );
}
