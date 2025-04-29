// Primeiro: corrigindo o Tool para retornar JSON seguro

import { z } from "zod";
import { getTokensByLatestTrade } from "../../clients/nadfun/nadfunApi";

const inputSchema = z.object({
  page: z.number().int().min(1).default(1).nullable().transform((v) => v ?? 1),
  limit: z.number().int().min(1).default(10).nullable().transform((v) => v ?? 10)
});

function jsonSafeStringify(obj: any): string {
  return JSON.stringify(obj, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
}

export const getTokensByLatestTradeTool = {
  name: "nadfun_get_tokens_by_latest_trade",
  description: "Get tokens ordered by their most recent trade.",
  inputSchema,
  handler: async ({ page, limit }: z.infer<typeof inputSchema>) => {
    try {
      const result = await getTokensByLatestTrade(page, limit);

      const response = {
        status: "success",
        metadata: {
          page,
          limit,
          count: result.order_token.length,
        },
        tokens: result.order_token,
      };

      return {
        content: [{
          type: "text" as const,
          text: jsonSafeStringify(response)
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