import { useEffect, useState } from 'react';
import { getProvider, provider } from '../lib/provider';
import { Coin, GetObjectDataResponse, getObjectFields, Network } from '@mysten/sui.js';
import Bignumber from 'bignumber.js';
import { NetworkType, SymbolType, TLPAndSymbolType } from '../config/config.type';
import { contractConfig } from '../config/contract.config';
import { numberWithCommas } from '../utils';
// import { useVault } from './useVault';
import { useAum } from './useAum';
import { useRefresh } from '../contexts/refresh';
import { useStore } from '../contexts/store';

export type SymbolPriceType = {
  price: string,
  originalPrice: string,
  emaPrice?: string,
  originalEmaPrice?: string,
  symbol?: string
}

// export const useSymbolPrice = (symbol: TLPAndSymbolType | undefined, network: NetworkType = 'DEVNET') => {
//   const { vault } = useVault();
//   const { aum } = useAum();
//   const { refreshTime } = useRefresh();

//   const [symbolPrice, setSymbolPrice] = useState<SymbolPriceType>({
//     price: '0.00',
//     originalPrice: '0'
//   });

//   const getSymbolPrice = async () => {
//     if (symbol && vault && aum && refreshTime) {
//       // const provider = getProvider(network);
//       const coin = contractConfig[network].Coin;
//       if (symbol === 'TLP') {
//         setSymbolPrice({
//           symbol,
//           originalPrice: aum.amount && Bignumber(vault.tlp_supply.fields.value).toNumber() !== 0 ?
//             Bignumber(aum.amount).div(vault.tlp_supply.fields.value).multipliedBy(10 ** 9).toString() : '0',
//           price: aum.amount && Bignumber(vault.tlp_supply.fields.value).toNumber() !== 0
//             ? Bignumber(aum.amount).div(vault.tlp_supply.fields.value).toFixed(2)
//             : '0.00'
//         })
//       } else {
//         const symbolConfig = coin[symbol];
//         const priceFeedResponce = await provider.getObject(symbolConfig?.PriceFeedObjectId || '');
//         const priceFeedField = getObjectFields(priceFeedResponce);

//         priceFeedField && setSymbolPrice({
//           ...priceFeedField,
//           symbol,
//           originalPrice: priceFeedField.price,
//           price: Bignumber(priceFeedField.price).div(10 ** priceFeedField.decimal).toFixed(2),
//           emaPrice: Bignumber(priceFeedField.ema_price).div(10 ** priceFeedField.decimal).toFixed(2)
//         });
//       }

//     }
//   }

//   useEffect(() => {
//     getSymbolPrice();
//   }, [symbol, vault, aum, refreshTime]);

//   return {
//     symbolPrice
//   }
// }


type AllSymbolPriceType = { [x: string]: SymbolPriceType }

export const useAllSymbolPrice = (network: NetworkType = 'DEVNET') => {
  const { store } = useStore();
  const { vault } = store;
  const { aum } = useAum();
  const { refreshTime } = useRefresh();

  const [allSymbolPrice, setAllSymbolPrice] = useState<AllSymbolPriceType | undefined>();

  const getAllSymbolPrice = async () => {
    if (contractConfig && vault && refreshTime && aum) {
      // const provider = getProvider(network);
      const coin = contractConfig[network].Coin;
      const symbolList = Object.keys(coin).concat(['TLP']);
      // symbolList.
      const priceList: AllSymbolPriceType = {};
      const objects = [];
      for (let i = 0; i < symbolList.length; i++) {
        if (symbolList[i] === 'TLP') {
          priceList[symbolList[i]] = {
            symbol: symbolList[i],
            originalPrice: aum.amount && Bignumber(vault.tlp_supply.fields.value).toNumber() !== 0 ?
              Bignumber(aum.amount).div(vault.tlp_supply.fields.value).multipliedBy(10 ** 9).toString() : '1000000000',
            price: aum.amount && Bignumber(vault.tlp_supply.fields.value).toNumber() !== 0
              ? Bignumber(aum.amount).div(vault.tlp_supply.fields.value).toFixed(2)
              : '1.00'
          }
        } else {
          objects.push(coin[symbolList[i] as SymbolType].PriceFeedObjectId);
        }
      }
      const priceFeedResponce = await provider.getObjectBatch(objects);

      priceFeedResponce.forEach((item: GetObjectDataResponse, index: number) => {
        const field = getObjectFields(item);
        if (field) {
          const symbol = field.symbol.replace(/USD$/, '');
          priceList[symbol] = {
            symbol,
            originalPrice: field.price,
            price: Bignumber(field.price).div(10 ** field.decimal).toFixed(2),
            emaPrice: Bignumber(field.ema_price).div(10 ** field.decimal).toFixed(2)
          }
        }
      });

      setAllSymbolPrice(priceList);
    }
  }

  useEffect(() => {
    getAllSymbolPrice();
  }, [contractConfig, vault, aum, refreshTime]);

  return {
    allSymbolPrice
  }
}