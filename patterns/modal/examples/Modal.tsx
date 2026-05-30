import { useEffect, useRef, useState } from "react";

export default function ModalExample() {
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
    <div className="space-y-3">
      <button
        ref={triggerRef}
        onClick={() => {
          setDeleted(false);
          setOpen(true);
        }}
        className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
      >
        Delete project
      </button>
      {deleted && <p className="text-sm text-slate-500">Project deleted.</p>}
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onCancel}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        <h2 id="modal-title" className="text-lg font-semibold text-slate-900">
          Delete this project?
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          This permanently removes the project and all its data. This action can&apos;t be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={confirming}
            className="rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={confirming}
            aria-busy={confirming}
            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-70"
          >
            {confirming && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-white motion-reduce:animate-none" />
            )}
            {confirming ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
