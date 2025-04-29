// src/tools/monorail/getQuoteTool.ts
import { z } from "zod";
import { getQuote } from "../../clients/monorail/monorailQuote"; // Your quote client

const inputSchema = z.object({
  amount: z.string().describe("Amount to swap (human readable, e.g., 1)"),
  from: z.string().describe("Token address or symbol to swap from"),
  to: z.string().describe("Token address or symbol to swap to"),
  sender: z.string().optional().describe("Wallet address that will execute the swap"),
  slippage: z.string().optional().describe("Allowed slippage in basis points (optional, e.g., 50 = 0.5%)"),
  deadline: z.string().optional().describe("Transaction deadline in seconds (optional, e.g., 60)"),
  max_hops: z.string().optional().describe("Maximum number of hops allowed (optional)"),
  excluded: z.string().optional().describe("Comma-separated list of protocols to exclude (optional)"),
  source: z.string().optional().describe("Request source identifier (optional)"),
});

export const getQuoteTool = {
  name: "monorail_get_quote",
  description: "Fetch the best quote for swapping one token to another using the Monorail API on Monad Testnet.",
  inputSchema,
  handler: async ({ amount, from, to, sender, slippage, deadline, max_hops, excluded, source }: z.infer<typeof inputSchema>) => {
    try {
      const quote = await getQuote({
        amount: Number(amount),
        from,
        to,
        sender,
        slippage: slippage ? Number(slippage) : undefined,
        deadline: deadline ? Number(deadline) : undefined,
        max_hops: max_hops ? Number(max_hops) : undefined,
        excluded,
        source
      });

      const priceImpact = parseFloat(quote.compound_impact ?? "0");

      const impactWarning = priceImpact > 0.2 
        ? "\n⚠️ Warning: High price impact detected! (> 20%)"
        : "";

      const result = 
        `🔄 Swap Quote:\n\n` +
        `• From: ${quote.from}\n` +
        `• To: ${quote.to}\n` +
        `• Input Amount: ${quote.input_formatted}\n` +
        `• Expected Output: ${quote.output_formatted}\n` +
        `• Minimum Guaranteed Output: ${quote.min_output_formatted}\n` +
        `• Hops: ${quote.hops}\n` +
        `• Price Impact: ${(priceImpact * 100).toFixed(2)}%\n` +
        impactWarning;

      return {
        content: [{
          type: "text" as const,
          text: result
        }]
      };

    } catch (error) {
      return {
        content: [{
          type: "text" as const,
          text: `❌ Error fetching quote: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
};
