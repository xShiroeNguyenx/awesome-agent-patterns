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

export default function ToastNeumorphism() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function push(variant: Variant) {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, variant, message: MESSAGES[variant] }]);
  }

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="relative min-h-[12rem] bg-slate-200 p-6 rounded-3xl">
      <div className="flex flex-wrap gap-2">
        {VARIANTS.map((v) => (
          <button
            key={v}
            onClick={() => push(v)}
            className="bg-slate-200 rounded-2xl shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] text-slate-700 font-semibold px-4 py-2 active:shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]"
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
    <div className="pointer-events-auto flex items-start gap-3 bg-slate-200 rounded-2xl shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] text-slate-600 px-4 py-3">
      <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700 shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]">
        {ICONS[toast.variant]}
      </span>
      <p className="flex-1 text-sm">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss"
        className="flex-none rounded-full bg-slate-200 px-1.5 text-lg leading-none text-slate-700 shadow-[3px_3px_6px_#b0b6c0,-3px_-3px_6px_#ffffff] transition active:shadow-[inset_3px_3px_6px_#b0b6c0,inset_-3px_-3px_6px_#ffffff] focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      >
        ×
      </button>
    </div>
  );
}
