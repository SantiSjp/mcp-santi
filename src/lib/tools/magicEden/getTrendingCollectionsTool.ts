import { z } from "zod";
import { getTrendingCollections } from "../../clients/magicEden";

const VALID_PERIODS = ["5m", "10m", "30m", "1h", "6h", "1d", "24h", "7d", "30d"] as const;
const VALID_SORT_OPTIONS = ["sales", "volume"] as const;

type Period = typeof VALID_PERIODS[number];
type SortBy = typeof VALID_SORT_OPTIONS[number];

const inputSchema = z.object({
  chain: z.string().describe("Blockchain network (e.g., ethereum, monad-testnet, arbitrum, base, etc)"),
  period: z.string().optional().describe("Time window to aggregate: 5m, 10m, 30m, 1h, 6h, 1d, 24h, 7d, 30d"),
  sortBy: z.string().optional().describe("Sort by sales or volume"),
  limit: z.string().optional().describe("Number of collections to fetch (default 10 if omitted)")
});

export const getTrendingCollectionsTool = {
  name: "magiceden_get_trending_collections",
  description: "Fetch trending NFT collections from Magic Eden RTP API, based on sales or volume.",
  inputSchema,
  handler: async ({ chain, period, sortBy, limit }: z.infer<typeof inputSchema>) => {
    try {
      const safePeriod: Period = VALID_PERIODS.includes(period as Period) ? (period as Period) : "1d";
      const safeSortBy: SortBy = VALID_SORT_OPTIONS.includes(sortBy as SortBy) ? (sortBy as SortBy) : "sales";
      const parsedLimit = limit ? parseInt(limit, 10) : 10;

      if (isNaN(parsedLimit)) {
        throw new Error("Invalid limit value, must be a number.");
      }

      const result = await getTrendingCollections(chain, {
        period: safePeriod,
        sortBy: safeSortBy,
        limit: parsedLimit,
        normalizeRoyalties: false,
        useNonFlaggedFloorAsk: false,
      });

      const collections = result.collections || result;

      if (!collections.length) {
        const response = {
          status: "empty",
          message: `No trending collections found for ${chain}.`,
          metadata: {
            chain: chain.toUpperCase(),
            period: safePeriod,
            sortBy: safeSortBy
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

      const formatNumber = (value: number | string) => {
        if (value === "N/A" || value === undefined) return null;
        return Number(value);
      };

      const response = {
        status: "success",
        metadata: {
          chain: chain.toUpperCase(),
          period: safePeriod,
          sortBy: safeSortBy
        },
        collections: collections.map((col: any, idx: number) => ({
          rank: idx + 1,
          name: col.name || "Unnamed Collection",
          floorPrice: formatNumber(col.floorAsk?.price?.amount?.native),
          salesCount: formatNumber(col.count),
          allTimeVolume: formatNumber(col.collectionVolume?.allTime),
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
