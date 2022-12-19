import styles from '../../Perpetual.module.css';
import Empty from "../../../../../components/empty/Empty";

type OrdersProps = {
  options: any[]
}

function Orders(props: OrdersProps) {
  const { options } = props;

  return (
    <>
      <table width="100%" className={styles.table}>
        <thead>
          <tr>
            <th align='left'>Type</th>
            <th align='left'>Order</th>
            <th align='left'>Trigger Price</th>
            <th align='left'>Mark Pirce</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            options.length > 0 ?
              options.map((item: any, index: number) =>
                <tr key={index}>
                  <td align='left'>
                    Limit
                  </td>
                  <td align='left'>
                    Increase BTC Long by $197.14
                  </td>
                  <td align='left'>
                    {`< 16,633.00`}
                  </td>
                  <td align='left'>
                    16,633.00
                  </td>
                  <td>
                    <button className={styles['table-btn']}>TP/SL</button>
                    <button className={styles['table-btn-red']}>Close</button>
                  </td>
                </tr>
              )
              :
              <tr>
                <td colSpan={5}><Empty /></td>
              </tr>
          }
        </tbody>
      </table>

      <div className='container mobile-container'>
        {
          options.length <= 0 ?
            <Empty />
            :
            <div className='line-con'>

              <div className='line'>
                <div className='ll'>Type</div>
                <div className='lr'>
                  Limit
                </div>
              </div>

              <div className='line'>
                <div className='ll'>Order</div>
                <div className='lr'>
                  Increase BTC Long by $197.14
                </div>
              </div>

              <div className='line'>
                <div className='ll'>Trigger Price</div>
                <div className='lr'>
                  {`< 16,633.00`}
                </div>
              </div>
              <div className='line'>
                <div className='ll'>Mark Pirce</div>
                <div className='lr'>
                  16,633.00
                </div>
              </div>

              <div className='line'>
                <div className='ll'></div>
                <div className='lr'>
                  <button className={styles['table-btn']}>TP/SL</button>
                  <button className={styles['table-btn-green']}>Close</button>
                </div>
              </div>

            </div>
        }

      </div>

    </>
  )
}

export default Orders;