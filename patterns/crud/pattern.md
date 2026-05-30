---
id: crud
title: CRUD Screen
category: page
when_to_use: Manage a resource end-to-end - list, search/filter, create, edit and delete with feedback.
tags: [crud, admin, manage, list, create, edit, delete]
composes: [table, search, filter, pagination, modal, toast, empty-state, error-state]
related: [loading]
states: [list, creating, editing, deleting, empty, error]
a11y: [table-semantics, dialog-for-edit, confirm-destructive, status-feedback]
stack: react-ts-tailwind
---

## When to use / when NOT to use

**Use** for the bread-and-butter admin screen that owns one resource — members, products,
API keys — where the user lists them, finds one, creates new ones, edits, and deletes, all in
one place with clear feedback.

**Don't use** a full CRUD screen for a read-only report (a plain [[table]] is enough), for a
wizard-style multi-step creation flow (use a dedicated flow), or when "editing" is really a
rich document — that wants its own editor, not a row in a list.

## States to handle

- **list** — the default: the resource rendered as a semantic [[table]], with a [[search]] box and a [[filter]] control above it, and [[pagination]] when the set is long.
- **creating** — the "Add" action opens a [[modal]] dialog with an empty form; saving appends the record and confirms with a [[toast]].
- **editing** — a row's Edit opens the *same* modal pre-filled with that record; saving updates in place and confirms with a toast.
- **deleting** — a destructive action gated by an explicit confirm step (never a single-click delete), with a toast on success.
- **empty** — when a search or filter matches nothing, show a filter-specific empty state ("No members match…") distinct from a never-had-any state (see [[empty-state]]).
- **error** — a save or load failure surfaces an inline, recoverable error with a retry path rather than a silent no-op (see [[error-state]]).

## UX guidance — Do & Don't

- **Do** reuse one modal form for create and edit; a pre-filled dialog is less to learn than two screens.
- **Do** make the search live and debounced, and keep the filter and pagination state visible so users know why they see what they see.
- **Do** require a deliberate confirm for delete and name the thing being deleted in the prompt.
- **Don't** navigate away to a separate page for a two-field create — an inline modal keeps context.
- **Don't** silently swallow a failed save; show the error and keep the user's input.
- **Don't** show a generic "no data" message for a filtered no-match — it sends users hunting for a bug.

## Accessibility checklist

- The list is a real `<table>` with `<thead>`/`<tbody>` and `<th scope="col">` headers ([[table]] semantics).
- The create/edit dialog is a `role="dialog"` with `aria-modal`, an `aria-label`/labelled heading, and focus moved into it on open and restored on close.
- Destructive confirms are explicit, keyboard-operable, and clearly worded — not relying on color alone.
- Save/delete feedback is announced via a polite live region (`role="status"`) so the toast reaches assistive tech.

## Code (React + TS + Tailwind)

See `examples/Crud.tsx` — a Members management screen: a searchable list rendered as a minimal
semantic table, an **Add** button opening an inline modal form, per-row **Edit** (same modal,
pre-filled) and **Delete** (with a confirm step), a transient **toast** on save/delete, and a
filter-specific **empty** state when the search matches nothing.

## Anti-patterns / common mistakes

- One-click delete with no confirmation, or a confirm that doesn't say *what* is being deleted.
- Separate, divergent forms for create vs. edit that drift out of sync over time.
- A save that fails quietly, losing the user's typed input with no error and no retry.
- Reusing the unfiltered "nothing here yet" empty state for a filtered no-match result.
