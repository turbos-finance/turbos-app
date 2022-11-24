import styles from './Perpetual.module.css';
import Slider from "rc-slider";
import Trades from './components/trades/Trades';
import longIcon from '../../../assets/images/long.png';
import shortIcon from '../../../assets/images/short.png';
import downIcon from '../../../assets/images/down.png';
import ethereumIcon from '../../../assets/images/ethereum.png';
import swapvertIcon from '../../../assets/images/swapvert.png';
import addIcon from '../../../assets/images/add.png';
import shareIcon from '../../../assets/images/share.png';
import { useRef, useState } from 'react';
import Empty from '../../../components/empty/Empty';
import SelectToken from '../../../components/selectToken/SelectToken';
import { supplyTokens, supplyPerpetualTokens } from '../../../config/tokens';
import Dropdown from "rc-dropdown";
import Menu, { Item as MenuItem } from 'rc-menu';

const leverageMarks = {
  2: "2x",
  5: "5x",
  10: "10x",
  15: "15x",
  20: "20x",
  25: "25x",
  30: "30x",
};

const percents = [0.25, 0.5, 0.75, 1];

type ParamsType = {
  pay: string
}

function Perpetual() {
  const chartRef = useRef(null);
  const balance = 100;

  const [trade, setTrade] = useState(0); // 0: long; 1: short
  const [type, setType] = useState(0); // 0: market; 1: limit; 2: Trigger
  const [record, setRecord] = useState(0); // 0: posotion ; 1: orders ; 2: trades
  const [selectToken, setSelectToken] = useState(false);
  const [percent, setPercent] = useState(0);

  const [params, setParams] = useState<ParamsType>({
    pay: ''
  });

  const toggleSelectToken = () => {
    setSelectToken(!selectToken);
  }

  const handleType = (type: number) => {
    setType(type);
  }

  const handleTrade = (type: number) => {
    setTrade(type);
  }

  const changeParams = (k: keyof ParamsType, value: string) => {
    const newParams = { ...params };
    newParams[k] = value;
    setParams(newParams)
  }

  const handlePercent = (percent: number) => {
    changeParams('pay', (balance * percent).toString());
    setPercent(percent);
  }

  const recordTitle = ['Positions', 'Orders', 'Trades'];
  const recordContent = [<Positions options={[]} />, <Orders options={[]} />, <Trades options={[]} />];
  const typeList = ['Market', 'Limit', 'Trigger'];
  const menu = (
    <Menu className="overlay-dropdown-ul">
      <MenuItem>
        <div className="overlay-dropdown-li menus-dropdown-li ">
          <span>BTC / USD</span>
        </div>
        <div className="overlay-dropdown-li menus-dropdown-li ">
          <span>ETH / USD</span>
        </div>
      </MenuItem>
    </Menu>
  );

  return (
    <div className="main">
      <div className="main-left">
        <div className='main-left-container'>
          <div className={selectToken ? 'section-operate' : ''}>

            <div className='tabs'>
              <div className={!!trade ? '' : 'active'} onClick={() => handleTrade(0)}>
                <img src={longIcon} alt="" />
                <span>Long</span>
              </div>
              <div className={!!trade ? 'red active' : 'red'} onClick={() => handleTrade(1)}>
                <img src={shortIcon} alt="" />
                <span>Short</span>
              </div>
            </div>

            <div className="type">
              {
                typeList.map((item: string, index: number) =>
                  <div className={index === type ? "active" : ''} onClick={() => handleType(index)}>{item}</div>
                )
              }
            </div>

            {
              type !== 2 ?
                <div className='section-con'>
                  <div className="section">
                    <div className="sectiontop">
                      <span>Pay</span>
                      <div>
                        <span className="section-balance">Balance: {balance}</span>
                        <span> | </span><span className='section-max' onClick={() => { handlePercent(1) }}>MAX</span>
                      </div>
                    </div>
                    <div className="section-percent">
                      {
                        percents.map((item: number) =>
                          <span key={item} className={percent === item ? 'active' : ''} onClick={() => { handlePercent(item) }}>{item * 100}%</span>
                        )
                      }
                    </div>
                    <div className="sectionbottom">
                      <div className="sectioninputcon" >
                        <input type="text" value={params.pay} className="sectioninput" placeholder="0.0" />
                      </div>
                      <div className="sectiontokens" onClick={toggleSelectToken}>
                        <img src={ethereumIcon} alt="" />
                        <span>SUI</span>
                        <img src={downIcon} className="sectiontokensicon" alt="" />
                      </div>
                    </div>
                  </div>

                  <div className="swapvert">
                    <div className={trade === 1 ? "swapvertcon swapvertcon-red" : 'swapvertcon'}><img src={swapvertIcon} alt="" /></div>
                  </div>

                  <div className="section">
                    <div className="sectiontop">
                      <span>Long</span>
                      <div>
                        {/* <span className="balance">Balance: 0.005</span>
                <span> | </span><span>MAX</span> */}
                      </div>
                    </div>
                    <div className="sectionbottom">
                      <div className="sectioninputcon" >
                        <input type="text" className="sectioninput" placeholder="0.0" />
                      </div>
                      <div className="sectiontokens">
                        <img src={ethereumIcon} alt="" />
                        <span>ETH</span>
                        <img src={downIcon} className="sectiontokensicon" alt="" />
                      </div>
                    </div>
                  </div>

                  {
                    type === 1 ?
                      <div className="section" style={{ marginTop: '10px' }}>
                        <div className="sectiontop">
                          <span>Price</span>
                          <div>
                            {/* <span className="balance">Balance: 0.005</span>
                <span> | </span><span>MAX</span> */}
                          </div>
                        </div>
                        <div className="sectionbottom">
                          <div className="sectioninputcon" >
                            <input type="text" className="sectioninput" placeholder="0.0" />
                          </div>
                          <div className="sectiontokens">
                            <span>USDC</span>
                          </div>
                        </div>
                      </div>
                      : null
                  }

                </div>
                : null
            }
            <div className="line">
              <p className="ll">leverage</p>
              <p className="lr"></p>
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

            <div className="line">
              <p className="ll">Collaterlal In</p>
              <p className="lr">USD</p>
            </div>
            <div className="line">
              <p className="ll">Leverage</p>
              <p className="lr">$5.45</p>
            </div>
            <div className="line">
              <p className="ll">Entry Price</p>
              <p className="lr">-</p>
            </div>
            <div className="line">
              <p className="ll">Liq. Price</p>
              <p className="lr">$15.45</p>
            </div>
            <div className="line">
              <p className="ll">Fees</p>
              <p className="lr">-</p>
            </div>
            <div className="btn">
              Connect Wallet
            </div>
          </div>

          <SelectToken visible={selectToken} options={supplyTokens} onClose={toggleSelectToken} />
        </div>

        <div className="container">
          <div className={styles.title}>Long ETH</div>
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
              <p className="ll">Borrow Fee</p>
              <p className="lr">0.0001% / 1h</p>
            </div>
            <div className="line">
              <p className="ll">Available Liquidity</p>
              <p className="lr">$107,695.16</p>
            </div>
          </div>
        </div>
      </div>

      <div className="main-right">
        <div className="main-right-container">

          <Dropdown overlay={menu} trigger={['click']} overlayClassName={'overlay-dropdown menus-dropdown'} >
            <div className={styles.tokenselect}>
              <span>ETH / USD</span>
              <img src={downIcon} className="sectiontokensicon" alt="" />
            </div>
          </Dropdown>

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
          {/* <div className="ExchangeChart-bottom-content" ref={chartRef}></div> */}
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

type PositionsProps = {
  options: any[]
}

function Positions(props: PositionsProps) {
  const { options } = props;

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
        {
          options.length <= 0 ?
            <tr>
              <td colSpan={8}><Empty /></td>
            </tr>
            :
            options.map((item: any) =>
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
            )
        }
      </tbody>
    </table>
  )
}

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
              options.map((item: any) =>
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
              )
              :
              <tr>
                <td colSpan={5}><Empty /></td>
              </tr>
          }
        </tbody>
      </table>
    </>
  )
}

export default Perpetual;