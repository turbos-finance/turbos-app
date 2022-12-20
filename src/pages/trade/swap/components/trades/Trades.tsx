

import { SuiEventEnvelope, SuiEvents } from '@mysten/sui.js';
import { useEffect, useState } from 'react';
import Empty from '../../../../../components/empty/Empty';
import { NetworkType } from '../../../../../config/config.type';
import { contractConfig } from '../../../../../config/contract.config';
import { useSuiWallet } from '../../../../../contexts/useSuiWallet';
import { provider } from '../../../../../lib/provider';
import styles from './Trades.module.css';


function Trades() {
  const {
    connecting,
    connected,
    account,
    network,
    adapter
  } = useSuiWallet();

  const [options, setOptions] = useState([]);

  const getTrades = async () => {
    if (account && network) {
      const config = contractConfig[network as NetworkType];
      const result = await provider.getEvents({ MoveEvent: `${config.ExchangePackageId}::exchange::SwapEvent` }, null, 10);
      console.log(result);

      result.data.map((item: SuiEventEnvelope) => {
      
      });

      const trans = await provider.getTransactionWithEffects('2zxTnLAZFnT2MmMyYjJTJLPPtjLJW2BhEb8hzNCpKcoX');
      console.log(trans);

    }
  }

  useEffect(() => {
    getTrades()
  }, []);

  return (
    <>
      {
        options.length <= 0 ?
          <div className='container'><Empty></Empty></div> :
          options.map((item: any) => (
            <div className={styles.trades}>
              <div className={styles['trades-time']}>18 Nov 2022, 1:12 AM</div>
              <div className={styles['trades-info']}>Deposit 9.99 USD into AVAX Long</div>
            </div>
          ))

      }
    </>
  )
}

export default Trades;
