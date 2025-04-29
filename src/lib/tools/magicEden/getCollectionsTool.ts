import { z } from "zod";
import { getCollections } from "../../clients/magicEden";

const VALID_SORT_OPTIONS = ["allTimeVolume", "1DayVolume", "7DayVolume", "30DayVolume"] as const;
type SortBy = typeof VALID_SORT_OPTIONS[number];

const inputSchema = z.object({
  chain: z.string().describe("Blockchain network (e.g., ethereum, monad-testnet, arbitrum, base, etc)"),
  sortBy: z.string().optional().default("allTimeVolume").describe("Sorting method (optional)"),
  limit: z.string().optional().default("10").describe("Number of collections to fetch (default 10)"),
  contract: z.string().optional().describe("Filter by collection contract (optional)"),
});

export const getCollectionsTool = {
  name: "magiceden_get_collections",
  description: "Fetch a list of NFT collections from Magic Eden RTP API, sorted by volume.",
  inputSchema,
  handler: async ({ chain, sortBy, limit, contract }: z.infer<typeof inputSchema>) => {
    try {
      let parsedLimit = parseInt(limit || "10", 10);
      if (isNaN(parsedLimit)) {
        throw new Error("Invalid limit value, must be a number.");
      }

      const safeSortBy: SortBy = VALID_SORT_OPTIONS.includes(sortBy as SortBy)
        ? (sortBy as SortBy)
        : "allTimeVolume";

      if (contract && !limit) {
        parsedLimit = 1;
      }

      const filters: any = {
        sortBy: safeSortBy,
        limit: parsedLimit,
        includeMintStages: false,
        includeSecurityConfigs: false,
        normalizeRoyalties: false,
        useNonFlaggedFloorAsk: false,
      };

      if (contract) {
        filters.contract = [contract];
      }

      const result = await getCollections(chain, filters);

      const collections = result.collections || result;

      if (!collections.length) {
        const response = {
          chain,
          collections: [],
          message: "No collections found for this chain.",
        };

        return {
          content: [{
            type: "text",
            text: JSON.stringify(response),
          }] as const,
        };
      }

      const response = {
        chain,
        collections: collections.map((col: any) => ({
          name: col.name || "Unnamed",
          symbol: col.symbol || "N/A",
          floorPrice: col.floorAsk?.price?.amount?.native ?? null,
          volumeAllTime: col.volume?.allTime ?? null,
          contractAddress: col.contract || null,
          imageUrl: col.imageUrl || "",
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
