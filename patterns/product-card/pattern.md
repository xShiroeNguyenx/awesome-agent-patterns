---
id: product-card
title: Product Card
category: commerce
when_to_use: Present a single product in a grid or list with image, price and a primary action.
tags: [product, card, ecommerce, price, add-to-cart, grid]
composes: []
related: [checkout, table, empty-state]
states: [default, on-sale, out-of-stock, loading]
a11y: [img-alt, price-semantics, button-label]
stack: react-ts-tailwind
---

## When to use / when NOT to use

**Use** to present a product in a browsable grid or list: image, name, price and one clear primary
action (Add to cart). Cards suit rich, scannable, image-led catalogs.

**Don't use** cards when users mainly need to compare many SKUs on shared attributes — a [[table]]
makes column-to-column comparison far easier. When a category has no matches, swap the grid for an
[[empty-state]] rather than rendering zero cards.

## States to handle

- **default** — image, name, single price, and an enabled Add-to-cart button.
- **on-sale** — show the sale price prominently with the original price struck through, plus a "Sale" badge; convey the discount in text, not colour alone.
- **out-of-stock** — disable the Add button, swap it for an "Out of stock" label/badge, and keep the card visible so users can still see (or save) the item.
- **loading** — show a skeleton card with the same shape (image block + text lines) so the grid doesn't reflow when data arrives.

## UX guidance — Do & Don't

- **Do** keep one primary action per card; secondary actions (save, quick view) stay subtler.
- **Do** show the real, current price first; never hide that an item is unavailable until checkout.
- **Do** keep card heights consistent so the grid stays tidy across rows.
- **Don't** rely on colour alone to signal a sale or out-of-stock — include text/badges.
- **Don't** use a live network image in the skeleton; reserve the space with a placeholder block.
- **Don't** let the Add button stay enabled for an out-of-stock item.

## Accessibility checklist

- The product image needs descriptive `alt` text (the product name); a decorative placeholder block uses `role="img"` with an `aria-label` of the product name.
- Express price with real text so screen readers read it; mark the struck-through original price as the prior price (e.g. visually-hidden "was" / "now" wording).
- The primary action has a specific label — `Add {name} to cart` — not a bare "Add".

## Code (React + TS + Tailwind)

See `examples/ProductCard.tsx` — a responsive grid of cards covering every state: default, on-sale
(strikethrough original + Sale badge), out-of-stock (disabled button + badge), and a loading
skeleton. Images are colored placeholder blocks with `role="img"` + `aria-label`.

## Anti-patterns / common mistakes

- A generic "Add" button with no product context, useless to screen reader users scanning by control.
- Signalling "sale" or "sold out" with colour only, invisible to colour-blind users.
- Skeletons whose dimensions differ from the loaded card, causing the grid to jump.
- Hiding out-of-stock items entirely so users can't tell whether the item exists.
