import { useEffect, useState } from 'react';
import { getProvider, provider } from '../lib/provider';
import { Coin, getObjectFields } from '@mysten/sui.js';
import Bignumber from 'bignumber.js';
import { contractConfig } from '../config/contract.config';
import { NetworkType } from '../config/config.type';

export const useVault = (network: NetworkType = 'DEVNET') => {

  const [vault, setVault] = useState({});

  const getVault = async () => {
    const provider = getProvider(network);
    const vaultObjectId = contractConfig[network].VaultObjectId;

    const vaultResponce = await provider.getObject(vaultObjectId);
    const vaultField = getObjectFields(vaultResponce);

    console.log(vaultField);
    setVault({
      ...vaultField
    })
  }

  useEffect(() => {
    getVault();
  }, []);

  return {
    vault
  }
}