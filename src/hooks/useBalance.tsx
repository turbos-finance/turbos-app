import { useEffect, useState } from 'react';
import { provider } from '../lib/provider';
import { Coin } from '@mysten/sui.js';
import Bignumber from 'bignumber.js';
import { useRefresh } from '../contexts/refresh';

export const useBalance = (account: string | undefined) => {
  const { refreshTime } = useRefresh();
  const [balance, setBalance] = useState('0.00');

  const getBalance = async () => {
    if (account) {
      const responce = await provider.getCoinBalancesOwnedByAddress(account, '0x2::sui::SUI');
      const balance = Coin.totalBalance(responce);

      setBalance(Bignumber(balance.toString()).div(10 ** 9).toFixed(2));
    }
  }

  useEffect(() => {
    getBalance();
  }, [account, refreshTime]);

  return {
    balance
  }
}