// src/tools/monorail/getTokensTool.ts
import { z } from "zod";
import { getTokens } from "../../clients/monorail/monorailApi";

const inputSchema = z.object({
  find: z.string().optional().describe("Partial name or ticker of the token to search for (optional)"),
  offset: z.string().optional().default("0").describe("Pagination offset (default 0)"),
  limit: z.string().optional().default("10").describe("Maximum number of tokens to fetch (default 10)")
});

export const getTokensTool = {
  name: "monorail_get_tokens",
  description: "Fetch a list of tokens available on Monad using the Monorail Data API, with optional search and pagination.",
  inputSchema,
  handler: async ({ find, offset, limit }: z.infer<typeof inputSchema>) => {
    try {
      const parsedLimit = parseInt(limit, 10);
      const parsedOffset = parseInt(offset, 10);

      if (isNaN(parsedLimit)) {
        throw new Error("Limit must be a valid number.");
      }
      if (isNaN(parsedOffset)) {
        throw new Error("Offset must be a valid number.");
      }

      const tokens = await getTokens({
        find,
        offset: parsedOffset,
        limit: parsedLimit,
      });

      if (!tokens.length) {
        return {
          content: [{
            type: "text" as const,
            text: "📭 No tokens found matching the criteria."
          }]
        };
      }

      const summary = tokens.map((token, idx) => (
        `${idx + 1}. ${token.name || "Unnamed"} (${token.symbol || "-"})\n` +
        `   🪙 Address: ${token.address}\n` +
        `   🔢 Decimals: ${token.decimals}\n` +
        `   🎯 Balance: ${token.balance}\n` +
        `   📚 Categories: ${token.categories.length ? token.categories.join(", ") : "None"}`
      )).join("\n\n");

      return {
        content: [{
          type: "text" as const,
          text: `📄 Tokens Found:\n\n${summary}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text" as const,
          text: `❌ Error fetching tokens: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
};
