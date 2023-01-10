import BigNumber from "bignumber.js";

export const allowUpSlippage = 1 / 100;
export const slippage = 1 / 1000;
export const plusSlippage = BigNumber(1).plus(slippage);
export const minusSlippage = BigNumber(1).minus(slippage);

export const slippagePercent = BigNumber(slippage).multipliedBy(100).toFixed(2);
export const allowSlippagePercent = BigNumber(allowUpSlippage).multipliedBy(100).toFixed(2);

export const getAllowPlusSlippage = () => {
  return BigNumber(1).plus(allowUpSlippage)
}

export const getAllowMinusSlippage = () => {
  return BigNumber(1).minus(allowUpSlippage)
}