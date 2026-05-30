// End-to-end MCP smoke test: spawn the built server over stdio and exercise the tools.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const serverPath = resolve(here, "..", "mcp-server", "dist", "index.js");

const transport = new StdioClientTransport({ command: process.execPath, args: [serverPath] });
const client = new Client({ name: "smoke-test", version: "1.0.0" });

await client.connect(transport);

const { tools } = await client.listTools();
console.log("Tools:", tools.map((t) => t.name).join(", "));

const list = await client.callTool({ name: "list_patterns", arguments: {} });
const ids = JSON.parse(list.content[0].text).map((p) => p.id);
console.log(`\nlist_patterns -> ${ids.length} pattern(s): ${ids.join(", ")}`);

const pat = await client.callTool({ name: "get_pattern", arguments: { id: "table" } });
const patText = pat.content[0].text;
console.log("\nget_pattern(table) -> first 200 chars:\n" + patText.slice(0, 200));

const recipesRes = await client.callTool({ name: "list_recipes", arguments: {} });
const recipes = JSON.parse(recipesRes.content[0].text);
console.log(`\nlist_recipes -> ${recipes.length} recipe(s): ${recipes.map((r) => r.task).join(", ")}`);

// Flagship flow: "Tạo trang danh sách sản phẩm" -> product-list-page recipe -> patterns.
const flagship = await client.callTool({
  name: "get_recipe",
  arguments: { task: "product-list-page", inline_patterns: true },
});
const flagshipText = flagship.content[0].text;
console.log("\nget_recipe(product-list-page, inline) -> first 220 chars:\n" + flagshipText.slice(0, 220));

const searchRes = await client.callTool({ name: "search_patterns", arguments: { query: "paginated list of products" } });
const searchHits = JSON.parse(searchRes.content[0].text);
console.log(`\nsearch_patterns("paginated list of products") -> ${searchHits.length} hit(s): ${searchHits.map((h) => h.id).slice(0, 5).join(", ")}`);

await client.close();

// Assertions
if (!tools.some((t) => t.name === "get_pattern")) throw new Error("get_pattern tool missing");
if (!Array.isArray(searchHits) || searchHits.length === 0) throw new Error("search_patterns returned no hits");
if (ids.length !== 16) throw new Error(`expected 16 patterns, got ${ids.length}`);
if (!ids.includes("table")) throw new Error("table pattern not found");
if (!patText.includes("Data Table") || !patText.includes("```tsx")) throw new Error("pattern detail/code missing");
const flagshipRecipe = recipes.find((r) => r.task === "product-list-page");
if (!flagshipRecipe) throw new Error("product-list-page recipe missing");
for (const id of ["table", "filter", "pagination", "loading", "empty-state", "error-state"]) {
  if (!flagshipRecipe.patterns.includes(id)) throw new Error(`flagship recipe missing pattern ${id}`);
}
if (!flagshipText.includes("```tsx")) throw new Error("inline_patterns did not embed code");

console.log("\n✅ smoke ok (16 patterns, 6 recipes, flagship flow verified)");
process.exit(0);
