# awesome-agent-patterns

[![CI](https://github.com/xShiroeNguyenx/awesome-agent-patterns/actions/workflows/ci.yml/badge.svg)](https://github.com/xShiroeNguyenx/awesome-agent-patterns/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@shiroe_nguyen/awesome-agent-patterns-mcp.svg)](https://www.npmjs.com/package/@shiroe_nguyen/awesome-agent-patterns-mcp)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> A UI/UX **pattern knowledge base for AI coding agents**, served over **MCP**.
>
> Instead of inventing UI from scratch every time, an agent asked to build *"a product list page"*
> consults this server, pulls the proven patterns (table + filter + pagination + loading +
> empty-state), and assembles the page from them.

🎨 **Live demo gallery:** https://xshiroenguyenx.github.io/awesome-agent-patterns/ (after first Pages deploy)

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

**Easiest — via npm (no clone needed).** Once published, add to your MCP client (e.g. Claude Code
`.mcp.json` or user config). The package bundles the pattern content, so it just works:

```jsonc
{
  "mcpServers": {
    "awesome-agent-patterns": {
      "command": "npx",
      "args": ["-y", "@shiroe_nguyen/awesome-agent-patterns-mcp"]
    }
  }
}
```

> **Windows:** spawning `npx` directly for an MCP stdio server is unreliable — wrap it in `cmd /c`:
> ```jsonc
> { "mcpServers": { "awesome-agent-patterns": {
>   "command": "cmd",
>   "args": ["/c", "npx", "-y", "@shiroe_nguyen/awesome-agent-patterns-mcp"]
> } } }
> ```

**From a local clone** (for development, or before publishing) — run `npm run build`, then point at
the built server (an example is at [`.mcp.json.example`](.mcp.json.example)):

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

## CI/CD

Three GitHub Actions workflows ([`.github/workflows/`](.github/workflows/)):

- **CI** (`ci.yml`) — on every push/PR: build server, typecheck, render gate, integrity, MCP smoke, demo build.
- **Pages** (`pages.yml`) — on push to `main`: build the demo and deploy to GitHub Pages.
- **Release** (`release.yml`) — on a `v*` tag: publish `awesome-agent-patterns-mcp` to npm + create a GitHub Release.

**One-time setup:**

1. **npm publishing** — create an npm [Automation token](https://docs.npmjs.com/creating-and-viewing-access-tokens), then add it as repo secret **`NPM_TOKEN`** (Settings → Secrets and variables → Actions).
2. **Pages** — Settings → Pages → Source = **GitHub Actions**.

**Cut a release:**

```bash
# bump versions first if needed (root + mcp-server package.json), then:
git tag v0.1.0
git push origin v0.1.0      # triggers npm publish + GitHub Release
```

## License

[MIT](LICENSE) © xShiroeNguyenx
