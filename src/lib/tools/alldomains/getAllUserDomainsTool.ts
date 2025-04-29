import { z } from "zod";
import { getAllUserDomains } from "../../clients/allDomains";

const inputSchema = z.object({
  address: z.string().describe("User's EVM address to fetch all domains."),
});

export const getAllUserDomainsTool = {
  name: "get_all_user_domains",
  description: "Fetches all domains registered by a user.",
  inputSchema,
  handler: async ({ address }: z.infer<typeof inputSchema>) => {
    try {
      const domains = await getAllUserDomains(address);

      if (!domains.length) {
        const response = {
          address,
          domains: [],
          message: "No domains found."
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
        domains: domains.map((d: any) => ({
          domain: `${d.domain_name}${d.tld}`,
        })),
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
