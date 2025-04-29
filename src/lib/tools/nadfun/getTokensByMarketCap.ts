// src/tools/nadfun/getTokensByMarketCapTool.ts
import { z } from "zod";
import { getTokensByMarketCap } from "../../clients/nadfun/nadfunApi";

const inputSchema = z.object({
  page: z.preprocess(
    (val) => typeof val === "string" ? parseInt(val, 10) : val,
    z.number().int().min(1).default(1)
  ).describe("Page number for pagination"),

  limit: z.preprocess(
    (val) => typeof val === "string" ? parseInt(val, 10) : val,
    z.number().int().min(1).default(10)
  ).describe("Items per page")
});

function jsonSafeStringify(obj: any): string {
  return JSON.stringify(obj, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
}

export const getTokensByMarketCapTool = {
  name: "nadfun_get_tokens_by_market_cap",
  description: "Get tokens ordered by their market capitalization (highest first).",
  inputSchema,
  handler: async ({ page, limit }: z.infer<typeof inputSchema>) => {
    try {
      const result = await getTokensByMarketCap(page, limit);

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
