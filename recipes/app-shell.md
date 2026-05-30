---
task: app-shell
title: App shell (header + sidebar layout)
patterns: [header, sidebar]
tags: [layout, shell, navigation, frame, scaffold]
---

## Goal

The persistent frame every authenticated page renders inside: a top **header** + a left **sidebar**
+ a `main` content outlet. Build this once; every page slots into it.

## Pattern composition (order matters)

1. **[[header]]** — top bar: branding, global search, account menu, mobile menu button.
2. **[[sidebar]]** — left rail: section navigation, collapsible to icons-only, drawer on mobile.
3. `main` — the routed page content (the outlet); the recipes above render here.

## Data/state flow notes

- Layout state lives at the shell level: `{ sidebarCollapsed, mobileDrawerOpen }`.
- The active route drives `aria-current="page"` in both header and sidebar.
- Provide a **skip-to-content** link as the first focusable element.

## Edge cases to not forget

- **Focus management** — when the mobile drawer opens, move focus into it; restore on close (trap like a `[[modal]]`).
- **Persist the collapse preference** (localStorage) — but read it in an effect, never during render (SSR-safe).
- **Responsive** — sidebar is a persistent rail on `lg+`, an overlay drawer below; use CSS breakpoints, not JS width checks.
- Keep the shell shell-only: no page data fetching in the frame.
