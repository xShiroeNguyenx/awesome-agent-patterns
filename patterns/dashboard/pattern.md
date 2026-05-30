---
id: dashboard
title: Dashboard
category: page
when_to_use: Give an at-a-glance overview with key metrics, summaries and recent activity.
tags: [dashboard, overview, stats, metrics, kpi, admin]
composes: [header, sidebar, table, empty-state]
related: [filter]
states: [loading, populated, empty]
a11y: [landmark-regions, heading-hierarchy, stat-labels]
stack: react-ts-tailwind
---

## When to use / when NOT to use

**Use** as the landing screen of an app or admin area where users want the headline numbers
(today's signups, revenue, open tickets) plus a glance at what just happened, before drilling
into a specific section.

**Don't use** a dashboard as a dumping ground for every chart you have — that buries the signal.
Don't use one when the user has a single concrete task (take them straight to that screen), and
don't replace a working detail view with a metrics wall the user can't act on.

## States to handle

- **loading** — show skeleton stat cards and a skeleton activity list with the same footprint as the real content, so the layout doesn't jump when data lands. Never collapse the shell to a single spinner (see [[loading]]).
- **populated** — the real overview: a row of KPI cards (label, value, delta) and a recent-activity mini-table built from the [[table]] pattern.
- **empty** — a brand-new account with no activity yet. Render the cards at zero and give the activity section a friendly empty state with a next step (see [[empty-state]]), rather than a blank gap.

## UX guidance — Do & Don't

- **Do** lead with 3–5 KPIs, each with a label, a current value, and a delta vs. the prior period so the number has context.
- **Do** keep the app shell consistent — a slim [[header]] for global actions and a left [[sidebar]] rail for navigation, so the dashboard feels like part of the product.
- **Do** color deltas semantically (up/down) but never rely on color alone — pair it with an arrow or sign.
- **Don't** cram a dozen widgets above the fold; prioritise the few numbers that drive a decision.
- **Don't** make every card a different size and style — a uniform grid scans far faster.
- **Don't** auto-refresh in a way that reorders or jumps content under the user's cursor.

## Accessibility checklist

- Use landmark elements: a `<header>` banner, a `<nav>` rail, and a single `<main>` region so screen-reader users can jump between them.
- Maintain a clear heading hierarchy — one `<h1>` for the page, `<h2>` for each section (KPIs, Recent activity).
- Each stat card pairs its value with a visible, programmatically associated label; don't leave a bare number unlabelled.
- Skeletons during loading are decorative — mark the loading region with `aria-busy` and ensure focus order is preserved when real content replaces it.

## Code (React + TS + Tailwind)

See `examples/Dashboard.tsx` — an app-shell page (`<header>` + `<nav>` + `<main>`) with a row of
KPI cards and a recent-activity mini-table. It boots in a skeleton **loading** state, switches to
**populated** after a simulated delay, and a toggle shows how the **empty** account reads.

## Anti-patterns / common mistakes

- A "spinner of doom" that hides the entire shell while loading, instead of skeletons that hold the layout.
- KPI numbers with no comparison — a value like "1,284" means nothing without a delta or baseline.
- Showing the same blank area for "still loading" and "genuinely empty", leaving the user unsure which.
- Stuffing the dashboard with vanity metrics nobody acts on, drowning the two or three numbers that matter.
