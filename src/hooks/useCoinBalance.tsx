import { useEffect, useState } from 'react';
import { provider } from '../lib/provider';
import { Coin } from '@mysten/sui.js';
import Big from 'big.js';

export const useCoinBalance = (account: string | undefined, symbol: string) => {
  const [coinBalance, setCoinBalance] = useState('0.00');

  const getBalance = async () => {
    if (account) {
      const responce = await provider.getCoinBalancesOwnedByAddress(account);
      const balance = Coin.totalBalance(responce)
      setCoinBalance(Big(balance.toString()).div(10 ** 9).toString());
    }
  }

  useEffect(() => {
    getBalance();
  }, [account]);

  return {
    coinBalance
  }
}