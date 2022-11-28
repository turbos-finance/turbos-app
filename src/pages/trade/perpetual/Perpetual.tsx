import styles from './Perpetual.module.css';
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Trades from './components/trades/Trades';
import longIcon from '../../../assets/images/long.png';
import shortIcon from '../../../assets/images/short.png';
import downIcon from '../../../assets/images/down.png';
import ethereumIcon from '../../../assets/images/ethereum.png';
import suiIcon from '../../../assets/images/ic_sui_40.svg';
import toIcon from '../../../assets/images/to.png';
import swapvertIcon from '../../../assets/images/swapvert.png';
import addIcon from '../../../assets/images/add.png';
import shareIcon from '../../../assets/images/share.png';
import { useRef, useState } from 'react';
import Empty from '../../../components/empty/Empty';
import SelectToken, { SelectTokenOption } from '../../../components/selectToken/SelectToken';
import { supplyTokens, supplyTradeTokens } from '../../../config/tokens';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Dropdown from "rc-dropdown";
import Menu, { Item as MenuItem } from 'rc-menu';
import TurbosDialog from '../../../components/UI/Dialog/Dialog';
import TurbosTooltip from '../../../components/UI/Tooltip/Tooltip';
import Chart from './components/chart/Chart';
import { useSuiWallet } from '../../../contexts/useSuiWallet';
import SuiWalletButton from '../../../components/walletButton/WalletButton';

const sliderGreen = ['rgb(99, 204, 169, .3)', 'rgb(99, 204, 169, 1)'];
const sliderRed = ['rgba(240, 68, 56, .3)', 'rgba(240, 68, 56, 1)'];

const leverageMarks = {
  2: "2x",
  5: "5x",
  10: "10x",
  15: "15x",
  20: "20x",
  25: "25x",
  30: "30x",
  40: "40x",
  49: "49x",
};
const percents = [0.25, 0.5, 0.75, 1];

type FromToTokenType = {
  balance: string,
  icon: string,
  symbol: string
}

