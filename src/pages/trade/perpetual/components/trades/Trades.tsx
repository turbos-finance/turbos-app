

import { useEffect, useState } from 'react';
import Empty from '../../../../../components/empty/Empty';
import { useRefresh } from '../../../../../contexts/refresh';
import { useSuiWallet } from '../../../../../contexts/useSuiWallet';
import styles from './Trades.module.css';
import moment from 'moment';
import { client, GET_TRADES } from '../../../../../http/apolloClient';

function Trades() {
  const {
    account,
  } = useSuiWallet();
  const { refreshTime } = useRefresh();

  const [options, setOptions] = useState<any[]>([]);

  const getTrades = async () => {
    if (account) {
      const data = await client.query({
        query: GET_TRADES, variables: {
          "sender": account,
          "skip": 0,
          "take": 20,
          "types": ["IncreasePositionEvent", "DecreasePositionEvent"]
        }
      });
      setOptions(data.data.events.list);
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
          options.map((item: any, index: number) => (
            <div className={styles.trades} key={index}>
              <div className={styles['trades-time']}>{moment(item.timestamp).format('DD MMM YYYY HH:mm:ss A')}</div>
              <div className={styles['trades-info']}>{item.description}</div>
            </div>
          ))

      }
    </>
  )
}

export default Trades;
