import { z } from "zod";
import { getWalletBalances } from "../../clients/monorail/monorailApi";

const inputSchema = z.object({
  address: z.string().describe("Monad wallet address to fetch token balances"),
});

export const getWalletBalancesTool = {
  name: "monorail_get_wallet_balances",
  description: "Fetch the list of token balances for a specific wallet address using Monorail Data API.",
  inputSchema,
  handler: async ({ address }: z.infer<typeof inputSchema>) => {
    try {
      const balances = await getWalletBalances(address);

      if (!balances.length) {
        const response = {
          status: "empty",
          message: `No token balances found for address ${address}.`,
          metadata: { address },
          tokens: []
        };

        return {
          content: [{
            type: "text" as const,
            text: JSON.stringify(response)
          }]
        };
      }

      const response = {
        status: "success",
        metadata: { address },
        tokens: balances.map((token: any) => ({
          name: token.name || "Unnamed Token",
          symbol: token.symbol || "?",
          balance: token.balance ?? null,
          categories: token.categories.length > 0 ? token.categories : []
        }))
      };

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify(response)
        }]
      };
    } catch (error) {
      const response = {
        status: "error",
        message: error instanceof Error ? error.message : String(error),
        metadata: { address }
      };

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify(response)
        }],
        isError: true
      };
    }
  }
};
