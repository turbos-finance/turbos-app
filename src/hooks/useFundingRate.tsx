import BigNumber from "bignumber.js";
import { el } from "date-fns/locale";
import { useEffect, useState } from "react"
import { useAllPool } from "./usePool";
import { useTimestamp } from "./useTimestamp";
import { useVault } from "./useVault";

export const useFundingRate = (to_symbol: string) => {
  const [fundingRate, setFundingRate] = useState(BigNumber(0));

  const { vault } = useVault();
  const { allPool } = useAllPool();
  const { currentTimestamp } = useTimestamp();

  const getFundingRate = (pool_data: any) => {
    let last_funding_times = pool_data.last_funding_times;
    let funding_interval = vault.funding_interval;
    let current_time = currentTimestamp;
    if (last_funding_times + funding_interval > current_time) { return 0 };

    let intervals = (current_time - last_funding_times) / funding_interval;
    let pool_amounts = pool_data.pool_amounts;
    if (pool_amounts == 0) { return 0 };
    let is_stable_token = pool_data.is_stable_token;
    let funding_rate_ractor = is_stable_token ? vault.stable_funding_rate_factor : vault.funding_rate_factor;
    let next_funding_rate = BigNumber(funding_rate_ractor).multipliedBy(pool_data.reserved_amounts).multipliedBy(intervals).div(pool_amounts).div(10 ** 9);
    setFundingRate(next_funding_rate);
  }

  useEffect(() => {
    if (currentTimestamp && vault && to_symbol && allPool[to_symbol]) {
      let pool_data = allPool[to_symbol];
      getFundingRate(pool_data);
    } else {
      setFundingRate(BigNumber(0));
    }

  }, [allPool, vault, currentTimestamp, to_symbol]);

  return {
    fundingRate
  }
}