import { useEffect, useState } from 'react';
import { getProvider, provider } from '../lib/provider';
import { Coin, GetObjectDataResponse, getObjectFields } from '@mysten/sui.js';
import Bignumber from 'bignumber.js';
import { contractConfig } from '../config/contract.config';
import { CoinConfigObjectType, NetworkType, SymbolType } from '../config/config.type';
import { numberWithCommas } from '../utils';

export const useAvailableLiquidity = (network: NetworkType = 'DEVNET') => {

  const [availableLiquidity, setAavailableLiquidity] = useState('0.00');

  const getAavailableLiquidity = async () => {
    const provider = getProvider(network);
    const coinConfig = contractConfig[network].Coin;

    const pools = Object.keys(coinConfig).map((item: string) => coinConfig[item as SymbolType].PoolObjectId);
    const objectBatch = await provider.getObjectBatch(pools);
    const result = objectBatch.reduce((sum: Bignumber, item: GetObjectDataResponse, index: number) => {
      const filed = getObjectFields(item);
      return sum.plus(filed?.tusd_amounts)
    }, Bignumber(0)).div(10 ** 9).toFixed(2);

    setAavailableLiquidity(numberWithCommas(result))
  }

  useEffect(() => {
    getAavailableLiquidity();
  }, []);

  return {
    availableLiquidity
  }
}