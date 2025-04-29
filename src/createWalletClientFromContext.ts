import { createWalletClient, http } from 'viem';
import { monadTestnet } from 'viem/chains';

export function createWalletClientFromContext(account: `0x${string}`) {
  console.log("createWalletClientFromContext",account);
  return createWalletClient({
    account,
    chain: monadTestnet,
    transport: http('https://testnet-rpc.monad.xyz'),
  });
}
