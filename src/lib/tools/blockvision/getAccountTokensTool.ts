import { z } from "zod";
import { getAccountTokens } from "../../clients/blockvision";

const inputSchema = z.object({
  address: z.string().describe("User wallet address (0x...)"),
  pageIndex: z.string().optional().describe("Page number to fetch (default 1)"),
});

export const getAccountTokensTool = {
  name: "monad_get_account_tokens",
  description: "Fetch all ERC-20 tokens owned by a specific wallet address from Blockvision API.",
  inputSchema,
  handler: async ({ address, pageIndex }: z.infer<typeof inputSchema>) => {
    try {
      const page = pageIndex ? parseInt(pageIndex, 10) : 1;
      const result = await getAccountTokens(address, page);

      const tokens = result?.result?.data || [];

      if (tokens.length === 0) {
        const response = {
          address,
          tokens: [],
          message: "No tokens found for this address.",
        };

        return {
          content: [{
            type: "text",
            text: JSON.stringify(response),
          }] as const,
        };
      }

      const response = {
        address,
        tokens: tokens.map((token: any) => ({
          name: token.name || "Unknown",
          symbol: token.symbol || "Unknown",
          balance: token.balance || "0",
          contractAddress: token.contractAddress || "",
          imageURL: token.imageURL || "",
          decimal: token.decimal ?? null,
          verified: token.verified ?? null,
        })),
      };

      return {
        content: [{
          type: "text",
          text: JSON.stringify(response),
        }] as const,
      };
    } catch (error) {
      const response = {
        error: error instanceof Error ? error.message : String(error),
      };

      return {
        content: [{
          type: "text",
          text: JSON.stringify(response),
        }] as const,
        isError: true,
      };
    }
  }
};
