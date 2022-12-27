import btcIcon from '../assets/images/ic_btc_40.svg';
import ethereumIcon from '../assets/images/ethereum.png';
import usdcIcon from '../assets/images/ic_usdc_40.svg';
import suiIcon from '../assets/images/ic_sui_40.svg';
import tlpIcon from '../assets/images/tlp.png';

export type SupplyTokenType = {
  icon: string,
  name: string,
  symbol: string,
}

const supplyTokens: SupplyTokenType[] = [
  {
    icon: suiIcon,
    name: 'Sui',
    symbol: 'SUI'
  },
  {
    icon: btcIcon,
    name: 'Bitcoin',
    symbol: 'BTC'
  },
  {
    icon: ethereumIcon,
    name: 'Ethereum',
    symbol: 'ETH'
  },
  {
    icon: usdcIcon,
    name: 'USD Coin',
    symbol: 'USDC'
  }
];


const supplyTradeTokens: SupplyTokenType[] = [
  {
    icon: btcIcon,
    name: 'Bitcoin',
    symbol: 'BTC'
  },
  {
    icon: ethereumIcon,
    name: 'Ethereum',
    symbol: 'ETH'
  },
];

const supplyTLPToken: SupplyTokenType = {
  icon: tlpIcon,
  name: 'TLP',
  symbol: 'TLP'
};


export {
  supplyTokens,
  supplyTLPToken,
  supplyTradeTokens
};