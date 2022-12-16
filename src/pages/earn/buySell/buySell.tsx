import { useEffect, useState } from "react";
import Bignumber from 'bignumber.js';

import TlpText from "../../../components/tlpText/TlpText";
import styles from './BuySell.module.css';

import suiIcon from '../../../assets/images/ic_sui_40.svg';
import buysellIcon from '../../../assets/images/buysellicon.png';
import downIcon from '../../../assets/images/down.png';
import tlpIcon from '../../../assets/images/tlp.png';

import { supplyTokens } from '../../../config/tokens';
import SelectToken, { SelectTokenOption } from "../../../components/selectToken/SelectToken";
import { useSuiWallet } from "../../../contexts/useSuiWallet";
import SuiWalletButton from "../../../components/walletButton/WalletButton";
import { useVault } from "../../../hooks/useVault";

import { numberWithCommas } from "../../../utils";
import { useAllSymbolBalance, useSymbolBalance } from "../../../hooks/useSymbolBalance";
import { useAllSymbolPrice, useSymbolPrice } from "../../../hooks/useSymbolPrice";
import { NetworkType, SymbolType, TLPAndSymbolType } from "../../../config/config.type";
import { usePool } from "../../../hooks/usePool";
import { provider } from "../../../lib/provider";
import { contractConfig } from "../../../config/contract.config";
import { useToastify } from '../../../contexts/toastify';
import { Coin, GetObjectDataResponse, getObjectId, getTransactionDigest, getTransactionEffects } from "@mysten/sui.js";
import Loading from "../../../components/loading/Loading";
import { Explorer } from "../../../components/explorer/Explorer";

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

  const {
    connecting,
    connected,
    account,
    network,
    adapter
  } = useSuiWallet();

  const { toastify } = useToastify();

  const [active, setActive] = useState(0); // 0:buy; 1:sell;
  const [fromToken, setFromToken] = useState<FromToTokenType>({ balance: '0.00', icon: suiIcon, symbol: 'SUI', value: '', price: '0' });
  const [toToken, setToToken] = useState<FromToTokenType>({ balance: '0.00', icon: tlpIcon, symbol: 'TLP', value: '', price: '0' });

  const [selectToken, setSelectToken] = useState(false);
  const [btnInfo, setBtnInfo] = useState({ state: 0, text: 'Connect Wallet' });
  const [loading, setLoading] = useState(false);

  const poolArg = active ? toToken.symbol as TLPAndSymbolType : fromToken.symbol as TLPAndSymbolType;

  const { vault } = useVault();
  const { pool } = usePool(poolArg === 'TLP' ? undefined : poolArg);
  const { allSymbolPrice } = useAllSymbolPrice();
  const { allSymbolBalance } = useAllSymbolBalance(account);

  const changeToken = (result: SelectTokenOption) => {
    if (active) {
      setToToken({
        ...toToken,
        symbol: result.symbol,
        icon: result.icon,
        address: result.address || '',
        balance: allSymbolBalance[result.symbol] ? allSymbolBalance[result.symbol].balance : '0.00',
      });
    } else {
      setFromToken({
        ...fromToken,
        symbol: result.symbol,
        icon: result.icon,
        address: result.address || '',
        balance: allSymbolBalance[result.symbol] ? allSymbolBalance[result.symbol].balance : '0.00',
      });
    }
  }

  const changeMax = () => {
    setFromToken({
      ...fromToken,
      value: fromToken.balance,
      isInput: true
    });

    const newBalance = Bignumber(fromToken.balance).multipliedBy(allSymbolPrice[fromToken.symbol].price).div(allSymbolPrice[toToken.symbol].price);
    // // const decimalValue = balance.toString().replace(/^\d+\.?/, '');
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

    const newBalance = e.target.value ? Bignumber(e.target.value).multipliedBy(allSymbolPrice[fromToken.symbol].price).div(allSymbolPrice[toToken.symbol].price).toString() : '';
    // // const decimalValue = balance.toString().replace(/^\d+\.?/, '');
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
    const newBalance = e.target.value ? Bignumber(e.target.value).multipliedBy(allSymbolPrice[toToken.symbol].price).div(allSymbolPrice[fromToken.symbol].price) : '';
    // // const decimalValue = balance.toString().replace(/^\d+\.?/, '');
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
      const amount = Bignumber(fromToken.value).multipliedBy(10 ** 9).toNumber();
      const balanceResponse = Coin.selectCoinSetWithCombinedBalanceGreaterThanOrEqual(coinBalance, BigInt(amount));
      const balanceObjects = balanceResponse.map((item) => Coin.getID(item));

      let argumentsVal: (string | number | string[])[] = []
      let typeArgumentsVal: string[] = [];

      if (!active) {
        argumentsVal = [
          config.VaultObjectId,
          fromSymbolConfig.PoolObjectId,
          balanceObjects,
          Bignumber(fromToken.value).multipliedBy(10 ** 9).toNumber(),
          config.PriceFeedStorageObjectId,
          0,
          config.TimeOracleObjectId
        ]
        typeArgumentsVal = [fromType];
      } else {
        argumentsVal = [
          config.VaultObjectId,
          toSymbolConfig.PoolObjectId,
          balanceObjects,
          Bignumber(fromToken.value).multipliedBy(10 ** 9).toNumber(),
          config.PriceFeedStorageObjectId,
          0,
          account,
          config.TimeOracleObjectId
        ]
        typeArgumentsVal = [toType];
      }

      try {
        const executeTransactionTnx = await adapter.executeMoveCall({
          packageObjectId: config.ExchangePackageId,
          module: 'exchange',
          function: !active ? 'add_liquidity' : 'remove_liquidity',
          typeArguments: typeArgumentsVal,
          arguments: argumentsVal,
          gasBudget: 10000
        });

        const effects = getTransactionEffects(executeTransactionTnx);
        const digest = getTransactionDigest(executeTransactionTnx);

        if (effects?.status.status === 'success') {
          toastify(<Explorer message={'Execute Transaction Successfully!'} type="transaction" digest={digest} />);

        } else {
          toastify(<Explorer message={'Execute Transaction error!'} type="transaction" digest={digest} />, 'error');
        }
      } catch (err: any) {
        toastify(err.message, 'error');
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
    if (allSymbolBalance[fromToken.symbol]) {
      setFromToken({
        ...fromToken,
        balance: allSymbolBalance[fromToken.symbol].balance
      })
    }
    if (allSymbolBalance[toToken.symbol]) {
      setToToken({
        ...toToken,
        balance: allSymbolBalance[toToken.symbol].balance
      })
    }
  }, [allSymbolBalance]);


  useEffect(() => {
    if (allSymbolPrice[fromToken.symbol]) {

      setFromToken({
        ...fromToken,
        price: allSymbolPrice[fromToken.symbol].price,
      });

      // if (fromToken.isInput) {

      // }

    }

    if (allSymbolPrice[toToken.symbol]) {
      setToToken({
        ...toToken,
        price: allSymbolPrice[toToken.symbol].price,
      })
    }

  }, [allSymbolPrice]);

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
                {active ? vault.mint_burn_fee_basis_points + '%' : pool?.turbos_fee_reserves ? pool.turbos_fee_reserves + '%' : '-'}
              </p>
            </div>

            {
              !connecting && !connected && !account ?
                <SuiWalletButton isButton={true} /> :
                <div>
                  <button className='btn' disabled={btnInfo.state > 0} onClick={approve}>
                    {loading ? <Loading /> : btnInfo.text}
                  </button>
                </div>
            }
          </div>

          <SelectToken visible={selectToken} options={supplyTokens} onClose={toggleSelectToken} onSelect={changeToken} />
        </div>
      </div>

      <BuySellRight />

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
  const { account } = useSuiWallet();
  const { vault } = useVault();
  const { coinBalance } = useSymbolBalance(account, 'TLP');
  const { symbolPrice } = useSymbolPrice('TLP');

  return (
    <div className="main-right">
      <div className="container">
        <div className={styles.title}>
          <img src={tlpIcon} />
          <div className={styles.tlpname}>
            <p>TLP</p>
            <p>TLP</p>
          </div>
        </div>

        <div className="line-con">
          <div className="line">
            <p className="ll">Price</p>
            <p className="lr">${numberWithCommas(symbolPrice.price)}</p>
          </div>
          <div className="line">
            <p className="ll">Wallet</p>
            <p className="lr">{numberWithCommas(coinBalance)} TLP (${numberWithCommas(Bignumber(coinBalance).multipliedBy(symbolPrice.price).toFixed(2))})</p>
          </div>
          {/* <div className="line">
          <p className="ll">Staked</p>
          <p className="lr">0.0000 TLP ($0.00)</p>
        </div> */}
        </div>
        <div className="line-con">
          {/* <div className="line">
          <p className="ll">APR</p>
          <p className="lr">20.00%</p>
        </div> */}
          <div className="line">
            <p className="ll">Totol Supply</p>
            <p className="lr">
              {numberWithCommas(vault.tlp_supply.fields.value)} TLP
              (${numberWithCommas(Bignumber(vault.tlp_supply.fields.value).multipliedBy(symbolPrice.price).toFixed(2))})
            </p>
          </div>
        </div>
      </div>
      <TlpText />
    </div>

  )
}

export default BuySell;