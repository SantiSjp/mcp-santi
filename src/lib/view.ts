import { getWalletClient } from 'wagmi/actions';
import { config } from '@/config';

export const walletClientPromise = getWalletClient(config);