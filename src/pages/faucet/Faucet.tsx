import styles from './Faucet.module.css';
// import ethereumIcon from '../../assets/images/ethereum.png';
import suiIcon from '../../assets/images/ic_sui_40.svg';
import SuiWalletButton from '../../components/walletButton/WalletButton';
import { useSuiWallet } from '../../contexts/useSuiWallet';
// import { Toast } from '../../utils/toastify';
import Loading from '../../components/loading/Loading';
import { useState } from 'react';
import { provider } from '../../lib/provider';
import { useToastify } from '../../contexts/toastify';


function Faucet() {

  const {
    connecting,
    connected,
    account
  } = useSuiWallet();

  const { toastify } = useToastify();

  const [loading, setLoading] = useState(false);

  const airdrop = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    try {
      if (account) {
        await provider.requestSuiFromFaucet(
          account
        );
        const transactions = await provider.getTransactionsForAddress(account);
        toastify(<div>5 test Sui objects are heading to your wallet.<a className='view' target={'_blank'} href={`https://explorer.sui.io/transaction/${encodeURIComponent(transactions[0])}?network=devnet`}>View In Explorer</a></div>);
      }

    } catch (err: any) {
      toastify(err.message, 'error')
    }
    setLoading(false);
  }

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
              <div className='btn' onClick={airdrop}>
                {loading ? <Loading /> : 'Airdrop'}
              </div>
          }
        </li>
      </ul>
    </div>
  )
}


export default Faucet;