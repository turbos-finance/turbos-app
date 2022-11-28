import styles from './Faucet.module.css';
import ethereumIcon from '../../assets/images/ethereum.png';
import SuiWalletButton from '../../components/walletButton/WalletButton';
import { useSuiWallet } from '../../contexts/useSuiWallet';
function Faucet() {

  const {
    connecting,
    connected,
    account
  } = useSuiWallet();

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
          {
            !connecting && !connected && !account ?
              <SuiWalletButton isButton={true} /> :
              <div className='btn'>
                Mint
              </div>
          }
        </li>
      </ul>
    </div>
  )
}


export default Faucet;