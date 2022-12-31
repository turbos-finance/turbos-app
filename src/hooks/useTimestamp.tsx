import { getObjectFields } from "@mysten/sui.js";
import { useCallback, useEffect, useState } from "react"
import { getContractConfig } from "../config";
import { provider } from "../lib/provider";

let interval: NodeJS.Timer | undefined;

export const useTimestamp = () => {
  const [currentTimestamp, setCurrenttTimestamp] = useState(0);

  const getTimestamp = async () => {
    const config = getContractConfig();
    if (!config) {
      return
    }
    const timeOracle = await provider.getObject(config.TimeOracleObjectId);
    const field = getObjectFields(timeOracle);
    field && setCurrenttTimestamp(field.unix_ms);
  }

  const changeTimeOracle = useCallback(() => {
    getTimestamp();
    interval = setTimeout(() => {
      getTimestamp();
    }, 5000);
  }, []);

  useEffect(() => {
    changeTimeOracle();
    return () => clearTimeout(interval)
  }, []);


  return {
    currentTimestamp
  }
}