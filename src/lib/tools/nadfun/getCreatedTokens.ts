// src/tools/account/getCreatedTokens.ts
import { z } from "zod";
import { getCreatedTokens } from "../../clients/nadfun/nadfunApi";

const inputSchema = z.object({
    address: z.string().describe("The account EOA address"),
    page: z
      .number()
      .int()
      .min(1)
      .default(1)
      .nullable()
      .transform((val) => val ?? 1)
      .describe("Page number for pagination"),
    limit: z
      .number()
      .int()
      .min(1)
      .default(10)
      .nullable()
      .transform((val) => val ?? 10)
      .describe("Items per page")
  });

export const getCreatedTokensTool = {
  name: "nadfun_get_created_tokens",
  description: "Get tokens created by a specific account.",
  inputSchema,
  handler: async ({ address, page, limit }: z.infer<typeof inputSchema>) => {
    try {
      const result = await getCreatedTokens(address, page, limit);
  
      const resumo = result.tokens
        .map((t: any, i: number) => {
          return `${i + 1}. ${t.token.name} (${t.token.symbol}) — ${t.price} MON\n` +
                 `   🧠 Criador: ${t.token.creator}\n` +
                 `   🧾 Supply: ${t.token.total_supply} — Market Cap: ${t.market_cap}`;
        })
        .join("\n\n");
  
      return {
        content: [
          {
            type: "text",
            text: `📦 Tokens criados por ${address}:\n\n${resumo || "Nenhum token encontrado."}`
          } as const
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Erro ao buscar tokens criados pela conta: ${error instanceof Error ? error.message : String(error)}`
          } as const
        ],
        isError: true
      };
    }
  }
};
