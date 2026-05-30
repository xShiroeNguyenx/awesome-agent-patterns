---
task: dashboard-home
title: Dashboard home
patterns: [dashboard, header, sidebar, table, empty-state]
tags: [dashboard, overview, home, metrics, admin]
---

## Goal

The landing screen after sign-in: an app shell wrapping an at-a-glance overview — key metrics,
summaries, and recent activity.

## Pattern composition (order matters)

1. **[[header]]** + **[[sidebar]]** — the persistent app shell (see the `app-shell` recipe).
2. **[[dashboard]]** — the content: a row of KPI/stat cards + summary widgets.
3. **[[table]]** — a "Recent activity" / latest-records mini-table.
4. **[[empty-state]]** — what a brand-new account sees before there's any data.
5. **[[loading]]** — skeleton cards/rows while each widget's data arrives.

## Data/state flow notes

- The **shell renders instantly**; each widget loads its own data **independently** with its own loading/empty/error.
- Keep a clear heading hierarchy (`h1` page title → `h2` per section) and landmark regions (`header`/`nav`/`main`).
- Stat cards show value + label + delta (with semantic up/down coloring), not just a bare number.

## Edge cases to not forget

- **New / empty account** — design the zero-data dashboard deliberately; it's the first impression.
- **Partial failure** — one widget failing must not blank the whole page; scope error/retry per widget.
- **Responsive shell** — sidebar collapses to a drawer; cards reflow to one column on mobile.
- Don't block the entire page on the slowest widget.
