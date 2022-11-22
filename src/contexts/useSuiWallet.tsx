import React, { useCallback, useEffect, useState, useContext } from 'react';

type WalletType = 'suiWallet' | 'suietWallet';

type SuiWalletProvider = {
    children: React.ReactNode
}

type SuiWalletContextValues = {
    account: string | undefined,
    connected: boolean,
    connecting: boolean,
    connect: (type: WalletType) => void,
    disconnect: () => void
}

const StoreContext = React.createContext<SuiWalletContextValues>({
    account: undefined,
    connected: false,
    connecting: false,
    connect: (type: WalletType) => { },
    disconnect: () => { }
});

export const UseSuiWalletProvider: React.FC<SuiWalletProvider> = ({ children }) => {
    const [walletType, setWalletType] = useState<WalletType | undefined>(undefined);
    const [account, setAccount] = useState<string | undefined>(undefined);
    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);

    const connect = useCallback(async (type: WalletType) => {
        if (type === 'suietWallet') {
            const wallet = (window as any).__suiet__;
            console.log(wallet);
            if (wallet) {
                try {
                    const newLocal = ["viewAccount"];
                    let given = await wallet.connect(newLocal);

                    if (given.data) {
                        setConnected(true);
                        setConnecting(true);
                        setWalletType(type);
                        localStorage.setItem('suiWallet', type);
                    }
                } catch (err) {
                    console.log(err);
                } finally {
                    setConnecting(false)
                }
            } else {
                window.open('https://chrome.google.com/webstore/detail/suiet-sui-wallet/khpkpbbcccdmmclmpigdgddabeilkdpd', '_blank')
            }

            return;
        }


        const wallet = (window as any).suiWallet;
        if (wallet) {
            try {
                let given = await wallet.requestPermissions();
                const newLocal = ["viewAccount"];
                let perms = await wallet.hasPermissions(newLocal);
                setConnected(true);
                setConnecting(true);
                setWalletType(type);
                localStorage.setItem('suiWallet', type);
            } catch (err) {
                console.log(err);
            } finally {
                setConnecting(false)
            }
        } else {
            window.open('https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil', '_blank')
        }

    }, []);

    const disconnect = useCallback(() => {
        setWalletType(undefined);
        setAccount(undefined);
        setConnected(false);
        setConnecting(false);
        localStorage.removeItem('suiWallet');
    }, []);

    const getAccount = async () => {
        if (walletType === 'suiWallet') {
            const accounts = await (window as any).suiWallet.getAccounts();
            setAccount(accounts[0])
        }
        else if (walletType === 'suietWallet') {
            const accounts = await (window as any).__suiet__.getAccounts();
            setAccount(accounts.data[0])
        } else {

        }

    }

    useEffect(() => {
        if (connected && connecting && walletType) {
            getAccount();
        }

    }, [connecting, connected, walletType]);

    useEffect(() => {
        const initWallet = () => {
            const type = localStorage.getItem('suiWallet');
            if (type === 'suiWallet') {
                connect('suiWallet');
            } else if (type === 'suietWallet') {
                connect('suietWallet');
            } else {
                disconnect();
            }
        }

        window.addEventListener('load', initWallet);
        return () => {
            window.removeEventListener('load', initWallet);
        }
    }, []);

    return (
        <StoreContext.Provider value={{ account, connected, connecting, connect, disconnect }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useSuiWallet = () => {
    return useContext(StoreContext);
};
