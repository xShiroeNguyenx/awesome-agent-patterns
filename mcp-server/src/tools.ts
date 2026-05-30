import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  loadPatterns,
  loadRecipes,
  getPattern,
  getRecipe,
  patternSummary,
  searchPatterns,
  type Pattern,
} from "./loader.js";

function text(value: string) {
  return { content: [{ type: "text" as const, text: value }] };
}

function langForFile(file: string): string {
  if (file.endsWith(".tsx") || file.endsWith(".ts")) return "tsx";
  if (file.endsWith(".jsx") || file.endsWith(".js")) return "jsx";
  return "";
}

function renderPattern(p: Pattern): string {
  const lines: string[] = [];
  lines.push(`# ${p.title}  \`(id: ${p.id})\``);
  lines.push("");
  lines.push(`- **Category:** ${p.category}`);
  lines.push(`- **When to use:** ${p.when_to_use}`);
  if (p.composes.length) lines.push(`- **Composes:** ${p.composes.join(", ")}`);
  if (p.related.length) lines.push(`- **Related:** ${p.related.join(", ")}`);
  if (p.states.length) lines.push(`- **States:** ${p.states.join(", ")}`);
  if (p.a11y.length) lines.push(`- **A11y:** ${p.a11y.join(", ")}`);
  lines.push(`- **Stack:** ${p.stack}`);
  lines.push("");
  lines.push(p.body);
  for (const ex of p.examples) {
    lines.push("");
    lines.push(`### Reference code — \`${ex.file}\``);
    lines.push("```" + langForFile(ex.file));
    lines.push(ex.code.trimEnd());
    lines.push("```");
  }
  return lines.join("\n");
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "list_patterns",
    {
      title: "List UI patterns",
      description:
        "List every UI/UX pattern in the knowledge base as a lightweight index (id, title, " +
        "category, one-line when-to-use, tags). Scan this first, then call get_pattern for detail.",
    },
    async () => {
      const list = loadPatterns().map((p) => {
        const { tags, composes, related, states, a11y, stack, ...rest } = patternSummary(p);
        return { ...rest, tags };
      });
      return text(JSON.stringify(list, null, 2));
    }
  );

  server.registerTool(
    "get_pattern",
    {
      title: "Get a UI pattern",
      description:
        "Return the full documentation (when-to-use, states, UX do/don't, accessibility, " +
        "anti-patterns) plus the React + TypeScript + Tailwind reference code for one pattern.",
      inputSchema: {
        id: z.string().describe("Pattern id, e.g. 'table', 'toast', 'pagination'."),
      },
    },
    async ({ id }) => {
      const p = getPattern(id);
      if (!p) {
        const known = loadPatterns().map((x) => x.id).join(", ");
        return text(`No pattern with id "${id}". Known ids: ${known}`);
      }
      return text(renderPattern(p));
    }
  );

  server.registerTool(
    "search_patterns",
    {
      title: "Search UI patterns",
      description:
        "Keyword search across pattern ids, titles, tags, when-to-use and docs. Returns ranked " +
        "matches (id, title, category, when-to-use). Use get_pattern to fetch the full detail.",
      inputSchema: {
        query: z.string().describe("Free-text keywords, e.g. 'paginated list of products'."),
      },
    },
    async ({ query }) => {
      const hits = searchPatterns(query);
      if (hits.length === 0) return text(`No patterns matched "${query}".`);
      return text(JSON.stringify(hits, null, 2));
    }
  );

  server.registerTool(
    "list_recipes",
    {
      title: "List page recipes",
      description:
        "List curated task recipes (e.g. 'product-list-page'). Each maps a common UI task to an " +
        "ordered set of patterns to compose. Use this to turn a feature request into a pattern set.",
    },
    async () => {
      const list = loadRecipes().map(({ task, title, patterns, tags }) => ({ task, title, patterns, tags }));
      return text(JSON.stringify(list, null, 2));
    }
  );

  server.registerTool(
    "get_recipe",
    {
      title: "Get a page recipe",
      description:
        "Return a recipe: the ordered set of patterns for a task plus composition/data-flow notes " +
        "and edge cases. Set inline_patterns=true to also embed each pattern's full docs + code.",
      inputSchema: {
        task: z.string().describe("Recipe task id, e.g. 'product-list-page'."),
        inline_patterns: z
          .boolean()
          .optional()
          .describe("If true, append each referenced pattern's full documentation and code."),
      },
    },
    async ({ task, inline_patterns }) => {
      const r = getRecipe(task);
      if (!r) {
        const known = loadRecipes().map((x) => x.task).join(", ");
        return text(`No recipe with task "${task}". Known tasks: ${known}`);
      }
      const lines: string[] = [];
      lines.push(`# Recipe: ${r.title}  \`(task: ${r.task})\``);
      lines.push("");
      lines.push(`**Patterns (in order):** ${r.patterns.join(" → ")}`);
      lines.push("");
      lines.push(r.body);
      if (inline_patterns) {
        for (const id of r.patterns) {
          const p = getPattern(id);
          lines.push("\n---\n");
          lines.push(p ? renderPattern(p) : `> (missing pattern: ${id})`);
        }
      } else {
        lines.push("\n> Call get_pattern for each id above, or re-run with inline_patterns=true.");
      }
      return text(lines.join("\n"));
    }
  );
}
