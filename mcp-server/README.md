# @shiroe_nguyen/awesome-agent-patterns-mcp

MCP server that exposes a **UI/UX pattern knowledge base** (16 patterns × 5 style variants +
task recipes) to AI coding agents. Part of
[awesome-agent-patterns](https://github.com/xShiroeNguyenx/awesome-agent-patterns).

## Use it

Add to your MCP client (e.g. Claude Code `.mcp.json`):

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

The package is self-contained — the pattern/recipe content is bundled, so no extra setup is needed.

## Tools

| Tool | Input | Returns |
|---|---|---|
| `list_patterns` | — | lightweight index (id, title, category, when-to-use, tags) |
| `get_pattern` | `{ id }` | full docs + all style variants' React/TS/Tailwind code |
| `search_patterns` | `{ query }` | ranked keyword matches |
| `list_recipes` | — | tasks → ordered pattern sets |
| `get_recipe` | `{ task, inline_patterns? }` | a recipe; optionally with each pattern inlined |

See the [main repo](https://github.com/xShiroeNguyenx/awesome-agent-patterns) for the full docs,
the demo gallery, and how to add a pattern.

License: MIT
