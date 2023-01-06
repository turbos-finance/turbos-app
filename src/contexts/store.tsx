import React, { useCallback, useState } from 'react';
import { useContext } from 'react';

type StoreProvider = {
  children: React.ReactNode
}

type StoreContextValues = {
  store: { [x: string]: any },
  changeStore: (storeValue: { [x: string]: any }) => void
}

const StoreContext = React.createContext<StoreContextValues>({
  store: {},
  changeStore: (storeValue: { [x: string]: any }) => { }
});

export const UseStoreProvider: React.FC<StoreProvider> = ({ children }) => {
  const [store, setStore] = useState({});

  const changeStore = useCallback((storeValue: { [x: string]: any }) => {
    setStore({
      ...store,
      ...storeValue
    })
  }, [store]);

  return (
    <StoreContext.Provider value={{ store, changeStore }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  return useContext(StoreContext);
};
