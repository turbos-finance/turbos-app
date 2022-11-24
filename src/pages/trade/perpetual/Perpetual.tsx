import styles from './Perpetual.module.css';

import Slider from "rc-slider";

import Trades from './components/trades/Trades';
import longIcon from '../../../assets/images/long.png';
import shortIcon from '../../../assets/images/short.png';
import downIcon from '../../../assets/images/down.png';
import upIcon from '../../../assets/images/up.png';
import ethereumIcon from '../../../assets/images/ethereum.png';
import swapvertIcon from '../../../assets/images/swapvert.png';
import addIcon from '../../../assets/images/add.png';
import shareIcon from '../../../assets/images/share.png';
import closeIcon from '../../../assets/images/close.png';
import searchIcon from '../../../assets/images/search.png';
import { useState } from 'react';
import Empty from '../../../components/empty/Empty';

const leverageMarks = {
  2: "2x",
  5: "5x",
  10: "10x",
  15: "15x",
  20: "20x",
  25: "25x",
  30: "30x",
};


const recordTitle = ['Positions', 'Orders', 'Trades'];
const recordContent = [<Positions />, <Orders />, <Trades />];

function Perpetual() {
  const [type, setType] = useState(0); // 0: long; 1: short
  const [selectToken, setSelectToken] = useState(false);
  const [record, setRecord] = useState(0); // 0: posotion ; 1: orders ; 2: trades

  const toggleSelectToken = () => {
    setSelectToken(!selectToken);
  }

  const handleType = (type: 0 | 1) => {
    setType(type)
  }

  return (
    <div className={styles.perpetual}>

      <div className={styles.left}>
        <div className={styles.leftcontainer}>
          <div className={selectToken ? styles.operate : ''}>

            <div className={styles.tabs}>
              <div className={!!type ? '' : styles.active} onClick={() => handleType(0)}>
                <img src={longIcon} alt="" />
                <span>Long</span>
              </div>
              <div className={!!type ? styles.active : ''} onClick={() => handleType(1)}>
                <img src={shortIcon} alt="" />
                <span>Short</span>
              </div>
            </div>

            <div className={styles.type}>
              <div className={styles.active}>Market</div>
              <div>Limit</div>
              <div>Trigger</div>
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
                  <div className={styles.sectiontokens} onClick={toggleSelectToken}>
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

              <div className={styles.swapvert}>
              </div>

              <div className={styles.section}>
                <div className={styles.sectiontop}>
                  <span>Price</span>
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

            <div className={styles.line}>
              <p className={styles.lleft}>leverage</p>
              <p className={styles.lright}></p>
            </div>

            <div
            // className={cx("Exchange-leverage-slider", "App-slider", {
            //   positive: isLong,
            //   negative: isShort,
            // })}
            >
              <Slider
                min={1.1}
                max={30.5}
                step={0.1}
                marks={leverageMarks}
              // handle={leverageSliderHandle}
              // onChange={(value) => setLeverageOption(value)}
              // value={leverageOption}
              // defaultValue={leverageOption}
              />
            </div>

            <div className={styles.line}>
              <p className={styles.lleft}>Collaterlal In</p>
              <p className={styles.lright}>USD</p>
            </div>
            <div className={styles.line}>
              <p className={styles.lleft}>Leverage</p>
              <p className={styles.lright}>$5.45</p>
            </div>
            <div className={styles.line}>
              <p className={styles.lleft}>Entry Price</p>
              <p className={styles.lright}>-</p>
            </div>
            <div className={styles.line}>
              <p className={styles.lleft}>Liq. Price</p>
              <p className={styles.lright}>$15.45</p>
            </div>
            <div className={styles.line}>
              <p className={styles.lleft}>Fees</p>
              <p className={styles.lright}>-</p>
            </div>
            <div className={styles.btn}>
              Connect Wallet
            </div>
          </div>

          <div className={styles['token-con']} style={{ display: selectToken ? 'block' : 'none' }}>
            <div className={styles['token-top']}>
              <div className={styles['token-top-title']}>Select Token</div>
              <div className={styles['token-top-close']} onClick={toggleSelectToken}><img src={closeIcon} alt="" height='24' /></div>
            </div>
            <div className={styles['token-search']}>
              <input type="text" className={styles['token-input']} placeholder="Search Token" />
              <img src={searchIcon} alt="" height='24' />
            </div>
            <ul className={styles['token-list']}>
              <li>
                <img src={ethereumIcon} alt="" height="24" />
                <div className={styles['token-name']}>
                  <p className={styles['token-value1']}>SUI</p>
                  <p className={styles['token-value2']}>Sui</p>
                </div>
                <div>
                  <p className={styles['token-value1']}>0.0000</p>
                  <p className={styles['token-value2']}>$ 0.00</p>
                </div>
              </li>
              <li>
                <img src={ethereumIcon} alt="" height="24" />
                <div className={styles['token-name']}>
                  <p className={styles['token-value1']}>SUI</p>
                  <p className={styles['token-value2']}>Sui</p>
                </div>
                <div>
                  <p className={styles['token-value1']}>0.0000</p>
                  <p className={styles['token-value2']}>$ 0.00</p>
                </div>
              </li>

            </ul>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.title}>Long ETH</div>
          <div className={styles.content}>
            <div className={styles.line}>
              <p className={styles.lleft}>Entry Price</p>
              <p className={styles.lright}>$5.45</p>
            </div>
            <div className={styles.line}>
              <p className={styles.lleft}>Exit Price</p>
              <p className={styles.lright}>$1,146.22</p>
            </div>
            <div className={styles.line}>
              <p className={styles.lleft}>Borrow Fee</p>
              <p className={styles.lright}>0.0001% / 1h</p>
            </div>
            <div className={styles.line}>
              <p className={styles.lleft}>Available Liquidity</p>
              <p className={styles.lright}>$107,695.16</p>
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
            {
              recordTitle.map((item: string, index: number) =>
                <span key={index} className={index === record ? styles.active : ''} onClick={() => setRecord(index)}>{item}</span>
              )
            }
          </div>
        </div>

        {recordContent[record]}
      </div>
    </div>
  )
}

function Positions() {
  return (
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
        {/* <tr>
          <td colSpan={8}><Empty /></td>
        </tr> */}
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
  )
}


function Orders() {
  return (
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
          <td colSpan={5}><Empty /></td>
        </tr>
        {/* <tr>
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
        </tr> */}
      </tbody>
    </table>
  )
}

export default Perpetual;