import Bignumber from 'bignumber.js';
import { useEffect, useState } from 'react';

import styles from './Perpetual.module.css';
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Trades from './components/trades/Trades';
import longIcon from '../../../assets/images/long.png';
import shortIcon from '../../../assets/images/short.png';
import downIcon from '../../../assets/images/down.png';
import ethereumIcon from '../../../assets/images/ethereum.png';
import suiIcon from '../../../assets/images/ic_sui_40.svg';
import btcIcon from '../../../assets/images/ic_btc_40.svg';
import toIcon from '../../../assets/images/to.png';
import swapvertIcon from '../../../assets/images/swapvert.png';
import addIcon from '../../../assets/images/add.png';
import shareIcon from '../../../assets/images/share.png';
import Empty from '../../../components/empty/Empty';
import SelectToken, { SelectTokenOption } from '../../../components/selectToken/SelectToken';
import { supplyTokens, supplyTradeTokens, SupplyTokenType } from '../../../config/tokens';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import TurbosDialog from '../../../components/UI/Dialog/Dialog';
import TurbosTooltip from '../../../components/UI/Tooltip/Tooltip';
import Chart from './components/chart/Chart';
import { useSuiWallet } from '../../../contexts/useSuiWallet';
import SuiWalletButton from '../../../components/walletButton/WalletButton';
import { useBalance } from '../../../hooks/useBalance';
import Loading from '../../../components/loading/Loading';
import { numberWithCommas } from '../../../utils';
import { NetworkType, SymbolType } from '../../../config/config.type';
import { usePool } from '../../../hooks/usePool';
import { useAllSymbolPrice } from '../../../hooks/useSymbolPrice';
import { useAllSymbolBalance } from '../../../hooks/useSymbolBalance';
import { useAvailableLiquidity } from '../../../hooks/useAvailableLiquidity';
import { contractConfig } from '../../../config/contract.config';
import { provider } from '../../../lib/provider';
import { Coin, getObjectId, getTransactionDigest, getTransactionEffects } from '@mysten/sui.js';
import { Explorer } from '../../../components/explorer/Explorer';
import { useRefresh } from '../../../contexts/refresh';
import { useToastify } from '../../../contexts/toastify';

const tradeType = ['Long', 'Short'];

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
};
const percents = [0.25, 0.5, 0.75, 1];

type FromToTokenType = {
  balance: string,
  icon: string,
  symbol: string,
  value: string,
  price: string,
  address?: string,
  isInput?: boolean,
}

