import TlpText from "../../../components/tlpText/TlpText";
import styles from './Liquidity.module.css';
import ethereumIcon from '../../../assets/images/ethereum.png';
import downIcon from '../../../assets/images/down.png';
import upIcon from '../../../assets/images/up.png';
import { Link } from "react-router-dom";

function Liquidity() {
  return (
    <>
      <table width='100%' className={styles.table}>
        <thead>
          <tr>
            <th align="left">token</th>
            <th align="right">price</th>
            <th align="right">avallable</th>
            <th align="right">wallet</th>
            <th align="right">fees</th>
            <th align="right"></th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td align="left">
              <div className={styles['liquidity']}>
                <div className={styles['liquidity-img']}><img src={ethereumIcon} alt='' /></div>
                <div className={styles['liquidity-info']}>
                  <div className={styles['liquidity-name']}>
                    <span>Ethereum</span>
                    <img src={downIcon} alt='' />
                  </div>
                  <div className={styles['liquidity-token']}>BTC</div>
                </div>
              </div>
            </td>
            <td align="right">$1,080.02</td>
            <td align="right">$149,896,890.29</td>
            <td align="right">0.00 ETH ($0.00)</td>
            <td align="right">-</td>
            <td align="right">
              <div className={styles['liquidity-btn']}>
                <Link to="/earn/buy-sell">Buy with ETH</Link>
              </div>
            </td>
          </tr>
          <tr>
            <td align="left">
              <div className={styles['liquidity']}>
                <div className={styles['liquidity-img']}><img src={ethereumIcon} alt='' /></div>
                <div className={styles['liquidity-info']}>
                  <div className={styles['liquidity-name']}>
                    <span>Ethereum</span>
                    <img src={downIcon} alt='' />
                  </div>
                  <div className={styles['liquidity-token']}>BTC</div>
                </div>
              </div>
            </td>
            <td align="right">$1,080.02</td>
            <td align="right">$149,896,890.29</td>
            <td align="right">0.00 ETH ($0.00)</td>
            <td align="right">-</td>
            <td align="right">
              <div className={styles['liquidity-btn']}>
                <Link to="/earn/buy-sell">Buy with ETH</Link>
              </div>
            </td>
          </tr>
          <tr>
            <td align="left">
              <div className={styles['liquidity']}>
                <div className={styles['liquidity-img']}><img src={ethereumIcon} alt='' /></div>
                <div className={styles['liquidity-info']}>
                  <div className={styles['liquidity-name']}>
                    <span>Ethereum</span>
                    <img src={downIcon} alt='' />
                  </div>
                  <div className={styles['liquidity-token']}>BTC</div>
                </div>
              </div>
            </td>
            <td align="right">$1,080.02</td>
            <td align="right">$149,896,890.29</td>
            <td align="right">0.00 ETH ($0.00)</td>
            <td align="right">-</td>
            <td align="right">
              <div className={styles['liquidity-btn']}>
                <Link to="/earn/buy-sell">Buy with ETH</Link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <TlpText></TlpText>
    </>
  )
}

export default Liquidity;