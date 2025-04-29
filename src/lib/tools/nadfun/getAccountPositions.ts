// src/tools/account/getAccountPositions.ts
import { z } from "zod";
import { getAccountPositions } from "../../clients/nadfun/nadfunApi";

const inputSchema = z.object({
  address: z.string().describe("The account EOA address"),
  positionType: z.enum(["all", "open", "close"]).default("all").describe("Filter type: all, open, or close"),
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

export const getAccountPositionsTool = {
  name: "nadfun_get_account_positions",
  description: "Get token positions held by an account, filtered by position type.",
  inputSchema,
  handler: async ({ address, positionType, page, limit }: z.infer<typeof inputSchema>) => {
    try {
      const result = await getAccountPositions(address, positionType, page, limit);
  
      const tokens = result.positions;
      if (!tokens.length) {
        return {
          content: [
            {
              type: "text",
              text: `📊 Nenhuma posição encontrada para ${address} com filtro "${positionType}".`
            } as const
          ]
        };
      }
  
      const resumo = tokens
        .map((pos: any, i: number) => {
          const token = pos.token;
          const position = pos.position;
          const market = pos.market;
  
          return `${i + 1}. ${token.name} (${token.symbol})\n` +
                 `   📈 Preço: ${market.price} MON\n` +
                 `   🎯 Quantidade: ${position.current_token_amount}\n` +
                 `   💸 PnL Total: ${position.total_pnl} (Realizado: ${position.realized_pnl}, Não Realizado: ${position.unrealized_pnl})\n`;
        })
        .join("\n");
  
      return {
        content: [
          {
            type: "text",
            text: `📦 Posições de ${address} [${positionType.toUpperCase()}]:\n\n${resumo}`
          } as const
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Erro ao buscar posições da conta: ${error instanceof Error ? error.message : String(error)}`
          } as const
        ],
        isError: true
      };
    }
  }  
};