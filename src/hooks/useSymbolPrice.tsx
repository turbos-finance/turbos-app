import { useEffect, useState } from 'react';
import { getProvider, provider } from '../lib/provider';
import { Coin, getObjectFields, Network } from '@mysten/sui.js';
import Bignumber from 'bignumber.js';
import { NetworkType, SymbolType } from '../config/config.type';
import { contractConfig } from '../config/contract.config';
import { numberWithCommas } from '../utils';

export type SymbolPriceType = {
  price?: string;
  symbol?: string
}

export const useSymbolPrice = (symbol: SymbolType | undefined, network: NetworkType = 'DEVNET') => {
  const [symbolPrice, setSymbolPrice] = useState<SymbolPriceType>({});

  const getSymbolPrice = async () => {
    if (symbol) {
      const provider = getProvider(network);
      const coin = contractConfig[network].Coin;
      const symbolConfig = coin[symbol];

      const priceFeedResponce = await provider.getObject(symbolConfig.PriceFeedObjectId);
      const priceFeedField = getObjectFields(priceFeedResponce);

      priceFeedField && setSymbolPrice({
        ...priceFeedField,
        symbol,
        price: Bignumber(priceFeedField.price).div(10 ** priceFeedField.decimal).toFixed(2)
      });

    }
  }

  useEffect(() => {
    getSymbolPrice();
  }, [symbol]);

  return {
    symbolPrice
  }
}