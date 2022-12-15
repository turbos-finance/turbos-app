import { useEffect, useState } from 'react';
import { getProvider, provider } from '../lib/provider';
import { Coin, getObjectExistsResponse, getObjectFields } from '@mysten/sui.js';
import BigNumber from 'bignumber.js';
import { contractConfig } from '../config/contract.config';
import { NetworkType, SymbolType } from '../config/config.type';
import { numberWithCommas } from '../utils';


export type AumType = {
  amount: string;
}

export const useAum = (network: NetworkType = 'DEVNET') => {
  const [aum, setAum] = useState<AumType>({
    amount: '0'
  });

  const getAum = async () => {
    const provider = getProvider(network);
    const coinConfig = contractConfig[network].Coin;

    const vaultObject = await provider.getObject(contractConfig[network].VaultObjectId);
    const vault = getObjectFields(vaultObject);
    let short_profits = BigNumber(0);

    const symbols = Object.keys(coinConfig);

    const priceFeeds = symbols.map((item: string) => (coinConfig[item as SymbolType]).PriceFeedObjectId);
    const pools = symbols.map((item: string) => (coinConfig[item as SymbolType]).PoolDataObjectId)

    const priceFeedsObjectIds = await provider.getObjectBatch(priceFeeds);
    const poolsObjectIds = await provider.getObjectBatch(pools);

    const amount = priceFeedsObjectIds.reduce((sum: BigNumber, item: any, index: number) => {
      let aum = BigNumber(vault?.aum_addition);

      let aum_deduction = BigNumber(vault?.aum_deduction);

      const pool = getObjectFields(poolsObjectIds[index]);
      const field = getObjectFields(item);

      if (!pool || !field) {
        return sum;
      }


      let price = BigNumber(field.price);

      let pool_amount = BigNumber(pool.pool_amounts);
      let decimals = pool.token_decimals;
      let average_price = BigNumber(pool.global_short_average_prices);

      let price_delta = average_price.minus(price).isGreaterThan(0) ? average_price.minus(price) : price.minus(average_price);
      let delta = price_delta.multipliedBy(pool.global_short_sizes).dividedBy(average_price);
      let has_profit = average_price.minus(price).isGreaterThan(0);
      if (pool.is_stable_token) {
        aum = aum.plus(pool_amount.multipliedBy(price).dividedBy(10 ** decimals));

      } else {
        if (pool.global_short_sizes > 0) {
          if (!has_profit) {
            aum = aum.plus(delta);
          } else {
            short_profits = short_profits.plus(delta);
          };
        };

        aum = aum.plus(pool.guaranteed_usd);
        aum = aum.plus(pool_amount.minus(pool.reserved_amounts).multipliedBy(price).dividedBy(10 ** decimals));
      }

      aum = short_profits.minus(aum).isGreaterThan(0) ? BigNumber(0) : aum.minus(short_profits);
      aum = aum_deduction.minus(aum).isGreaterThan(0) ? BigNumber(0) : aum.minus(aum_deduction);

      return sum.plus(aum)
    }, BigNumber(0)).toNumber();

    setAum({
      amount: BigNumber(amount).div(10 ** 9).toFixed(2)
    })
  }

  useEffect(() => {
    getAum();
  }, []);

  return {
    aum
  }
}