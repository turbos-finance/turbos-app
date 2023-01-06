import { useEffect, useState } from 'react';
import { getProvider, provider } from '../lib/provider';
import { Coin, getObjectFields } from '@mysten/sui.js';
import Bignumber from 'bignumber.js';
import { contractConfig } from '../config/contract.config';
import { NetworkType } from '../config/config.type';
import { numberWithCommas } from '../utils';
import { useRefresh } from '../contexts/refresh';
import { bignumberDivDecimalFixed } from '../utils/tools';


export type VaultType = {
  tlp_supply: { fields: { value: string } },
  mint_burn_fee_basis_points: string
  [x: string]: any
};

export const useVault = (network: NetworkType = 'DEVNET') => {
  const { refreshTime } = useRefresh();

  const [vault, setVault] = useState<VaultType | undefined>();

  const getVault = async () => {
    if (!refreshTime) {
      return;
    }
    // const provider = getProvider(network);
    const vaultObjectId = contractConfig[network].VaultObjectId;
    const vaultResponce = await provider.getObject(vaultObjectId);
    const vaultField = getObjectFields(vaultResponce);

    if (!vaultField) {
      return;
    }

    setVault({
      ...vaultField,
      mint_burn_fee_basis_points: bignumberDivDecimalFixed(Bignumber(vaultField.mint_burn_fee_basis_points).multipliedBy(100)),
      tlp_supply: {
        fields: {
          value: bignumberDivDecimalFixed(vaultField.tlp_supply.fields.value)
        }
      }
    })
  }

  useEffect(() => {
    getVault();
  }, [refreshTime]);

  return {
    vault
  }
}