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
import { useSymbolBalance } from "../../../hooks/useSymbolBalance";
import { useSymbolPrice } from "../../../hooks/useSymbolPrice";
import { NetworkType, SymbolType, TLPAndSymbolType } from "../../../config/config.type";
import { usePool } from "../../../hooks/usePool";
import { provider } from "../../../lib/provider";
import { contractConfig } from "../../../config/contract.config";
import { useToastify } from '../../../contexts/toastify';
import { Coin, getTransactionDigest } from "@mysten/sui.js";

type FromToTokenType = {
  balance: string,
  icon: string,
  symbol: string,
  address?: string,
  isInput?: boolean,
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
  const [fromToken, setFromToken] = useState<FromToTokenType>({ balance: '', icon: suiIcon, symbol: 'SUI' });
  const [toToken, setToToken] = useState<FromToTokenType>({ balance: '', icon: tlpIcon, symbol: 'TLP' });

  const [selectToken, setSelectToken] = useState(false);
  const [btnInfo, setBtnInfo] = useState({ state: 0, text: 'Connect Wallet' });

  const { vault } = useVault();
  const { pool } = usePool(fromToken.symbol === 'TLP' ? undefined : fromToken.symbol as SymbolType);

  const fromTokenBalance = useSymbolBalance(account, fromToken.symbol as TLPAndSymbolType);
  const fromTokenPrice = useSymbolPrice(fromToken.symbol as TLPAndSymbolType);
  const toTokenBalance = useSymbolBalance(account, toToken.symbol as TLPAndSymbolType);
  const toTokenPrice = useSymbolPrice(toToken.symbol as TLPAndSymbolType);

  const changeToken = (result: SelectTokenOption) => {
    if (active) {
      setToToken({
        ...toToken,
        symbol: result.symbol,
        icon: result.icon,
        address: result.address || ''
      });
    } else {
      setFromToken({
        ...fromToken,
        symbol: result.symbol,
        icon: result.icon,
        address: result.address || ''
      });
    }
  }

  const changeMax = () => {
    setFromToken({
      ...fromToken,
      balance: fromTokenBalance.coinBalance,
      isInput: true
    });

    const newBalance = Bignumber(fromTokenBalance.coinBalance).multipliedBy(fromTokenPrice.symbolPrice.price).div(toTokenPrice.symbolPrice.price);
    // const decimalValue = balance.toString().replace(/^\d+\.?/, '');
    setToToken({
      ...toToken,
      balance: newBalance.toString(),
      isInput: false
    })
  }

  const toggleSelectToken = () => {
    setSelectToken(!selectToken);
  }

  const toggleActive = (value: 0 | 1) => {
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
      balance: e.target.value,
      isInput: true
    });
    const newBalance = e.target.value ? Bignumber(e.target.value).multipliedBy(fromTokenPrice.symbolPrice.price).div(toTokenPrice.symbolPrice.price).toString() : '';
    // const decimalValue = balance.toString().replace(/^\d+\.?/, '');
    setToToken({
      ...toToken,
      balance: newBalance,
      isInput: false
    })
  }

  const changeTo = (e: any) => {
    setToToken({
      ...toToken,
      balance: e.target.value,
      isInput: true
    });
    const newBalance = e.target.value ? Bignumber(e.target.value).multipliedBy(toTokenPrice.symbolPrice.price).div(fromTokenPrice.symbolPrice.price) : '';
    // const decimalValue = balance.toString().replace(/^\d+\.?/, '');
    setFromToken({
      ...fromToken,
      balance: newBalance.toString(),
      isInput: false
    });
  }

  const approve = async () => {
    if (network && account) {
      const config = contractConfig[network as NetworkType];
      const symbolConfig = config.Coin[(!active ? fromToken.symbol : toToken.symbol) as SymbolType];
      // console.log(adapter)；
      const balance = await provider.getCoinBalancesOwnedByAddress(account, symbolConfig.Type);
      const value = Coin.selectCoinWithBalanceGreaterThanOrEqual(balance, BigInt(Bignumber(fromToken.balance).toNumber()))
      console.log(value);
      if(value){
        const id = Coin.getID(value);
        console.log(id);
      }
      
      // try {
      //   const executeTransactionTnx = await adapter.executeMoveCall({
      //     packageObjectId: config.ExchangePackageId,
      //     module: 'exchange',
      //     function: 'add_liquidity',
      //     typeArguments: [
      //       symbolConfig.Type
      //     ],
      //     arguments: [
      //       config.VaultObjectId,
      //       symbolConfig.PoolObjectId,
      //       symbolConfig.Type,
      //       config.PriceFeedStorageObjectId,
      //       toToken.balance,
      //       config.AumOracleObjectId,
      //       config.TimeOracleObjectId
      //     ],
      //     gasBudget: 1000
      //   });
      //   const digest = getTransactionDigest(executeTransactionTnx);
      //   toastify(<div>Execute Transaction Successfully <a className='view' target={'_blank'} href={`https://explorer.sui.io/transaction/${digest}?network=devnet`}>View In Explorer</a></div>)
      // } catch (err: any) {
      //   toastify(err.message, 'error');
      // }
    }
  }

  const changeBtnText = () => {
    if (!fromToken.balance || !Number(fromToken.balance)) {
      setBtnInfo({
        state: 1,
        text: 'Enter a amount'
      });
    } else if (Bignumber(fromToken.balance).minus(fromTokenBalance.coinBalance).isGreaterThan(0)) {
      setBtnInfo({
        state: 2,
        text: `Insufficient ${fromToken.symbol} balance`
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
  }, [connecting, connected, account, fromToken, fromTokenBalance.coinBalance]);


  useEffect(() => {
    if (fromTokenPrice.symbolPrice.price && fromTokenPrice.symbolPrice.price) {
      if (fromToken.isInput) {
        const newBalance = Bignumber(fromToken.balance).multipliedBy(fromTokenPrice.symbolPrice.price).div(toTokenPrice.symbolPrice.price).toString();
        setToToken({
          ...toToken,
          balance: newBalance
        });
      }

      if (toToken.isInput) {
        const newBalance = Bignumber(toToken.balance).multipliedBy(toTokenPrice.symbolPrice.price).div(fromTokenPrice.symbolPrice.price).toString();
        setFromToken({
          ...fromToken,
          balance: newBalance
        });
      }
    }
  }, [fromTokenPrice.symbolPrice.price, fromTokenPrice.symbolPrice.price]);

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
                    <span className="section-balance">Balance: {fromTokenBalance.coinBalance}</span>
                    <span> | </span><span className="section-max" onClick={changeMax}>MAX</span>
                  </div>
                </div>

                <div className="sectionbottom">
                  <div className="sectioninputcon" >
                    <input type="number" value={fromToken.balance} className="sectioninput" placeholder="0.0" onChange={changeFrom} />
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
                    <span className="section-balance">Balance: {toTokenBalance.coinBalance}</span>
                  </div>
                </div>
                <div className="sectionbottom">
                  <div className="sectioninputcon" >
                    <input type="number" value={toToken.balance} className="sectioninput" placeholder="0.0" onChange={changeTo} />
                  </div>
                  <SectionTokens symbol={toToken.symbol} icon={toToken.icon} toggleSelectToken={active ? toggleSelectToken : undefined} />
                </div>
              </div>

            </div>

            <div className="line">
              <p className="ll">Fees</p>
              <p className="lr">
                {active ? vault.mint_burn_fee_basis_points + '%' : pool?.fee_reserves ? pool.fee_reserves + '%' : '-'}
              </p>
            </div>

            {
              !connecting && !connected && !account ?
                <SuiWalletButton isButton={true} /> :
                <div>
                  <button className='btn' disabled={btnInfo.state > 0} onClick={approve}>
                    {btnInfo.text}
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