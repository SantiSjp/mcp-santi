// src/tools/monorail/getWalletBalancesTool.ts
import { z } from "zod";
import { getWalletBalances } from "../../clients/monorail/monorailApi";

// Define o input da ferramenta
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
        return {
          content: [{
            type: "text" as const,
            text: `📭 No token balances found for address ${address}.`
          }]
        };
      }

      const summary = balances
        .map((token: any, idx: number) => {
          return `${idx + 1}. ${token.name || "Unnamed Token"} (${token.symbol || "?"})\n` +
                 `   🪙 Balance: ${token.balance}\n` +
                 `   📜 Categories: ${token.categories.join(", ") || "None"}`;
        })
        .join("\n\n");

      return {
        content: [{
          type: "text" as const,
          text: `👜 Token Balances for ${address}:\n\n${summary}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text" as const,
          text: `❌ Error fetching wallet balances: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
};
