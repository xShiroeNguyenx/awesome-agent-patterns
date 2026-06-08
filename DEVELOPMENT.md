# Development

How to run, build, and contribute to **awesome-agent-patterns**. If you only want to *use* the
patterns from an AI agent, you don't need any of this — see the
[Install section in the README](README.md#install--connect-it-to-your-ai-agent-mcp).

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

---

## Run the MCP server from a local clone

For development (or before publishing), point your MCP client at the built server instead of the npm
package. Run `npm run build` first, then use a config like the one in
[`.mcp.json.example`](.mcp.json.example):

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

---

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
