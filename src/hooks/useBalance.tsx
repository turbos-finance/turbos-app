import { useEffect, useState } from 'react';
import { provider } from '../lib/provider';
import { Coin } from '@mysten/sui.js';
import Big from 'big.js';

export const useBalance = (account: string | undefined) => {
  const [balance, setBalance] = useState('0.00');

  const getBalance = async () => {
    if (account) {
      const responce = await provider.getCoinBalancesOwnedByAddress(account);
      const balance = Coin.totalBalance(responce)
      setBalance(Big(balance.toString()).div(10 ** 9).toString());
    }
  }

  useEffect(() => {
    getBalance();
  }, [account]);

  return {
    balance
  }
}