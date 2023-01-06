import Bignumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import styles from './Swap.module.css';
import Trades from './components/trades/Trades';
import downIcon from '../../../assets/images/down.png';
import toIcon from '../../../assets/images/to.png';
import swapvertIcon from '../../../assets/images/swapvert.png';
import SelectToken, { SelectTokenOption } from '../../../components/selectToken/SelectToken';
import { supplyTokens, SupplyTokenType, supplyTradeTokens } from '../../../config/tokens';
import TurbosDialog from '../../../components/UI/Dialog/Dialog';
import TurbosTooltip from '../../../components/UI/Tooltip/Tooltip';
import Chart from '../perpetual/components/chart/Chart';
import { useSuiWallet } from '../../../contexts/useSuiWallet';
import SuiWalletButton from '../../../components/walletButton/WalletButton';
import { NetworkType, SymbolType, TLPAndSymbolType } from '../../../config/config.type';
import { numberWithCommas } from '../../../utils';
import { useToastify } from '../../../contexts/toastify';
import { contractConfig } from '../../../config/contract.config';
import { provider } from '../../../lib/provider';
import { Coin, getTimestampFromTransactionResponse, getTransactionDigest, getTransactionEffects } from '@mysten/sui.js';
import { useRefresh } from '../../../contexts/refresh';
import { Explorer } from '../../../components/explorer/Explorer';
import Loading from '../../../components/loading/Loading';
import { getLocalStorage, getLocalStorageSupplyToken, setLocalStorage, TurbosSwapFrom, TurbosSwapTo, TurbosSwapTradeRecord, unshiftLocalStorage } from '../../../lib';
import { getSuiType } from '../../../config';
import { bignumberMulDecimalString, bignumberRemoveDecimal } from '../../../utils/tools';
import { useFees } from '../../../hooks/useFees';
import { useStore } from '../../../contexts/store';

type FromToTokenType = {
  balance: string,
  icon: string,
  symbol: string,
  value: string,
  price: string,
  address?: string,
  isInput?: boolean,
}

