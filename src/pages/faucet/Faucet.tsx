import styles from './Faucet.module.css';
// import ethereumIcon from '../../assets/images/ethereum.png';
import suiIcon from '../../assets/images/ic_sui_40.svg';
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
              <img src={suiIcon} alt="" height={60} />
            </div>
            <div className={styles['faucet-token']}>
              <p>SUI</p>
              <p>Sui</p>
            </div>
          </div>
          {
            !connecting && !connected && !account ?
              <SuiWalletButton isButton={true} /> :
              <div className='btn'>
                Airdrop
              </div>
          }
        </li>
      </ul>
    </div>
  )
}


export default Faucet;