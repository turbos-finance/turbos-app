import BigNumber from "bignumber.js";

const BASIS_POINTS_DIVISOR = 10000;

export const getPositionFee = (vault: any, position_size_delta: BigNumber | string | number): BigNumber => {
  if (!position_size_delta || !vault) {
    return BigNumber(0);
  }

  const after_fee_usd = BigNumber(position_size_delta)
    .multipliedBy(BigNumber(BASIS_POINTS_DIVISOR).minus(vault.margin_fee_basis_points))
    .div(BASIS_POINTS_DIVISOR);

  return BigNumber(position_size_delta).minus(after_fee_usd);
}