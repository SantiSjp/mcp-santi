// src/tools/monorail/getQuoteTool.ts
import { z } from "zod";
import { getQuote } from "../../clients/monorail/monorailQuote";

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
        source,
      });

      const priceImpact = parseFloat(quote.compound_impact ?? "0");

      const response = {
        status: "success",
        metadata: {
          from: quote.from,
          to: quote.to,
          amountInput: quote.input_formatted,
          expectedOutput: quote.output_formatted,
          minimumGuaranteedOutput: quote.min_output_formatted,
          hops: quote.hops,
          priceImpactPercent: Number((priceImpact * 100).toFixed(2)),
          warning: priceImpact > 0.2 ? "High price impact detected (> 20%)" : null,
        },
        rawQuote: quote,
      };

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify(response),
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
        isError: true
      };
    }
  }
};
