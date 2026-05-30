# awesome-agent-patterns

> A UI/UX **pattern knowledge base for AI coding agents**, served over **MCP**.
>
> Instead of inventing UI from scratch every time, an agent asked to build *"a product list page"*
> consults this server, pulls the proven patterns (table + filter + pagination + loading +
> empty-state), and assembles the page from them.

**Stack:** patterns are React + TypeScript + Tailwind CSS · MCP server is TypeScript/Node ·
demo gallery is Vite + React + Tailwind.

---

## What's inside

- **16 patterns** (`patterns/<id>/`) — each is a `pattern.md` (when-to-use, states, UX do/don't,
  a11y, anti-patterns) plus a self-contained React + TS + Tailwind reference component.
- **5 style variants per pattern** (80 components total) — every pattern ships a `standard` look
  plus 4 creative re-skins: **brutalism · glass · neon · neumorphism** (see
  [patterns/STYLES.md](patterns/STYLES.md)). The demo has a variant switcher; `get_pattern` returns
  all variants' code.
- **6 recipes** (`recipes/<task>.md`) — curated *task → ordered pattern set* maps. This is what turns
  "build a product list page" into the right five patterns.
- **MCP server** (`mcp-server/`) — exposes the knowledge base to agents via 5 tools.
- **Demo gallery** (`demo/`) — browse every pattern (live preview / code / docs) and the recipes.

| | Patterns |
|---|---|
| feedback | loading, toast, modal, empty-state, error-state |
| data-display | table, pagination, search, filter |
| navigation | header, sidebar |
| commerce | product-card, checkout |
| auth | login |
| page | dashboard, crud |

---

## Quick start

```bash
npm install            # install all workspaces
npm run build          # build the MCP server -> mcp-server/dist
npm run smoke          # end-to-end MCP roundtrip (16 patterns, 6 recipes, flagship flow)

npm run build:index    # (re)generate patterns/index.json + recipes/index.json
npm run check:integrity  # no dangling composes/related/recipe links
npm run check:types    # typecheck every example component
npm run check:render   # mount every example in Node (enforces the demo contract)

npm run dev:demo       # open the demo gallery (Vite dev server)
```

## Connect it to an AI agent (MCP)

After `npm run build`, point your MCP client at the built server. For **Claude Code**, add to your
project `.mcp.json` (an example is included at the repo root) or user config:

```jsonc
{
  "mcpServers": {
    "awesome-agent-patterns": {
      "command": "node",
      "args": ["D:/NGUYENKHANH/awesome-agent-patterns/mcp-server/dist/index.js"]
    }
  }
}
```

The agent then has these tools:

| Tool | Input | Returns |
|---|---|---|
| `list_patterns` | — | lightweight index (id, title, category, when-to-use, tags) |
| `get_pattern` | `{ id }` | full docs + React/TS/Tailwind code for one pattern |
| `search_patterns` | `{ query }` | ranked keyword matches |
| `list_recipes` | — | tasks → ordered pattern sets |
| `get_recipe` | `{ task, inline_patterns? }` | a recipe; `inline_patterns:true` embeds every pattern's docs+code |

**Typical agent flow:** `get_recipe("product-list-page")` → `[table, filter, pagination, loading,
empty-state, error-state]` → `get_pattern` for each → build the page from proven patterns.

---

## How to add a pattern

1. Create `patterns/<id>/pattern.md` following **[patterns/SCHEMA.md](patterns/SCHEMA.md)** (frontmatter + 6 sections).
2. Add `patterns/<id>/examples/<Component>.tsx` — a **default-export component with zero required
   props**, importing only from `react`, Tailwind classes only, SSR-safe initial render.
3. Update `composes` / `related` on related patterns (and a recipe if relevant).
4. Run the gates: `npm run check:integrity && npm run check:types && npm run check:render && npm run build:index`.

The MCP server discovers new patterns automatically on its next start — no server code changes.

---

## Project layout

```
patterns/<id>/pattern.md + examples/*.tsx   # the knowledge base content
recipes/<task>.md                           # task -> ordered pattern set
mcp-server/src/{index,loader,tools}.ts      # the MCP server
demo/src/App.tsx                            # the gallery (auto-discovers patterns)
scripts/{build-index,check-integrity,render-check}.ts, smoke-mcp.mjs
```

See **[PLAN.md](PLAN.md)** for the design rationale, **[CHECKLIST.md](CHECKLIST.md)** for the build
phases, and **[DECISIONS.md](DECISIONS.md)** for autonomous build decisions.

## License

[MIT](LICENSE) © xShiroeNguyenx