function Perpetual() {

  const {
    connecting,
    connected,
    account,
    network,
    adapter
  } = useSuiWallet();
  const { changeRefreshTime } = useRefresh();
  const { toastify } = useToastify();

  const [trade, setTrade] = useState(0); // 0: long; 1: short
  const [type, setType] = useState(0); // 0: market; 1: limit; 2: Trigger
  const [record, setRecord] = useState(0); // 0: posotion ; 1: orders ; 2: trades
  const [selectToken, setSelectToken] = useState(false);
  const [selectTokenSource, setSelectTokenSource] = useState(0); // 0: from token; 1: to token

  const [percent, setPercent] = useState(0);
  const [leverage, setLeverage] = useState(1.5);
  const [showLeverage, setShowLeverage] = useState(true);
  const [check, setCheck] = useState(false);

  const [fromToken, setFromToken] = useState<FromToTokenType>({ balance: '0.00', icon: suiIcon, symbol: 'SUI', value: '', price: '0' });
  const [toToken, setToToken] = useState<FromToTokenType>({ balance: '0.00', icon: btcIcon, symbol: 'BTC', value: '', price: '0' });

  const [btnInfo, setBtnInfo] = useState({ state: 0, text: 'Connect Wallet' });
  const [loading, setLoading] = useState(false);

  const { pool } = usePool(toToken.symbol as SymbolType);
  const { allSymbolPrice } = useAllSymbolPrice();
  const { allSymbolBalance } = useAllSymbolBalance(account);
  const { availableLiquidity } = useAvailableLiquidity();

  const toggleCheck = () => {
    setCheck(!check);
  }

  const swapvert = () => {
    setFromToken({
      ...toToken,
    });

    const isSymbole = supplyTradeTokens.find((item: SupplyTokenType) => fromToken.symbol == item.symbol);
    if (isSymbole) {
      setToToken({
        ...fromToken,
      });
    } else {
      const symbol = supplyTradeTokens[0].symbol;
      setToToken({
        ...fromToken,
        symbol,
        balance: allSymbolBalance[symbol] ? allSymbolBalance[symbol].balance : '0',
        price: allSymbolPrice[symbol] ? allSymbolPrice[symbol].price : '0',
        icon: supplyTradeTokens[0].icon
      });
    }
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

  const handlePercent = (percent: number) => {
    const newValue = Bignumber(fromToken.balance).multipliedBy(percent).toString();
    setPercent(percent);
    setFromToken({
      ...fromToken,
      value: newValue,
      isInput: true
    });

    const newBalance = Bignumber(newValue)
      .multipliedBy(allSymbolPrice[fromToken.symbol].price)
      .div(allSymbolPrice[toToken.symbol].price)
      .multipliedBy(leverage)
      .toString();

    setToToken({
      ...toToken,
      value: newBalance,
      isInput: false
    });
  }

  const changeSelectToken = (result: SelectTokenOption) => {
    let newFromToken = {
      ...fromToken
    };
    let newToToken = {
      ...toToken
    };

    if (selectTokenSource) {
      newToToken = {
        ...newToToken,
        symbol: result.symbol,
        address: result.address,
        price: allSymbolPrice[result.symbol] ? allSymbolPrice[result.symbol].price : '0',
        balance: allSymbolBalance[result.symbol] ? allSymbolBalance[result.symbol].balance : '0.00'
      };

      if (fromToken.isInput && fromToken.value) {
        newToToken = {
          ...newToToken,
          value: Bignumber(fromToken.value).multipliedBy(fromToken.price).div(allSymbolPrice[result.symbol].price).multipliedBy(leverage).toString()
        }
      }

      if (toToken.isInput && toToken.value) {
        newFromToken = {
          ...newFromToken,
          value: Bignumber(allSymbolPrice[result.symbol].price).multipliedBy(toToken.value).div(fromToken.price).div(leverage).toString()
        }
      }

    } else {
      newFromToken = {
        ...newFromToken,
        icon: result.icon,
        symbol: result.symbol,
        address: result.address,
        price: allSymbolPrice[result.symbol] ? allSymbolPrice[result.symbol].price : '0',
        balance: allSymbolBalance[result.symbol] ? allSymbolBalance[result.symbol].balance : '0.00'
      };

      if (fromToken.isInput && fromToken.value) {
        newToToken = {
          ...newToToken,
          value: Bignumber(fromToken.value).multipliedBy(allSymbolPrice[result.symbol].price).div(toToken.price).multipliedBy(leverage).toString()
        }
      }

      if (toToken.isInput && toToken.value) {
        newFromToken = {
          ...newFromToken,
          value: Bignumber(toToken.price).multipliedBy(toToken.value).div(allSymbolPrice[result.symbol].price).div(leverage).toString()
        }
      }
    }

    setFromToken(newFromToken);
    setToToken(newToToken);
  }

  const changeChartSymbol = (symbol: string) => {
    const tradeToken = supplyTradeTokens.find((item: SupplyTokenType) => item.symbol === symbol);
    if (tradeToken) {
      setToToken({
        ...toToken,
        symbol: tradeToken.symbol,
        icon: tradeToken.icon
      });


      if (fromToken.isInput && fromToken.value) {
        setToToken({
          ...toToken,
          symbol: tradeToken.symbol,
          icon: tradeToken.icon,
          price: allSymbolPrice[tradeToken.symbol].price,
          value: Bignumber(fromToken.value).multipliedBy(fromToken.price).div(allSymbolPrice[tradeToken.symbol].price).multipliedBy(leverage).toString()
        })
      }

      if (toToken.isInput && toToken.value) {
        setFromToken({
          ...fromToken,
          value: Bignumber(allSymbolPrice[tradeToken.symbol].price).multipliedBy(toToken.value).div(fromToken.price).div(leverage).toString()
        })
      }
    }
  }

  const changeFrom = (e: any) => {
    setFromToken({
      ...fromToken,
      value: e.target.value,
      isInput: true
    });

    const newBalance = e.target.value ?
      Bignumber(e.target.value)
        .multipliedBy(allSymbolPrice[fromToken.symbol].price)
        .div(allSymbolPrice[toToken.symbol].price)
        .multipliedBy(leverage)
        .toString()
      : '';
    // // const decimalValue = balance.toString().replace(/^\d+\.?/, '');
    setToToken({
      ...toToken,
      value: newBalance,
      isInput: false
    });
    setPercent(0);
  }


  const changeTo = (e: any) => {
    setToToken({
      ...toToken,
      value: e.target.value,
      isInput: true
    });
    const newBalance = e.target.value ?
      Bignumber(e.target.value)
        .multipliedBy(allSymbolPrice[toToken.symbol].price)
        .div(allSymbolPrice[fromToken.symbol].price)
        .div(leverage)
        .toString()
      : '';
    // // const decimalValue = balance.toString().replace(/^\d+\.?/, '');
    setFromToken({
      ...fromToken,
      value: newBalance,
      isInput: false
    });
  }

  const changeBtnText = () => {
    if (!fromToken.value || !Number(fromToken.value)) {
      setBtnInfo({
        state: 1,
        text: 'Enter a amount'
      });
    } else if (Bignumber(fromToken.value).minus(fromToken.balance).isGreaterThan(0)) {
      setBtnInfo({
        state: 2,
        text: `Insufficient ${fromToken.symbol} balance`
      });
    } else if (Bignumber(toToken.value).multipliedBy(10 ** 9).minus(pool.pool_amounts).isGreaterThan(0)) {
      setBtnInfo({
        state: 3,
        text: `Insufficient ${toToken.symbol} liquidity`
      });
    } else {
      setBtnInfo({
        state: -1,
        text: `${tradeType[trade]} ${toToken.symbol}`
      });
    }
  };

  const approve = async () => {
    if (network && account) {
      setLoading(true);

      const config = contractConfig[network as NetworkType];
      const toSymbolConfig = config.Coin[(toToken.symbol) as SymbolType];
      const fromSymbolConfig = config.Coin[(fromToken.symbol) as SymbolType];

      const fromType = fromSymbolConfig.Type === '0x0000000000000000000000000000000000000002::sui::SUI' ? '0x2::sui::SUI' : fromSymbolConfig.Type;

      const coinBalance = await provider.getCoinBalancesOwnedByAddress(account, fromType);
      const amount = Bignumber(fromToken.value).multipliedBy(10 ** 9).toNumber();
      const balanceResponse = Coin.selectCoinSetWithCombinedBalanceGreaterThanOrEqual(coinBalance, BigInt(amount));
      const balanceObjects = balanceResponse.map((item) => Coin.getID(item));

      let argumentsVal: (string | number | boolean | string[])[] = [
        config.VaultObjectId,
        balanceObjects,
        Bignumber(fromToken.value).multipliedBy(10 ** 9).toNumber(),
        fromSymbolConfig.PoolObjectId,
        toSymbolConfig.PoolObjectId,
        config.PriceFeedStorageObjectId,
        config.PositionsObjectId,
        !trade ? true : false,
        Bignumber(leverage).multipliedBy(10 ** 9).toNumber(),
        Bignumber(toToken.price).multipliedBy(10 ** 9).toNumber(),
        config.TimeOracleObjectId
      ];

      let typeArgumentsVal: string[] = [
        fromSymbolConfig.Type,
        toSymbolConfig.Type
      ];

      try {
        let executeTransactionTnx = await adapter.executeMoveCall({
          packageObjectId: config.ExchangePackageId,
          module: 'exchange',
          function: 'increase_position',
          typeArguments: typeArgumentsVal,
          arguments: argumentsVal,
          gasBudget: 10000
        });

        if (executeTransactionTnx.error) {
          toastify(executeTransactionTnx.error.msg, 'error');
        } else {
          if (executeTransactionTnx.data) {
            executeTransactionTnx = executeTransactionTnx.data;
          }

          const effects = getTransactionEffects(executeTransactionTnx);
          const digest = getTransactionDigest(executeTransactionTnx);

          if (effects?.status.status === 'success') {
            toastify(<Explorer message={'Execute Transaction Successfully!'} type="transaction" digest={digest} />);
            toggleCheck();
            changeRefreshTime(); // reload data
          } else {
            toastify(<Explorer message={'Execute Transaction error!'} type="transaction" digest={digest} />, 'error');
          }
        }
      } catch (err: any) {
        toastify(err.message || err, 'error');
      }

      setLoading(false);
    }
  }

  useEffect(() => {
    changeBtnText();
  }, [connecting, connected, account, fromToken, toToken, pool, trade]);

  useEffect(() => {
    if (allSymbolBalance[fromToken.symbol]) {
      setFromToken({
        ...fromToken,
        balance: allSymbolBalance[fromToken.symbol].balance
      })
    } else {
      setFromToken({
        ...fromToken,
        balance: '0.00'
      })
    }

    if (allSymbolBalance[toToken.symbol]) {
      setToToken({
        ...toToken,
        balance: allSymbolBalance[toToken.symbol].balance
      })
    }
    else {
      setToToken({
        ...toToken,
        balance: '0.00'
      })
    }
  }, [allSymbolBalance]);


  useEffect(() => {
    if (allSymbolPrice[fromToken.symbol]) {
      setFromToken({
        ...fromToken,
        price: allSymbolPrice[fromToken.symbol].price,
      });
    }

    if (allSymbolPrice[toToken.symbol]) {
      setToToken({
        ...toToken,
        price: allSymbolPrice[toToken.symbol].price,
      })
    }

    if (fromToken.isInput) {
      setToToken({
        ...toToken,
        value: Bignumber(allSymbolPrice[fromToken.symbol].price)
          .multipliedBy(fromToken.value)
          .div(allSymbolPrice[toToken.symbol].price)
          .multipliedBy(leverage)
          .toString(),
      });
    }

    if (toToken.isInput) {
      setFromToken({
        ...fromToken,
        value: Bignumber(allSymbolPrice[toToken.symbol].price)
          .multipliedBy(toToken.value)
          .div(allSymbolPrice[fromToken.symbol].price)
          .div(leverage)
          .toString(),
      });
    }

  }, [allSymbolPrice, leverage]);

  const recordTitle = ['Positions', 'Orders', 'Trades'];
  const recordContent = [<Positions options={[]} />, <Orders options={[]} />, <Trades options={[]} />];
  const typeList = ['Market']; // ['Market', 'Limit', 'Trigger'];

  const liqPrice = !trade ?
    Bignumber(toToken.price).minus(Bignumber(fromToken.value).multipliedBy(fromToken.price).div(leverage)).toFixed(2) :
    Bignumber(toToken.price).plus(Bignumber(fromToken.value).multipliedBy(fromToken.price).div(leverage)).toFixed(2);

  const fees = Bignumber(toToken.value).multipliedBy(toToken.price).multipliedBy(0.001).toFixed(2);

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
                          <span className="section-balance">Balance: {fromToken.balance}</span>
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
                          <input type="text"
                            value={fromToken.value}
                            onChange={changeFrom}
                            className="sectioninput"
                            placeholder="0.0"
                          />
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
                        <span>{tradeType[trade]}</span>
                        <div>
                          {showLeverage ? `Leverage: ${leverage}x` : null}
                        </div>
                      </div>
                      <div className="sectionbottom">
                        <div className="sectioninputcon" >
                          <input type="text" value={toToken.value} className="sectioninput" placeholder="0.0" onChange={changeTo} />
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
                      max={30}
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
                    <p className="lr"> {showLeverage ? `${leverage}x` : '-'}</p>
                  </div>
                  <div className="line">
                    <p className="ll">Entry Price</p>
                    <p className="lr">{toToken.price ? `\$${numberWithCommas(toToken.price)}` : '-'}</p>
                  </div>
                  <div className="line">
                    <p className="ll">Liq. Price</p>
                    <p className="lr">{toToken.value ?
                      `\$${numberWithCommas(liqPrice)}`
                      : '-'}
                    </p>
                  </div>
                  <div className="line">
                    <p className="ll">Fees</p>
                    <p className="lr">{toToken.value ? `\$${fees}` : '-'}</p>
                  </div>
                </>
                : null
            }

            {
              !connecting && !connected && !account ?
                <SuiWalletButton isButton={true} /> :
                <div>
                  <button className={trade === 1 ? 'btn btn-red' : 'btn'} disabled={btnInfo.state > 0} onClick={toggleCheck}>
                    {btnInfo.text}
                  </button>
                </div>
            }


          </div>

          <SelectToken visible={selectToken} options={selectTokenSource ? supplyTradeTokens : supplyTokens} onClose={toggleSelectToken} onSelect={changeSelectToken} />
        </div>

        <div className="container">
          <div className="container-title">{tradeType[trade]} {fromToken.symbol}</div>
          <div className="line-con1">
            <div className="line">
              <p className="ll">Entry Price</p>
              <p className="lr">{toToken.price ? `\$${numberWithCommas(toToken.price)}` : '-'}</p>
            </div>
            <div className="line">
              <p className="ll">Exit Price</p>
              <p className="lr">{toToken.price ? `\$${numberWithCommas(toToken.price)}` : '-'}</p>
            </div>
            <div className="line">
              <p className="ll">Borrow Fee</p>
              <p className="lr">-</p>
            </div>
            <div className="line">
              <p className="ll">Available Liquidity</p>
              <p className="lr">{availableLiquidity ? `\$${availableLiquidity}` : '-'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="main-right">
        <Chart symbol={toToken.symbol} changeChartSymbol={changeChartSymbol} />

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


      <TurbosDialog open={check} title="Check order" onClose={toggleCheck}>
        <>
          {/* <div className="section section-marbottom">
            <div className="sectiontop">
              <span>Pay</span>
              <div>
                <span className="section-balance">Balance: {fromToken.value}</span>
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
                <span className="section-balance">Balance: {toToken.value}</span>
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
          </div> */}

          <div className='check-con'>
            <div className='check-list'>
              <img src={fromToken.icon} alt="" height="24" />
              <div className='check-info'>
                <p>Pay {fromToken.symbol}</p>
                <p>{fromToken.value}</p>
              </div>
            </div>
            <div className='check-to'><img src={toIcon} alt="" height="24" /></div>
            <div className='check-list'>
              <img src={toToken.icon} alt="" height="24" />
              <div className='check-info'>
                <p>Receive {toToken.symbol}</p>
                <p>{toToken.value}</p>
              </div>
            </div>
          </div>

          <div className="line line-top-16">
            <p className="ll">Collaterlal In</p>
            <p className="lr">USD</p>
          </div>
          <div className="line">
            <p className="ll">Leverage</p>
            <p className="lr">{leverage}x</p>
          </div>
          <div className="line">
            <p className="ll">Liq. Price</p>
            <p className="lr">${numberWithCommas(liqPrice)}</p>
          </div>
          <div className="line">
            <p className="ll">Fees</p>
            <p className="lr">${fees}</p>
          </div>
          <div className="line">
            <p className="ll">Collaterlal</p>
            <p className="lr">${numberWithCommas(Bignumber(toToken.value).multipliedBy(toToken.price).toFixed(2))}</p>
          </div>
          <div className="line-hr"></div>
          <div className="line">
            <p className="ll">Spread</p>
            <p className="lr">-</p>
          </div>
          <div className="line">
            <p className="ll">Entry Price</p>
            <p className="lr">${numberWithCommas(fromToken.price)}</p>
          </div>
          <div className="line">
            <p className="ll">Borrow Fee</p>
            <p className="lr">-</p>
          </div>
          <div className="line">
            <p className="ll">Execution Fee</p>
            <p className="lr">
              <TurbosTooltip title={'Max BTC long'}>
                <span className='underline'>0.03{fromToken.symbol}</span>
              </TurbosTooltip>
            </p>
          </div>
          <div className="line">
            <p className="ll">Allowed Slippage</p>
            <p className="lr">0.03%</p>
          </div>
          <div className="line">
            <p className="ll">Allow up to 1% slippage</p>
            <p className="lr">

            </p>
          </div>

          <div>
            <button className={trade === 1 ? 'btn btn-red' : 'btn'} onClick={approve} disabled={loading}>
              {loading ? <Loading /> : tradeType[trade]}
            </button>
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