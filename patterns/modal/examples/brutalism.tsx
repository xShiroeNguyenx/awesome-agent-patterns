import { useEffect, useRef, useState } from "react";

export default function ModalBrutalism() {
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
    <div className="space-y-3 bg-yellow-50 p-5">
      <button
        ref={triggerRef}
        onClick={() => {
          setDeleted(false);
          setOpen(true);
        }}
        className="rounded-none border-2 border-black bg-pink-400 px-3 py-1.5 text-sm font-bold text-black shadow-[4px_4px_0_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#000]"
      >
        Delete project
      </button>
      {deleted && <p className="text-sm font-bold text-black">Project deleted.</p>}
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onCancel}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-none border-2 border-black bg-white p-6 shadow-[6px_6px_0_0_#000] outline-none focus-visible:ring-2 focus-visible:ring-black"
      >
        <h2 id="modal-title" className="text-lg font-extrabold uppercase tracking-tight text-black">
          Delete this project?
        </h2>
        <p className="mt-2 text-sm font-medium text-black">
          This permanently removes the project and all its data. This action can&apos;t be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={confirming}
            className="rounded-none border-2 border-black bg-cyan-300 px-3 py-1.5 text-sm font-bold text-black shadow-[4px_4px_0_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#000] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={confirming}
            aria-busy={confirming}
            className="inline-flex items-center gap-2 rounded-none border-2 border-black bg-pink-400 px-3 py-1.5 text-sm font-bold text-black shadow-[4px_4px_0_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#000] disabled:opacity-70"
          >
            {confirming && (
              <span className="h-4 w-4 animate-spin rounded-none border-2 border-black border-t-transparent motion-reduce:animate-none" />
            )}
            {confirming ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
