import React, { useCallback, useEffect, useState } from 'react';
import { useContext } from 'react';

type RefreshProvider = {
  children: React.ReactNode,
}

type RefreshContextValues = {
  refreshTime: string | number | null,
  changeRefreshTime: () => void
}

const RefreshContext = React.createContext<RefreshContextValues>({
  refreshTime: null,
  changeRefreshTime: () => { },
});

let interval: NodeJS.Timer | undefined;
const time = 20000;

export const UseRefreshProvider: React.FC<RefreshProvider> = ({ children }) => {
  const [refreshTime, setRefreshTime] = useState<string | number | null>(null);

  const changeTime = useCallback(() => {
    interval = setTimeout(() => {
      setRefreshTime(Date.now());
      changeTime();
    }, time);
  }, []);

  const changeRefreshTime = useCallback(() => {
    setRefreshTime(Date.now());
    clearTimeout(interval);
    changeTime();
  }, []);

  useEffect(() => {
    setRefreshTime(Date.now());
    changeTime();
    return () => clearTimeout(interval);
  }, []);

  return (
    <RefreshContext.Provider value={{ refreshTime, changeRefreshTime }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = () => {
  return useContext(RefreshContext);
};
