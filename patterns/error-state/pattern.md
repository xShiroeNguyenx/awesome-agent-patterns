---
id: error-state
title: Error State
category: feedback
when_to_use: Tell the user something failed and give them a clear way to recover (retry / go back).
tags: [error, error-state, failure, retry, fallback]
composes: []
related: [loading, empty-state, toast]
states: [inline, full-page, retrying]
a11y: [role=alert, focus-error, clear-message]
stack: react-ts-tailwind
---

## When to use / when NOT to use

**Use** when an operation failed and the user needs to know *and* recover — a request that errored, a
section that couldn't load, a save that didn't go through. Always pair the message with a recovery path
(Retry, go back, contact support).

**Don't use** an error state for an expected empty result — that's an [[empty-state]]. Don't block the whole
screen for a minor, transient failure where a [[toast]] would do. And don't leave an error visible after the
request succeeds on retry: clear it the moment recovery works (it replaces the [[loading]] state).

## States to handle

- **inline** — a single section/card failed while the rest of the page is fine. Show a compact error card in place with a Retry, keeping surrounding context intact.
- **full-page** — the primary content of the route failed to load. Center a larger message with a Retry plus a secondary escape (Go back / Reload). Used when there's nothing else meaningful to show.
- **retrying** — the user pressed Retry; the action is in flight. Disable the button and show a spinner so they don't double-submit, then resolve to success or back to the error.

## UX guidance — Do & Don't

- **Do** write a human, specific message ("We couldn't load your orders") — never expose a raw stack trace or error code as the headline.
- **Do** make Retry the obvious primary action; offer a secondary escape on full-page errors.
- **Do** move keyboard focus to the error on appearance so screen-reader and keyboard users notice it.
- **Don't** lose the user's work or context; an inline error shouldn't wipe the rest of the page.
- **Don't** let the Retry button stay clickable mid-retry — disable it and show progress.
- **Don't** blame the user ("You did something wrong"); describe the failure and the fix neutrally.

## Accessibility checklist

- The error container has `role="alert"` so assistive tech announces it as soon as it renders.
- Programmatically move focus to the error region (`tabIndex={-1}` + `ref.focus()` in an effect) so it isn't missed.
- The message is plain language; technical detail (if any) is secondary and visually de-emphasized.
- The Retry control is a real `<button>` with a clear accessible name and a `disabled` state while retrying.

## Code (React + TS + Tailwind)

See `examples/ErrorState.tsx` — a self-contained component with a live state switcher
(`inline / full-page / retrying`), `role="alert"`, focus moved to the error on mount, and a Retry
button that swaps to a disabled spinner while a retry is in flight.

## Anti-patterns / common mistakes

- Showing a raw exception or stack trace as the user-facing message.
- An error with no recovery action, leaving the user stuck.
- A Retry button that stays enabled during the retry, inviting duplicate requests.
- Using a blocking full-page error for a minor failure that a [[toast]] would handle gracefully.
- Confusing an empty result with a failure — reaching for an error state where an [[empty-state]] belongs.
