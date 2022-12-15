import { useEffect, useState } from 'react';
import { JsonRpcProvider, Network } from '@mysten/sui.js';
import { useSuiWallet } from '../contexts/useSuiWallet';

export const useProvider = () => {
  const {
    network
  } = useSuiWallet();

  const [provider, setProvider] = useState<JsonRpcProvider>(new JsonRpcProvider(Network['DEVNET']))

  const getProvider = async () => {
    setProvider(new JsonRpcProvider(Network['DEVNET']))
  }

  useEffect(() => {
    getProvider();
  }, [network]);

  return {
    provider
  }
}