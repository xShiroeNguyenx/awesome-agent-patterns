---
id: loading
title: Loading
category: feedback
when_to_use: Indicate that content or an action is in progress so users aren't left guessing.
tags: [loading, spinner, skeleton, progress, async, pending]
composes: []
related: [table, error-state, empty-state]
states: [spinner, skeleton, progress, button-loading]
a11y: [aria-busy, role=status, aria-live, reduced-motion]
stack: react-ts-tailwind
---

## When to use / when NOT to use

**Use** when an operation takes long enough to notice (roughly >300ms) and the user would otherwise
wonder whether the app is broken: fetching a list, submitting a form, computing a result.

**Don't use** a global blocking spinner for fast, local actions, and don't stack a spinner on top of
a skeleton. For data that simply isn't there, show an empty state (see [[empty-state]]); for a failed
load, show an error with retry (see [[error-state]]) — a perpetual spinner is the worst of both.

## States to handle

- **spinner** — an indeterminate indicator for short, unstructured waits where you can't predict layout. Pair with `role="status"` so assistive tech announces it.
- **skeleton** — placeholder blocks that mirror the final layout so the page doesn't jump when content arrives. Prefer this for content regions like a [[table]] or a card list.
- **progress** — a determinate bar when you know how far along you are (uploads, multi-step jobs). Expose `aria-valuenow`/`min`/`max` so the percentage is announced.
- **button-loading** — an inline spinner inside the triggering control while an action runs; disable the button and keep its width stable so it doesn't reflow.

## UX guidance — Do & Don't

- **Do** match the skeleton to the real layout (same columns, same heights) to avoid layout shift.
- **Do** keep a small delay before showing a spinner so very fast responses don't flash one.
- **Do** keep button labels readable while loading ("Saving…") instead of replacing them with a bare spinner.
- **Don't** block the whole page for a change that affects one small region.
- **Don't** animate aggressively — respect `prefers-reduced-motion` and tone the animation down.
- **Don't** leave a loading state with no timeout or error path; a spinner that never resolves reads as a crash.

## Accessibility checklist

- Wrap indeterminate indicators in an element with `role="status"` and `aria-live="polite"` so screen readers announce "Loading".
- Set `aria-busy="true"` on the region being populated, and remove it when content arrives.
- Determinate progress uses `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.
- Honor `prefers-reduced-motion`: replace spinning/pulsing animation with a static or subtle cue.
- A loading button stays focusable-or-disabled with an accessible name that reflects the busy state.

## Code (React + TS + Tailwind)

See `examples/Loading.tsx` — a self-contained demo with a live state switcher
(`spinner / skeleton / progress / button-loading`) showing each loading affordance.

## Anti-patterns / common mistakes

- A full-screen spinner that hides structure and causes a jarring layout shift when content swaps in.
- Skeletons whose shape doesn't match the real content, so the page still jumps on load.
- An indeterminate spinner used where progress is actually knowable (uploads), denying the user an ETA.
- No `role="status"`/`aria-live`, so screen-reader users get silence during the wait.
- A loading button that changes width or loses its label, making the UI twitch and confusing the user.
