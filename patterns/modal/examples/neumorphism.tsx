import { useEffect, useRef, useState } from "react";

export default function ModalNeumorphism() {
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
    <div className="space-y-3 rounded-3xl bg-slate-200 p-6">
      <button
        ref={triggerRef}
        onClick={() => {
          setDeleted(false);
          setOpen(true);
        }}
        className="rounded-2xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] transition active:shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]"
      >
        Delete project
      </button>
      {deleted && <p className="text-sm text-slate-600">Project deleted.</p>}
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-400/40 p-4"
      onClick={onCancel}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-slate-200 p-6 shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      >
        <h2 id="modal-title" className="text-lg font-semibold text-slate-700">
          Delete this project?
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          This permanently removes the project and all its data. This action can&apos;t be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={confirming}
            className="rounded-2xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] transition active:shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={confirming}
            aria-busy={confirming}
            className={`inline-flex items-center gap-2 rounded-2xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition disabled:opacity-70 ${
              confirming
                ? "shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]"
                : "shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] active:shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]"
            }`}
          >
            {confirming && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-slate-600 motion-reduce:animate-none" />
            )}
            {confirming ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
