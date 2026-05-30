---
id: filter
title: Filter
category: data-display
when_to_use: Narrow a list by one or more attributes (category, status, price) with visible active filters.
tags: [filter, facet, refine, chips, multi-select]
composes: []
related: [search, table, pagination, empty-state]
states: [none-active, some-active, cleared]
a11y: [grouped-controls, removable-chips, clear-all]
stack: react-ts-tailwind
---

## When to use / when NOT to use

**Use** when a collection has known, enumerable attributes users want to refine by — status,
category, price band — especially over a [[table]] or list paired with [[pagination]]. Filtering
answers "show me only the ones like *this*".

**Don't use** filters for free-text lookup by name (use [[search]]), or when the attribute space is
huge/open-ended. Don't bury filtering behind a modal when only one or two facets matter — keep them
inline.

## States to handle

- **none-active** — no filter selected: show the full list and no chips; this is the default rest state.
- **some-active** — one or more filters applied: render each as a removable chip, narrow the list
  live, and (if nothing matches) show a filter-specific empty message (see [[empty-state]]).
- **cleared** — "Clear all" returns to none-active in one action without reloading the page or
  losing the user's scroll position.

## UX guidance — Do & Don't

- **Do** apply filters live as they change so users see the effect immediately.
- **Do** surface every active filter as a chip with its own × so each can be removed independently.
- **Do** offer a single "Clear all" when more than one filter is active.
- **Do** show a count of matching results so the impact of a filter is legible.
- **Don't** hide which filters are active — invisible state leads to "where did my rows go?".
- **Don't** show the same empty message for "no data" and "no matches"; tell users it's the filters.

## Accessibility checklist

- Group related controls in a `<fieldset>` with a `<legend>` so the relationship is announced.
- Checkboxes/selects have real labels; the select has an associated `<label>`.
- Each chip's remove control is a `<button>` with `aria-label="Remove {filter}"` (not an `×` glyph alone).
- "Clear all" is a `<button>`; all controls are keyboard reachable with visible focus rings.

## Code (React + TS + Tailwind)

See `examples/Filter.tsx` — status checkboxes plus a category `<select>` (grouped in a
`<fieldset><legend>`) that filter a sample list live, active filters shown as removable chips, a
"Clear all" action, a matching-results count, and a distinct empty message when nothing matches.

## Anti-patterns / common mistakes

- Hiding active filters, so users can't tell why the list shrank or how to undo it.
- Chips with a bare `×` and no accessible label, unreadable to screen readers.
- Requiring an "Apply" click for trivial filters when live updates would be clearer.
- Reusing the generic empty state for a no-match filter set, hiding that filters caused it.
- Ungrouped checkboxes with no `<fieldset>`/`<legend>`, losing the "these belong together" semantics.
