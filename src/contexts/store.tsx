import React, { useState } from 'react';
import { useContext } from 'react';

type StoreProvider = {
  children: React.ReactNode
}

type StoreContextValues = {
  store: { [x: string]: any },
  setStore: (storeValue: { [x: string]: any }) => void
}

const StoreContext = React.createContext<StoreContextValues>({
  store: {},
  setStore: (storeValue: { [x: string]: any }) => { }
});

export const UseStoreProvider: React.FC<StoreProvider> = ({ children }) => {
  const [store, setStore] = useState({});

  return (
    <StoreContext.Provider value={{ store, setStore }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  return useContext(StoreContext);
};
