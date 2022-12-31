import { CoinConfigObjectType, NetworkType, SymbolType } from "./config.type";
import { contractConfig } from "./contract.config";
import { supplyTokens, SupplyTokenType, supplyTradeTokens } from "./tokens";

export const getContractConfig = (network: string | undefined = 'DEVNET') => {
  if (!network) {
    return;
  }

  return contractConfig[network as NetworkType]
}

export const getContractConfigCoinSymbol = (network: string | undefined, symbol: string) => {
  if (!network) {
    return;
  }
  const config = contractConfig[network as NetworkType];
  const toSymbolConfig = config.Coin[symbol as SymbolType];
  return toSymbolConfig;
}

export const findContractConfigCoinSymbol = (network: string, value: string, keys: keyof CoinConfigObjectType) => {
  const coin = contractConfig[network as NetworkType].Coin;
  const symbol = Object.keys(coin).find((k: string) => value === coin[k as SymbolType][keys]);
  return symbol as SymbolType;
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

export const getSuiType = (coinConfigObjectType: string) => {
  return coinConfigObjectType === '0x0000000000000000000000000000000000000002::sui::SUI' ? '0x2::sui::SUI' : coinConfigObjectType;
}