---
id: sidebar
title: Sidebar Navigation
category: navigation
when_to_use: Offer persistent section navigation for an app shell, collapsible on smaller screens.
tags: [sidebar, side-nav, drawer, navigation, menu]
composes: []
related: [header, dashboard]
states: [expanded, collapsed, mobile-drawer]
a11y: [nav-landmark, current-page, collapse-button-label, focus-management]
stack: react-ts-tailwind
---

## When to use / when NOT to use

**Use** for an app shell with many persistent sections (dashboard, settings, admin) where users
move between areas frequently. A vertical rail keeps every destination one click away and pairs
naturally with a top [[header]].

**Don't use** for a marketing site with a handful of pages (a top navbar is enough), or when the
content needs the full width on every screen — a sidebar that can't collapse will crowd small
viewports.

## States to handle

- **expanded** — full rail with icons and text labels; the active item is highlighted.
- **collapsed** — the rail narrows to an icon-only strip to reclaim horizontal space. Labels are visually hidden but remain as accessible names (tooltips/`aria-label`).
- **mobile-drawer** — on small screens the rail is hidden by default and slides in as an overlay drawer triggered by a button; an overlay/scrim lets the user dismiss it.

## UX guidance — Do & Don't

- **Do** group related items with section headers and keep the most-used items near the top.
- **Do** persist the collapsed/expanded choice so it survives navigation and reloads.
- **Do** keep icons meaningful and pair them with labels (icon-only is ambiguous when collapsed).
- **Don't** collapse the active item out of view — always show which section the user is in.
- **Don't** make the collapse toggle a mystery; give it an action-specific accessible label.
- **Don't** trap keyboard focus behind a closed mobile drawer; manage focus when it opens/closes.

## Accessibility checklist

- Wrap items in `<nav aria-label="Sidebar">` so it's a distinct landmark from the [[header]] nav.
- Mark the active destination with `aria-current="page"`.
- The collapse button has an action label that changes with state (`Collapse sidebar` / `Expand sidebar`).
- When collapsed, keep an accessible name on every item (visually-hidden label or `aria-label`); manage focus when the mobile drawer opens and closes.

## Code (React + TS + Tailwind)

See `examples/Sidebar.tsx` — a small app-shell mockup with a collapsible vertical sidebar (grouped
items with emoji icons, an active item, and a collapse toggle that narrows the rail to icons-only),
demonstrating the expanded, collapsed and mobile-drawer states.

## Anti-patterns / common mistakes

- Icon-only rails with no labels or tooltips, leaving destinations ambiguous.
- A collapse button labelled only with a glyph and no accessible name.
- A mobile drawer that opens without moving focus into it or restoring focus on close.
- Re-rendering the whole shell and losing scroll/active state on every navigation.
