export type NetworkType = 'DEVNET' | 'TESTNET' | 'MAINNET';
export type SymbolType = 'BTC' | 'ETH' | 'USDC' | 'SUI';
export type TLPAndSymbolType = SymbolType | 'TLP';

export type SymbolConfigValueType = {
  type: string,
  symbol: string,
  balance: number,
  decimals: number
}

export type TokenFaucetConfigType = {
  [x in NetworkType]: {
    [y in SymbolType]: {
      type: string,
      symbol: string,
      balance: number,
      decimals: number
    }
  }
}

export type TokenTaskConfigType = {
  [x in NetworkType]: {
    [y in SymbolType]: {
      immutableToken?: string,
      coinPackageObjectId: string,
      packageObjectId: string,
      objectId: string,
      symbol: string,
      priceId: string
    }
  }
}

export type OracleConfigType = {
  [x in NetworkType]: {
    sharedObjectId: string,
    packageObjectId: string
  }
}

export type ContractConfigValueType = {
  ExchangePackageId: string,
  VaultObjectId: string,
  PositionsObjectId: string,
  ManagerCapObjectId: string,
  AumOraclePackageId: string,
  TimeOraclePackageId: string,
  PriceOraclePackageId: string,
  AumOracleObjectId: string,
  TimeOracleObjectId: string,
  PriceFeedStorageObjectId: string,
  Coin: {
    [y in SymbolType]: {
      PackageId: string,
      PriceFeedObjectId: string,
      Type: string,
      PriceFeedId: string,
      PoolObjectId: string
    }
  }
}

export type ContractConfigType = {
  [x in NetworkType]: ContractConfigValueType
}

export type TLPConfigType = {
  [x in NetworkType]: {
    Type: string
  }
}