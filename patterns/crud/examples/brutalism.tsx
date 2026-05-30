import { useEffect, useMemo, useRef, useState } from "react";

type Role = "Admin" | "Editor" | "Viewer";

interface Member {
  id: number;
  name: string;
  email: string;
  role: Role;
}

interface FormState {
  name: string;
  email: string;
  role: Role;
}

const SEED: Member[] = [
  { id: 1, name: "Ava Nguyen", email: "ava@example.com", role: "Admin" },
  { id: 2, name: "Minh Tran", email: "minh@example.com", role: "Editor" },
  { id: 3, name: "Linh Pham", email: "linh@example.com", role: "Viewer" },
  { id: 4, name: "Khoa Le", email: "khoa@example.com", role: "Editor" },
];

const ROLES: Role[] = ["Admin", "Editor", "Viewer"];
const EMPTY_FORM: FormState = { name: "", email: "", role: "Viewer" };

export default function CrudBrutalism() {
  const [members, setMembers] = useState<Member[]>(SEED);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Member | null>(null); // null + open => create
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Member | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Auto-dismiss the toast banner.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q));
  }, [members, query]);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(m: Member) {
    setEditing(m);
    setModalOpen(true);
  }

  function handleSave(form: FormState) {
    if (editing) {
      setMembers((prev) => prev.map((m) => (m.id === editing.id ? { ...m, ...form } : m)));
      setToast(`Saved changes to ${form.name}`);
    } else {
      const id = members.reduce((max, m) => Math.max(max, m.id), 0) + 1;
      setMembers((prev) => [...prev, { id, ...form }]);
      setToast(`Added ${form.name}`);
    }
    setModalOpen(false);
    setEditing(null);
  }

  function handleDelete() {
    if (!confirmDelete) return;
    const name = confirmDelete.name;
    setMembers((prev) => prev.filter((m) => m.id !== confirmDelete.id));
    setConfirmDelete(null);
    setToast(`Deleted ${name}`);
  }

  return (
    <div className="bg-yellow-50 p-5">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-extrabold uppercase tracking-tight text-black">Members</h1>
            <p className="text-sm font-bold text-black">{members.length} total</p>
          </div>
          <button
            onClick={openCreate}
            className="border-2 border-black bg-yellow-300 px-3 py-1.5 font-bold text-black rounded-none shadow-[4px_4px_0_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#000]"
          >
            Add member
          </button>
        </div>

        {/* Search ([[search]]) */}
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            placeholder="Search by name or email…"
            aria-label="Search members"
            className="w-full border-2 border-black rounded-none px-3 py-2 text-sm text-black placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyResults query={query} onClear={() => setQuery("")} onAdd={openCreate} />
        ) : (
          <div className="overflow-x-auto border-2 border-black bg-white rounded-none shadow-[6px_6px_0_0_#000]">
            <table className="w-full border-collapse text-sm">
              <thead className="border-b-2 border-black bg-lime-300 text-black">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left font-extrabold uppercase tracking-tight">Name</th>
                  <th scope="col" className="px-4 py-3 text-left font-extrabold uppercase tracking-tight">Role</th>
                  <th scope="col" className="px-4 py-3 text-right font-extrabold uppercase tracking-tight">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-yellow-100">
                    <td className="px-4 py-3">
                      <div className="font-bold text-black">{m.name}</div>
                      <div className="text-black/70">{m.email}</div>
                    </td>
                    <td className="px-4 py-3 text-black">
                      <span className="inline-block border-2 border-black bg-cyan-300 px-2 py-0.5 text-xs font-bold text-black">
                        {m.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(m)} className="font-bold text-black underline decoration-2 hover:bg-lime-300">
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmDelete(m)}
                        className="ml-3 font-bold text-black underline decoration-2 hover:bg-pink-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {modalOpen && (
          <MemberModal
            member={editing}
            onCancel={() => {
              setModalOpen(false);
              setEditing(null);
            }}
            onSave={handleSave}
          />
        )}

        {confirmDelete && (
          <ConfirmDialog
            name={confirmDelete.name}
            onCancel={() => setConfirmDelete(null)}
            onConfirm={handleDelete}
          />
        )}

        {/* Toast banner ([[toast]]) — announced politely */}
        <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 flex justify-center">
          {toast && (
            <div className="pointer-events-auto border-2 border-black bg-yellow-300 px-4 py-2 text-sm font-bold text-black rounded-none shadow-[4px_4px_0_0_#000]">
              {toast}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MemberModal({
  member,
  onCancel,
  onSave,
}: {
  member: Member | null;
  onCancel: () => void;
  onSave: (form: FormState) => void;
}) {
  const [form, setForm] = useState<FormState>(
    member ? { name: member.name, email: member.email, role: member.role } : EMPTY_FORM,
  );
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Move focus into the dialog on open.
  useEffect(() => {
    firstFieldRef.current?.focus();
  }, []);

  const valid = form.name.trim().length > 0 && /.+@.+\..+/.test(form.email);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    onSave({ ...form, name: form.name.trim(), email: form.email.trim() });
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/30 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-dialog-title"
        className="w-full max-w-md border-2 border-black bg-white p-5 rounded-none shadow-[6px_6px_0_0_#000]"
      >
        <h2 id="member-dialog-title" className="text-base font-extrabold uppercase tracking-tight text-black">
          {member ? "Edit member" : "Add member"}
        </h2>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <label className="block">
            <span className="text-sm font-bold text-black">Name</span>
            <input
              ref={firstFieldRef}
              value={form.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1 w-full border-2 border-black rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-black">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="mt-1 w-full border-2 border-black rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-black">Role</span>
            <select
              value={form.role}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm((f) => ({ ...f, role: e.target.value as Role }))}
              className="mt-1 w-full border-2 border-black rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="border-2 border-black bg-white px-3 py-1.5 font-bold text-black rounded-none shadow-[3px_3px_0_0_#000] transition hover:bg-cyan-300 active:shadow-[1px_1px_0_0_#000]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!valid}
              className="border-2 border-black bg-yellow-300 px-3 py-1.5 font-bold text-black rounded-none shadow-[4px_4px_0_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#000] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_0_#000]"
            >
              {member ? "Save changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmDialog({
  name,
  onCancel,
  onConfirm,
}: {
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-sm border-2 border-black bg-white p-5 rounded-none shadow-[6px_6px_0_0_#000]"
      >
        <h2 id="confirm-title" className="text-base font-extrabold uppercase tracking-tight text-black">
          Delete {name}?
        </h2>
        <p className="mt-1 text-sm font-bold text-black">This removes the member and can&apos;t be undone.</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="border-2 border-black bg-white px-3 py-1.5 font-bold text-black rounded-none shadow-[3px_3px_0_0_#000] transition hover:bg-cyan-300 active:shadow-[1px_1px_0_0_#000]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="border-2 border-black bg-pink-400 px-3 py-1.5 font-bold text-black rounded-none shadow-[4px_4px_0_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#000]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyResults({ query, onClear, onAdd }: { query: string; onClear: () => void; onAdd: () => void }) {
  if (query.trim()) {
    return (
      <div className="border-2 border-black bg-white p-10 text-center rounded-none shadow-[6px_6px_0_0_#000]">
        <p className="font-extrabold uppercase tracking-tight text-black">No members match &ldquo;{query}&rdquo;</p>
        <p className="mt-1 text-sm font-bold text-black">Try a different search.</p>
        <button
          onClick={onClear}
          className="mt-4 border-2 border-black bg-white px-3 py-1.5 font-bold text-black rounded-none shadow-[3px_3px_0_0_#000] transition hover:bg-cyan-300 active:shadow-[1px_1px_0_0_#000]"
        >
          Clear search
        </button>
      </div>
    );
  }
  return (
    <div className="border-2 border-black bg-white p-10 text-center rounded-none shadow-[6px_6px_0_0_#000]">
      <p className="font-extrabold uppercase tracking-tight text-black">No members yet</p>
      <p className="mt-1 text-sm font-bold text-black">Add your first teammate to get started.</p>
      <button
        onClick={onAdd}
        className="mt-4 border-2 border-black bg-yellow-300 px-3 py-1.5 font-bold text-black rounded-none shadow-[4px_4px_0_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#000]"
      >
        Add member
      </button>
    </div>
  );
}
