import { z } from "zod";
import { getTokenInfo } from "../../clients/nadfun/nadfunApi";

const inputSchema = z.object({
  tokenAddress: z.string().describe("Token address")
});

export const getMemeTokenInfoTool = {
  name: "nadfun_get_meme_token_info",
  description: "Get detailed metadata about a token.",
  inputSchema,
  handler: async ({ tokenAddress }: z.infer<typeof inputSchema>) => {
    try {
      const data = await getTokenInfo(tokenAddress);

      return {
        content: [{
          type: "text" as const,
          text: `🪙 ${data.name} (${data.symbol})\nCriador: ${data.creator_address}\nPreço: ${data.price || "N/A"}\nSupply: ${data.total_supply}\nDescrição: ${data.description || "(sem descrição)"}`
        }]
      };
    } catch (error) {
      return {
        content: [{ type: "text" as const, text: `Erro ao buscar informações do token: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true
      };
    }
  }
};
