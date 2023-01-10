import { useEffect, useState } from "react";
import Bignumber from 'bignumber.js';

import TlpText from "../../../components/tlpText/TlpText";
import styles from './BuySell.module.css';

import buysellIcon from '../../../assets/images/buysellicon.png';
import downIcon from '../../../assets/images/down.png';
import toIcon from '../../../assets/images/to.png';
import { supplyTLPToken, supplyTokens } from '../../../config/tokens';
import SelectToken, { SelectTokenOption } from "../../../components/selectToken/SelectToken";
import { useSuiWallet } from "../../../contexts/useSuiWallet";
import SuiWalletButton from "../../../components/walletButton/WalletButton";
import { numberWithCommas } from "../../../utils";
import { NetworkType, SymbolType, TLPAndSymbolType } from "../../../config/config.type";
import { provider } from "../../../lib/provider";
import { contractConfig } from "../../../config/contract.config";
import { useToastify } from '../../../contexts/toastify';
import { Coin, GetObjectDataResponse, getObjectId, getTransactionDigest, getTransactionEffects } from "@mysten/sui.js";
import Loading from "../../../components/loading/Loading";
import { Explorer } from "../../../components/explorer/Explorer";
import { useRefresh } from "../../../contexts/refresh";
import { getLocalStorage, getLocalStorageSupplyToken, setLocalStorage, TurbosBuySell, TurbosBuySellActive } from "../../../lib";
import { useFees } from "../../../hooks/useFees";
import { bignumberMulDecimalString, bignumberRemoveDecimal } from "../../../utils/tools";
import TurbosDialog from "../../../components/UI/Dialog/Dialog";
import { useStore } from "../../../contexts/store";
import { Token } from "graphql";

type FromToTokenType = {
  balance: string,
  icon: string,
  symbol: string,
  address?: string,
  isInput?: boolean,
  value: string,
  price: string
}

