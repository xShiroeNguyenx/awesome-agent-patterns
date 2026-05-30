#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./tools.js";

const server = new McpServer({
  name: "awesome-agent-patterns",
  version: "0.1.0",
});

registerTools(server);

const transport = new StdioServerTransport();
await server.connect(transport);

// stderr is safe for logs; stdout is reserved for the JSON-RPC stream.
console.error("[awesome-agent-patterns] MCP server running on stdio.");
