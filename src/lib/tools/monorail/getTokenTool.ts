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
              text: JSON.stringify({
                status: "empty",
                message: `Token not found for address: ${contractAddress}`,
                metadata: { contractAddress }
              })
            }
          ],
          isError: true
        };
      }

      const response = {
        status: "success",
        metadata: { contractAddress },
        token: {
          name: data.name,
          symbol: data.symbol,
          decimals: data.decimals,
          address: data.address,
          categories: data.categories.length > 0 ? data.categories : []
        }
      };

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response)
          }
        ]
      };
    } catch (error) {
      const response = {
        status: "error",
        message: error instanceof Error ? error.message : String(error),
        metadata: { contractAddress }
      };

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response)
          }
        ],
        isError: true
      };
    }
  }
};
