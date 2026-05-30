---
task: checkout-flow
title: Checkout flow
patterns: [checkout, product-card, toast, error-state, loading]
tags: [checkout, cart, payment, order, ecommerce]
---

## Goal

Move a shopper from cart to placed order: review items, enter address/payment, and confirm — with
no lost data and no accidental double-charges.

## Pattern composition (order matters)

1. **[[product-card]]** — cart line items (compact row variant): image, name, qty, line total.
2. **[[checkout]]** — the step flow (Cart → Address → Payment) + order summary with totals.
3. **[[loading]]** — the "Place order" button shows a placing/busy state during submission.
4. **[[error-state]]** — payment/validation failure, recoverable without re-entering everything.
5. **[[toast]]** — lightweight "Added / removed / quantity updated" feedback in the cart.

## Data/state flow notes

- State: `{ step, cart, address, payment, status }` with `status ∈ editing|placing|success|error`.
- Recompute totals (subtotal + shipping + tax − discounts) from the cart; show the breakdown, not just the grand total.
- "Place order" → `placing` (disable button) → success confirmation or recoverable error.

## Edge cases to not forget

- **Empty-cart guard** — don't allow checkout of an empty cart; send them back to browse.
- **No double-submit** — disable "Place order" while `placing`; treat the network as at-least-once.
- **Recover from payment failure** without clearing the entered address/payment fields.
- **Validate per step** before allowing Continue; let users jump back to a completed step.
- Show the order summary at every step so the total is never a surprise.
