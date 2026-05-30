# Pattern frontmatter schema

Every pattern lives at `patterns/<id>/pattern.md` and **must** begin with YAML frontmatter using
exactly these keys. The MCP server parses this frontmatter at startup (via `gray-matter`) and builds
its in-memory index from it — there is no separate hand-maintained index.

```yaml
---
id: table                       # kebab-case, must equal the folder name. Unique.
title: Data Table               # human-readable name
category: data-display          # one of the categories below
when_to_use: One sentence...    # the single line agents scan first
tags: [table, data, grid]       # lowercase keywords for search
composes: []                    # ids of patterns this is BUILT FROM (empty for primitives)
related: [pagination, filter]   # ids of patterns commonly used together
states: [loading, empty, error, populated]   # UI states the pattern must handle
a11y: [role=table, keyboard-nav]              # key accessibility concerns
stack: react-ts-tailwind        # always this value for now
---
```

## Categories

`primitive` · `feedback` · `data-display` · `navigation` · `page` · `auth` · `commerce`

## Markdown body — required sections (in this order)

1. `## When to use / when NOT to use`
2. `## States to handle` — describe each state in `states`
3. `## UX guidance — Do & Don't`
4. `## Accessibility checklist`
5. `## Code (React + TS + Tailwind)` — point to `examples/<Component>.tsx`
6. `## Anti-patterns / common mistakes`

> **Guidance before code.** Sections 1–4 are framework-agnostic so the pattern survives a stack
> change; section 5 is the concrete React + TS + Tailwind implementation.

## Example component convention — `patterns/<id>/examples/<Component>.tsx`

- **Default export** a self-contained React component with **no required props** so it renders
  standalone in the demo gallery (use inline sample data).
- Demonstrate the relevant `states` live where it makes sense (e.g. a small state switcher).
- Use **only** React + Tailwind utility classes. No external UI libraries, no required context,
  no network calls. TypeScript, no `any`.
- The file doubles as the copy-paste reference shown by the `get_pattern` MCP tool.

## Integrity rules

- Every id in `composes`, `related`, and any recipe's `patterns` list **must** resolve to a real
  pattern folder. Run `npm run check:integrity` to verify (no dangling links).
- `id` must equal the folder name.
