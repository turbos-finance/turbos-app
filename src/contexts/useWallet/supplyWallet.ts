import surfWalletIcon from '../../assets/images/surf_vector.svg';
import suiWalletIcon from '../../assets/images/suiwallet.svg';
import suietWalletIcon from '../../assets/images/suiet.webp';

export type SupplyWalletType = {
    icon?: string,
    name: string,
    website?: string,
}

export type SupplyWalletName = 'Suiet' | 'Sui Wallet' | 'Surf Wallet';

const supplyWallets: SupplyWalletType[] = [
    {
        icon: suietWalletIcon,
        name: 'Suiet',
        website: 'https://suiet.app/'
    },
    {
        icon: suiWalletIcon,
        name: 'Sui Wallet',
        website: 'https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil'
    },
    {
        icon: surfWalletIcon,
        name: 'Surf Wallet',
        website: 'https://surf.tech/'
    }
];

export { supplyWallets };