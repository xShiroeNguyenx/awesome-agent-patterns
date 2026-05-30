---
id: pagination
title: Pagination
category: data-display
when_to_use: Break a large result set into pages so users can navigate without loading everything.
tags: [pagination, paging, pager, offset, cursor, pages]
composes: []
related: [table, filter, search]
states: [first-page, middle, last-page, single-page]
a11y: [nav-aria-label, aria-current=page, disabled-prev-next]
stack: react-ts-tailwind
---

## When to use / when NOT to use

**Use** when a result set is too large to render or scan at once (search results, a [[table]] of
records, a list of orders) and users benefit from stable, linkable, "jump to page N" navigation.

**Don't use** for short lists that fit in one view, for feeds where infinite scroll fits the mental
model better, or *together* with infinite scroll on the same list (pick one). For very large or
frequently-changing datasets, prefer cursor pagination over offset (see Code notes).

## States to handle

- **first-page** — Prev is disabled; the window starts at page 1 with no leading ellipsis.
- **middle** — both Prev and Next are enabled; show the current page flanked by neighbours with a
  leading and trailing ellipsis when pages are skipped.
- **last-page** — Next is disabled; the window ends at the last page with no trailing ellipsis.
- **single-page** — there is only one page: keep the "Showing X–Y of N" summary but hide or fully
  disable the pager so users aren't offered navigation that does nothing.

## UX guidance — Do & Don't

- **Do** show a "Showing X–Y of N" summary so users always know where they are in the set.
- **Do** keep the control width stable as the page number grows (reserve space / use tabular-nums) so
  the layout doesn't jump.
- **Do** disable — not hide — Prev/Next at the ends so the control's shape stays predictable.
- **Don't** reset filters, sort, or scroll position when the page changes; pair cleanly with
  [[filter]] and [[search]].
- **Don't** render hundreds of raw page buttons — collapse the middle with an ellipsis.
- **Don't** make the page a purely client-side illusion over data you never actually fetched.

## Accessibility checklist

- Wrap the control in `<nav aria-label="Pagination">` so it is announced as a distinct landmark.
- Mark the active page button with `aria-current="page"`; it should not be a navigation target.
- Prev/Next are real `<button>`s with `disabled` set at the boundaries (not just visually greyed).
- Give icon-only or symbol controls accessible text (e.g. `aria-label="Previous page"`).

## Code (React + TS + Tailwind)

See `examples/Pagination.tsx` — a live numbered pager (Prev / 1 … current ± neighbours with
ellipsis … last / Next) over a sample dataset, with a "Showing X–Y of N" line and a page-size control
so the **single-page** state is reachable. Prev is disabled on the first page and Next on the last.

> **Offset vs cursor.** *Offset* (`LIMIT/OFFSET`, "page N") is simple and supports jump-to-page, but
> drifts when rows are inserted/deleted mid-paging and gets slow at deep offsets. *Cursor* (keyset,
> "items after this id") is stable under inserts and fast at any depth, but only supports
> next/prev — not arbitrary jumps. Use offset for stable admin tables; use cursor for large,
> live-updating feeds.

## Anti-patterns / common mistakes

- Hiding Prev/Next at the boundaries so the control reflows and buttons jump under the cursor.
- Using a non-interactive element (`<div onClick>`) for page links, losing keyboard and focus support.
- Forgetting `aria-current="page"`, so screen-reader users can't tell which page they're on.
- Sorting or filtering only the current page instead of the whole dataset, misleading the user.
- Offset paging a feed that changes under the user, causing skipped or duplicated rows between pages.
