// src/clients/monorail/quote.ts
import axios from "axios";

const BASE_URL = "https://testnet-pathfinder-v2.monorail.xyz/v1/quote";

interface ErrorResponse {
  message: string;
}

/**
 * Call the Monorail Quote API to get a quote for a swap.
 */
export async function getQuote(options: {
  amount: string | number;
  from: string;
  to: string;
  sender?: string;
  slippage?: number;
  deadline?: number;
  max_hops?: number;
  excluded?: string;
  source?: string;
}) {
  try {
    const params = new URLSearchParams();

    params.append("amount", options.amount.toString());
    params.append("from", options.from);
    params.append("to", options.to);

    if (options.sender) params.append("sender", options.sender);
    if (options.slippage !== undefined) params.append("slippage", options.slippage.toString());
    if (options.deadline !== undefined) params.append("deadline", options.deadline.toString());
    if (options.max_hops !== undefined) params.append("max_hops", options.max_hops.toString());
    if (options.excluded) params.append("excluded", options.excluded);
    params.append("source", options.source ?? "monorail-mcp"); // default source if not provided

    const url = `${BASE_URL}?${params.toString()}`;

    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data as ErrorResponse;
      throw new Error(`Quote API Error: ${errorData.message || error.message}`);
    } else {
      throw new Error(`Failed to fetch quote: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
