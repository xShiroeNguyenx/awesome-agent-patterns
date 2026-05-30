import { useEffect, useRef, useState } from "react";

export default function ModalNeon() {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function close() {
    if (confirming) return;
    setOpen(false);
    triggerRef.current?.focus();
  }

  function confirm() {
    setConfirming(true);
  }

  // Drive the "confirming" busy state, then resolve. Timer in an effect for SSR safety.
  useEffect(() => {
    if (!confirming) return;
    const id = setTimeout(() => {
      setConfirming(false);
      setOpen(false);
      setDeleted(true);
      triggerRef.current?.focus();
    }, 1200);
    return () => clearTimeout(id);
  }, [confirming]);

  return (
    <div className="space-y-3 rounded-xl bg-slate-950 p-6">
      <button
        ref={triggerRef}
        onClick={() => {
          setDeleted(false);
          setOpen(true);
        }}
        className="rounded-md border border-fuchsia-400 bg-fuchsia-400/10 px-3 py-1.5 text-sm font-medium text-fuchsia-300 shadow-[0_0_12px_rgba(232,121,249,0.5)] transition hover:bg-fuchsia-400/20"
      >
        Delete project
      </button>
      {deleted && <p className="text-sm text-slate-400">Project deleted.</p>}
      {open && <ConfirmDialog confirming={confirming} onCancel={close} onConfirm={confirm} />}
    </div>
  );
}

function ConfirmDialog({
  confirming,
  onCancel,
  onConfirm,
}: {
  confirming: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Move focus into the dialog on open, and wire ESC-to-close. Effect only — SSR-safe.
  useEffect(() => {
    dialogRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
      onClick={onCancel}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-lg border border-cyan-500/50 bg-slate-900 p-6 text-slate-100 shadow-[0_0_18px_rgba(34,211,238,0.35)] outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      >
        <h2
          id="modal-title"
          className="text-lg font-semibold text-cyan-200 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]"
        >
          Delete this project?
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          This permanently removes the project and all its data. This action can&apos;t be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={confirming}
            className="rounded-md border border-cyan-400 bg-cyan-400/10 px-3 py-1.5 text-sm font-medium text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.5)] transition hover:bg-cyan-400/20 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={confirming}
            aria-busy={confirming}
            className="inline-flex items-center gap-2 rounded-md border border-fuchsia-400 bg-fuchsia-400/10 px-3 py-1.5 text-sm font-medium text-fuchsia-300 shadow-[0_0_12px_rgba(232,121,249,0.5)] transition hover:bg-fuchsia-400/20 disabled:opacity-70"
          >
            {confirming && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-fuchsia-400/30 border-t-fuchsia-300 motion-reduce:animate-none" />
            )}
            {confirming ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
