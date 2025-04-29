import { z } from "zod";
import { getNftCollectionMetadata } from "../../clients/codex";

const inputSchema = z.object({
  address: z.string().startsWith("0x").length(42).describe("NFT collection contract address"),
});

export const getNftCollectionMetadataTool = {
  name: "codex_get_nft_collection_metadata",
  description: "Fetch NFT collection metadata from Codex by address on Monad Testnet.",
  inputSchema,
  handler: async ({ address }: z.infer<typeof inputSchema>) => {
    try {
      const metadata = await getNftCollectionMetadata(address);

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            status: "success",
            metadata,
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
