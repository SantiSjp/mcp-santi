import { z } from "zod";
import { getNameRecordFromDomainTld } from "../../clients/allDomains";

const inputSchema = z.object({
  domainTld: z.string().describe("Full domain name (e.g., miester.mon)"),
});

export const getNameRecordFromDomainTldTool = {
  name: "get_name_record_from_domain_tld",
  description: "Fetches the complete NameRecord of a domain.",
  inputSchema,
  handler: async ({ domainTld }: z.infer<typeof inputSchema>) => {
    try {
      const record = await getNameRecordFromDomainTld(domainTld);

      const response = {
        domainTld,
        nameRecord: {
          createdAt: new Date(record.created_at * 1000).toISOString(),
          expiresAt: new Date(record.expires_at * 1000).toISOString(),
          mainDomainAddress: record.main_domain_address,
          transferrable: record.transferrable,
        },
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
