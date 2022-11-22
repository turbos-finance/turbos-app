import styles from './Perpetual.module.css';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SwapVertIcon from '@mui/icons-material/SwapVert';
interface CountryType {
  code: string;
  label: string;
  phone: string;
  suggested?: boolean;
}

const countries: readonly CountryType[] = [
  { code: 'AD', label: 'Andorra', phone: '376' },
  {
    code: 'AE',
    label: 'United Arab Emirates',
    phone: '971',
  },
];

function Perpetual() {
  return (
    <div className={styles.perpetual}>

      <div className={styles.left}>
        <div className={styles.leftcontainer}>

          <div className={styles.tabs}>
            <div className={styles.active}>做多</div>
            <div>做空</div>
          </div>

          <div className={styles.type}>
            <div className={styles.active}>Market</div>
            <div>Limit</div>
            <div>Trigger</div>
          </div>

          <div>
            <div className={styles.section}>
              <div className={styles.sectiontop}>
                <div>Pay: 4.99 USD</div>
                <div>Balance: 0.005</div>
              </div>
              <div className={styles.sectionbottom}>
                <div className={styles.sectioninputcon} >
                  <input type="text" className={styles.sectioninput} placeholder="0.0" />
                </div>
                <div className={styles.sectionmax}>MAX</div>
                <div className={styles.sectiontokens}>
                  <span>USDC</span>
                  <KeyboardArrowDownIcon sx={{ color: '#ffffff', fontSize: 30 }} />
                </div>
              </div>
            </div>
            <div className={styles.swapvert}>
              <SwapVertIcon sx={{ color: '#ffffff', fontSize: 30 }} />
            </div>
            <div className={styles.section}>
              <div className={styles.sectiontop}>
                <div>Receive: 4.99 USD</div>
                <div>Balance: 0.005</div>
              </div>
              <div className={styles.sectionbottom}>
                <div className={styles.sectioninputcon} >
                  <input type="text" className={styles.sectioninput} placeholder="0.0" />
                </div>
                <div className={styles.sectiontokens}>
                  <span>USDC</span>
                  <KeyboardArrowDownIcon sx={{ color: '#ffffff', fontSize: 30, }} />
                </div>
              </div>
            </div>
          
          </div>

          <div className={styles.line}>
            <p className={styles.lleft}>leverage</p>
            <p className={styles.lright}></p>
          </div>

          <div>

          </div>

          <div className={styles.line}>
            <p className={styles.lleft}>Collaterlal In</p>
            <p className={styles.lright}>USD</p>
          </div>
          <div className={styles.line}>
            <p className={styles.lleft}>杠杆</p>
            <p className={styles.lright}>$5.45</p>
          </div>
          <div className={styles.line}>
            <p className={styles.lleft}>入场价格</p>
            <p className={styles.lright}>-</p>
          </div>
          <div className={styles.line}>
            <p className={styles.lleft}>可用的流动资金</p>
            <p className={styles.lright}>$15.45</p>
          </div>
          <div className={styles.line}>
            <p className={styles.lleft}>费用</p>
            <p className={styles.lright}>-</p>
          </div>
          <div className={styles.btn}>
            Buy
          </div>
        </div>

        <div className={styles.leftcontainer}>
          <div className={styles.title}>做多AVAX</div>
          <div className={styles.line}>
            <p className={styles.lleft}>入场价格</p>
            <p className={styles.lright}>$5.45</p>
          </div>
          <div className={styles.line}>
            <p className={styles.lleft}>退出价格</p>
            <p className={styles.lright}>$5.45</p>
          </div>
          <div className={styles.line}>
            <p className={styles.lleft}>借款费用</p>
            <p className={styles.lright}>$5.45</p>
          </div>
          <div className={styles.line}>
            <p className={styles.lleft}>可用的流动资金</p>
            <p className={styles.lright}>$5.45</p>
          </div>
        </div>
      </div>


      <div className={styles.right}>

        <div className={styles.leftcontainer + ' ' + styles.rightcontainer}>
          <div className={styles.tokenu}>ETH / USD</div>
          <div>
            <div>1,250.91</div>
            <div>$1,250.91</div>
          </div>
          <div>
            <div>1,250.91</div>
            <div>+6.9%</div>
          </div>
          <div>
            <div>1,250.91</div>
            <div>$1,250.91</div>
          </div>
          <div>
            <div>1,250.91</div>
            <div>$1,250.91</div>
          </div>
        </div>

        <div className={styles.sectionchart}>

        </div>

        <div>
          <div>
            <div>Position</div>
            <div>Orders</div>
            <div>Trades</div>
          </div>
          <div>
            Chart position
          </div>
        </div>

        <div className={styles.leftcontainer}>

        </div>

      </div>


    </div>
  )
}

export default Perpetual;