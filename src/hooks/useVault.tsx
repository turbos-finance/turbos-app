import { useEffect, useState } from 'react';
import { provider } from '../lib/provider';
import { Coin } from '@mysten/sui.js';
import Bignumber from 'bignumber.js';

export const useVault = (account: string | undefined, symbol: string | undefined, network: string = 'DEVNET') => {

  const [balance, setBalance] = useState('0.00');

  const getBalance = async () => {
    if (account) {
      const responce = await provider.getCoinBalancesOwnedByAddress(account);
      const balance = Coin.totalBalance(responce)
      setBalance(Bignumber(balance.toString()).div(10 ** 9).toString());
    }
  }

  useEffect(() => {
    getBalance();
  }, [account]);

  return {
    balance
  }
}