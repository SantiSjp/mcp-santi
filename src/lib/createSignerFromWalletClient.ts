// src/lib/createSignerFromWalletClient.ts
import { WalletClient } from "viem";
import { ethers } from "ethers";

/**
 * Converte um WalletClient (Viem) para um Signer (ethers.js)
 */
export async function createSignerFromWalletClient(walletClient: WalletClient): Promise<ethers.JsonRpcSigner> {
  const provider = new ethers.BrowserProvider(walletClient as any); 
  return provider.getSigner();
}
