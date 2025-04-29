// src/tools/account/getCreatedTokens.ts
import { z } from "zod";
import { getCreatedTokens } from "../../clients/nadfun/nadfunApi";

const inputSchema = z.object({
  address: z.string().describe("The account EOA address"),
  page: z
    .number()
    .int()
    .min(1)
    .default(1)
    .nullable()
    .transform((val) => val ?? 1)
    .describe("Page number for pagination"),
  limit: z
    .number()
    .int()
    .min(1)
    .default(10)
    .nullable()
    .transform((val) => val ?? 10)
    .describe("Items per page"),
});

function jsonSafeStringify(obj: any): string {
  return JSON.stringify(obj, (_, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
}

export const getCreatedTokensTool = {
  name: "nadfun_get_created_tokens",
  description: "Get tokens created by a specific account.",
  inputSchema,
  handler: async ({ address, page, limit }: z.infer<typeof inputSchema>) => {
    try {
      const result = await getCreatedTokens(address, page, limit);

      const response = {
        status: "success",
        metadata: {
          address,
          page,
          limit,
          count: result.tokens.length,
        },
        tokens: result.tokens,
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
