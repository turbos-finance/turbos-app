import BigNumber from "bignumber.js";
import { useEffect, useState } from "react"
import { getContractConfig } from "../config";
import { useSuiWallet } from "../contexts/useSuiWallet";
import { provider } from "../lib/provider";
import { useAllPool } from "./usePool";
import { useAllSymbolPrice, useSymbolPrice } from "./useSymbolPrice";
import { useVault } from "./useVault";

const BASIS_POINTS_DIVISOR = 10000;

export const useFees = (in_symbol: string, in_symbol_value: string, out_symbol: string, out_symbol_value: string) => {
  const {
    network
  } = useSuiWallet();

  const { vault } = useVault();
  const { allPool } = useAllPool();
  const { allSymbolPrice } = useAllSymbolPrice();

  const [fees, setFees] = useState(BigNumber(0));

  const get_swap_fee_basis_points = () => {
    const tusd_amount = BigNumber(in_symbol_value).multipliedBy(allSymbolPrice[in_symbol].originalPrice);
    let in_pool_data = allPool[in_symbol];
    let out_pool_data = allPool[out_symbol];
    let is_token_in_stable = in_pool_data?.is_stable_token;
    let is_token_out_stable = out_pool_data?.is_stable_token;
    let is_stable_swap = is_token_in_stable && is_token_out_stable;
    let base_bps = is_stable_swap ? vault.stable_swap_fee_basis_points : vault.swap_fee_basis_points;
    let tax_bps = is_stable_swap ? vault.stable_tax_basis_points : vault.tax_basis_points;
    let fee_basis_points_0 = get_fee_basis_points(in_pool_data, tusd_amount, base_bps, tax_bps, true);
    let fees_basis_points_1 = get_fee_basis_points(out_pool_data, tusd_amount, base_bps, tax_bps, false);
    let point = fee_basis_points_0 > fees_basis_points_1 ? fee_basis_points_0 : fees_basis_points_1;
    return point;
  }

  const get_fee_basis_points = (pool_data: any, tusd_delta: any, fee_basis_points: any, tax_basis_points: any, increment: boolean) => {
    let has_dynamic_fees = vault.has_dynamic_fees;
    if (!has_dynamic_fees) { return fee_basis_points };

    let initial_amount = pool_data.tusd_amounts;
    let next_amount = initial_amount + tusd_delta;
    if (!increment) {
      next_amount = tusd_delta > initial_amount ? 0 : initial_amount - tusd_delta;
    };

    let target_amount = get_target_tusd_amount(pool_data);
    if (target_amount == 0) { return fee_basis_points };

    let initial_diff = initial_amount > target_amount ? initial_amount - target_amount : target_amount - initial_amount;
    let next_diff = next_amount > target_amount ? next_amount - target_amount : target_amount - next_amount;

    if (next_diff < initial_diff) {
      let rebate_bps = BigNumber(tax_basis_points).multipliedBy(initial_diff).div(target_amount).toNumber();
      return rebate_bps > fee_basis_points ? 0 : fee_basis_points - rebate_bps
    };

    let average_diff = (initial_diff + next_diff) / 2;
    if (average_diff > target_amount) {
      average_diff = target_amount;
    };
    let tax_bps = BigNumber(tax_basis_points).multipliedBy(average_diff).div(target_amount).toNumber();
    return fee_basis_points + tax_bps;
  }

  const get_target_tusd_amount = (pool_data: any) => {
    let supply = vault.tusd_supply_amount;
    if (supply == 0) { return 0 };
    let weight = pool_data.token_weights;
    let target_weight = BigNumber(weight).multipliedBy(supply).div(vault.total_token_weights).toNumber()
    return target_weight;
  }


  const getFees = async () => {
    let fee_basis_points = get_swap_fee_basis_points();
    const after_fees = BigNumber(out_symbol_value)
      .multipliedBy(BigNumber(BASIS_POINTS_DIVISOR).minus(fee_basis_points))
      .div(BASIS_POINTS_DIVISOR);
    setFees(after_fees);
  }

  useEffect(() => {
    if (network && in_symbol && in_symbol_value && out_symbol && out_symbol_value && allPool[in_symbol]) {
      getFees();
    } else {
      setFees(BigNumber(0));
    }
  }, [network, in_symbol, in_symbol_value, out_symbol, out_symbol_value, vault, allPool]);

  return {
    fees
  }
}