import styles from './Swap.module.css';

import Slider from "rc-slider";

import Trades from '../perpetual/components/trades/Trades';
import longIcon from '../../../assets/images/long.png';
import shortIcon from '../../../assets/images/short.png';
import downIcon from '../../../assets/images/down.png';
import upIcon from '../../../assets/images/up.png';
import ethereumIcon from '../../../assets/images/ethereum.png';
import swapvertIcon from '../../../assets/images/swapvert.png';
import addIcon from '../../../assets/images/add.png';
import shareIcon from '../../../assets/images/share.png';

const leverageMarks = {
  2: "2x",
  5: "5x",
  10: "10x",
  15: "15x",
  20: "20x",
  25: "25x",
  30: "30x",
};

function Swap() {
  return (
    <div className={styles.perpetual}>

      <div className={styles.left}>
        <div className={styles.leftcontainer}>

          <div className="type">
            <div className="active">Market</div>
            <div>Limit</div>
          </div>

          <div className={styles['section-con']}>
            <div className={styles.section}>
              <div className={styles.sectiontop}>
                <span>Pay</span>
                <div>
                  <span className={styles.balance}>Balance: 0.005</span>
                  <span> | </span><span>MAX</span>
                </div>
              </div>
              <div className={styles['section-percent']}>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
              <div className={styles.sectionbottom}>
                <div className={styles.sectioninputcon} >
                  <input type="text" className={styles.sectioninput} placeholder="0.0" />
                </div>
                <div className={styles.sectiontokens}>
                  <img src={ethereumIcon} alt="" />
                  <span>USDC</span>
                  <img src={downIcon} className={styles.sectiontokensicon} alt="" />
                </div>
              </div>
            </div>

            <div className={styles.swapvert}>
              {/* <SwapVertIcon sx={{ color: '#ffffff', fontSize: 30 }} /> */}
              <div className={styles.swapvertcon}><img src={swapvertIcon} alt="" /></div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectiontop}>
                <span>Long</span>
                <div>
                  {/* <span className={styles.balance}>Balance: 0.005</span>
                  <span> | </span><span>MAX</span> */}
                </div>
              </div>
              <div className={styles.sectionbottom}>
                <div className={styles.sectioninputcon} >
                  <input type="text" className={styles.sectioninput} placeholder="0.0" />
                </div>
                <div className={styles.sectiontokens}>
                  <img src={ethereumIcon} alt="" />
                  <span>USDC</span>
                  <img src={downIcon} className={styles.sectiontokensicon} alt="" />
                </div>
              </div>
            </div>

          </div>

          <div className="line">
            <p className="ll">Fees</p>
            <p className="lr">-</p>
          </div>
          <div className={styles.btn}>
            Connect Wallet
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.title}>Swap</div>
          <div className="line-con1">
            <div className="line">
              <p className="ll">Entry Price</p>
              <p className="lr">$5.45</p>
            </div>
            <div className="line">
              <p className="ll">Exit Price</p>
              <p className="lr">$1,146.22</p>
            </div>
            <div className="line">
              <p className="ll">Available Liquidity</p>
              <p className="lr">$107,695.16</p>
            </div>
          </div>
        </div>
      </div>


      <div className={styles.right}>
        <div className={styles.rightcontainer}>
          <div className={styles.tokenselect}>
            <span>ETH / USD</span>
            <img src={downIcon} className={styles.sectiontokensicon} alt="" />
          </div>
          <div className={styles.pricelist}>
            <div className={styles.value1}>1,250.91</div>
            <div className={styles.value2}>$1,250.91</div>
          </div>
          <div className={styles.pricelist}>
            <div className={styles.value2}>24h Change</div>
            <div className={styles.value1} style={{ color: '#0ecc83' }}>+6.9%</div>
          </div>
          <div className={styles.pricelist}>
            <div className={styles.value2}>24h High</div>
            <div className={styles.value1}>$1,250.91</div>
          </div>
          <div className={styles.pricelist}>
            <div className={styles.value2}>24h Low</div>
            <div className={styles.value1}>$1,250.91</div>
          </div>
        </div>

        <div className={styles.sectionchart}>

        </div>


        <div>
          <div className={styles.ordertab}>
            <span className={styles.active}>Position(2)</span>
            <span>Orders</span>
            <span>Trades</span>
          </div>
        </div>


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
            <tr>
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
            <tr>
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
            <tr>
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
                <button className={styles['table-btn-red']}>Close</button>
              </td>
            </tr>
          </tbody>
        </table>

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
            <tr>
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
          </tbody>
        </table>


        <Trades options={[]} />

      </div>


    </div>
  )
}

export default Swap;