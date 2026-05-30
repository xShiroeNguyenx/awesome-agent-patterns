---
id: header
title: Header / Navbar
category: navigation
when_to_use: Provide top-level app or site navigation, branding, search and account access.
tags: [header, navbar, topbar, navigation, appbar]
composes: []
related: [sidebar, search]
states: [default, mobile-open, scrolled]
a11y: [nav-landmark, skip-link, current-page, mobile-menu-button]
stack: react-ts-tailwind
---

## When to use / when NOT to use

**Use** for the persistent top bar of an app or site: branding, the primary navigation, global
search, and account access. It anchors orientation — users always know where "home" and "me" are.

**Don't use** a header as the *only* navigation for a deep app with many sections (pair it with a
[[sidebar]]), and don't stuff secondary or rarely-used links into it — overflow them into a menu or
move them into the page body.

## States to handle

- **default** — full-height bar; desktop nav links visible inline, search box and account button on the right.
- **mobile-open** — on small screens the inline links collapse behind a hamburger button; tapping it reveals a mobile menu panel. The button reflects open/closed via `aria-expanded`.
- **scrolled** — once the page scrolls, the bar condenses (smaller padding) and gains a shadow/solid background so it stays legible over content. Keep it sticky so navigation is always reachable.

## UX guidance — Do & Don't

- **Do** keep the header sticky and the logo a link back to home/dashboard.
- **Do** mark the active destination with `aria-current="page"` and a visible style.
- **Do** make the search box reachable on every screen size (full-width inside the mobile menu).
- **Don't** hide the hamburger's purpose — give it an accessible label and toggle `aria-expanded`.
- **Don't** let the header grow taller than ~2 rows; overflow extra links into a menu.
- **Don't** trap focus or block the page when the mobile menu is open unless it is a full-screen overlay.

## Accessibility checklist

- Wrap the bar in a `<header>` landmark and the links in `<nav aria-label="Main">`.
- Provide a skip-to-content link as the first focusable element so keyboard users can bypass the nav.
- The hamburger is a `<button>` with `aria-expanded` and `aria-controls` pointing at the mobile menu.
- The current page link carries `aria-current="page"`; ensure visible focus rings on every control.

## Code (React + TS + Tailwind)

See `examples/Header.tsx` — a responsive top bar with a logo, desktop nav, search box and account
button, plus a hamburger that toggles the mobile menu and a button that simulates the `scrolled`
condensed state so all three states are visible in the demo.

## Anti-patterns / common mistakes

- A hamburger button with no `aria-expanded`, so screen reader users can't tell the menu's state.
- Driving the `scrolled` state from a raw `window.scrollY` listener that breaks during SSR/initial render.
- Using `<div>`s for nav instead of `<header>` + `<nav>`, losing landmarks and the skip-link target.
- Cramming every link into the bar so it wraps to multiple rows on medium screens.
