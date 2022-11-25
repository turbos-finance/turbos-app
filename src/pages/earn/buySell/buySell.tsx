import TlpText from "../../../components/tlpText/TlpText";
import styles from './BuySell.module.css';

import suiIcon from '../../../assets/images/ic_sui_40.svg';
import buysellIcon from '../../../assets/images/buysellicon.png';
import downIcon from '../../../assets/images/down.png';
import tlpIcon from '../../../assets/images/tlp.png';
import { useState } from "react";
import { supplyTokens } from '../../../config/tokens';
import SelectToken, { SelectTokenOption } from "../../../components/selectToken/SelectToken";
import { useSuiWallet } from "../../../contexts/useSuiWallet";

function BuySell() {
  const balance = 100;

  const {
    connecting,
    connected,
    account
  } = useSuiWallet()

  const [active, setActive] = useState(0); // 0:buy; 1:sell;
  const [selectToken, setSelectToken] = useState(false);

  const [from, setFrom] = useState({ balance: '', symbol: 'SUI', icon: suiIcon, address: '' });
  const [to, setTo] = useState({ balance: '', symbol: 'TLP', icon: tlpIcon, address: '' });

  const changeToken = (result: SelectTokenOption) => {
    setFrom({
      ...from,
      symbol: result.symbol,
      icon: result.icon,
      address: result.address || ''
    })
  }

  const toggleSelectToken = () => {
    setSelectToken(!selectToken);
  }

  const toggleActive = (value: 0 | 1) => {
    setActive(value);
  }

  const changeFrom = (e: any) => {
    setFrom({
      ...from,
      balance: e.target.value
    });
  }

  const btnText = (() => {
    if (!connecting && !connected && !account) {
      return 'Connect Wallet';
    }
    return 'Enter a amount'
  })();

  return (
    <div className={styles.perpetual}>

      <div className={styles.left}>
        <div className={styles.leftcontainer}>

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
                    <span className="section-balance">Balance: {balance}</span>
                    <span> | </span><span className="section-max">MAX</span>
                  </div>
                </div>

                <div className="sectionbottom">
                  <div className="sectioninputcon" >
                    <input type="text" value={from.balance} className="sectioninput" placeholder="0.0" onChange={changeFrom} />
                  </div>
                  {!!active ? <TlpToken /> : <SectionTokens symbol={from.symbol} icon={from.icon} toggleSelectToken={toggleSelectToken} />}
                </div>
              </div>

              <div className={styles.swapvert} onClick={() => { toggleActive(!!active ? 0 : 1) }}>
                <div className={styles.swapvertcon}><img src={buysellIcon} alt="" /></div>
              </div>

              <div className="section">
                <div className="sectiontop">
                  <span>Receive</span>
                  <div>
                    <span className="section-balance">Balance: 0.000</span>
                  </div>
                </div>
                <div className="sectionbottom">
                  <div className="sectioninputcon" >
                    <input type="text" value={to.balance} className="sectioninput" placeholder="0.0" />
                  </div>
                  {!!active ? <SectionTokens symbol={from.symbol} icon={from.icon} toggleSelectToken={toggleSelectToken} /> : <TlpToken />}
                </div>
              </div>

            </div>

            <div className="line">
              <p className="ll">Fees</p>
              <p className="lr">-</p>
            </div>

            <div className={styles.btn}>
              {btnText}
            </div>
          </div>

          <SelectToken visible={selectToken} options={supplyTokens} onClose={toggleSelectToken} onSelect={changeToken} />

        </div>

      </div>


      <div className={styles.right}>
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
              <p className="lr">$1.00</p>
            </div>
            <div className="line">
              <p className="ll">Wallet</p>
              <p className="lr">0.0000 TLP ($0.00)</p>
            </div>
            <div className="line">
              <p className="ll">Staked</p>
              <p className="lr">0.0000 TLP ($0.00)</p>
            </div>
          </div>
          <div className="line-con">
            <div className="line">
              <p className="ll">APR</p>
              <p className="lr">20.00%</p>
            </div>
            <div className="line">
              <p className="ll">Totol Supply</p>
              <p className="lr">100,000,000 TLP ($100,000,000.00) </p>
            </div>
          </div>
        </div>
        <TlpText />
      </div>

    </div>
  )
}

type SectionTokensProps = {
  toggleSelectToken: Function,
  icon: string,
  symbol: string
}
function SectionTokens(props: SectionTokensProps) {
  const { toggleSelectToken, icon, symbol } = props;

  return (
    <div className="sectiontokens" onClick={() => { toggleSelectToken() }}>
      <img src={icon} alt="" />
      <span>{symbol}</span>
      <img src={downIcon} className="sectiontokensicon" alt="" />
    </div>
  )
}

function TlpToken() {
  return (
    <div className="sectiontokens" style={{ cursor: 'default' }}>
      <img src={tlpIcon} alt="" />
      <span>TLP</span>
    </div>
  )
}

export default BuySell;