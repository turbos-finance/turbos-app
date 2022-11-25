import styles from './Faucet.module.css';
import ethereumIcon from '../../assets/images/ethereum.png';
function Faucet() {
  return (
    <div className={styles.faucet}>
      <ul className={styles['faucet-item']}>
        <li>
          <div className={styles['faucet-li-top']}>
            <div className="">
              <img src={ethereumIcon} alt="" height={60} />
            </div>
            <div className={styles['faucet-token']}>
              <p>SUI</p>
              <p>10000 devSUI</p>
            </div>
          </div>
          <div className='btn'>Mint</div>
        </li>
        <li>
          <div className={styles['faucet-li-top']}>
            <div className="">
              <img src={ethereumIcon} alt="" height={60} />
            </div>
            <div className={styles['faucet-token']}>
              <p>SUI</p>
              <p>10000 devSUI</p>
            </div>
          </div>
          <div className='btn'>Mint</div>
        </li>
        <li>
          <div className={styles['faucet-li-top']}>
            <div className="">
              <img src={ethereumIcon} alt="" height={60} />
            </div>
            <div className={styles['faucet-token']}>
              <p>SUI</p>
              <p>10000 devSUI</p>
            </div>
          </div>
          <div className='btn'>Mint</div>
        </li>
        <li>
          <div className={styles['faucet-li-top']}>
            <div className="">
              <img src={ethereumIcon} alt="" height={60} />
            </div>
            <div className={styles['faucet-token']}>
              <p>SUI</p>
              <p>10000 devSUI</p>
            </div>
          </div>
          <div className='btn'>Mint</div>
        </li>
        <li>
          <div className={styles['faucet-li-top']}>
            <div className="">
              <img src={ethereumIcon} alt="" height={60} />
            </div>
            <div className={styles['faucet-token']}>
              <p>SUI</p>
              <p>10000 devSUI</p>
            </div>
          </div>
          <div className='btn'>Mint</div>
        </li>
      </ul>
    </div>
  )
}


export default Faucet;