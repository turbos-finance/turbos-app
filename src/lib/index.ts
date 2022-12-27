import { supplyTokens, SupplyTokenType, supplyTradeTokens } from "../config/tokens";

export const TurbosBuySell = 'Turbos_Buy_Sell';
export const TurbosBuySellActive = 'Turbos_Buy_Sell_Active';
export const TurbosSwapFrom = 'Turbos_Swap_From';
export const TurbosSwapTo = 'Turbos_Swap_To';

export const setLocalStorage = (k: string, value: string) => {
  localStorage.setItem(k, value);
}

export const getLocalStorage = (k: string) => {
  return localStorage.getItem(k);
}

export const removeLocalStorage = (k: string) => {
  return localStorage.removeItem(k);
}

export const getLocalStorageSupplyToken = (k: string, d: number = 0): SupplyTokenType => {
  const value = localStorage.getItem(k);
  const result = supplyTokens.find((item: SupplyTokenType) => item.symbol === value);
  if (!result) {
    return supplyTokens[d];
  } else {
    return result;
  }
}

export const getLocalStorageSupplyTradeToken = (k: string): SupplyTokenType => {
  const value = localStorage.getItem(k);
  const result = supplyTradeTokens.find((item: SupplyTokenType) => item.symbol === value);
  if (!result) {
    return supplyTradeTokens[0];
  } else {
    return result;
  }
}