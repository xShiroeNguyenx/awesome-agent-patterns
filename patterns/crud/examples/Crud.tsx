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

export default function CrudExample() {
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Members</h1>
          <p className="text-sm text-slate-500">{members.length} total</p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
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
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyResults query={query} onClear={() => setQuery("")} onAdd={openCreate} />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th scope="col" className="px-4 py-3 text-left font-medium">Name</th>
                <th scope="col" className="px-4 py-3 text-left font-medium">Role</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{m.name}</div>
                    <div className="text-slate-500">{m.email}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{m.role}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(m)} className="text-sky-700 hover:underline">
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmDelete(m)}
                      className="ml-3 text-red-600 hover:underline"
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
          <div className="pointer-events-auto rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg">
            {toast}
          </div>
        )}
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
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/40 p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="member-dialog-title" className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        <h2 id="member-dialog-title" className="text-base font-semibold text-slate-900">
          {member ? "Edit member" : "Add member"}
        </h2>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Name</span>
            <input
              ref={firstFieldRef}
              value={form.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Role</span>
            <select
              value={form.role}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm((f) => ({ ...f, role: e.target.value as Role }))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
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
              className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!valid}
              className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
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
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/40 p-4">
      <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
        <h2 id="confirm-title" className="text-base font-semibold text-slate-900">
          Delete {name}?
        </h2>
        <p className="mt-1 text-sm text-slate-500">This removes the member and can&apos;t be undone.</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
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
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
        <p className="font-medium text-slate-700">No members match &ldquo;{query}&rdquo;</p>
        <p className="mt-1 text-sm text-slate-500">Try a different search.</p>
        <button onClick={onClear} className="mt-4 rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200">
          Clear search
        </button>
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
      <p className="font-medium text-slate-700">No members yet</p>
      <p className="mt-1 text-sm text-slate-500">Add your first teammate to get started.</p>
      <button onClick={onAdd} className="mt-4 rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700">
        Add member
      </button>
    </div>
  );
}
