import { z } from "zod";
import { getUserDomainsByTld } from "../../clients/allDomains";

const inputSchema = z.object({
  address: z.string().describe("User's EVM address."),
  tld: z.string().describe("Specific TLD (e.g., .mon)"),
});

export const getUserDomainsByTldTool = {
  name: "get_user_domains_by_tld",
  description: "Fetches domains under a specific TLD registered by a user.",
  inputSchema,
  handler: async ({ address, tld }: z.infer<typeof inputSchema>) => {
    try {
      const domains = await getUserDomainsByTld(address, tld);

      if (!domains.length) {
        const response = {
          address,
          tld,
          domains: [],
          message: "No domains found for this address and TLD.",
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
        tld,
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
  }
};
