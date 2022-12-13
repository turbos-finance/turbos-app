import { useEffect, useState } from 'react';
import { getProvider, provider } from '../lib/provider';
import { Coin, getObjectFields } from '@mysten/sui.js';
import Bignumber from 'bignumber.js';
import { contractConfig } from '../config/contract.config';
import { NetworkType } from '../config/config.type';
import { numberWithCommas } from '../utils';


export type AumType = {
    amount: string;
}

export const useAum = (network: NetworkType = 'DEVNET') => {

    const [aum, setAum] = useState<AumType>({
        amount : '0'
    });

    const getVault = async () => {
        const provider = getProvider(network);
        const aumObjectId = contractConfig[network].AumOracleObjectId;

        const aumResponce = await provider.getObject(aumObjectId);
        const aumField = getObjectFields(aumResponce);

        setAum({
            ...aumField,
            amount: Bignumber(aumField?.amount).div(10 ** 9).toFixed(2)
        })
    }

    useEffect(() => {
        getVault();
    }, []);

    return {
        aum
    }
}