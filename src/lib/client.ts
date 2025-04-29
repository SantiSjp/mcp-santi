import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export async function createClient() {
  const origin = typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000";

  const transport = new StreamableHTTPClientTransport(new URL(`${origin}/mcp`));

  const client = new Client(
    { name: "frontend-client", version: "1.0.0" }, // Só metadata
    { capabilities: { prompts: {}, resources: {}, tools: {} } } // ClientOptions sem transports
  );

  await client.connect(transport);

  return client;
}
