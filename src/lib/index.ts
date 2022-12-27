import { supplyTokens, SupplyTokenType } from "../config/tokens";

export const TurbosBuySell = 'Turbos_Buy_Sell';
export const TurbosBuySellActive = 'Turbos_Buy_Sell_Active';

export const setLocalStorage = (k: string, value: string) => {
  localStorage.setItem(k, value);
}

export const getLocalStorage = (k: string) => {
  return localStorage.getItem(k);
}

export const removeLocalStorage = (k: string) => {
  return localStorage.removeItem(k);
}

export const getLocalStorageSupplyToken = (k: string): SupplyTokenType => {
  const value = localStorage.getItem(k);
  const result = supplyTokens.find((item: SupplyTokenType) => item.symbol === value);
  if (!result) {
    return supplyTokens[0];
  } else {
    return result;
  }
}