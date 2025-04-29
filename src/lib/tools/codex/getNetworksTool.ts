import { z } from "zod";
import { getNetworks } from "../../clients/codex";

export const getCodexNetworksTool = {
  name: "codex_get_networks",
  description: "Fetches all supported networks from Codex and returns them in JSON format.",
  inputSchema: z.object({}),
  handler: async () => {
    try {
      const networks = await getNetworks();

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              status: "success",
              data: networks,
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
