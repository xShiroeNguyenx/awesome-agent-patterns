---
id: checkout
title: Checkout
category: commerce
when_to_use: Guide a user through reviewing the cart, entering details, and placing an order.
tags: [checkout, cart, payment, order, ecommerce, summary]
composes: [product-card, toast, error-state, loading]
related: [login]
states: [cart, address, payment, placing, success, error]
a11y: [step-indicator, order-summary-semantics, error-handling]
stack: react-ts-tailwind
---

## When to use / when NOT to use

**Use** to move a user from "I have things in my cart" to "the order is placed" with the fewest steps
that still capture what you need (review → address → payment). The persistent order summary is the
anchor that builds confidence the whole way.

**Don't use** a multi-step flow for a one-line digital purchase (a single confirm button is enough),
and don't force account creation mid-flow — offer guest checkout and let [[login]] be optional. Each
line item reuses the [[product-card]] visual language, but at row density rather than full cards.

## States to handle

- **cart** — review step: the line items, quantities, and the running summary. Let the user back out cheaply.
- **address** — shipping/contact step: collected with inline validation, with Back/Continue navigation that never loses entered data.
- **payment** — payment step: card or wallet details; the order summary stays pinned so the total is always in view.
- **placing** — the order is being submitted: lock the "Place order" button into a spinner/disabled state so it can't be double-fired (see [[loading]]).
- **success** — a clear confirmation with the order number; this is also where a [[toast]] or email receipt belongs.
- **error** — payment/network failure surfaces an inline, retryable error that preserves the cart and entered details (see [[error-state]]) — never silently drop the order.

## UX guidance — Do & Don't

- **Do** keep the order summary (subtotal, shipping, total) visible on every step so the price is never a surprise.
- **Do** show a step indicator (Cart → Address → Payment) so the user knows where they are and how much is left.
- **Do** preserve all entered data when moving Back, and only validate the current step before Continue.
- **Don't** hide shipping or fees until the final step — surprise costs are the top cause of cart abandonment.
- **Don't** double-charge: disable "Place order" the instant it's pressed and key the request so retries are idempotent.
- **Don't** dump the user back to an empty cart on an error — keep their items and let them retry.

## Accessibility checklist

- The step indicator is an ordered list with the current step marked `aria-current="step"`.
- The order summary expresses totals as a description list (`<dl>`/`<dt>`/`<dd>`) so label/value pairs are programmatically associated.
- The "Place order" button exposes its busy state (`disabled`, `aria-busy`) while placing, and errors are announced via `role="alert"`.
- Back/Continue are real `<button>`s with visible focus rings and a logical tab order through each step's fields.

## Code (React + TS + Tailwind)

See `examples/Checkout.tsx` — a single-screen checkout with an inline order summary (line items +
subtotal/shipping/total in a `<dl>`), a Cart → Address → Payment step indicator with Back/Continue,
and a "Place order" button that enters a placing state then shows a success confirmation (simulated
with `setTimeout`). Product rows are re-implemented inline rather than imported.

## Anti-patterns / common mistakes

- Revealing shipping or taxes only on the final step, so the total jumps right before purchase.
- Allowing double-submit because "Place order" stays live during the network call.
- Losing the user's address or cart on a payment error and forcing them to start over.
- Faking the order summary with loose `<div>`s instead of a semantic `<dl>`, breaking label/value association.
