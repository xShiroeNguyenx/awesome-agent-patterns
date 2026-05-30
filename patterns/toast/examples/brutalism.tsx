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
  success: "border-2 border-black bg-lime-300 text-black",
  error: "border-2 border-black bg-pink-400 text-black",
  info: "border-2 border-black bg-cyan-300 text-black",
  warning: "border-2 border-black bg-yellow-300 text-black",
};

const ICONS: Record<Variant, string> = {
  success: "✓",
  error: "✕",
  info: "i",
  warning: "!",
};

export default function ToastBrutalism() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function push(variant: Variant) {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, variant, message: MESSAGES[variant] }]);
  }

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="relative min-h-[12rem] bg-yellow-50 p-5">
      <div className="flex flex-wrap gap-2">
        {VARIANTS.map((v) => (
          <button
            key={v}
            onClick={() => push(v)}
            className="border-2 border-black bg-yellow-300 px-3 py-1.5 font-bold text-black rounded-none shadow-[4px_4px_0_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#000]"
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
      className={`pointer-events-auto flex items-start gap-3 rounded-none px-4 py-3 shadow-[6px_6px_0_0_#000] ${STYLES[toast.variant]}`}
    >
      <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-none border-2 border-black bg-white text-xs font-bold">
        {ICONS[toast.variant]}
      </span>
      <p className="flex-1 text-sm font-bold">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss"
        className="flex-none rounded-none text-lg font-bold leading-none transition hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
      >
        ×
      </button>
    </div>
  );
}
