# Variant style specs

Every pattern ships **5 variants** as separate files in `patterns/<id>/examples/`:

| variant | file | look |
|---|---|---|
| standard | `<Name>.tsx` (existing) | clean, professional slate/sky — the production-ready default |
| brutalism | `brutalism.tsx` | neo-brutalism — thick black borders, hard offset shadows, vivid blocks |
| glass | `glass.tsx` | glassmorphism — blurred translucent panels over a gradient |
| neon | `neon.tsx` | dark cyberpunk — black bg, glowing cyan/fuchsia edges |
| neumorphism | `neumorphism.tsx` | soft UI — monochrome, extruded/inset soft shadows |

The creative variants are **re-skins of the standard's logic** — same behaviour, restyled with the
tokens below. They must stay self-contained (default export, zero props, react-only imports,
SSR-safe) and use **only built-in Tailwind v3 utilities + arbitrary values** (no config/theme
changes, no plugins). Each creative variant **wraps itself in its own background** so it reads
correctly inside the demo's white preview card.

---

## brutalism (`brutalism.tsx`)

- **Outer wrap:** `bg-yellow-50 p-5` (optional, to set off the blocks)
- **Panel / card / table / dialog:** `border-2 border-black bg-white rounded-none shadow-[6px_6px_0_0_#000]`
- **Primary button:** `border-2 border-black bg-yellow-300 px-3 py-1.5 font-bold text-black rounded-none shadow-[4px_4px_0_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#000]`
- **Secondary / accent fills:** `bg-pink-400`, `bg-lime-300`, `bg-cyan-300` (always `border-2 border-black text-black`)
- **Inputs:** `border-2 border-black rounded-none px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black`
- **Headers:** `font-extrabold` (consider `uppercase tracking-tight`)
- **Active/selected state:** filled vivid block + black border (no subtle highlights)

## glass (`glass.tsx`)

- **Outer wrap (provides the backdrop the blur needs):** `bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-500 p-6 rounded-2xl`
- **Panel / card / table / dialog:** `border border-white/40 bg-white/15 backdrop-blur-md rounded-2xl shadow-xl text-white`
- **Primary button:** `border border-white/50 bg-white/25 px-3 py-1.5 font-medium text-white rounded-xl backdrop-blur transition hover:bg-white/40`
- **Text:** headings `text-white`, secondary `text-white/70`
- **Inputs:** `border border-white/40 bg-white/20 text-white placeholder:text-white/60 rounded-xl px-3 py-2 backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/60`
- **Active/selected state:** brighter `bg-white/40`

## neon (`neon.tsx`)

- **Outer wrap:** `bg-slate-950 p-6 rounded-xl`
- **Panel / card / table / dialog:** `border border-cyan-500/50 bg-slate-900 rounded-lg text-slate-100 shadow-[0_0_18px_rgba(34,211,238,0.35)]`
- **Primary button:** `border border-cyan-400 bg-cyan-400/10 px-3 py-1.5 font-medium text-cyan-200 rounded-md shadow-[0_0_12px_rgba(34,211,238,0.5)] transition hover:bg-cyan-400/20`
- **Accent (secondary):** fuchsia — `border-fuchsia-400 text-fuchsia-300 shadow-[0_0_12px_rgba(232,121,249,0.5)]`
- **Glowing text:** `drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]`
- **Inputs:** `border border-cyan-500/40 bg-slate-900 text-slate-100 placeholder:text-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400`
- **Active/selected state:** brighter glow + `text-cyan-200`

## neumorphism (`neumorphism.tsx`)

- **Outer wrap (the base tone everything extrudes from):** `bg-slate-200 p-6 rounded-3xl`
- **Raised panel / card / button:** `bg-slate-200 rounded-2xl shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff]`
- **Pressed / inset / inputs / selected:** `bg-slate-200 rounded-2xl shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]`
- **Primary button:** raised by default → `shadow-[inset_...]` on `active:`; `text-slate-700 font-semibold px-4 py-2`
- **Text:** `text-slate-600` / headings `text-slate-700` (low contrast, monochrome — no bright accents)
- **Active/selected state:** switch the element to the inset shadow

---

> The demo's preview card sits on white; each creative variant's outer wrap supplies its own
> background so it always reads as intended. Keep creative variants concise — render the pattern's
> most representative state (keep a state switcher only where multiple states are the whole point,
> e.g. loading / empty-state / error-state).
