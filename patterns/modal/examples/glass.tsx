import { useEffect, useRef, useState } from "react";

export default function ModalGlass() {
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
    <div className="space-y-3 rounded-2xl bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-500 p-6">
      <button
        ref={triggerRef}
        onClick={() => {
          setDeleted(false);
          setOpen(true);
        }}
        className="rounded-xl border border-white/50 bg-white/25 px-3 py-1.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/40"
      >
        Delete project
      </button>
      {deleted && <p className="text-sm text-white/70">Project deleted.</p>}
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-white/40 bg-white/15 p-6 text-white shadow-xl outline-none backdrop-blur-md focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <h2 id="modal-title" className="text-lg font-semibold text-white">
          Delete this project?
        </h2>
        <p className="mt-2 text-sm text-white/70">
          This permanently removes the project and all its data. This action can&apos;t be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={confirming}
            className="rounded-xl border border-white/40 bg-white/20 px-3 py-1.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/40 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={confirming}
            aria-busy={confirming}
            className="inline-flex items-center gap-2 rounded-xl border border-white/50 bg-white/25 px-3 py-1.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/40 disabled:opacity-70"
          >
            {confirming && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" />
            )}
            {confirming ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
