import { z } from "zod";
import { getTokenHolders } from "../../clients/blockvision";

const inputSchema = z.object({
  contractAddress: z.string().describe("ERC-20 Token contract address (0x...)"),
  pageSize: z.string().optional().describe("Number of holders per page (default 20, max 50)"),
  pageIndex: z.string().optional().describe("Page number to fetch (default 1)"),
});

export const getMonadTokenHoldersTool = {
  name: "monad_get_token_holders",
  description: "Fetch token holders for a specific ERC-20 token using Blockvision API.",
  inputSchema,
  handler: async ({ contractAddress, pageSize, pageIndex }: z.infer<typeof inputSchema>) => {
    try {
      const size = pageSize ? parseInt(pageSize, 10) : 20;
      const page = pageIndex ? parseInt(pageIndex, 10) : 1;

      const result = await getTokenHolders(contractAddress, size, page);

      if (!result.holders || result.holders.length === 0) {
        return {
          content: [{
            type: "text",
            text: `📦 No holders found for contract: ${contractAddress}`
          }]
        };
      }

      const summary = result.holders.map((holder: any, idx: number) =>
        `${idx + 1}. ${holder.address} - Balance: ${holder.balance}`
      ).join("\n");

      return {
        content: [{
          type: "text",
          text: `👥 Token Holders for ${contractAddress}:\n\n${summary}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `❌ Error fetching token holders: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
};
