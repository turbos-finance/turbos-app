import TlpText from "../../../components/tlpText/TlpText";
import styles from './BuySell.module.css';

import ethereumIcon from '../../../assets/images/ethereum.png';
import swapvertIcon from '../../../assets/images/swapvert.png';
import downIcon from '../../../assets/images/down.png';
import upIcon from '../../../assets/images/up.png';

function BuySell() {
  return (
    <div className={styles.perpetual}>

      <div className={styles.left}>
        <div className={styles.leftcontainer}>

          <div className={styles.tabs}>
            <div className={styles.active}>
              <span>Buy TLP</span>
            </div>
            <div>
              <span>Sell TLP</span>
            </div>
          </div>

          <div className={styles['section-con']}>
            <div className={styles.section}>
              <div className={styles.sectiontop}>
                <span>Pay</span>
                <div>
                  <span className={styles.balance}>Balance: 0.005</span>
                  <span> | </span><span>MAX</span>
                </div>
              </div>

              <div className={styles.sectionbottom}>
                <div className={styles.sectioninputcon} >
                  <input type="text" className={styles.sectioninput} placeholder="0.0" />
                </div>
                <div className={styles.sectiontokens}>
                  <img src={ethereumIcon} alt="" />
                  <span>USDC</span>
                  <img src={downIcon} className={styles.sectiontokensicon} alt="" />
                </div>
              </div>
            </div>

            <div className={styles.swapvert}>
              {/* <SwapVertIcon sx={{ color: '#ffffff', fontSize: 30 }} /> */}
              <div className={styles.swapvertcon}><img src={swapvertIcon} alt="" /></div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectiontop}>
                <span>Long</span>
                <div>
                  {/* <span className={styles.balance}>Balance: 0.005</span>
                <span> | </span><span>MAX</span> */}
                </div>
              </div>
              <div className={styles.sectionbottom}>
                <div className={styles.sectioninputcon} >
                  <input type="text" className={styles.sectioninput} placeholder="0.0" />
                </div>
                <div className={styles.sectiontokens}>
                  <img src={ethereumIcon} alt="" />
                  <span>USDC</span>
                  <img src={downIcon} className={styles.sectiontokensicon} alt="" />
                </div>
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

      </div>


      <div className={styles.right}>
        <div className={styles.container}>
          <div className={styles.title}>
            <img src={ethereumIcon} />
            <div className={styles.tlpname}>
              <p>TLP</p>
              <p>TLP</p>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.line}>
              <p className={styles.lleft}>Entry Price</p>
              <p className={styles.lright}>$5.45</p>
            </div>
            <div className={styles.line}>
              <p className={styles.lleft}>Exit Price</p>
              <p className={styles.lright}>$1,146.22</p>
            </div>
            <div className={styles.line}>
              <p className={styles.lleft}>Borrow Fee</p>
              <p className={styles.lright}>0.0001% / 1h</p>
            </div>
            <div className={styles.line}>
              <p className={styles.lleft}>Available Liquidity</p>
              <p className={styles.lright}>$107,695.16</p>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.line}>
              <p className={styles.lleft}>Entry Price</p>
              <p className={styles.lright}>$5.45</p>
            </div>
            <div className={styles.line}>
              <p className={styles.lleft}>Exit Price</p>
              <p className={styles.lright}>$1,146.22</p>
            </div>
            <div className={styles.line}>
              <p className={styles.lleft}>Borrow Fee</p>
              <p className={styles.lright}>0.0001% / 1h</p>
            </div>
            <div className={styles.line}>
              <p className={styles.lleft}>Available Liquidity</p>
              <p className={styles.lright}>$107,695.16</p>
            </div>
          </div>
        </div>
        <TlpText></TlpText>

      </div>


    </div>
  )
}

export default BuySell;