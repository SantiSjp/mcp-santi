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

export const getTokensByMarketCapTool = {
  name: "nadfun_get_tokens_by_market_cap",
  description: "Get tokens ordered by their market capitalization (highest first).",
  inputSchema,
  handler: async ({ page, limit }: z.infer<typeof inputSchema>) => {
    try {
      const result = await getTokensByMarketCap(page, limit);
      const formatted = result.order_token
        .map((t: any, i: number) => `${i + 1}. ${t.token_info.name} (${t.token_info.symbol}) — ${t.market_info.price} MON`)
        .join("\n");

      return {
        content: [{ type: "text" as const, text: `💰 Tokens por capitalização de mercado:\n\n${formatted}` }]
      };
    } catch (error) {
      return {
        content: [{ type: "text" as const, text: `Erro ao buscar tokens por market cap: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true
      };
    }
  }
};