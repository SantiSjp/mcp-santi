// src/clients/blockvision.ts
import dotenv from "dotenv";

dotenv.config();

const BLOCKVISION_BASE_URL = "https://api.blockvision.org/v2/monad";
const BLOCKVISION_API_KEY = "2wNfH3LsPI6X8jgR05cE6RntLwD";

if (!BLOCKVISION_API_KEY) {
  throw new Error("Missing BLOCKVISION_API_KEY environment variable.");
}

async function fetchBlockvisionJson(url: string) {
  const res = await fetch(url, {
    headers: {
      "x-api-key": BLOCKVISION_API_KEY,
      "Content-Type": "application/json",
    },
  });

  console.log(res);

  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

/**
 * Fetches all tokens owned by a specific account.
 * 
 * @param address - Wallet address to query (e.g., 0xabc...)
 * @param pageIndex - Page index for pagination (starting from 1)
 */
export async function getAccountTokens(address: string, pageIndex: number = 1) {
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error("Invalid wallet address format. Must be a valid 0x address.");
  }

  if (pageIndex < 1) {
    throw new Error("Page index must be greater than or equal to 1.");
  }

  const url = `${BLOCKVISION_BASE_URL}/account/tokens?address=${address}&pageIndex=${pageIndex}`;
  return fetchBlockvisionJson(url);
}

/**
 * Fetches all NFTs owned by a specific account.
 * 
 * @param address - Wallet address to query (e.g., 0xabc...)
 * @param pageIndex - Page index for pagination (starting from 1)
 */
export async function getAccountNFTs(address: string, pageIndex: number = 1) {
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error("Invalid wallet address format. Must be a valid 0x address.");
  }

  if (pageIndex < 1) {
    throw new Error("Page index must be greater than or equal to 1.");
  }
  console.log(BLOCKVISION_API_KEY);
  const url = `${BLOCKVISION_BASE_URL}/account/nfts?address=${address}&pageIndex=${pageIndex}`;
  console.log(url);
  return fetchBlockvisionJson(url);
}

/**
 * Fetches token holders for a given ERC-20 contract address.
 * 
 * @param contractAddress - The contract address of the ERC-20 token
 * @param pageSize - How many holders per page (default 20, max 50)
 * @param pageIndex - Page index (defaults to 1)
 */
export async function getTokenHolders(contractAddress: string, pageSize: number = 20, pageIndex: number = 1) {
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
        throw new Error("Invalid contract address format. Must be a valid 0x address.");
    }

    if (pageSize > 50) {
        throw new Error("Page size cannot exceed 50.");
    }

    const url = `${BLOCKVISION_BASE_URL}/token/holders?contractAddress=${contractAddress}&pageSize=${pageSize}&pageIndex=${pageIndex}`;
    return fetchBlockvisionJson(url);
}