// src/tools/account/getAccountPositions.ts
import { z } from "zod";
import { getAccountPositions } from "../../clients/nadfun/nadfunApi";

const inputSchema = z.object({
  address: z.string().describe("The account EOA address"),
  positionType: z.enum(["all", "open", "close"]).default("all").describe("Filter type: all, open, or close"),
  page: z.number().int().min(1).default(1).nullable().transform((val) => val ?? 1).describe("Page number for pagination"),
  limit: z.number().int().min(1).default(10).nullable().transform((val) => val ?? 10).describe("Items per page"),
});

function jsonSafeStringify(obj: any): string {
  return JSON.stringify(obj, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
}

export const getAccountPositionsTool = {
  name: "nadfun_get_account_positions",
  description: "Get token positions held by an account, filtered by position type.",
  inputSchema,
  handler: async ({ address, positionType, page, limit }: z.infer<typeof inputSchema>) => {
    try {
      const result = await getAccountPositions(address, positionType, page, limit);

      const response = {
        status: "success",
        metadata: {
          address,
          positionType,
          page,
          limit,
          count: result.positions.length,
        },
        positions: result.positions,
      };

      return {
        content: [
          {
            type: "text" as const,
            text: jsonSafeStringify(response),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              status: "error",
              message: error instanceof Error ? error.message : String(error),
            }),
          },
        ],
        isError: true,
      };
    }
  },
};
