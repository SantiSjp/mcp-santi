import { z } from "zod";
import { getAccountNFTs } from "../../clients/blockvision";

const inputSchema = z.object({
  address: z.string().describe("User wallet address (0x...)"),
  pageIndex: z.string().optional().describe("Page number to fetch (default 1)"),
});

export const getAccountNFTsTool = {
  name: "monad_get_account_nfts",
  description: "Fetches all NFTs owned by a specific wallet address from Blockvision API.",
  inputSchema,
  handler: async ({ address, pageIndex }: z.infer<typeof inputSchema>) => {
    try {
      const page = pageIndex ? parseInt(pageIndex, 10) : 1;
      const result = await getAccountNFTs(address, page);

      if (!result.result?.data || result.result.data.length === 0) {
        const response = {
          address,
          nfts: [],
          message: "No NFTs found for this address.",
        };

        return {
          content: [{
            type: "text",
            text: JSON.stringify(response),
          }] as const,
        };
      }

      // Mapear todos os itens de todos os contratos encontrados
      const nfts = result.result.data.flatMap((collection: any) =>
        collection.items.map((item: any) => ({
          collectionName: collection.name,
          contractAddress: item.contractAddress,
          tokenId: item.tokenId,
          name: item.name || "Unnamed NFT",
          image: item.image || null,
        }))
      );

      const response = {
        address,
        nfts,
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
