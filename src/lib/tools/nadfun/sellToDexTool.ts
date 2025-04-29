import { z } from "zod";
import { sellToDex } from "../../clients/nadfun/nadFunAbi";

const inputSchema = z.object({
  privateKey: z.string().describe("Private key of the wallet"),
  tokenAddress: z.string().describe("Address of the token to sell"),
  amountTokens: z.string().describe("Amount of tokens to sell (e.g., '1000.0')"),
  slippage: z.number().min(0).max(100).default(0.5).describe("Slippage percentage (default 0.5%)")
});

export const sellToDexTool = {
  name: "nadfun_sell_to_dex",
  description: "Sell tokens to the DEX (Uniswap V2) after they are listed.",
  inputSchema,
  handler: async ({ privateKey, tokenAddress, amountTokens, slippage }: z.infer<typeof inputSchema>) => {
    try {
      const txHash = await sellToDex(privateKey, tokenAddress, amountTokens, slippage);

      return {
        content: [
          {
            type: "text",
            text: `✅ Successfully sold token!\nTx Hash: ${txHash}`
          } as const
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error selling to DEX: ${error instanceof Error ? error.message : String(error)}`
          } as const
        ],
        isError: true
      };
    }
  }
};
