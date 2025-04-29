import { z } from "zod";
import { getTokenHolders } from "../../clients/nadfun/nadfunApi";

const inputSchema = z.object({
  tokenAddress: z.string().describe("Token address"),
  page: z.number().int().min(1).default(1).nullable().transform((v) => v ?? 1),
  limit: z.number().int().min(1).default(10).nullable().transform((v) => v ?? 10)
});

export const getTokenHoldersTool = {
  name: "nadfun_get_token_holders",
  description: "Get list of holders for a given token.",
  inputSchema,
  handler: async ({ tokenAddress, page, limit }: z.infer<typeof inputSchema>) => {
    try {
      const result = await getTokenHolders(tokenAddress, page, limit);
      const holders = result.holders
        .map((h: any, i: number) => `${i + 1}. ${h.account_address} — ${h.current_amount}${h.is_dev ? " (Dev)" : ""}`)
        .join("\n");

      return {
        content: [{
          type: "text" as const,
          text: `👥 Holders do token ${tokenAddress} (total: ${result.total_count}):\n\n${holders}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text" as const,
          text: `Erro ao buscar holders do token: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
};