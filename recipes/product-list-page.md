---
task: product-list-page
title: Product list / catalog page
patterns: [table, filter, pagination, loading, empty-state, error-state]
tags: [list, catalog, ecommerce, admin, products]
---

## Goal

Render a browsable, filterable list of records (products, orders, users…) with paging and every
async state handled. This is the canonical "list page" — the most common screen in any app.

## Pattern composition (order matters)

1. **[[loading]]** — show a skeleton matching the row/grid layout while the first page fetches.
2. **[[table]]** (or a product-card grid for a visual catalog) — the populated results.
3. **[[search]]** + **[[filter]]** — narrow the set. Changing a filter or query **resets to page 1**.
4. **[[pagination]]** — page through the (filtered) results; show "Showing X–Y of N".
5. **[[empty-state]]** — distinguish *no records yet* (first-use CTA) from *no matches for these filters* (clear-filters CTA).
6. **[[error-state]]** — inline error + Retry if the fetch fails; keep the filters and header visible.

## Data/state flow notes

- Core state: `{ query, filters, page, pageSize, sort, data, status }` where `status ∈ idle|loading|success|empty|error`.
- Derive the request from `query/filters/page/sort`; refetch when any of them change.
- On `query`/`filters`/`sort` change → **set `page = 1`** before refetching.
- Optionally keep the previous page's rows visible (dimmed) while refetching to avoid flicker.

## Edge cases to not forget

- **Empty-after-filter ≠ empty dataset** — different copy and CTA for each.
- **Slow fetch** → skeleton, never a centered spinner that collapses the layout.
- **Failed fetch** → preserve filters/query, offer Retry.
- **Stale page** — the classic bug: user is on page 5, a filter cuts results to 2 pages, and the list goes blank. Always clamp/reset `page` when the result count shrinks.
