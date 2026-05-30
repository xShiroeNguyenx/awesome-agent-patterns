---
id: search
title: Search
category: data-display
when_to_use: Let users find items by typing a query, with debounced live results.
tags: [search, query, find, debounce, typeahead, autocomplete]
composes: []
related: [filter, table, empty-state]
states: [idle, typing, results, no-results, clearing]
a11y: [labeled-input, role=searchbox, clear-button, results-announced]
stack: react-ts-tailwind
---

## When to use / when NOT to use

**Use** when a collection is large enough that scanning is slow and users know (roughly) what they
want by name or keyword — products, contacts, docs, rows in a [[table]].

**Don't use** as the *only* way to narrow data when the useful axes are known, enumerable
attributes (status, category, price) — that's a job for [[filter]]. Don't reach for search on a
short list that fits on screen, or where browsing/structure matters more than lookup.

## States to handle

- **idle** — empty query: show the full list (or recent/suggested items), not an empty void.
- **typing** — a query is entered but the debounce timer hasn't fired yet; show a subtle
  "Searching…" hint so the input feels responsive without thrashing on every keystroke.
- **results** — matches found; announce the count so it isn't a silent visual change.
- **no-results** — a non-empty query matched nothing: show a specific empty message that echoes the
  query and offers a way out (clear, broaden), distinct from the idle/empty state (see [[empty-state]]).
- **clearing** — the clear (×) button resets the query to idle and returns focus to the input.

## UX guidance — Do & Don't

- **Do** debounce input (~250–350ms) so you query/filter after the user pauses, not per keystroke.
- **Do** offer a clear (×) button once there's a query, and keep focus in the field after clearing.
- **Do** keep results in place during the typing window rather than flashing empty between updates.
- **Don't** block the field with a spinner overlay; show progress inline and keep typing possible.
- **Don't** make the no-results state look identical to the idle state — say *what* was searched.
- **Don't** trigger an expensive search on the empty string.

## Accessibility checklist

- The input has a real, associated `<label>` (visible or `sr-only`) — never placeholder-as-label.
- Use `type="search"` and/or `role="searchbox"`; the clear control is a `<button>` with
  `aria-label="Clear search"`.
- Announce result counts in an `aria-live="polite"` region so screen-reader users hear updates.
- Ensure the field and clear button are keyboard reachable with a visible focus ring.

## Code (React + TS + Tailwind)

See `examples/Search.tsx` — a labeled search input that debounces ~300ms (`useEffect` +
`setTimeout` with cleanup), filters a sample list, shows a "Searching…" hint while the timer is
pending, a clear (×) button, a distinct no-results message, and a result count in an
`aria-live="polite"` region.

## Anti-patterns / common mistakes

- Filtering synchronously on every keystroke (janky on large lists; no debounce).
- Using the placeholder as the only label, leaving the field unlabeled for assistive tech.
- A clear button that wipes the query but steals focus away from the input.
- Showing the generic empty state for a no-match query, so users can't tell search even ran.
- Updating results visually with no `aria-live` region, so the change is silent to screen readers.
