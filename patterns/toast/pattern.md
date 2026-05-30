---
id: toast
title: Toast
category: feedback
when_to_use: Briefly confirm an action or surface a non-blocking message without interrupting flow.
tags: [toast, notification, snackbar, alert, feedback]
composes: []
related: [modal, error-state, crud]
states: [success, error, info, warning]
a11y: [role=status, aria-live=polite, dismissible, auto-dismiss]
stack: react-ts-tailwind
---

## When to use / when NOT to use

**Use** for transient, low-stakes feedback that confirms something happened ("Saved", "Copied",
"Item deleted") without stealing focus — typically after a [[crud]] action.

**Don't use** for anything the user must read or act on before continuing — that's a [[modal]]. Don't
use a toast for a persistent error that needs a retry; keep that inline (see [[error-state]]). Toasts
disappear, so never put critical information or the only path to an action in one.

## States to handle

- **success** — confirms an action completed (green). The most common toast; brief and reassuring.
- **error** — reports a recoverable failure (red). Consider a longer or sticky timeout, and keep a parallel inline error if recovery is required.
- **info** — neutral, non-urgent context (sky/blue), e.g. "A new version is available".
- **warning** — a caution that isn't yet a failure (amber), e.g. "You're offline; changes will sync later".

## UX guidance — Do & Don't

- **Do** stack toasts in one consistent corner (commonly top-right) and cap how many show at once.
- **Do** auto-dismiss after a few seconds, and pause/extend for errors the user likely needs to read.
- **Do** keep messages to one short line with an optional single action ("Undo").
- **Don't** rely on a toast alone for important confirmation — also reflect the change in the UI.
- **Don't** stack endless toasts; collapse or queue them so the screen isn't buried.
- **Don't** auto-dismiss so fast that slower readers or screen-reader users miss it.

## Accessibility checklist

- Render the toast container as an `aria-live` region: `role="status"` + `aria-live="polite"` for routine messages (use `assertive` only for urgent errors).
- Each toast is dismissible via a real `<button>` with an accessible label (`aria-label="Dismiss"`).
- Don't put essential, action-only content solely in an auto-dismissing toast.
- Ensure color is not the only signal — pair each variant with an icon or text cue.
- Keep auto-dismiss timeouts generous (4s+) and clear them on unmount so nothing fires after teardown.

## Code (React + TS + Tailwind)

See `examples/Toast.tsx` — buttons that push `success / error / info / warning` toasts onto a stacked
top-right container; each auto-dismisses (timer in `useEffect`, cleared on unmount) and is manually closable.

## Anti-patterns / common mistakes

- Using a toast for a blocking confirmation that the user must acknowledge — use a [[modal]] instead.
- A `setTimeout` that isn't cleared on unmount, firing a state update after the component is gone.
- Toasts that overlap or never stack, so a burst of actions hides earlier messages.
- No `aria-live` region, so screen-reader users never hear the confirmation at all.
- Conveying success/error by color only, invisible to colorblind users.
