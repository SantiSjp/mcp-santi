// src/tools/account/getTokensByCreationTime.ts
import { z } from "zod";
import { getTokensByCreationTime } from "../../clients/nadfun/nadfunApi";

const inputSchema = z.object({
  page: z.number().int().min(1).default(1).nullable().transform((v) => v ?? 1),
  limit: z.number().int().min(1).default(10).nullable().transform((v) => v ?? 10)
});

function jsonSafeStringify(obj: any): string {
  return JSON.stringify(obj, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
}

export const getTokensByCreationTimeTool = {
  name: "nadfun_get_tokens_by_creation_time",
  description: "Get tokens ordered by their creation time (newest first).",
  inputSchema,
  handler: async ({ page, limit }: z.infer<typeof inputSchema>) => {
    try {
      const result = await getTokensByCreationTime(page, limit);

      const response = {
        status: "success",
        metadata: {
          page,
          limit,
          count: result.order_token.length,
        },
        tokens: result.order_token,
      };

      return {
        content: [{
          type: "text" as const,
          text: jsonSafeStringify(response),
        }]
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
        isError: true
      };
    }
  }
};
