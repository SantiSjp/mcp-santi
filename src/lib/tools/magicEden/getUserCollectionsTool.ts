import { z } from "zod";
import { getUserCollections } from "../../clients/magicEden";

const inputSchema = z.object({
  chain: z.string().describe("Blockchain network (e.g., ethereum, monad, base, etc.)"),
  user: z.string().describe("Wallet address starting with 0x."),
});

export const getUserCollectionsTool = {
  name: "magiceden_get_user_collections",
  description: "Fetch NFT collections owned by a user from Magic Eden RTP API.",
  inputSchema,
  handler: async ({ chain, user }: z.infer<typeof inputSchema>) => {
    try {
      const result = await getUserCollections(chain, user);

      const collections = result.collections || result;

      if (!collections.length) {
        const response = {
          status: "empty",
          message: `No collections found for user ${user} on ${chain}.`,
          metadata: {
            chain: chain.toUpperCase(),
            user
          },
          collections: []
        };

        return {
          content: [{
            type: "text" as const,
            text: JSON.stringify(response),
          }]
        };
      }

      const formatNumber = (value: number | string | undefined) => {
        if (value === undefined || value === "N/A") return null;
        return Number(value);
      };

      const response = {
        status: "success",
        metadata: {
          chain: chain.toUpperCase(),
          user
        },
        collections: collections.map((entry: any) => ({
          name: entry.collection?.name || "Unnamed Collection",
          floorPrice: formatNumber(entry.collection?.floorAskPrice?.amount?.native),
          tokensOwned: formatNumber(entry.ownership?.tokenCount),
          tokensOnSale: formatNumber(entry.ownership?.onSaleCount),
        }))
      };

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify(response),
        }]
      };
    } catch (error) {
      const response = {
        status: "error",
        message: error instanceof Error ? error.message : String(error),
      };

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify(response),
        }],
        isError: true
      };
    }
  }
};
