import { z } from "zod";
import { buyFromDex } from "../../clients/nadfun/nadFunAbi";

const inputSchema = z.object({
  privateKey: z.string().describe("Private key of the wallet"),
  tokenAddress: z.string().describe("Address of the token to buy"),
  amountMON: z.string().describe("Amount of MON to spend (e.g., '1.0')"),
  slippage: z.number().min(0).max(100).default(0.5).describe("Slippage percentage (default 0.5%)")
});

export const buyFromDexTool = {
  name: "nadfun_buy_from_dex",
  description: "Buy tokens from the DEX (Uniswap V2) after they are listed.",
  inputSchema,
  handler: async ({ privateKey, tokenAddress, amountMON, slippage }: z.infer<typeof inputSchema>) => {
    try {
      const txHash = await buyFromDex(privateKey, tokenAddress, amountMON, slippage);

      return {
        content: [
          {
            type: "text",
            text: `✅ Successfully bought token!\nTx Hash: ${txHash}`
          } as const
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error buying from DEX: ${error instanceof Error ? error.message : String(error)}`
          } as const
        ],
        isError: true
      };
    }
  }
};
