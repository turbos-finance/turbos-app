import styles from '../../Perpetual.module.css';
import Empty from "../../../../../components/empty/Empty";
import ethereumIcon from '../../../../assets/images/ethereum.png';
import addIcon from '../../../../assets/images/add.png';
import shareIcon from '../../../../assets/images/share.png';

type PositionsProps = {
  options: any[]
}

function Positions(props: PositionsProps) {
  const { options } = props;

  return (
    <>
      <table width="100%" className={styles.table}>
        <thead>
          <tr>
            <th align='left'>Position</th>
            <th align='left'>Total</th>
            <th align='left'>Margin</th>
            <th align='left'>Entry Price</th>
            <th align='left'>Mark Price</th>
            <th align='left'>Liq. Price</th>
            <th align='left'>PnL/PnL (%)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            options.length <= 0 ?
              <tr>
                <td colSpan={8}><Empty /></td>
              </tr>
              :
              options.map((item: any, index: number) =>
                <tr key={index}>
                  <td align='left'>
                    <div className={styles['table-position']}>
                      <img src={ethereumIcon} alt="" height="24" />
                      <span>BTC</span>
                    </div>
                    <div className={styles['table-position']}>
                      10.0x&nbsp;&nbsp;<span className={styles.red}>Short</span>
                    </div>
                  </td>
                  <td align='left'>
                    $200.00
                  </td>
                  <td align='left'>
                    <div className={styles['table-position']}>
                      <span>$20.00</span>
                      <img src={addIcon} alt="" height="24" className={styles.icon} />
                    </div>
                  </td>
                  <td align='left'>
                    $200.00
                  </td>
                  <td align='left'>
                    $200.00
                  </td>
                  <td align='left'>
                    $200.00
                  </td>
                  <td align='left'>
                    <span className={styles.red}>
                      +10.0
                    </span>
                    <div className={styles['table-position']}>
                      <span className={styles.red}>-1.16%</span>
                      <img src={shareIcon} alt="" height="24" className={styles.icon} />
                    </div>
                  </td>
                  <td>
                    <button className={styles['table-btn']}>TP/SL</button>
                    <button className={styles['table-btn-green']}>Close</button>
                  </td>
                </tr>
              )
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
                <div className='ll'>Position</div>
                <div className='lr'>
                  <div>
                    <div className={styles['table-position']}>
                      <img src={ethereumIcon} alt="" height="24" />
                      <span>BTC</span>
                    </div>
                    <div className={styles['table-position']}>
                      10.0x&nbsp;&nbsp;<span className={styles.red}>Short</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='line'>
                <div className='ll'>Total</div>
                <div className='lr'>
                  $200.00
                </div>
              </div>

              <div className='line'>
                <div className='ll'>Margin</div>
                <div className='lr'>
                  <div className={styles['table-position']}>
                    <span>$20.00</span>
                    <img src={addIcon} alt="" height="24" className={styles.icon} />
                  </div>
                </div>
              </div>

              <div className='line'>
                <div className='ll'>Entry Price</div>
                <div className='lr'>
                  $200.00
                </div>
              </div>

              <div className='line'>
                <div className='ll'>Mark Price</div>
                <div className='lr'>
                  $200.00
                </div>
              </div>

              <div className='line'>
                <div className='ll'>Liq. Price</div>
                <div className='lr'>
                  $200.00
                </div>
              </div>

              <div className='line'>
                <div className='ll'>PnL/PnL (%)</div>
                <div className='lr'>
                  <div>
                    <span className={styles.red}>
                      +10.0
                    </span>
                    <div className={styles['table-position']}>
                      <span className={styles.red}>-1.16%</span>
                      <img src={shareIcon} alt="" height="24" className={styles.icon} />
                    </div>
                  </div>
                </div>
              </div>

              <div className='line'>
                <div className='ll'>Liq. Price</div>
                <div className='lr'>
                  $200.00
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

export default Positions;