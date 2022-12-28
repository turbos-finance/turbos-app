

import { getCertifiedTransaction, getExecutionStatus, getTimestampFromTransactionResponse, getTransactionData, getTransactionDigest, SuiEvent, SuiEventEnvelope, SuiEvents, SuiTransactionData, SuiTransactionResponse } from '@mysten/sui.js';
import { useEffect, useState } from 'react';
import Empty from '../../../../../components/empty/Empty';
import { NetworkType, SymbolType } from '../../../../../config/config.type';
import { contractConfig } from '../../../../../config/contract.config';
import { useRefresh } from '../../../../../contexts/refresh';
import { useSuiWallet } from '../../../../../contexts/useSuiWallet';
import { getLocalStorage, TurbosSwapTradeRecord } from '../../../../../lib';
import { provider } from '../../../../../lib/provider';
import styles from './Trades.module.css';
import moment from 'moment';

function Trades() {
  const {
    connecting,
    connected,
    account,
    network,
    adapter
  } = useSuiWallet();
  const { refreshTime } = useRefresh();

  const [options, setOptions] = useState<any[]>([]);

  const getTrades = async () => {
    if (account) {
      const data = getLocalStorage(`${TurbosSwapTradeRecord}_${account}`);
      if (!data) {
        return;
      }
      const turbosSwapTradeRecord = data.split(',');
      setOptions(turbosSwapTradeRecord.map((item: string) => item.split('<br/>')));
    } else {
      setOptions([]);
    }
  }

  useEffect(() => {
    getTrades()
  }, [account, refreshTime]);

  return (
    <>
      {
        options.length <= 0 ?
          <div className='container'><Empty></Empty></div> :
          options.map((item: any) => (
            <div className={styles.trades}>
              <div className={styles['trades-time']}>{moment(item[0] && Number(item[0])).format('DD MMM YYYY HH:mm:ss A')}</div>
              <div className={styles['trades-info']}>{item[1]}</div>
            </div>
          ))

      }
    </>
  )
}

export default Trades;
