import { useEffect, useState } from 'react';
import { getProvider, provider } from '../lib/provider';
import { Coin, getObjectFields, Network } from '@mysten/sui.js';
import Bignumber from 'bignumber.js';
import { NetworkType, SymbolType, TLPAndSymbolType } from '../config/config.type';
import { contractConfig } from '../config/contract.config';
import { numberWithCommas } from '../utils';
import { useVault } from './useVault';
import { useAum } from './useAum';

export type SymbolPriceType = {
  price: string;
  symbol?: string
}

export const useSymbolPrice = (symbol: TLPAndSymbolType | undefined, network: NetworkType = 'DEVNET') => {
  const { vault } = useVault();
  const { aum } = useAum();

  const [symbolPrice, setSymbolPrice] = useState<SymbolPriceType>({
    price: '0.00'
  });

  const getSymbolPrice = async () => {
    if (symbol) {
      const provider = getProvider(network);
      const coin = contractConfig[network].Coin;
      if (symbol === 'TLP') {
        setSymbolPrice({
          symbol,
          price: aum.amount && Bignumber(vault.tlp_supply.fields.value).toNumber() !== 0
            ? Bignumber(aum.amount).div(vault.tlp_supply.fields.value).toFixed(2)
            : '0.00'
        })
      } else {
        const symbolConfig = coin[symbol];
        const priceFeedResponce = await provider.getObject(symbolConfig?.PriceFeedObjectId || '');
        const priceFeedField = getObjectFields(priceFeedResponce);

        priceFeedField && setSymbolPrice({
          ...priceFeedField,
          symbol,
          price: Bignumber(priceFeedField.price).div(10 ** priceFeedField.decimal).toFixed(2)
        });
      }

    }
  }

  useEffect(() => {
    getSymbolPrice();
  }, [symbol, vault, aum]);

  return {
    symbolPrice
  }
}