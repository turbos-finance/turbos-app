

import { SuiEventEnvelope, SuiEvents } from '@mysten/sui.js';
import { useEffect } from 'react';
import Empty from '../../../../../components/empty/Empty';
import { provider } from '../../../../../lib/provider';
import styles from './Trades.module.css';

type TradesProps = {
  options: any[]
}
function Trades(props: TradesProps) {
  const { options } = props;

  const getTrades = async () => {

    // const result = await provider.getEvents({ MoveEvent: `${}::exchange::SwapEvent` }, null, 10);
    // console.log(result);

    // result.data.map((item: SuiEventEnvelope) => {

    // })

    // const trans = await provider.getTransactionWithEffects('2zxTnLAZFnT2MmMyYjJTJLPPtjLJW2BhEb8hzNCpKcoX');
    // console.log(trans);

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
