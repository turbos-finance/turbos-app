

import Empty from '../../../../../components/empty/Empty';
import styles from './Trades.module.css';

type TradesProps = {
  options: any[]
}
function Trades(props: TradesProps) {
  const { options } = props;

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
