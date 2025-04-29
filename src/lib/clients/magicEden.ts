import dotenv from "dotenv";

dotenv.config();
const BASE_URL = "https://api-mainnet.magiceden.dev/v3/rtp";
const MAGICEDEN_API_KEY =  process.env.MAGICEDEN_API_KEY as string;

if (!MAGICEDEN_API_KEY) {
  throw new Error("Missing MAGIC_EDEN_API_KEY environment variable.");
}

async function fetchJson(url: string) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${MAGICEDEN_API_KEY}`,
      "Content-Type": "application/json",
    },
  });
  
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

/**
 * Fetches collections from Magic Eden RTP API.
 * 
 * @param chain - Blockchain network (e.g., ethereum, monad-testnet)
 * @param options - Query parameters like sortBy, limit, etc.
 */
export async function getCollections(
  chain: string,
  options: {
    includeMintStages?: boolean;
    includeSecurityConfigs?: boolean;
    normalizeRoyalties?: boolean;
    useNonFlaggedFloorAsk?: boolean;
    sortBy?: "allTimeVolume" | "1DayVolume" | "7DayVolume" | "30DayVolume";
    limit?: number;
    offset?: number;
    id?: string;
    slug?: string;
    community?: string;
    collectionsSetId?: string;
    creator?: string;
    name?: string;
    maxFloorAskPrice?: number;
    minFloorAskPrice?: number;
    includeAttributes?: boolean;
    includeSalesCount?: boolean;
    contract?: string[];
  } = {}
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(options)) {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.append(key, String(value));
      }
    }
  }

  const url = `${BASE_URL}/${chain}/collections/v7?${params.toString()}`;
  return fetchJson(url);
}

/**
 * Fetches trending collections from Magic Eden RTP API.
 * 
 * @param chain - Blockchain network (e.g., ethereum, monad-testnet, arbitrum, base, etc.)
 * @param options - Query parameters (period, limit, sortBy, normalizeRoyalties, useNonFlaggedFloorAsk)
 */
export async function getTrendingCollections(
  chain: string,
  options: {
    period?: "5m" | "10m" | "30m" | "1h" | "6h" | "1d" | "24h" | "7d" | "30d";
    limit?: number;
    sortBy?: "sales" | "volume";
    normalizeRoyalties?: boolean;
    useNonFlaggedFloorAsk?: boolean;
  } = {}
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(options)) {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  }

  const url = `${BASE_URL}/${chain}/collections/trending/v1?${params.toString()}`;
  return fetchJson(url);
}

/**
 * Fetches user collections from Magic Eden RTP API.
 * 
 * @param chain - Blockchain network (e.g., ethereum, monad, base, etc.)
 * @param user - User wallet address (must match ^0x[a-fA-F0-9]{40}$)
 */
export async function getUserCollections(
  chain: string,
  user: string
) {
  if (!/^0x[a-fA-F0-9]{40}$/.test(user)) {
    throw new Error("Invalid user address format. Must be a valid 0x wallet address.");
  }

  const url = `${BASE_URL}/${chain}/users/${user}/collections/v3`;
  return fetchJson(url);
}

/**
 * Fetches user activity from Magic Eden RTP API.
 * 
 * @param chain - Blockchain network (e.g., ethereum, monad, base, etc.)
 * @param users - Array of wallet addresses (length between 1 and 50)
 */
export async function getUserActivity(
  chain: string,
  user: string
) {
  if (user.length === 0 || user.length > 50) {
    throw new Error("The 'users' array must have between 1 and 50 addresses.");
  }

  const params = new URLSearchParams();
  console.log(params);

  const url = `${BASE_URL}/${chain}/users/activity/v6?users=${user}`;
  console.log(url);
  return fetchJson(url);
}