function Swap() {
  const turbos_swap_from = getLocalStorageSupplyToken(TurbosSwapFrom);
  const turbos_swap_to = getLocalStorageSupplyToken(TurbosSwapTo, 1);

  const {
    connecting,
    connected,
    account,
    network,
    adapter
  } = useSuiWallet();
  const { changeRefreshTime } = useRefresh();
  const { toastify } = useToastify();

  const [type, setType] = useState(0); // 0: market; 1: limit; 2: Trigger
  const [record, setRecord] = useState(0); // 0: posotion ; 1: orders ; 2: trades
  const [selectToken, setSelectToken] = useState(false);
  const [selectTokenSource, setSelectTokenSource] = useState(0); // 0: from token; 1: to token
  const [check, setCheck] = useState(false);

  const [fromToken, setFromToken] = useState<FromToTokenType>({
    balance: '0.00',
    icon: turbos_swap_from.icon,
    symbol: turbos_swap_from.symbol,
    value: '',
    price: '0'
  });
  const [toToken, setToToken] = useState<FromToTokenType>({
    balance: '0.00',
    icon: turbos_swap_to.icon,
    symbol: turbos_swap_to.symbol,
    value: '',
    price: '0'
  });

  const [btnInfo, setBtnInfo] = useState({ state: 0, text: 'Connect Wallet' });
  const [loading, setLoading] = useState(false);

  const { fees } = useFees(fromToken.symbol, fromToken.value, toToken.symbol, toToken.value);
  const { store } = useStore();
  const pool = store.allPool ? store.allPool[toToken.symbol] : undefined;
  const { allSymbolPrice, allSymbolBalance } = store;

  const toggleCheck = () => {
    setCheck(!check);
  }

  const swapvert = () => {
    setFromToken({
      ...toToken,
    });

    setToToken({
      ...fromToken,
    });

    // const isSymbole = supplyTradeTokens.find((item: SupplyTokenType) => fromToken.symbol == item.symbol);
    // if (isSymbole) {
    //   setToToken({
    //     ...fromToken,
    //   });
    // } else {
    //   const symbol = supplyTradeTokens[0].symbol;
    //   setToToken({
    //     ...fromToken,
    //     symbol,
    //     balance: allSymbolBalance[symbol] ? allSymbolBalance[symbol].balance : '0',
    //     price: allSymbolPrice[symbol] ? allSymbolPrice[symbol].price : '0',
    //     icon: supplyTradeTokens[0].icon
    //   });
    // }
  }

  const toggleSelectToken = (source: number) => {
    setSelectToken(!selectToken);
    setSelectTokenSource(source);
  }

  const handleType = (type: number) => {
    setType(type);
  }

  const changeMax = () => {
    setFromToken({
      ...fromToken,
      value: fromToken.balance,
      isInput: true
    });

    const newBalance = Bignumber(fromToken.balance).multipliedBy(fromToken.price).div(toToken.price);

    setToToken({
      ...toToken,
      value: newBalance.toString(),
      isInput: false
    })
  }

  const changeFrom = (e: any) => {
    setFromToken({
      ...fromToken,
      value: e.target.value,
      isInput: true
    });

    const newBalance = e.target.value ?
      Bignumber(e.target.value)
        .multipliedBy(fromToken.price)
        .div(toToken.price)
        .toString()
      : '';
    setToToken({
      ...toToken,
      value: newBalance,
      isInput: false
    })
  }


  const changeTo = (e: any) => {
    setToToken({
      ...toToken,
      value: e.target.value,
      isInput: true
    });
    const newBalance = e.target.value ?
      Bignumber(e.target.value)
        .multipliedBy(toToken.price)
        .div(fromToken.price)
      : '';
    setFromToken({
      ...fromToken,
      value: newBalance.toString(),
      isInput: false
    });
  }

  const changeSelectToken = (result: SelectTokenOption) => {
    const _symbolPrice: any = allSymbolPrice ? allSymbolPrice[result.symbol] : {};
    const _symbolBalance: any = allSymbolBalance ? allSymbolBalance[result.symbol] : {};

    let newFromToken = {
      ...fromToken
    };
    let newToToken = {
      ...toToken
    };

    if (selectTokenSource) {
      newToToken = {
        ...newToToken,
        icon: result.icon,
        symbol: result.symbol,
        address: result.address,
        price: _symbolPrice.price || '0',
        balance: _symbolBalance || '0.00'
      };

      if (fromToken.isInput && fromToken.value) {
        newToToken = {
          ...newToToken,
          value: Bignumber(fromToken.value).multipliedBy(fromToken.price).div(_symbolPrice.price).toString()
        }
      }

      if (toToken.isInput && toToken.value) {
        newFromToken = {
          ...newFromToken,
          value: Bignumber(_symbolPrice.price).multipliedBy(toToken.value).div(fromToken.price).toString()
        }
      }

    } else {
      newFromToken = {
        ...newFromToken,
        icon: result.icon,
        symbol: result.symbol,
        address: result.address,
        price: _symbolPrice.price || '0',
        balance: _symbolBalance.balance || '0.00'
      };

      if (fromToken.isInput && fromToken.value) {
        newToToken = {
          ...newToToken,
          value: Bignumber(fromToken.value).multipliedBy(_symbolPrice.price).div(toToken.price).toString()
        }
      }

      if (toToken.isInput && toToken.value) {
        newFromToken = {
          ...newFromToken,
          value: Bignumber(toToken.price).multipliedBy(toToken.value).div(_symbolPrice.price).toString()
        }
      }
    }

    setFromToken(newFromToken);
    setToToken(newToToken);
  }

  const changeBtnText = () => {
    if (!fromToken.value || !Number(fromToken.value) || !toToken.value || !Number(fromToken.value)) {
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
        text: `Swap`
      });
    }
  };

  useEffect(() => {
    changeBtnText();
  }, [connecting, connected, account, fromToken, toToken, pool]);

  useEffect(() => {
    const _fromSymbolBalance: any = allSymbolBalance && allSymbolBalance[fromToken.symbol] ? allSymbolBalance[fromToken.symbol] : { balance: '0.00' };
    const _toSymbolBalance: any = allSymbolBalance && allSymbolBalance[toToken.symbol] ? allSymbolBalance[toToken.symbol] : { balance: '0.00' };

    const _fromSymbolPrice = allSymbolPrice && allSymbolPrice[fromToken.symbol] ? allSymbolPrice[fromToken.symbol] : { price: '0' };
    const _toSymbolPrice = allSymbolPrice && allSymbolPrice[toToken.symbol] ? allSymbolPrice[toToken.symbol] : { price: '0' };

    const fromTokenValue = toToken.isInput
      ? Bignumber(_toSymbolPrice.price)
        .multipliedBy(toToken.value)
        .div(_fromSymbolPrice.price)
        .toString()
      : fromToken.value;

    setFromToken({
      ...fromToken,
      balance: _fromSymbolBalance.balance,
      price: _fromSymbolPrice.price,
      value: fromTokenValue
    });

    const toTokenValue = fromToken.isInput
      ? Bignumber(_fromSymbolPrice.price)
        .multipliedBy(fromToken.value)
        .div(_toSymbolPrice.price)
        .toString()
      : toToken.value;
    setToToken({
      ...toToken,
      balance: _toSymbolBalance.balance,
      price: _toSymbolPrice.price,
      value: toTokenValue
    });
  }, [allSymbolBalance, allSymbolPrice]);
  
  useEffect(() => {
    setLocalStorage(TurbosSwapFrom, fromToken.symbol);
  }, [fromToken.symbol]);

  useEffect(() => {
    setLocalStorage(TurbosSwapTo, toToken.symbol);
  }, [toToken.symbol]);

  const swap = async () => {
    if (network && account) {
      setLoading(true);

      const config = contractConfig[network as NetworkType];
      const toSymbolConfig = config.Coin[(toToken.symbol) as SymbolType];
      const fromSymbolConfig = config.Coin[(fromToken.symbol) as SymbolType];
      const fromType = getSuiType(fromSymbolConfig.Type);

      const coinBalance = await provider.getCoinBalancesOwnedByAddress(account, fromType);
      const amount = bignumberRemoveDecimal(bignumberMulDecimalString(fromToken.value));
      const balanceResponse = Coin.selectCoinSetWithCombinedBalanceGreaterThanOrEqual(coinBalance, BigInt(amount));
      const balanceObjects = balanceResponse.map((item) => Coin.getID(item));

      let argumentsVal: (string | number | BigInt | string[])[] = [
        config.VaultObjectId,
        balanceObjects,
        amount.toString(),
        fromSymbolConfig.PoolObjectId,
        toSymbolConfig.PoolObjectId,
        config.PriceFeedStorageObjectId,
        account,
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
          function: 'swap',
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
          const timestamp = getTimestampFromTransactionResponse(executeTransactionTnx);

          if (effects?.status.status === 'success') {
            const storege = `${timestamp || Date.now()}Swap ${fromToken.value} ${fromToken.symbol} to ${toToken.symbol}`;
            // unshiftLocalStorage(`${TurbosSwapTradeRecord}_${account}`, storege);
            toastify(<Explorer message={storege} type="transaction" digest={digest} />);
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

  const recordTitle = ['Trades'];
  const recordContent = [<Trades />];
  const typeList = ['Market'];  // ['Market', 'Limit'];

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
                          <span className="section-balance">Balance: {fromToken.balance}</span>
                          <span> | </span><span className='section-max' onClick={changeMax}>MAX</span>
                        </div>
                      </div>
                      <div className="sectionbottom">
                        <div className="sectioninputcon" >
                          <input type="text" value={fromToken.value} onChange={changeFrom} className="sectioninput" placeholder="0.0" />
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
                        </div>
                      </div>
                      <div className="sectionbottom">
                        <div className="sectioninputcon" >
                          <input type="text" value={toToken.value} className="sectioninput" onChange={changeTo} placeholder="0.0" />
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
                              <span>{fromToken.symbol} per {toToken.symbol}</span>
                            </div>
                          </div>
                        </div>
                        : null
                    }

                  </div>
                  <div className="line">
                    <p className="ll">Fees</p>
                    <p className="lr"> {!!fees.toNumber() ? `\$${fees.toFixed(2)}` : '-'}</p>
                  </div>
                </>
                : null
            }

            {
              !connecting && !connected && !account ?
                <SuiWalletButton isButton={true} /> :
                <div>
                  <button className='btn' disabled={btnInfo.state > 0} onClick={toggleCheck}>
                    {btnInfo.text}
                  </button>
                </div>
            }

          </div>

          <SelectToken visible={selectToken} options={supplyTokens} onClose={toggleSelectToken} onSelect={changeSelectToken} />
        </div>

        <div className="container">
          <div className="container-title">Swap</div>
          <div className="line-con1">
            <div className="line">
              <p className="ll">{fromToken.symbol} Price</p>
              <p className="lr">{allSymbolPrice && allSymbolPrice[fromToken.symbol] ? `\$${numberWithCommas(allSymbolPrice[fromToken.symbol]?.price)}` : '-'}</p>
            </div>
            <div className="line">
              <p className="ll">{toToken.symbol} Price</p>
              <p className="lr">{allSymbolPrice && allSymbolPrice[toToken.symbol] ? `\$${numberWithCommas(allSymbolPrice[toToken.symbol].price)}` : '-'}</p>
            </div>
            <div className="line">
              <p className="ll">Available Liquidity</p>
              <p className="lr">{pool && pool.turbos_tusd_amounts ? `\$${pool.turbos_tusd_amounts}` : '-'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="main-right">
        <Chart symbol={toToken.symbol} dropdownDisabled={true} />

        <div className={styles.ordertab}>
          {
            recordTitle.map((item: string, index: number) =>
              <span key={index} className={index === record ? styles.active : ''} onClick={() => setRecord(index)}>{item}</span>
            )
          }
        </div>

        {recordContent[record]}
      </div>


      <TurbosDialog open={check} title="Check order" onClose={toggleCheck} >
        <>
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
            <p className="ll">Min. Ratio</p>
            <p className="lr">1 {fromToken.symbol} ≈ {Bignumber(fromToken.price).div(toToken.price).toString()}{toToken.symbol} </p>
          </div>
          <div className="line">
            <p className="ll">Spread</p>
            <p className="lr">-</p>
          </div>
          <div className="line">
            <p className="ll">Fees</p>
            <p className="lr">{!!fees.toNumber() ? `\$${fees.toFixed(2)}` : '-'}</p>
          </div>

          <div>
            <button className='btn' onClick={swap} disabled={loading}>
              {loading ? <Loading /> : 'Approve'}
            </button>
          </div>
        </>
      </TurbosDialog>

    </div>
  )
}

export default Swap;