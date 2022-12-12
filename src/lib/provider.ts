import { JsonRpcProvider, Network } from '@mysten/sui.js';

export const provider = new JsonRpcProvider(Network.DEVNET);

export const getProvider = (network: string = 'DEVNET') => new JsonRpcProvider(Network['DEVNET']);