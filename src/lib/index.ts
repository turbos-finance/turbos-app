import { supplyTokens, SupplyTokenType, supplyTradeTokens } from "../config/tokens";

export const TurbosVersion = 'Turbos_Version';
export const TurbosBuySell = 'Turbos_Buy_Sell';
export const TurbosBuySellActive = 'Turbos_Buy_Sell_Active';
export const TurbosSwapFrom = 'Turbos_Swap_From';
export const TurbosSwapTo = 'Turbos_Swap_To';
export const TurbosSwapTradeRecord = 'Turbos_Swap_Trade_Record';
export const TurbosPerpetualFrom = 'Turbos_Perpetual_From';
export const TurbosPerpetualTo = 'Turbos_Perpetual_To';
export const TurbosPerpetualTrade = 'Turbos_Perpetual_Trade';
export const TurbosPerpetualTradeRecord = 'Turbos_Perpetual_Trade_Record';

export const setLocalStorage = (k: string, value: string) => {
  localStorage.setItem(k, value);
}

export const getLocalStorage = (k: string) => {
  return localStorage.getItem(k);
}

export const unshiftLocalStorage = (k: string, value: string, len: number = 10) => {
  const record = getLocalStorage(k);
  let current_value = value;
  if (record) {
    const val = record.split(',');
    val.unshift(value);

    if (val.length > len) {
      val.pop();
    }

    current_value = val.join(',')
  }
  localStorage.setItem(k, current_value);
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