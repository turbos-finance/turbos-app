import React, { useEffect, useState } from 'react';
import { useContext } from 'react';


type RefreshProvider = {
  children: React.ReactNode
}

type RefreshContextValues = {
  refreshTime: string | number | null
}

const RefreshContext = React.createContext<RefreshContextValues>({
  refreshTime: null,
});

let interval: NodeJS.Timer | undefined;
const time = 30000;

export const UseRefreshProvider: React.FC<RefreshProvider> = ({ children }) => {
  const [refreshTime, setRefreshTime] = useState<string | number | null>(null);

  useEffect(() => {

    const changeTime = () => {
      interval = setTimeout(() => {
        setRefreshTime(new Date().getTime());
        changeTime();
      }, time);
    }

    changeTime();

    return () => clearTimeout(interval);
  }, []);

  return (
    <RefreshContext.Provider value={{ refreshTime }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = () => {
  return useContext(RefreshContext);
};