function BuySell() {
  const turbos_buy_sell_supplytoken = getLocalStorageSupplyToken(TurbosBuySell);
  const current_active = getLocalStorage(TurbosBuySellActive);
  const initActive = current_active === '1' ? 1 : 0;
  const ininFrom = !initActive ? turbos_buy_sell_supplytoken : supplyTLPToken;
  const ininTo = initActive ? turbos_buy_sell_supplytoken : supplyTLPToken;

  const {
    connecting,
    connected,
    account,
    network,
    adapter
  } = useSuiWallet();

  const { changeRefreshTime } = useRefresh();
  const { toastify } = useToastify();

  const [active, setActive] = useState(initActive); // 0:buy; 1:sell;
  const [fromToken, setFromToken] = useState<FromToTokenType>({ balance: '0.00', icon: ininFrom.icon, symbol: ininFrom.symbol, value: '', price: '0' });
  const [toToken, setToToken] = useState<FromToTokenType>({ balance: '0.00', icon: ininTo.icon, symbol: ininTo.symbol, value: '', price: '0' });

  const [selectToken, setSelectToken] = useState(false);
  const [btnInfo, setBtnInfo] = useState({ state: 0, text: 'Connect Wallet' });
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState(false);

  const poolArg = active ? toToken.symbol as TLPAndSymbolType : fromToken.symbol as TLPAndSymbolType;

  const { fees } = useFees(fromToken.symbol, fromToken.value, toToken.symbol, toToken.value);
  const { store } = useStore();
  const { allSymbolPrice, allSymbolBalance, allPool } = store;
  const pool = poolArg === 'TLP' ? undefined : allPool && allPool[poolArg];

  const toggleCheck = () => {
    setCheck(!check);
  }

  const changeToken = (result: SelectTokenOption) => {
    const _symbolPrice: any = allSymbolPrice && allSymbolPrice[result.symbol] ? allSymbolPrice[result.symbol] : { price: '0' };
    const _symbolBalance: any = allSymbolBalance && allSymbolBalance[result.symbol] ? allSymbolBalance[result.symbol] : { balance: '0' };

    let newFromToken = {
      ...fromToken
    };
    let newToToken = {
      ...toToken
    };

    if (active) {
      newToToken = {
        ...newToToken,
        symbol: result.symbol,
        icon: result.icon,
        address: result.address || '',
        price: _symbolPrice.price || '0',
        balance: _symbolBalance.balance || '0.00',
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
        symbol: result.symbol,
        icon: result.icon,
        address: result.address || '',
        price: _symbolPrice.price || '0',
        balance: _symbolBalance.balance || '0.00',
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

  const changeMax = () => {
    setFromToken({
      ...fromToken,
      value: fromToken.balance,
      isInput: true
    });

    const newBalance = Bignumber(fromToken.balance)
      .multipliedBy(fromToken.price)
      .div(toToken.price);
    setToToken({
      ...toToken,
      value: newBalance.toString(),
      isInput: false
    })
  }

  const toggleSelectToken = () => {
    setSelectToken(!selectToken);
  }

  const toggleActive = (value: 0 | 1) => {
    if (active === value) {
      return;
    }

    setActive(value);

    setToToken({
      ...fromToken
    });

    setFromToken({
      ...toToken
    });

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
        .toString() : '';
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
        .div(fromToken.price) : '';
    setFromToken({
      ...fromToken,
      value: newBalance.toString(),
      isInput: false
    });
  }

  const approve = async () => {
    if (network && account) {
      setLoading(true);

      const config = contractConfig[network as NetworkType];
      const toSymbolConfig = config.Coin[(toToken.symbol) as SymbolType];
      const fromSymbolConfig = config.Coin[(fromToken.symbol) as SymbolType];

      const toType = !toSymbolConfig
        ? config.ExchangePackageId + '::exchange::TLP'
        : toSymbolConfig.Type === '0x0000000000000000000000000000000000000002::sui::SUI' ? '0x2::sui::SUI' : toSymbolConfig.Type;

      const fromType = !fromSymbolConfig
        ? config.ExchangePackageId + '::exchange::TLP'
        : fromSymbolConfig.Type === '0x0000000000000000000000000000000000000002::sui::SUI' ? '0x2::sui::SUI' : fromSymbolConfig.Type;

      const coinBalance = await provider.getCoinBalancesOwnedByAddress(account, fromType);
      const amount = bignumberRemoveDecimal(bignumberMulDecimalString(fromToken.value));
      const balanceResponse = Coin.selectCoinSetWithCombinedBalanceGreaterThanOrEqual(coinBalance, BigInt(amount));
      const balanceObjects = balanceResponse.map((item) => Coin.getID(item));

      let argumentsVal: (string | number | string[])[] = []
      let typeArgumentsVal: string[] = [];

      if (!active) {
        argumentsVal = [
          config.VaultObjectId,
          fromSymbolConfig.PoolObjectId,
          balanceObjects,
          amount.toString(),
          config.PriceFeedStorageObjectId,
          '0',
          config.TimeOracleObjectId
        ]
        typeArgumentsVal = [fromType];
      } else {
        argumentsVal = [
          config.VaultObjectId,
          toSymbolConfig.PoolObjectId,
          balanceObjects,
          amount.toString(),
          config.PriceFeedStorageObjectId,
          '0',
          account,
          config.TimeOracleObjectId
        ]
        typeArgumentsVal = [toType];
      }

      try {
        let executeTransactionTnx = await adapter.executeMoveCall({
          packageObjectId: config.ExchangePackageId,
          module: 'exchange',
          function: !active ? 'add_liquidity' : 'remove_liquidity',
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
            const message = `Request ${!active ? 'add' : 'remove'} liquidity of TLP by ${!active ? fromToken.value : toToken.value} ${!active ? fromToken.symbol : toToken.symbol}.`;
            toastify(<Explorer message={message} type="transaction" digest={digest} />);
            changeRefreshTime(); // reload data
            toggleCheck();
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
    } else if (active && Bignumber(toToken.value).multipliedBy(10 ** 9).minus(pool.pool_amounts).isGreaterThan(0)) {
      setBtnInfo({
        state: 3,
        text: `Insufficient ${toToken.symbol} liquidity`
      });
    } else {
      setBtnInfo({
        state: -1,
        text: `Approve`
      });
    }
  };

  useEffect(() => {
    changeBtnText();
  }, [connecting, connected, account, fromToken, toToken, pool, active]);

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
    setLocalStorage(TurbosBuySellActive, active.toString());
  }, [active]);

  useEffect(() => {
    setLocalStorage(TurbosBuySell, active ? toToken.symbol : fromToken.symbol);
  }, [active, toToken, fromToken]);

  return (
    <div className="main">

      <div className="main-left">
        <div className="main-left-container">

          <div className={selectToken ? 'section-operate' : ''}>

            <div className="tabs">
              <div className={!!active ? '' : "active"} onClick={() => { toggleActive(0) }}>
                <span>Buy TLP</span>
              </div>
              <div className={!!active ? "active" : ''} onClick={() => { toggleActive(1) }}>
                <span>Sell TLP</span>
              </div>
            </div>

            <div className="section-con">
              <div className="section">
                <div className="sectiontop">
                  <span>Pay</span>
                  <div>
                    <span className="section-balance">Balance: {fromToken.balance}</span>
                    <span> | </span><span className="section-max" onClick={changeMax}>MAX</span>
                  </div>
                </div>

                <div className="sectionbottom">
                  <div className="sectioninputcon" >
                    <input type="number" value={fromToken.value} className="sectioninput" placeholder="0.0" onChange={changeFrom} />
                  </div>
                  <SectionTokens symbol={fromToken.symbol} icon={fromToken.icon} toggleSelectToken={!active ? toggleSelectToken : undefined} />
                </div>
              </div>

              <div className="swapvert" onClick={() => { toggleActive(!!active ? 0 : 1) }}>
                <div className="swapvertcon"><img src={buysellIcon} alt="" /></div>
              </div>

              <div className="section">
                <div className="sectiontop">
                  <span>Receive</span>
                  <div>
                    <span className="section-balance">Balance: {toToken.balance}</span>
                  </div>
                </div>
                <div className="sectionbottom">
                  <div className="sectioninputcon" >
                    <input type="number" value={toToken.value} className="sectioninput" placeholder="0.0" onChange={changeTo} />
                  </div>
                  <SectionTokens symbol={toToken.symbol} icon={toToken.icon} toggleSelectToken={active ? toggleSelectToken : undefined} />
                </div>
              </div>

            </div>

            <div className="line">
              <p className="ll">Fees</p>
              <p className="lr">
                {!!fees.toNumber() ? `${fees.toFixed(2)}%` : '-'}
              </p>
            </div>

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

          <SelectToken visible={selectToken} options={supplyTokens} onClose={toggleSelectToken} onSelect={changeToken} />
        </div>
      </div>

      <BuySellRight />

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
            <p className="lr">1 {fromToken.symbol} ≈ {Bignumber(fromToken.price).div(toToken.price).toFixed(9)} {toToken.symbol} </p>
          </div>
          <div className="line">
            <p className="ll">Spread</p>
            <p className="lr">-</p>
          </div>
          <div className="line">
            <p className="ll">Fees</p>
            <p className="lr">{!!fees.toNumber() ? `${fees.toFixed(2)}%` : '-'}</p>
          </div>

          <div>
            <button className='btn' onClick={approve} disabled={loading}>
              {loading ? <Loading /> : 'Approve'}
            </button>
          </div>
        </>
      </TurbosDialog>



    </div>
  )
}

type SectionTokensProps = {
  toggleSelectToken?: Function | undefined,
  icon: string,
  symbol: string,
}

function SectionTokens(props: SectionTokensProps) {
  const { toggleSelectToken, icon, symbol } = props;

  return (
    <div className="sectiontokens" onClick={() => { toggleSelectToken && toggleSelectToken() }} style={{ cursor: !toggleSelectToken ? 'default' : 'cursor' }}>
      <img src={icon} alt="" />
      <span>{symbol}</span>
      {toggleSelectToken ? <img src={downIcon} className="sectiontokensicon" alt="" /> : null}
    </div>
  )
}


function BuySellRight() {
  const { store } = useStore();
  const vault: any = store.vault || undefined;
  const symbolPrice = store.allSymbolPrice && store.allSymbolPrice[supplyTLPToken.symbol] ? store.allSymbolPrice[supplyTLPToken.symbol] : { price: '0' };
  const coinBalance = store.allSymbolBalance && store.allSymbolBalance[supplyTLPToken.symbol] ? store.allSymbolBalance[supplyTLPToken.symbol] : { balance: '0' };

  return (
    <div className="main-right">
      <div className="container">
        <div className={styles.title}>
          <img src={supplyTLPToken.icon} />
          <div className={styles.tlpname}>
            <p>{supplyTLPToken.symbol}</p>
            <p>{supplyTLPToken.name}</p>
          </div>
        </div>

        <div className="line-con">
          <div className="line">
            <p className="ll">Price</p>
            <p className="lr">${
              numberWithCommas(symbolPrice.price)}
            </p>
          </div>
          <div className="line">
            <p className="ll">Wallet</p>
            <p className="lr">{numberWithCommas(coinBalance.balance)} {supplyTLPToken.symbol}
              (${numberWithCommas(Bignumber(coinBalance.balance).multipliedBy(symbolPrice.price).toFixed(2))})
            </p>
          </div>
          {/* <div className="line">
          <p className="ll">Staked</p>
          <p className="lr">0.0000 TLP ($0.00)</p>
        </div> */}
        </div>
        <div className="line-con">
          {/* <div className="line">
          <p className="ll">APR</p>git 
          <p className="lr">20.00%</p>
        </div> */}
          <div className="line">
            <p className="ll">Totol Supply</p>
            <p className="lr">
              {numberWithCommas(vault && vault.tlp_supply.fields.value, '0')} {supplyTLPToken.symbol}
              (${numberWithCommas(Bignumber(vault ? vault.tlp_supply.fields.value : 0).multipliedBy(symbolPrice.price).toFixed(2))})
            </p>
          </div>
        </div>
      </div>
      <TlpText />
    </div>

  )
}

export default BuySell;