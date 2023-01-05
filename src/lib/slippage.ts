import BigNumber from "bignumber.js";
export const slippage = 1 / 1000;
export const plusSlippage = BigNumber(1).plus(slippage);
export const minusSlippage = BigNumber(1).minus(slippage);

export const slippagePercent = BigNumber(slippage).multipliedBy(100).toNumber();