// src/tools/account/getTokenHolders.ts
import { z } from "zod";
import { getTokenHolders } from "../../clients/nadfun/nadfunApi";

const inputSchema = z.object({
  tokenAddress: z.string().describe("Token address"),
  page: z.number().int().min(1).default(1).nullable().transform((v) => v ?? 1),
  limit: z.number().int().min(1).default(10).nullable().transform((v) => v ?? 10),
});

function jsonSafeStringify(obj: any): string {
  return JSON.stringify(obj, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
}

export const getTokenHoldersTool = {
  name: "nadfun_get_token_holders",
  description: "Get list of holders for a given token.",
  inputSchema,
  handler: async ({ tokenAddress, page, limit }: z.infer<typeof inputSchema>) => {
    try {
      const result = await getTokenHolders(tokenAddress, page, limit);

      const response = {
        status: "success",
        metadata: {
          tokenAddress,
          page,
          limit,
          totalCount: result.total_count,
          count: result.holders.length,
        },
        holders: result.holders.map((h: any) => ({
          accountAddress: h.account_address,
          isDev: h.is_dev,
          balance: h.balance
        })),
      };

      return {
        content: [{
          type: "text" as const,
          text: jsonSafeStringify(response),
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
