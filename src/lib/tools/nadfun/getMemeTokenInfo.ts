// src/tools/nadfun/getMemeTokenInfoTool.ts
import { z } from "zod";
import { getTokenInfo } from "../../clients/nadfun/nadfunApi";

const inputSchema = z.object({
  tokenAddress: z.string().describe("Token address"),
});

function jsonSafeStringify(obj: any): string {
  return JSON.stringify(obj, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
}

export const getMemeTokenInfoTool = {
  name: "nadfun_get_meme_token_info",
  description: "Get detailed metadata about a token.",
  inputSchema,
  handler: async ({ tokenAddress }: z.infer<typeof inputSchema>) => {
    try {
      const data = await getTokenInfo(tokenAddress);

      const response = {
        status: "success",
        metadata: {
          address: tokenAddress,
        },
        token: {
          name: data.name,
          symbol: data.symbol,
          creator: data.creator_address,
          price: data.price ?? null,
          totalSupply: data.total_supply,
          description: data.description ?? null,
        },
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