function Perpetual() {
  const balance = 100;

  const {
    connecting,
    connected,
    account
  } = useSuiWallet();

  const [trade, setTrade] = useState(0); // 0: long; 1: short
  const [type, setType] = useState(0); // 0: market; 1: limit; 2: Trigger
  const [record, setRecord] = useState(0); // 0: posotion ; 1: orders ; 2: trades
  const [selectToken, setSelectToken] = useState(false);
  const [selectTokenSource, setSelectTokenSource] = useState(0); // 0: from token; 1: to token
  const [percent, setPercent] = useState(0);
  const [leverage, setLeverage] = useState(1.5);
  const [showLeverage, setShowLeverage] = useState(true);
  const [fromToken, setFromToken] = useState<FromToTokenType>({ balance: '', icon: suiIcon, symbol: 'SUI' });
  const [toToken, setToToken] = useState<FromToTokenType>({ balance: '', icon: ethereumIcon, symbol: 'ETH' });

  const [chartToken, setChartToken] = useState('BTC')

  const changeChartToken = (value: string) => {
    setChartToken(value);
  }
  const swapvert = () => {
    setFromToken({
      ...toToken,
    });
    setToToken({
      ...fromToken,
    });
  }

  const toggleSelectToken = (source: number) => {
    setSelectToken(!selectToken);
    setSelectTokenSource(source);
  }

  const handleType = (type: number) => {
    setType(type);
  }

  const handleTrade = (type: number) => {
    setTrade(type);
  }

  const changefromToken = (k: keyof FromToTokenType, value: string) => {
    const newParams = { ...fromToken };
    newParams[k] = value;
    setFromToken(newParams)
  }

  const handlePercent = (percent: number) => {
    changefromToken('balance', (balance * percent).toString());
    setPercent(percent);
  }

  const changeSelectToken = (result: SelectTokenOption) => {
    if (selectTokenSource) {
      setToToken({
        ...toToken,
        icon: result.icon,
        symbol: result.symbol
      });
    } else {
      setFromToken({
        ...fromToken,
        icon: result.icon,
        symbol: result.symbol
      })
    }
  }

  const recordTitle = ['Positions', 'Orders', 'Trades'];
  const recordContent = [<Positions options={[]} />, <Orders options={[]} />, <Trades options={[]} />];
  const typeList = ['Market', 'Limit', 'Trigger'];

  const menu = (
    <Menu className="overlay-dropdown-ul">
      <MenuItem>
        <div className="overlay-dropdown-li menus-dropdown-li" onClick={() => { changeChartToken('BTC'); }}>
          <span>BTC / USD</span>
        </div>
        <div className="overlay-dropdown-li menus-dropdown-li " onClick={() => { changeChartToken('ETH'); }}>
          <span>ETH / USD</span>
        </div>
      </MenuItem>
    </Menu>
  );

  const btnText = (() => {
    if (!connecting && !connected && !account) {
      return 'Connect Wallet';
    }
    return 'Enter a amount'
  })();


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
                  <div key={index} className={index === type ? "active" : ''} onClick={() => handleType(index)}>{item}</div>
                )
              }
            </div>

            {
              type !== 2 ?
                <>
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
                          <input type="text" value={fromToken.balance} onChange={(e: any) => changefromToken('balance', e.target.value)} className="sectioninput" placeholder="0.0" />
                        </div>
                        <div className="sectiontokens" onClick={() => { toggleSelectToken(0) }}>
                          <img src={fromToken.icon} alt="" />
                          <span>{fromToken.symbol}</span>
                          <img src={downIcon} className="sectiontokensicon" alt="" />
                        </div>
                      </div>
                    </div>

                    <div className="swapvert" onClick={swapvert}>
                      <div className={trade === 1 ? "swapvertcon swapvertcon-red" : 'swapvertcon'}><img src={swapvertIcon} alt="" /></div>
                    </div>

                    <div className="section">
                      <div className="sectiontop">
                        <span>{trade === 1 ? 'Short' : 'Long'}</span>
                        <div>
                          {/* <span className="balance">Balance: 0.005</span>
                <span> | </span><span>MAX</span> */}
                        </div>
                      </div>
                      <div className="sectionbottom">
                        <div className="sectioninputcon" >
                          <input type="text" value={toToken.balance} className="sectioninput" placeholder="0.0" />
                        </div>
                        <div className="sectiontokens" onClick={() => { toggleSelectToken(1) }}>
                          <img src={toToken.icon} alt="" />
                          <span>{toToken.symbol}</span>
                          <img src={downIcon} className="sectiontokensicon" alt="" />
                        </div>
                      </div>
                    </div>

                    {
                      type === 1 ?
                        <div className="section section-martop" >
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
                  <div className="line" style={{ marginBottom: '.5rem' }}>
                    <p className="ll">leverage</p>
                    <p className="lr pointer" onClick={() => setShowLeverage(!showLeverage)}>
                      {
                        !showLeverage ?
                          <CheckBoxOutlineBlankIcon sx={{ color: '#63CCA9', fontSize: 18 }} />
                          : <CheckBoxIcon sx={{ color: '#63CCA9', fontSize: 18 }} />
                      }
                    </p>
                  </div>

                  <div style={{ display: showLeverage ? 'block' : 'none' }} className={styles.silder}>
                    <Slider
                      min={1.1}
                      max={50}
                      step={0.1}
                      marks={leverageMarks}
                      onChange={(value) => { setLeverage(value as number) }}
                      value={leverage}
                      defaultValue={leverage}
                      dotStyle={{ backgroundColor: trade === 0 ? sliderGreen[0] : sliderRed[0], border: '0 none', borderRadius: '2px', width: '2px' }}
                      handleStyle={{ backgroundColor: trade === 0 ? sliderGreen[1] : sliderRed[1], opacity: 1, border: '2px solid rgba(0,0,0,.7)', boxShadow: 'none' }}
                      trackStyle={{ background: trade === 0 ? sliderGreen[1] : sliderRed[1] }}
                      railStyle={{ backgroundColor: '#2B3649' }}
                      activeDotStyle={{ backgroundColor: trade === 0 ? sliderGreen[1] : sliderRed[1] }}
                    />
                  </div>

                  <div className="line">
                    <p className="ll">Collaterlal In</p>
                    <p className="lr">USD</p>
                  </div>
                  <div className="line">
                    <p className="ll">Leverage</p>
                    <p className="lr">{leverage}</p>
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
                </>
                : null
            }

            {
              !connecting && !connected && !account ?
                <SuiWalletButton isButton={true} /> :
                <div className={trade === 1 ? 'btn btn-red' : 'btn'}>
                  {btnText}
                </div>
            }


          </div>

          <SelectToken visible={selectToken} options={selectTokenSource ? supplyTradeTokens : supplyTokens} onClose={toggleSelectToken} onSelect={changeSelectToken} />
        </div>

        <div className="container">
          <div className="container-title">Long ETH</div>
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

          <Dropdown overlay={menu} trigger={['click']} overlayClassName={'overlay-dropdown menus-dropdown'}>
            <div className={styles.tokenselect}>
              <span>{chartToken} / USD</span>
              <img src={downIcon} className="sectiontokensicon" alt="" />
            </div>
          </Dropdown>

          <div className={styles.pricelistcon}>
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
        </div>

        <Chart chartToken={chartToken} />

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


      <TurbosDialog open={false} title="Check order" >
        <>
          {/* <div className='check-con'>
            <div className='check-list'>
              <img src={suiIcon} alt="" height="24" />
              <div className='check-info'>
                <p>Pay USDC</p>
                <p>0.19234</p>
              </div>
            </div>
            <div className='check-to'><img src={toIcon} alt="" height="24" /></div>
            <div className='check-list'>
              <img src={ethereumIcon} alt="" height="24" />
              <div className='check-info'>
                <p>Long ETH</p>
                <p>1.2323</p>
              </div>
            </div>
          </div> */}
          <div className="section section-marbottom">
            <div className="sectiontop">
              <span>Pay</span>
              <div>
                <span className="section-balance">Balance: {balance}</span>
                <span> | </span><span className='section-max'>MAX</span>
              </div>
            </div>
            <div className="sectionbottom">
              <div className="sectioninputcon" >
                <input type="text" className="sectioninput" placeholder="0.0" />
              </div>
              <div className="sectiontokens">
                <img src={ethereumIcon} alt="" />
                <span>SUI</span>
              </div>
            </div>
          </div>
          <div className="section section-marbottom">
            <div className="sectiontop">
              <span>Pay</span>
              <div>
                <span className="section-balance">Balance: {balance}</span>
              </div>
            </div>
            <div className="sectionbottom">
              <div className="sectioninputcon" >
                <input type="text" className="sectioninput" placeholder="0.0" />
              </div>
              <div className="sectiontokens">
                <img src={ethereumIcon} alt="" />
                <span>SUI</span>
              </div>
            </div>
          </div>

          <div className="line">
            <p className="ll">Collaterlal In</p>
            <p className="lr">ETH</p>
          </div>
          <div className="line">
            <p className="ll">Leverage</p>
            <p className="lr">USD</p>
          </div>
          <div className="line">
            <p className="ll">Liq. Price</p>
            <p className="lr">USD</p>
          </div>
          <div className="line">
            <p className="ll">Fees</p>
            <p className="lr">USD</p>
          </div>
          <div className="line">
            <p className="ll">Collaterlal</p>
            <p className="lr">USD</p>
          </div>
          <div className="line-hr"></div>
          <div className="line">
            <p className="ll">Spread</p>
            <p className="lr">ETH</p>
          </div>
          <div className="line">
            <p className="ll">Entry Price</p>
            <p className="lr">USD</p>
          </div>
          <div className="line">
            <p className="ll">Borrow Fee</p>
            <p className="lr">USD</p>
          </div>
          <div className="line">
            <p className="ll">Execution Fee</p>
            <p className="lr">
              <TurbosTooltip title={'Max BTC long'}>
                <span className='underline'>0.03%</span>
              </TurbosTooltip>
            </p>
          </div>
          <div className="line">
            <p className="ll">Allowed Slippage</p>
            <p className="lr">USD</p>
          </div>
          <div className="line">
            <p className="ll">Allow up to 1% slippage</p>
            <p className="lr"></p>
          </div>

          <div className='btn'>
            Long
          </div>
        </>
      </TurbosDialog>

    </div>
  )
}

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

export default Perpetual;