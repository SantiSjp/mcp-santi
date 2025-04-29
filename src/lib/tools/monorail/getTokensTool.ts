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
            text: JSON.stringify({
              status: "empty",
              message: "No tokens found matching the criteria.",
              metadata: {
                find: find || null,
                offset: parsedOffset,
                limit: parsedLimit
              },
              tokens: []
            })
          }]
        };
      }

      const response = {
        status: "success",
        metadata: {
          find: find || null,
          offset: parsedOffset,
          limit: parsedLimit
        },
        tokens: tokens.map((token) => ({
          name: token.name || "Unnamed",
          symbol: token.symbol || "-",
          address: token.address,
          decimals: token.decimals,
          balance: token.balance,
          categories: token.categories || []
        }))
      };

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify(response),
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            status: "error",
            message: error instanceof Error ? error.message : String(error)
          })
        }],
        isError: true
      };
    }
  }
};
