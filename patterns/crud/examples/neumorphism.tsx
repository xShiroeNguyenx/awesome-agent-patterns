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

export default function CrudNeumorphism() {
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
    <div className="bg-slate-200 p-6 rounded-3xl">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-700">Members</h1>
            <p className="text-sm text-slate-600">{members.length} total</p>
          </div>
          <button
            onClick={openCreate}
            className="bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-2xl shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] transition active:shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]"
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
            className="w-full bg-slate-200 text-slate-700 placeholder:text-slate-500 rounded-2xl px-3 py-2 text-sm shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff] focus:outline-none"
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyResults query={query} onClear={() => setQuery("")} onAdd={openCreate} />
        ) : (
          <div className="overflow-x-auto bg-slate-200 rounded-2xl shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff]">
            <table className="w-full border-collapse text-sm">
              <thead className="text-slate-600">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left font-medium">Name</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium">Role</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-700">{m.name}</div>
                      <div className="text-slate-500">{m.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{m.role}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEdit(m)}
                        className="rounded-xl bg-slate-200 px-2.5 py-1 text-slate-700 shadow-[3px_3px_6px_#b0b6c0,-3px_-3px_6px_#ffffff] transition active:shadow-[inset_3px_3px_6px_#b0b6c0,inset_-3px_-3px_6px_#ffffff]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmDelete(m)}
                        className="ml-3 rounded-xl bg-slate-200 px-2.5 py-1 text-slate-700 shadow-[3px_3px_6px_#b0b6c0,-3px_-3px_6px_#ffffff] transition active:shadow-[inset_3px_3px_6px_#b0b6c0,inset_-3px_-3px_6px_#ffffff]"
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
            <div className="pointer-events-auto bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 rounded-2xl shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff]">
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
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-slate-400/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-dialog-title"
        className="w-full max-w-md bg-slate-200 rounded-2xl shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] p-5"
      >
        <h2 id="member-dialog-title" className="text-base font-semibold text-slate-700">
          {member ? "Edit member" : "Add member"}
        </h2>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <label className="block">
            <span className="text-sm font-medium text-slate-600">Name</span>
            <input
              ref={firstFieldRef}
              value={form.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1 w-full bg-slate-200 text-slate-700 rounded-2xl px-3 py-2 text-sm shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff] focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-600">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="mt-1 w-full bg-slate-200 text-slate-700 rounded-2xl px-3 py-2 text-sm shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff] focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-600">Role</span>
            <select
              value={form.role}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm((f) => ({ ...f, role: e.target.value as Role }))}
              className="mt-1 w-full bg-slate-200 text-slate-700 rounded-2xl px-3 py-2 text-sm shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff] focus:outline-none"
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
              className="bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-2xl shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] transition active:shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!valid}
              className="bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-2xl shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] transition active:shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff] disabled:cursor-not-allowed disabled:opacity-40"
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
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-400/40 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-sm bg-slate-200 rounded-2xl shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] p-5"
      >
        <h2 id="confirm-title" className="text-base font-semibold text-slate-700">
          Delete {name}?
        </h2>
        <p className="mt-1 text-sm text-slate-600">This removes the member and can&apos;t be undone.</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-2xl shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] transition active:shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-2xl shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff] transition active:shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff]"
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
      <div className="bg-slate-200 rounded-2xl shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff] p-10 text-center">
        <p className="font-medium text-slate-700">No members match &ldquo;{query}&rdquo;</p>
        <p className="mt-1 text-sm text-slate-600">Try a different search.</p>
        <button
          onClick={onClear}
          className="mt-4 bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-2xl shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] transition active:shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]"
        >
          Clear search
        </button>
      </div>
    );
  }
  return (
    <div className="bg-slate-200 rounded-2xl shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff] p-10 text-center">
      <p className="font-medium text-slate-700">No members yet</p>
      <p className="mt-1 text-sm text-slate-600">Add your first teammate to get started.</p>
      <button
        onClick={onAdd}
        className="mt-4 bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-2xl shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] transition active:shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]"
      >
        Add member
      </button>
    </div>
  );
}
