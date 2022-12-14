import { useEffect, useState } from 'react';
import { getProvider, provider } from '../lib/provider';
import { Coin, getObjectFields } from '@mysten/sui.js';
import Bignumber from 'bignumber.js';
import { contractConfig } from '../config/contract.config';
import { NetworkType } from '../config/config.type';
import { numberWithCommas } from '../utils';


export type VaultType = {
  tlp_supply: { fields: { value: string } },
  mint_burn_fee_basis_points?: string

}

export const useVault = (network: NetworkType = 'DEVNET') => {

  const [vault, setVault] = useState<VaultType>({
    tlp_supply: { fields: { value: '0' } }
  });

  const getVault = async () => {
    const provider = getProvider(network);
    const vaultObjectId = contractConfig[network].VaultObjectId;

    const vaultResponce = await provider.getObject(vaultObjectId);
    const vaultField = getObjectFields(vaultResponce);

    setVault({
      ...vaultField,
      mint_burn_fee_basis_points: Bignumber(vaultField?.mint_burn_fee_basis_points).multipliedBy(100).div(10 ** 9).toFixed(2),
      tlp_supply: {
        fields: {
          value: Bignumber(vaultField?.tlp_supply?.fields.value).div(10 ** 9).toFixed(2)
        }
      }
    })
  }

  useEffect(() => {
    getVault();
  }, []);

  return {
    vault
  }
}