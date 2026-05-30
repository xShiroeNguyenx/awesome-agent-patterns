// Verify the PUBLISHED npm package end-to-end: launch it via npx and exercise the MCP tools.
// Usage: node scripts/smoke-published.mjs [package-name]
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const pkg = process.argv[2] ?? "@shiroe_nguyen/awesome-agent-patterns-mcp";
// On Windows, spawning `npx` directly for an MCP stdio server is flaky (the npx.cmd
// shim doesn't pipe stdio reliably). Wrapping in `cmd /c` is the standard fix.
const isWin = process.platform === "win32";
const command = isWin ? "cmd" : "npx";
const args = isWin ? ["/c", "npx", "-y", pkg] : ["-y", pkg];
console.log(`Launching published package via: ${command} ${args.join(" ")}`);
const transport = new StdioClientTransport({ command, args });
const client = new Client({ name: "smoke-published", version: "1.0.0" });

await client.connect(transport);

const { tools } = await client.listTools();
console.log("tools:", tools.map((t) => t.name).join(", "));

const list = await client.callTool({ name: "list_patterns", arguments: {} });
const ids = JSON.parse(list.content[0].text).map((p) => p.id);
console.log(`patterns: ${ids.length} (${ids.slice(0, 5).join(", ")} ...)`);

const rec = await client.callTool({ name: "get_recipe", arguments: { task: "product-list-page" } });
console.log("get_recipe ok:", rec.content[0].text.slice(0, 70).replace(/\n/g, " "));

await client.close();

if (ids.length !== 16) throw new Error(`expected 16 patterns from published pkg, got ${ids.length}`);
console.log("\n✅ published package works end-to-end from npm (content bundled correctly)");
process.exit(0);
