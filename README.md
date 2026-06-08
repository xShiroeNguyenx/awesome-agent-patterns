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

---

## Install — connect it to your AI agent (MCP)

**No clone, no build.** The npm package bundles all pattern content, so it works out of the box.

### One command (Claude Code)

```bash
# macOS / Linux
claude mcp add awesome-agent-patterns -- npx -y @shiroe_nguyen/awesome-agent-patterns-mcp

# Windows — wrap npx in `cmd /c`, otherwise the stdio server spawns unreliably
claude mcp add awesome-agent-patterns -- cmd /c npx -y @shiroe_nguyen/awesome-agent-patterns-mcp
```

That's the whole install — no clone, no build, `npx` fetches and runs the server on first launch.

- **Scope:** defaults to your personal config. Add `--scope project` to write a shared
  [`.mcp.json`](.mcp.json) (committed to git) so your whole team gets it, or `--scope user` for all
  your projects.
- **Verify / remove:** `claude mcp list` · `claude mcp remove awesome-agent-patterns`

### One command (Codex CLI)

```bash
# macOS / Linux
codex mcp add awesome-agent-patterns -- npx -y @shiroe_nguyen/awesome-agent-patterns-mcp

# Windows — wrap npx in `cmd /c`, same as above
codex mcp add awesome-agent-patterns -- cmd /c npx -y @shiroe_nguyen/awesome-agent-patterns-mcp
```

The entry is written to `~/.codex/config.toml` (or a project-scoped `.codex/config.toml`). Manage it
with `codex mcp --help` (`list` / `remove`). The equivalent TOML block, if you'd rather edit by hand:

```toml
[mcp_servers.awesome-agent-patterns]
command = "npx"
args = ["-y", "@shiroe_nguyen/awesome-agent-patterns-mcp"]
```

### Manual config (any MCP client)

If your client isn't Claude Code, add the server to its `mcpServers` config by hand:

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

**Where to put this config**

| Client | Config location |
|---|---|
| Claude Code | `.mcp.json` in your project root (or user config) |
| Cursor | `.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (global) |
| Other MCP clients | wherever the client reads `mcpServers` from |

Restart the client after editing. That's it — no install step, `npx` fetches and runs the server on
first launch.

> Prefer to install globally instead of `npx`-on-demand? Run
> `npm i -g @shiroe_nguyen/awesome-agent-patterns-mcp`, then set `"command"` to
> `awesome-agent-patterns-mcp` with empty `"args"`.

### What your agent gets

Once connected, the agent has these 5 tools:

| Tool | Input | Returns |
|---|---|---|
| `list_patterns` | — | lightweight index (id, title, category, when-to-use, tags) |
| `get_pattern` | `{ id }` | full docs + React/TS/Tailwind code for one pattern (all 5 style variants) |
| `search_patterns` | `{ query }` | ranked keyword matches |
| `list_recipes` | — | tasks → ordered pattern sets |
| `get_recipe` | `{ task, inline_patterns? }` | a recipe; `inline_patterns:true` embeds every pattern's docs+code |

**Typical agent flow:** `get_recipe("product-list-page")` → `[table, filter, pagination, loading,
empty-state, error-state]` → `get_pattern` for each → build the page from proven patterns.

### Example prompts to try

Once connected, just describe the screen you want in plain language — the agent pulls the matching
recipe and patterns on its own. No need to name the tools:

| You say… | The agent does… |
|---|---|
| *"Build a product list page with filters and pagination."* | `get_recipe("product-list-page")` → table · filter · pagination · loading · empty-state · error-state |
| *"Scaffold a CRUD admin screen for managing users."* | `get_recipe("crud-admin-page")` |
| *"Add a login / signup flow."* | `get_recipe("auth-flow")` |
| *"Make a checkout flow."* | `get_recipe("checkout-flow")` |
| *"Give me a dashboard home page."* | `get_recipe("dashboard-home")` |
| *"Set up the app shell (header + sidebar)."* | `get_recipe("app-shell")` |
| *"What patterns do you have for loading states?"* | `search_patterns({ query: "loading" })` |
| *"Show me the toast pattern, all style variants."* | `get_pattern({ id: "toast" })` |
| *"Re-skin the table in the neon style."* | `get_pattern({ id: "table" })` → use the `neon` variant |

> 💡 Tip: phrase it as the **outcome** ("a settings page with a sidebar and a form"), not the tool.
> The agent maps your request to a recipe, then assembles the page from the returned patterns.

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

**Stack:** patterns are React + TypeScript + Tailwind CSS · MCP server is TypeScript/Node ·
demo gallery is Vite + React + Tailwind.

---

## Running or contributing to the project

Cloning, building, running the demo, adding patterns, and the CI/CD setup all live in
**[DEVELOPMENT.md](DEVELOPMENT.md)**.

See also **[PLAN.md](PLAN.md)** for the design rationale, **[CHECKLIST.md](CHECKLIST.md)** for the
build phases, and **[DECISIONS.md](DECISIONS.md)** for autonomous build decisions.

## License

[MIT](LICENSE) © xShiroeNguyenx
