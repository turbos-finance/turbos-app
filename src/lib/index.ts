import { CoinConfigObjectType, NetworkType, SymbolType } from "../config/config.type";
import { contractConfig } from "../config/contract.config";
import { supplyTokens, SupplyTokenType, supplyTradeTokens } from "../config/tokens";

export const findContractConfigCoinSymbol = (network: string, value: string, keys: keyof CoinConfigObjectType) => {
  const coin = contractConfig[network as NetworkType].Coin;
  const symbol = Object.keys(coin).find((k: string) => value === coin[k as SymbolType][keys]);
  return symbol;
}

export const findSupplyTradeTokeSymbol = (symbol: string | undefined) => {
  if (!symbol) {
    return;
  }
  const supplyTradeToken = supplyTradeTokens.find((item: SupplyTokenType) => item.symbol === symbol);
  return supplyTradeToken;
}

export const findsupplyTokenSymbol = (symbol: string | undefined) => {
  if (!symbol) {
    return;
  }
  const supplyToken = supplyTokens.find((item: SupplyTokenType) => item.symbol === symbol);
  return supplyToken;
}