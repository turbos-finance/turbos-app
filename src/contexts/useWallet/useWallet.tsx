import React, { useCallback, useEffect, useState, useContext } from 'react';
import { WalletStandardAdapterProvider } from '@mysten/wallet-adapter-all-wallets';
import { WalletAdapterProvider, WalletAdapter } from "@mysten/wallet-adapter-base";
import { supplyWallets, SupplyWalletType, SupplyWalletName } from './supplyWallet';
import { SignableTransaction } from "@mysten/sui.js";
import { StandardWalletAdapterWallet } from "@mysten/wallet-standard";

export interface StandardWalletAdapterConfig {
  wallet: StandardWalletAdapterWallet;
}

export declare class StandardWalletAdapter implements WalletAdapter {
  connected: boolean;
  connecting: boolean;
  constructor({ wallet }: StandardWalletAdapterConfig);
  get name(): string;
  get icon(): `data:image/svg+xml;base64,${string}` | `data:image/webp;base64,${string}` | `data:image/png;base64,${string}` | `data:image/gif;base64,${string}`;
  get wallet(): StandardWalletAdapterWallet;
  getAccounts(): Promise<string[]>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  signAndExecuteTransaction(transaction: SignableTransaction): Promise<import("@mysten/wallet-standard").SuiSignAndExecuteTransactionOutput>;
}

type SuiWalletProvider = {
  children: React.ReactNode
}

type SuiWalletContextValues = {
  account: string | undefined,
  connected: boolean,
  connecting: boolean,
  connect: (type: string) => void,
  disconnect: () => void,
  adapter: StandardWalletAdapter | undefined,
  adapters: { [x: string]: StandardWalletAdapter } | undefined
}

const StoreContext = React.createContext<SuiWalletContextValues>({
  account: undefined,
  connected: false,
  connecting: false,
  connect: (type: string) => { },
  disconnect: () => { },
  adapter: undefined,
  adapters: undefined
});

export const UseSuiWalletProvider: React.FC<SuiWalletProvider> = ({ children }) => {
  const [adapters, setAdapters] = useState<{ [x: string]: StandardWalletAdapter } | undefined>({});
  const [adapter, setAdapter] = useState<StandardWalletAdapter | undefined>(undefined);

  const [account, setAccount] = useState<string | undefined>(undefined);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const connect = useCallback(async (type: string) => {
    console.log(type);
    console.log(adapters);
    const adapter = adapters && adapters[type];
    console.log(adapter);

    const value = adapter && await adapter.connect();
    console.log(value);
    setAdapter(adapter);
  }, [adapters]);

  const disconnect = useCallback(() => {
    adapter?.disconnect();
    setAdapter(undefined);
  }, [adapter]);

  const getWalletInfo = async () => {
    if (adapter) {
      await adapter.getAccounts();
    } else {
      setAccount(undefined);
      setConnected(false);
      setConnecting(false);
    }
  }

  useEffect(() => {
    getWalletInfo();
  }, [adapter]);


  useEffect(() => {
    if (adapters) {
      const type = localStorage.getItem('suiWallet');
      if (type) {
        setAdapter(adapters[type]);
      } else {
        setAdapter(undefined);
      }
    }
  }, [adapters]);

  useEffect(() => {
    const initWallet = () => {
      const adapters = new WalletStandardAdapterProvider().get();
      let walletAdapter: { [x: string]: any } | undefined;
      supplyWallets.forEach((item: SupplyWalletType) => {
        const adapter = adapters.find((adapter: StandardWalletAdapter) => adapter.name === item.name)
        if (adapter) {
          if (!walletAdapter) {
            walletAdapter = {};
          }
          walletAdapter[item.name] = adapter;
        }
      });
      setAdapters(walletAdapter);
    }

    window.addEventListener('load', initWallet);
    return () => {
      window.removeEventListener('load', initWallet);
    }
  }, [])

  return (
    <StoreContext.Provider value={{ account, connected, connecting, connect, disconnect, adapters, adapter }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useSuiWallet = () => {
  return useContext(StoreContext);
};
