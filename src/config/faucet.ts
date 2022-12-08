import btcIcon from '../assets/images/ic_btc_40.svg';
import ethereumIcon from '../assets/images/ethereum.png';
import usdcIcon from '../assets/images/ic_usdc_40.svg';

export type SymbolsType = {
    symbol: string,
    number: number,
    decimals: number,
    name: string,
    icon: string,
}

const symbols: SymbolsType[] = [
    {
        name: 'Ethereum',
        icon: ethereumIcon,
        symbol: 'ETH',
        number: 10,
        decimals: 9
    },
    {
        name: 'BitCoin',
        icon: btcIcon,
        symbol: 'BTC',
        number: 1,
        decimals: 9
    },
    {
        name: 'USD Coin',
        icon: usdcIcon,
        symbol: 'USDC',
        number: 10000,
        decimals: 9
    }
];

export { symbols }
