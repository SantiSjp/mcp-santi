import { z } from "zod";
import { getOwnerFromDomainTld } from "../../clients/allDomains";

const inputSchema = z.object({
  domainTld: z.string().describe("Full domain name (e.g., miester.mon)"),
});

export const getOwnerFromDomainTldTool = {
  name: "get_owner_from_domain_tld",
  description: "Fetches the owner address of a specific domain.",
  inputSchema,
  handler: async ({ domainTld }: z.infer<typeof inputSchema>) => {
    try {
      const owner = await getOwnerFromDomainTld(domainTld);

      const response = {
        domainTld,
        owner,
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
