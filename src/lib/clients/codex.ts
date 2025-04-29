import { Codex } from "@codex-data/sdk";
import { Network } from "@codex-data/sdk/dist/resources/graphql";

// Você pode usar variáveis de ambiente ou setar diretamente sua chave
const CODEX_API_KEY = process.env.CODEX_API_KEY as string;

export interface TokenPairData {
  token1Data: {
    name: string;
    symbol: string;
  };
  token0Data: {
    name: string;
    symbol: string;
  };
  exchangeHash: string;
}

export interface NftCollectionMetadata {
  address: string;
  ercType: string;
  image: string;
  name: string;
  symbol: string;
}


export const sdk = new Codex(CODEX_API_KEY);

/**
 * Fetches all supported networks from Codex.
 */
export async function getNetworks(): Promise<Network[]> {
  const query = `
    query GetNetworks {
      getNetworks { id name }
    }
  `;

  const response = await sdk.send<{ getNetworks: Network[] }>(query, {});
  return response.getNetworks;
}

/**
 * Fetches the network status for Monad Testnet (networkId 10143).
 */
export async function getNetworkStatus(networkId : string): Promise<{
  lastProcessedBlock: number;
  lastProcessedTimestamp: string;
  networkId: number;
  networkName: string;
}> {
  const query = `
    query NetworkStatus {
      getNetworkStatus(networkIds: ${networkId}) {
        lastProcessedBlock
        lastProcessedTimestamp
        networkId
        networkName
      }
    }
  `;

  const response = await sdk.send<{
    getNetworkStatus: {
      lastProcessedBlock: number;
      lastProcessedTimestamp: string;
      networkId: number;
      networkName: string;
    }[];
  }>(query, {});

  return response.getNetworkStatus[0];
}

/**
 * Fetches detailed token info by networkId and token address.
 */
export async function getTokenInfoFromCodex(address: string) {
  const query = `
    query TokenInfo{
      tokens(ids: { networkId: 10143, address: "${address}" }) {
        address
        name
        symbol
        totalSupply
        decimals
        info {
          circulatingSupply
          description
          id
        }
      }
    }
  `;

  const response = await sdk.send<{
    tokens: {
      address: string;
      name: string;
      symbol: string;
      totalSupply: string;
      decimals: number;
      info: {
        circulatingSupply: string;
        description: string | null;
        id: string;
      } | null;
    }[];
  }>(query);

  return response.tokens?.[0]; 
}

/**
 * Fetches trading pairs for a given token on a specified network.
 * 
 * @param networkId The network ID (e.g., 10143 for Monad Testnet)
 * @param tokenAddress The token address
 */
export async function getTokenPairs(tokenAddress: string): Promise<TokenPairData[]> {
  const query = `
    query TokenPairs{
      listPairsForToken(
        networkId: 10143
        tokenAddress: "${tokenAddress}"
      ) {
        token1Data {
          name
          symbol
        }
        token0Data {
          name
          symbol
        }
        exchangeHash
      }
    }
  `;

  const response = await sdk.send<{ listPairsForToken: TokenPairData[] }>(query);
  return response.listPairsForToken;
}

/**
 * Fetches NFT collection metadata for a given address and networkId.
 * 
 * @param address The NFT collection contract address
 */
export async function getNftCollectionMetadata(address: string): Promise<NftCollectionMetadata> {
  const query = `
    query NftCollection{
      getNftCollectionMetadata(
        networkId: 10143
        address: "${address}"
      ) {
        contract {
          address
          ercType
          image
          name
          symbol
        }
      }
    }
  `;

  const response = await sdk.send<{
    getNftCollectionMetadata: { contract: NftCollectionMetadata };
  }>(query);

  return response.getNftCollectionMetadata.contract;
}