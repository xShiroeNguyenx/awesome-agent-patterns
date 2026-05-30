---
id: empty-state
title: Empty State
category: feedback
when_to_use: Communicate that there's nothing to show and guide the user toward a useful next action.
tags: [empty, empty-state, zero-data, placeholder, no-results]
composes: []
related: [table, search, filter, error-state]
states: [first-use, no-results, cleared]
a11y: [meaningful-heading, actionable-cta, decorative-icon-hidden]
stack: react-ts-tailwind
---

## When to use / when NOT to use

**Use** when a region that normally holds content has none, and you want to explain *why* and offer the
*right* next step — a fresh account ("No projects yet"), a query that matched nothing, or a list the user
just finished clearing.

**Don't use** an empty state to hide a failure: if data failed to load, that's an [[error-state]], not an
empty one. Don't show an empty state while data is still loading (use a skeleton), and don't reuse one
generic "Nothing here" for every situation — the cause dictates the copy and the call to action.

## States to handle

- **first-use** — the user has *never* created anything. Welcome them and offer a primary "create" action (e.g. "No projects yet" → Create project). This is onboarding, not an error.
- **no-results** — there *is* data, but the current [[search]] / [[filter]] excluded all of it. Say so explicitly and offer to clear or broaden the query, not to create a new record. Often paired with a [[table]].
- **cleared** — the user reached zero by finishing or emptying the set (inbox zero, all tasks done). Acknowledge the accomplishment; the next action is gentle, not urgent.

## UX guidance — Do & Don't

- **Do** lead with a meaningful heading that names the situation ("No matches for your filters"), not just an icon.
- **Do** give exactly one obvious primary action, matched to the state (Create vs. Clear filters vs. nothing).
- **Do** keep first-use ≠ no-results: a "Create" button on a no-results screen is a trap — the user has data, they just over-filtered.
- **Don't** dump a wall of marketing copy; one short sentence of guidance is enough.
- **Don't** show a sad/empty illustration so large it pushes the action below the fold.
- **Don't** leave a no-results state with no escape — always offer a way back to a populated view.

## Accessibility checklist

- The state opens with a real heading element (`<h2>`/`<h3>`) so screen-reader users land on a meaningful label, not a bare icon.
- The primary action is a true `<button>`/`<a>` with descriptive text ("Create project", "Clear filters") — never an icon alone.
- Decorative illustrations and glyphs carry `aria-hidden="true"` so they aren't announced.
- Maintain visible focus rings on the call to action.

## Code (React + TS + Tailwind)

See `examples/EmptyState.tsx` — a self-contained component with a live state switcher
(`first-use / no-results / cleared`), each variant rendering its own heading, copy, decorative
(`aria-hidden`) icon, and a distinct call to action.

## Anti-patterns / common mistakes

- Showing the same "No data" message for an unfiltered first-use screen and a filtered no-match screen.
- Offering "Create new" as the only action on a no-results state, when the user simply needs to clear a filter.
- Using an empty state to mask an error or a still-loading request (use [[error-state]] or a skeleton instead).
- Decorative artwork announced by screen readers because it lacks `aria-hidden`.
- A heading made of an icon only, leaving assistive tech with nothing meaningful to read.
