import { useEffect, useState } from 'react';
import { getProvider, provider } from '../lib/provider';
import { Coin, getMoveObjectType, GetObjectDataResponse, getObjectType } from '@mysten/sui.js';
import Bignumber from 'bignumber.js';
import { NetworkType, SymbolType, TLPAndSymbolType } from '../config/config.type';
import { contractConfig } from '../config/contract.config';
import { useRefresh } from '../contexts/refresh';
import { getSuiType } from '../config';

export const useSymbolBalance = (account: string | undefined, symbol: TLPAndSymbolType | undefined, network: NetworkType = 'DEVNET') => {
  const { refreshTime } = useRefresh();
  const [coinBalance, setCoinBalance] = useState('0.00');

  const getBalance = async () => {
    if (account && symbol) {
      // const provider = getProvider(network);

      let symbolConfig;
      if (symbol === 'TLP') {
        symbolConfig = {
          Type: contractConfig[network].ExchangePackageId + '::exchange::TLP'
        };
      } else {
        const coin = contractConfig[network].Coin;
        symbolConfig = coin[symbol];
      }

      const responce = await provider.getCoinBalancesOwnedByAddress(account, getSuiType(symbolConfig.Type));
      const balance = Coin.totalBalance(responce);

      setCoinBalance(Bignumber(balance.toString()).div(10 ** 9).toFixed(2));
    } else {
      setCoinBalance('0.00');
    }
  }

  useEffect(() => {
    getBalance();
  }, [account, symbol, refreshTime]);

  return {
    coinBalance
  }
}

type AllSymbolPriceType = {
  [x: string]: {
    symbol?: string,
    balance: string,
  }
}

export const useAllSymbolBalance = (account: string | undefined, network: NetworkType = 'DEVNET') => {
  const { refreshTime } = useRefresh();
  const [allSymbolBalance, setAllSymbolBalance] = useState<AllSymbolPriceType | undefined>();

  const getBalance = async () => {
    if (account && refreshTime) {
      // const provider = getProvider(network);
      const coin = contractConfig[network].Coin;
      const symbolList = Object.keys(coin).concat(['TLP']);

      const getCoinBalances = symbolList.map((item: string) => {
        let type;
        if (item === 'TLP') {
          type = contractConfig[network].ExchangePackageId + '::exchange::TLP';
        } else {
          type = coin[item as SymbolType].Type;
        }
        return provider.getCoinBalancesOwnedByAddress(account, getSuiType(type))
      })

      const responce = await Promise.all(getCoinBalances);
      const balanceList: AllSymbolPriceType = {};
      responce.forEach((item: GetObjectDataResponse[]) => {
        if (item.length > 0) {
          const balance = Coin.totalBalance(item);
          const type = getMoveObjectType(item[0]);
          const symbol = type?.slice(type.lastIndexOf(":") + 1).replace('>', '') || 'symbol';
          balanceList[symbol] = {
            symbol,
            balance: Bignumber(balance.toString()).div(10 ** 9).toFixed(2)
          }
        }
      });
      setAllSymbolBalance(balanceList);
    } else {
      setAllSymbolBalance(undefined);
    }
  }

  useEffect(() => {
    getBalance();
  }, [account, refreshTime]);

  return {
    allSymbolBalance
  }
}