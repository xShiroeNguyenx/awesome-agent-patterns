---
task: crud-admin-page
title: CRUD admin page
patterns: [table, search, filter, pagination, modal, toast, empty-state, error-state]
tags: [crud, admin, manage, dashboard, resource]
---

## Goal

Manage a resource end-to-end on one screen: list it, find within it, and create / edit / delete
individual records with clear feedback. The bread-and-butter of any admin panel.

## Pattern composition (order matters)

1. **[[table]]** — the resource list with row-level Edit / Delete actions.
2. **[[search]]** + **[[filter]]** — locate records; reset to page 1 on change.
3. **[[pagination]]** — page through the list.
4. **[[modal]]** — the create/edit form opens in a dialog (same form, empty vs pre-filled).
5. **[[toast]]** — confirm "Saved" / "Deleted" without interrupting the list.
6. **[[empty-state]]** — *no records yet* vs *no search matches*.
7. **[[error-state]]** — load failure (inline + Retry) and save failure (in the modal).

## Data/state flow notes

- State: `{ items, query, filters, page, status, editing, confirmingDelete }`.
- "Add" → open modal with empty form; row "Edit" → open same modal pre-filled with that record.
- On save: validate → submit → on success close modal, toast, refetch/patch list; on failure keep modal open and show the error.
- Delete is a **two-step** action (confirm), never a single click.

## Edge cases to not forget

- **Confirm destructive actions** (`[[modal]]` as an `alertdialog`); focus the safe button by default.
- **Disable the submit button while saving** to prevent double-submit.
- **Delete the last row on a page** → step back to the previous page instead of showing blank.
- **Validation errors** belong inside the modal, associated with their fields — not in a toast.
- Don't lose the user's filters/page after a create or edit.
