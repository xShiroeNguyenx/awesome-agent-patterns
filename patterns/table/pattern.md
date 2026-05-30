---
id: table
title: Data Table
category: data-display
when_to_use: Display many structured records as rows/columns with sorting, selection and row actions.
tags: [table, data, grid, sorting, selection, rows, columns]
composes: []
related: [pagination, filter, search, empty-state, error-state, loading]
states: [loading, empty, error, populated]
a11y: [semantic-table, scope-th, aria-sort, keyboard-nav, focus-visible]
stack: react-ts-tailwind
---

## When to use / when NOT to use

**Use** when users need to scan, compare, sort, or act on many records along shared attributes
(users, orders, invoices). Tables make column-to-column comparison easy.

**Don't use** for a handful of rich items (use cards), for a single record (use a description list),
or on narrow mobile screens without a responsive strategy (stacked cards or horizontal scroll).

## States to handle

- **loading** — show a skeleton with the same column layout so the page doesn't jump. Never a bare spinner that hides the structure.
- **empty** — distinguish *no data yet* from *no results for this filter*; give the right call to action (see [[empty-state]]).
- **error** — show an inline error with a Retry action; keep the header visible (see [[error-state]]).
- **populated** — the data. Above ~25 rows, pair with [[pagination]]; pair filtering/search with [[filter]] / [[search]].

## UX guidance — Do & Don't

- **Do** keep column headers visible (sticky header) for long tables.
- **Do** right-align numbers, left-align text, and use tabular-nums for figures.
- **Do** make the whole row's primary action obvious; keep destructive actions out of easy mis-click range.
- **Don't** put more than ~7 columns on screen at once — hide secondary data behind a row expand or detail view.
- **Don't** reset the user's scroll/sort/selection on a background refresh.
- **Don't** paginate *and* infinite-scroll at the same time.

## Accessibility checklist

- Use a real `<table>` with `<thead>`/`<tbody>`, `<th scope="col">` for headers.
- Sortable headers are `<button>`s inside `<th>` and expose `aria-sort` (`ascending`/`descending`/`none`).
- Row selection checkboxes have accessible labels (`aria-label="Select {name}"`); the header checkbox toggles all.
- Ensure visible focus rings and full keyboard operability of every interactive cell.

## Code (React + TS + Tailwind)

See `examples/Table.tsx` — a self-contained table with a live state switcher
(`populated / loading / empty / error`), sortable columns, and select-all + per-row selection.

## Anti-patterns / common mistakes

- Rendering a `<div>` grid instead of a semantic `<table>` (breaks screen readers and copy/paste).
- A single global spinner that collapses the layout while loading (causes layout shift).
- Showing the same "No data" message for an unfiltered empty set and a filtered no-match set.
- Sorting only the current page instead of the full dataset, silently misleading the user.
