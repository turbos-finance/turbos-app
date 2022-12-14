import { useEffect, useState } from 'react';
import { getProvider, provider } from '../lib/provider';
import { Coin } from '@mysten/sui.js';
import Bignumber from 'bignumber.js';
import { NetworkType, SymbolType, TLPAndSymbolType } from '../config/config.type';
import { contractConfig } from '../config/contract.config';
import TLPConfig from '../config/TLP.config';


export const useSymbolBalance = (account: string | undefined, symbol: TLPAndSymbolType | undefined, network: NetworkType = 'DEVNET') => {
  const [coinBalance, setCoinBalance] = useState('0.00');

  const getBalance = async () => {
    if (account && symbol) {
      const provider = getProvider(network);

      let symbolConfig;
      if (symbol === 'TLP') {
        symbolConfig = TLPConfig[network];
      } else {
        const coin = contractConfig[network].Coin;
        symbolConfig = coin[symbol];
      }

      const responce = await provider.getCoinBalancesOwnedByAddress(account, symbolConfig.Type === '0x0000000000000000000000000000000000000002::sui::SUI' ? '0x2::sui::SUI' : symbolConfig.Type);
      const balance = Coin.totalBalance(responce);

      setCoinBalance(Bignumber(balance.toString()).div(10 ** 9).toFixed(2));
    }
  }

  useEffect(() => {
    getBalance();
  }, [account, symbol]);

  return {
    coinBalance
  }
}