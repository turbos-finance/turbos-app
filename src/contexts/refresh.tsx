import React, { useCallback, useEffect, useState } from 'react';
import { useContext } from 'react';

type RefreshProvider = {
  children: React.ReactNode,
}

type RefreshContextValues = {
  refreshTime: number | null,
  changeRefreshTime: () => void
}

const RefreshContext = React.createContext<RefreshContextValues>({
  refreshTime: null,
  changeRefreshTime: () => { },
});

let interval: NodeJS.Timer;
const time = 20000;

export const UseRefreshProvider: React.FC<RefreshProvider> = ({ children }) => {
  const [refreshTime, setRefreshTime] = useState<number | null>(null);

  const changeTime = useCallback(() => {
    setRefreshTime(Date.now());
    clearTimeout(interval)
    interval = setTimeout(() => {
      changeTime();
    }, time);
  }, []);

  const changeRefreshTime = useCallback(() => {
    changeTime();
  }, []);

  useEffect(() => {
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
