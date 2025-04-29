import { z } from "zod";
import { getToken } from "../../clients/monorail/monorailApi"; 

const inputSchema = z.object({
  contractAddress: z.string().describe("Token contract address (must be a valid Monad address)")
});

export const getTokenInfoTool = {
  name: "monorail_get_token_info",
  description: "Fetch detailed information about a token on Monad using the Monorail Data API.",
  inputSchema,
  handler: async ({ contractAddress }: z.infer<typeof inputSchema>) => {
    try {
      const data = await getToken(contractAddress);

      if (!data || !data.name) {
        return {
          content: [
            {
              type: "text" as const,
              text: `❌ Token not found for address: ${contractAddress}`
            }
          ],
          isError: true
        };
      }

      return {
        content: [
          {
            type: "text" as const,
            text: `🪙 Token Details:\n\n` +
                  `• Name: ${data.name}\n` +
                  `• Symbol: ${data.symbol}\n` +
                  `• Decimals: ${data.decimals}\n` +
                  `• Categories: ${data.categories.length > 0 ? data.categories.join(", ") : "None"}\n` +
                  `• Address: ${data.address}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `❌ Error fetching token details: ${error instanceof Error ? error.message : String(error)}`
          }
        ],
        isError: true
      };
    }
  }
};
