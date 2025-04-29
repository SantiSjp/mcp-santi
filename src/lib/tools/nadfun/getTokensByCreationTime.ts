import { z } from "zod";
import { getTokensByCreationTime } from "../../clients/nadfun/nadfunApi";

const inputSchema = z.object({
  page: z.number().int().min(1).default(1).nullable().transform((v) => v ?? 1),
  limit: z.number().int().min(1).default(10).nullable().transform((v) => v ?? 10)
});

export const getTokensByCreationTimeTool = {
  name: "nadfun_get_tokens_by_creation_time",
  description: "Get tokens ordered by their creation time (newest first).",
  inputSchema,
  handler: async ({ page, limit }: z.infer<typeof inputSchema>) => {
    try {
      const result = await getTokensByCreationTime(page, limit);
      const formatted = result.order_token
        .map((t: any, i: number) => `${i + 1}. ${t.token_info.name} (${t.token_info.symbol}) — ${t.market_info.price} MON`)
        .join("\n");

      return {
        content: [{ type: "text" as const, text: `🆕 Tokens mais recentes:\n\n${formatted}` }]
      };
    } catch (error) {
      return {
        content: [{ type: "text" as const, text: `Erro ao buscar tokens por criação: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true
      };
    }
  }
};
