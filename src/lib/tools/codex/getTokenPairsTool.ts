// src/tools/codex/getTokenPairsTool.ts
import { z } from "zod";
import { getTokenPairs } from "../../clients/codex"; // ajuste conforme o seu caminho

const inputSchema = z.object({
    tokenAddress: z.string().startsWith("0x").describe("Token address to find trading pairs for"),
  });
  

  export const getTokenPairsTool = {
    name: "codex_get_token_pairs",
    description: "Fetch trading pairs for a given token on Monad Testnet (networkId: 10143).",
    inputSchema,
    handler: async ({ tokenAddress }: z.infer<typeof inputSchema>) => {
    try {
      const pairs = await getTokenPairs(tokenAddress);
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            status: "success",
            pairs,
          }),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            status: "error",
            message: error instanceof Error ? error.message : String(error),
          }),
        }],
        isError: true,
      };
    }
  }
};
