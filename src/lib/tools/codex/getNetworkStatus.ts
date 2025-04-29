import { z } from "zod";
import { getNetworkStatus } from "../../clients/codex"; // ajuste o caminho conforme seu projeto

// Primeiro define o inputSchema separado
const inputSchema = z.object({
  networkId: z.string().describe("The network ID to fetch the status for (e.g., '10143' for Monad Testnet)"),
});

export const getNetworkStatusTool = {
  name: "codex_get_network_status",
  description: "Fetch the latest block and timestamp for a given networkId from Codex.",
  inputSchema, 
  handler: async ({ networkId }: z.infer<typeof inputSchema>) => {
    try {  

      const status = await getNetworkStatus(networkId);

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            status: "success",
            metadata: status,
          }),
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
        isError: true,
      };
    }
  }
};
