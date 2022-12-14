import { useEffect, useState } from 'react';
import { getProvider, provider } from '../lib/provider';
import { Coin, getObjectFields, Network } from '@mysten/sui.js';
import Bignumber from 'bignumber.js';
import { NetworkType, SymbolType } from '../config/config.type';
import { contractConfig } from '../config/contract.config';
import { numberWithCommas } from '../utils';

export type PoolValueType = {
  max_tusd_amounts?: string,
  price?: string,
  fee_reserves?: string,
  available?: string,
  tusd_amounts?: string,
  coin_amounts?: string,
  poolObjectId?:string,
}

export const usePool = (symbol: SymbolType | undefined, network: NetworkType = 'DEVNET') => {
  const [pool, setPool] = useState<PoolValueType>({});

  const getPool = async () => {
    if (symbol) {
      const provider = getProvider(network);
      const coin = contractConfig[network].Coin;
      const symbolConfig = coin[symbol];

      const poolResponce = await provider.getObject(symbolConfig.PoolObjectId);
      const poolField = getObjectFields(poolResponce);
      // console.log(poolField);

      poolField && setPool({
        ...poolField,
        poolObjectId: symbolConfig.PoolObjectId,
        max_tusd_amounts: numberWithCommas(Bignumber(poolField.max_tusd_amounts).div(10 ** poolField.token_decimals).toFixed(2)),
        fee_reserves: Bignumber(poolField.fee_reserves).multipliedBy(100).div(10 ** poolField.token_decimals).toFixed(2),
        available: numberWithCommas(Bignumber(poolField.tusd_amounts).div(10 ** poolField.token_decimals).toFixed(2)),
        tusd_amounts: numberWithCommas(Bignumber(poolField.tusd_amounts).div(10 ** poolField.token_decimals).toFixed(2)),
        coin_amounts: numberWithCommas(Bignumber(poolField.pool_amounts).div(10 ** poolField.token_decimals).toFixed(2)),
      });
    }
  }

  useEffect(() => {
    getPool();
  }, [symbol]);

  return {
    pool
  }
}