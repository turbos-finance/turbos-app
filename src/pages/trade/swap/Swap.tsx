import styles from './Swap.module.css';
import Trades from '../perpetual/components/trades/Trades';
import downIcon from '../../../assets/images/down.png';
import ethereumIcon from '../../../assets/images/ethereum.png';
import suiIcon from '../../../assets/images/ic_sui_40.svg';
import toIcon from '../../../assets/images/to.png';
import swapvertIcon from '../../../assets/images/swapvert.png';
import addIcon from '../../../assets/images/add.png';
import shareIcon from '../../../assets/images/share.png';
import { useState } from 'react';
import Empty from '../../../components/empty/Empty';
import SelectToken, { SelectTokenOption } from '../../../components/selectToken/SelectToken';
import { supplyTokens, supplyTradeTokens } from '../../../config/tokens';
import Dropdown from "rc-dropdown";
import Menu, { Item as MenuItem } from 'rc-menu';
import TurbosDialog from '../../../components/UI/Dialog/Dialog';
import TurbosTooltip from '../../../components/UI/Tooltip/Tooltip';
import Chart from '../perpetual/components/chart/Chart';
import { useSuiWallet } from '../../../contexts/useSuiWallet';

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

  const [type, setType] = useState(0); // 0: market; 1: limit; 2: Trigger
  const [record, setRecord] = useState(0); // 0: posotion ; 1: orders ; 2: trades
  const [selectToken, setSelectToken] = useState(false);
  const [selectTokenSource, setSelectTokenSource] = useState(0); // 0: from token; 1: to token
  const [fromToken, setFromToken] = useState<FromToTokenType>({ balance: '', icon: suiIcon, symbol: 'SUI' });
  const [toToken, setToToken] = useState<FromToTokenType>({ balance: '', icon: ethereumIcon, symbol: 'ETH' });

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

  const changefromToken = (k: keyof FromToTokenType, value: string) => {
    const newParams = { ...fromToken };
    newParams[k] = value;
    setFromToken(newParams)
  }

  const handlePercent = (balance: number) => {
    changefromToken('balance', balance.toString());
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
  const recordContent = [<Positions options={[{}, {}]} />, <Orders options={[]} />, <Trades options={[]} />];
  const typeList = ['Market', 'Limit'];

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
                      <div className='swapvertcon'><img src={swapvertIcon} alt="" /></div>
                    </div>

                    <div className="section">
                      <div className="sectiontop">
                        <span>Receive</span>
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
                  <div className="line">
                    <p className="ll">Fees</p>
                    <p className="lr">-</p>
                  </div>
                </>
                : null
            }

            <div className='btn'>
              {btnText}
            </div>
          </div>

          <SelectToken visible={selectToken} options={selectTokenSource ? supplyTradeTokens : supplyTokens} onClose={toggleSelectToken} onSelect={changeSelectToken} />
        </div>

        <div className="container">
          <div className="container-title">Swap</div>
          <div className="line-con1">
            <div className="line">
              <p className="ll">ETH Price</p>
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

        <Chart />

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
          <div className='check-con'>
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
          </div>
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
    </>
  )
}

export default Perpetual;