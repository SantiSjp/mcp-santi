import { z } from "zod";
import { getMainDomain } from "../../clients/allDomains";

const inputSchema = z.object({
  address: z.string().describe("User's EVM address."),
});

export const getMainDomainTool = {
  name: "get_main_domain",
  description: "Fetches the main configured domain of a user.",
  inputSchema,
  handler: async ({ address }: z.infer<typeof inputSchema>) => {
    try {
      const domain = await getMainDomain(address);

      if (!domain) {
        const response = {
          address,
          mainDomain: null,
          message: "No main domain configured for this address.",
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response),
            } as const,
          ],
        };
      }

      const response = {
        address,
        mainDomain: domain,
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response),
          } as const,
        ],
      };
    } catch (error) {
      const response = {
        error: error instanceof Error ? error.message : String(error),
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response),
          } as const,
        ],
        isError: true,
      };
    }
  },
};
