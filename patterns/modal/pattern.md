---
id: modal
title: Modal Dialog
category: feedback
when_to_use: Capture focus for a short, self-contained task or confirmation that must block the page.
tags: [modal, dialog, overlay, popup, confirm]
composes: []
related: [toast, crud, login]
states: [open, closed, confirming]
a11y: [role=dialog, aria-modal, focus-trap, esc-close, restore-focus]
stack: react-ts-tailwind
---

## When to use / when NOT to use

**Use** to interrupt the flow for a short, must-handle task: confirming a destructive [[crud]] action,
a focused [[login]] form, or a quick decision that shouldn't lose page context behind it.

**Don't use** for non-blocking confirmation ("Saved") — that's a [[toast]]. Don't use a modal for long
forms or content that deserves its own page, and never nest modals. If the user can safely ignore it,
it shouldn't be a modal.

## States to handle

- **closed** — the default; the trigger is visible and focusable, no overlay rendered.
- **open** — overlay dims the page, dialog is centered, focus moves into the dialog, and background scroll/interaction is blocked.
- **confirming** — the primary action is running (e.g. deleting): disable Confirm, show a busy label, and keep the dialog open until it resolves.

## UX guidance — Do & Don't

- **Do** allow dismissal three ways: ESC, clicking the overlay, and an explicit Cancel button.
- **Do** label the primary action with the verb ("Delete", "Save"), not a generic "OK".
- **Do** restore focus to the element that opened the modal after it closes.
- **Don't** close on overlay click if the user has entered data that would be lost — confirm first.
- **Don't** let background content scroll or receive focus while the modal is open.
- **Don't** stack modals or auto-open one on page load without user intent.

## Accessibility checklist

- The dialog has `role="dialog"` and `aria-modal="true"`, with `aria-labelledby` pointing at its title.
- Move focus into the dialog on open (the dialog or first/close control) and trap focus within it.
- ESC closes the dialog; overlay click and Cancel close it too.
- On close, restore focus to the triggering element so keyboard users don't lose their place.
- Attach the keydown listener in an effect (never during render) and remove it on unmount.

## Code (React + TS + Tailwind)

See `examples/Modal.tsx` — a trigger opens a centered, dimmed modal; it closes on ESC, overlay click,
and Cancel, has a primary Confirm with a `confirming` busy state, and moves focus to the dialog on open
(listener attached in `useEffect`).

## Anti-patterns / common mistakes

- Using `createPortal`/`react-dom` when an inline fixed-position overlay suffices (and breaks the "react-only" constraint).
- Attaching the ESC `keydown` listener during render instead of in `useEffect`, breaking SSR and leaking handlers.
- No focus management — focus stays behind the overlay, so keyboard users tab through hidden page content.
- Closing on overlay click and silently discarding entered data with no confirmation.
- Missing `role="dialog"`/`aria-modal`, so assistive tech doesn't announce or isolate the dialog.
