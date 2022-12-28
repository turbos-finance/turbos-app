import { useEffect, useState } from 'react';
import { getProvider, provider } from '../lib/provider';
import { Coin, GetObjectDataResponse, getObjectFields, Network } from '@mysten/sui.js';
import Bignumber from 'bignumber.js';
import { NetworkType, SymbolType } from '../config/config.type';
import { contractConfig } from '../config/contract.config';
import { numberWithCommas } from '../utils';
import { useRefresh } from '../contexts/refresh';

export type PoolValueType = {
  turbos_max_tusd_amounts?: string,
  turbos_fee_reserves?: string,
  turbos_available?: string,
  turbos_tusd_amounts?: string,
  turbos_coin_amounts?: string,
  poolDataObjectId?: string,
  poolObjectId?: string,
  [x: string]: any
}

export const usePool = (symbol: SymbolType | undefined, network: NetworkType = 'DEVNET') => {
  const { refreshTime } = useRefresh();

  const [pool, setPool] = useState<PoolValueType>({});

  const getPool = async () => {
    if (symbol) {
      // const provider = getProvider(network);
      const coin = contractConfig[network].Coin;
      const symbolConfig = coin[symbol];

      const poolResponce = await provider.getObject(symbolConfig.PoolDataObjectId);
      const poolField = getObjectFields(poolResponce);

      poolField && setPool({
        ...poolField,
        poolObjectId: symbolConfig.PoolObjectId,
        poolDataObjectId: symbolConfig.PoolDataObjectId,
        turbos_max_tusd_amounts: numberWithCommas(Bignumber(poolField.max_tusd_amounts).div(10 ** poolField.token_decimals).toFixed(2)),
        turbos_fee_reserves: numberWithCommas(Bignumber(poolField.fee_reserves).div(10 ** poolField.token_decimals).toFixed(2)),
        turbos_available: numberWithCommas(Bignumber(poolField.tusd_amounts).div(10 ** poolField.token_decimals).toFixed(2)),
        turbos_tusd_amounts: numberWithCommas(Bignumber(poolField.tusd_amounts).div(10 ** poolField.token_decimals).toFixed(2)),
        turbos_coin_amounts: numberWithCommas(Bignumber(poolField.pool_amounts).div(10 ** poolField.token_decimals).toFixed(2)),
      });
    }
  }

  useEffect(() => {
    getPool();
  }, [symbol, refreshTime]);

  return {
    pool
  }
}

type AllPoolValueType = { [x: string]: PoolValueType }


export const useAllPool = (network: NetworkType = 'DEVNET') => {
  const { refreshTime } = useRefresh();

  const [allPool, setAllPool] = useState<AllPoolValueType>({});

  const getPool = async () => {
    // const provider = getProvider(network);
    const coin = contractConfig[network].Coin;
    const symbolList = Object.keys(coin);

    const objects = symbolList.map((item: string) => coin[item as SymbolType].PoolDataObjectId);
    const poolResponse = await provider.getObjectBatch(objects);
    const pools: any = {}
    for (let i = 0; i < poolResponse.length; i++) {
      const poolField = getObjectFields(poolResponse[i]);
      const k = symbolList[i] as SymbolType;
      const field = poolField && {
        ...poolField,
        poolObjectId: coin[k].PoolObjectId,
        poolDataObjectId: coin[k].PoolDataObjectId,
        turbos_max_tusd_amounts: numberWithCommas(Bignumber(poolField.max_tusd_amounts).div(10 ** poolField.token_decimals).toFixed(2)),
        turbos_fee_reserves: numberWithCommas(Bignumber(poolField.fee_reserves).div(10 ** poolField.token_decimals).toFixed(2)),
        turbos_available: numberWithCommas(Bignumber(poolField.tusd_amounts).div(10 ** poolField.token_decimals).toFixed(2)),
        turbos_tusd_amounts: numberWithCommas(Bignumber(poolField.tusd_amounts).div(10 ** poolField.token_decimals).toFixed(2)),
        turbos_coin_amounts: numberWithCommas(Bignumber(poolField.pool_amounts).div(10 ** poolField.token_decimals).toFixed(2)),
      }
      pools[k] = field;
    }
    setAllPool(pools);

  }

  useEffect(() => {
    if (contractConfig) {
      getPool();
    }
  }, [contractConfig, refreshTime]);

  return {
    allPool
  }
}