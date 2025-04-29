import { z } from "zod";
import { getTokensByLatestTrade } from "../../clients/nadfun/nadfunApi";

const inputSchema = z.object({
  page: z.number().int().min(1).default(1).nullable().transform((v) => v ?? 1),
  limit: z.number().int().min(1).default(10).nullable().transform((v) => v ?? 10)
});

export const getTokensByLatestTradeTool = {
  name: "nadfun_get_tokens_by_latest_trade",
  description: "Get tokens ordered by their most recent trade.",
  inputSchema,
  handler: async ({ page, limit }: z.infer<typeof inputSchema>) => {
    try {
      const result = await getTokensByLatestTrade(page, limit);
      const formatted = result.order_token
        .map((t: any, i: number) => `${i + 1}. ${t.token_info.name} (${t.token_info.symbol}) — ${t.market_info.price} MON`)
        .join("\n");

      return {
        content: [{ type: "text" as const, text: `📈 Tokens por última negociação:\n\n${formatted}` }]
      };
    } catch (error) {
      return {
        content: [{ type: "text" as const, text: `Erro ao buscar tokens por última negociação: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true
      };
    }
  }
};
