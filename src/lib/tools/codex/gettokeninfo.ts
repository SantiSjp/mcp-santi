// src/tools/codex/getTokenInfoTool.ts
import { z } from "zod";
import { getTokenInfoFromCodex } from "../../clients/codex";

const inputSchema = z.object({
  address: z.string().describe("Token address"),
});

export const getMonadTokenInfoTool = {
  name: "codex_get_token_info",
  description: "Fetch detailed token info from Codex by network ID and token address.",
  inputSchema,
  handler: async ({address }: z.infer<typeof inputSchema>) => {
    try {
      const token = await getTokenInfoFromCodex(address);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              status: "success",
              token,
            }),
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
