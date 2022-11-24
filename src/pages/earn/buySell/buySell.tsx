import TlpText from "../../../components/tlpText/TlpText";
import styles from './BuySell.module.css';

import suiIcon from '../../../assets/images/ic_sui_40.svg';
import ethereumIcon from '../../../assets/images/ethereum.png';
import buysellIcon from '../../../assets/images/buysellicon.png';
import downIcon from '../../../assets/images/down.png';
import tlpIcon from '../../../assets/images/tlp.png';
import closeIcon from '../../../assets/images/close.png';
import searchIcon from '../../../assets/images/search.png';
import { useState } from "react";

function BuySell() {
  const [active, setActive] = useState(0); // 0:buy; 1:sell;
  const [selectToken, setSelectToken] = useState(false);

  const toggleSelectToken = () => {
    setSelectToken(!selectToken);
  }
  const toggleActive = (value: 0 | 1) => {
    setActive(value);
  }


  return (
    <div className={styles.perpetual}>

      <div className={styles.left}>
        <div className={styles.leftcontainer}>

          <div className={selectToken ? styles.operate : ''}>
            <div className={styles.tabs}>
              <div className={!!active ? '' : styles.active} onClick={() => { toggleActive(0) }}>
                <span>Buy TLP</span>
              </div>
              <div className={!!active ? styles.active : ''} onClick={() => { toggleActive(1) }}>
                <span>Sell TLP</span>
              </div>
            </div>

            <div className={styles['section-con']}>
              <div className={styles.section}>
                <div className={styles.sectiontop}>
                  <span>Pay: $0.00</span>
                  <div>
                    <span className={styles.balance}>Balance: 0.000</span>
                    <span> | </span><span className={styles.max}>MAX</span>
                  </div>
                </div>

                <div className={styles.sectionbottom}>
                  <div className={styles.sectioninputcon} >
                    <input type="text" className={styles.sectioninput} placeholder="0.0" />
                  </div>

                  {!!active ? <TlpToken /> : <SectionTokens toggleSelectToken={toggleSelectToken} />}

                </div>
              </div>

              <div className={styles.swapvert} onClick={() => { toggleActive(!!active ? 0 : 1) }}>
                <div className={styles.swapvertcon}><img src={buysellIcon} alt="" /></div>
              </div>

              <div className={styles.section}>
                <div className={styles.sectiontop}>
                  <span>Receive: $0.00</span>
                  <div>
                    <span className={styles.balance}>Balance: 0.000</span>
                  </div>
                </div>
                <div className={styles.sectionbottom}>
                  <div className={styles.sectioninputcon} >
                    <input type="text" className={styles.sectioninput} placeholder="0.0" />
                  </div>
                  {!!active ? <SectionTokens toggleSelectToken={toggleSelectToken} /> : <TlpToken />}
                </div>
              </div>

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

      </div>


      <div className={styles.right}>
        <div className={styles.container}>
          <div className={styles.title}>
            <img src={tlpIcon} />
            <div className={styles.tlpname}>
              <p>TLP</p>
              <p>TLP</p>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.line}>
              <p className={styles.lleft}>Price</p>
              <p className={styles.lright}>$1.00</p>
            </div>
            <div className={styles.line}>
              <p className={styles.lleft}>Wallet</p>
              <p className={styles.lright}>0.0000 TLP ($0.00)</p>
            </div>
            <div className={styles.line}>
              <p className={styles.lleft}>Staked</p>
              <p className={styles.lright}>0.0000 TLP ($0.00)</p>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.line}>
              <p className={styles.lleft}>APR</p>
              <p className={styles.lright}>20.00%</p>
            </div>
            <div className={styles.line}>
              <p className={styles.lleft}>Totol Supply</p>
              <p className={styles.lright}>100,000,000 TLP ($100,000,000.00) </p>
            </div>
          </div>
        </div>
        <TlpText />
      </div>

    </div>
  )
}

type SectionTokensProps = {
  toggleSelectToken: Function
}
function SectionTokens(props: SectionTokensProps) {
  const { toggleSelectToken } = props;

  return (
    <div className={styles.sectiontokens} onClick={() => { toggleSelectToken() }}>
      <img src={suiIcon} alt="" />
      <span>SUI</span>
      <img src={downIcon} className={styles.sectiontokensicon} alt="" />
    </div>
  )
}

function TlpToken() {
  return (
    <div className={styles.sectiontokens} style={{ cursor: 'default' }}>
      <img src={tlpIcon} alt="" />
      <span>TLP</span>
    </div>
  )
}

export default BuySell;