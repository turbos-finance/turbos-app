import { useEffect } from "react";
import { version } from "../config/version";
import { useSuiWallet } from "../contexts/useSuiWallet";
import { getLocalStorage, removeLocalStorage, setLocalStorage, TurbosPerpetualTradeRecord, TurbosSwapTradeRecord, TurbosVersion } from "../lib";

export const useVersion = () => {
  const {
    account
  } = useSuiWallet();

  useEffect(() => {
    if (account) {
      const currentVersion = getLocalStorage(`${TurbosVersion}_${account}`);
      if (currentVersion !== version) {
        removeLocalStorage(`${TurbosPerpetualTradeRecord}_${account}`);
        removeLocalStorage(`${TurbosSwapTradeRecord}_${account}`);

        setLocalStorage(`${TurbosVersion}_${account}`, version);
      }
    }
  }, [account]);
}