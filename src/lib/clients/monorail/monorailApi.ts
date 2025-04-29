// src/clients/monorailDataApi.ts
import axios from "axios";

// API base URL
const BASE_URL = "https://testnet-api.monorail.xyz";

interface ErrorResponse {
  message: string;
}

export interface TokenDetails {
  address: string;
  categories: string[];
  decimals: number;
  name: string;
  symbol: string;
}

export interface TokenBalance {
  address: string;
  balance: string;
  categories: string[];
  decimals: number;
  id: string;
  name: string;
  symbol: string;
}

export interface TokenResult {
  address: string;
  balance: string;
  categories: string[];
  decimals: string; // API retorna como string
  id: string;
  name: string;
  symbol: string;
}

export type TokenCategory = 'wallet' | 'verified' | 'stable' | 'lst' | 'bridged' | 'meme';

function handleError(error: any): void {
  if (axios.isAxiosError(error) && error.response) {
    const errorData = error.response.data as ErrorResponse;
    console.error(`API Error: ${errorData.message || error.message}`);
  } else {
    console.error(`Error: ${error.message}`);
  }
}

export async function getToken(contractAddress: string): Promise<TokenDetails> {
  try {
    const res = await axios.get(`${BASE_URL}/v1/token/${contractAddress}`);
    return res.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function getTokens(options?: {
  find?: string;
  offset?: string | number;
  limit?: string | number;
}): Promise<TokenResult[]> {
  try {
    const res = await axios.get(`${BASE_URL}/v1/tokens`, { params: options });
    return res.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function getTokensByCategory(
  category: TokenCategory,
  options?: {
    address?: string;
    offset?: number;
    limit?: number;
  }
): Promise<TokenResult[]> {
  try {
    const res = await axios.get(`${BASE_URL}/v1/tokens/category/${category}`, { params: options });
    return res.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function getTokenCount(): Promise<number> {
  try {
    const res = await axios.get(`${BASE_URL}/v1/tokens/count`);
    return res.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function getWalletBalances(address: string): Promise<TokenBalance[]> {
  try {
    const res = await axios.get(`${BASE_URL}/v1/wallet/${address}/balances`);
    return res.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}
