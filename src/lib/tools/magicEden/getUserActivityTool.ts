import { z } from "zod";
import { getUserActivity } from "../../clients/magicEden";

const inputSchema = z.object({
  chain: z.string().describe("Blockchain network (e.g., ethereum, monad, base, etc)"),
  users: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Must be a valid 0x wallet address")
    .min(1, "At least one user address is required")
    .max(50, "A maximum of 50 user addresses is allowed")
    .describe("Array of user wallet addresses (max 50). Example: [\"0x1234...\", \"0x5678...\"]")
});

export const getUserActivityTool = {
  name: "magiceden_get_user_activity",
  description: "Fetch recent activity (mint, sale, transfer) for one or more users on Magic Eden RTP API.",
  inputSchema,
  handler: async ({ chain, users }: z.infer<typeof inputSchema>) => {
    try {
      const result = await getUserActivity(chain, users);
      console.log(result);
      const activities = result.activities || [];

      if (!activities.length) {
        const response = {
          status: "empty",
          message: `No recent activity found for the provided users on ${chain}.`,
          metadata: {
            chain: chain.toUpperCase(),
            users
          },
          activities: []
        };

        return {
          content: [{
            type: "text" as const,
            text: JSON.stringify(response),
          }]
        };
      }

      const formattedActivities = activities.map((activity: any) => ({
        type: activity.type || "unknown",
        collectionName: activity.collection?.collectionName || "Unknown Collection",
        tokenName: activity.token?.tokenName || "Unknown Token",
        price: activity.price?.amount?.native
          ? Number(activity.price.amount.native)
          : null,
        timestamp: activity.timestamp || null,
      }));

      const response = {
        status: "success",
        metadata: {
          chain: chain.toUpperCase(),
          users
        },
        activities: formattedActivities
      };

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify(response),
        }]
      };
    } catch (error) {
      const response = {
        status: "error",
        message: error instanceof Error ? error.message : String(error),
      };

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify(response),
        }],
        isError: true
      };
    }
  }
};
