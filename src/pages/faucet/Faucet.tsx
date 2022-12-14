import styles from './Faucet.module.css';
// import ethereumIcon from '../../assets/images/ethereum.png';
import suiIcon from '../../assets/images/ic_sui_40.svg';
import SuiWalletButton from '../../components/walletButton/WalletButton';
import { useSuiWallet } from '../../contexts/useSuiWallet';
import Loading from '../../components/loading/Loading';
import { useState } from 'react';
import { provider } from '../../lib/provider';
import { useToastify } from '../../contexts/toastify';
import { getCertifiedTransaction, getTimestampFromTransactionResponse, getTransactionSender } from '@mysten/sui.js';

const paySuiAddress = '0xc4173a804406a365e69dfb297d4eaaf002546ebd';

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
        // cache Transaction
        // const lastFaucetTransaction = localStorage.getItem('lastFaucetTransaction');
        // if (lastFaucetTransaction) {
        //   const res = await provider.getTransactionWithEffects(lastFaucetTransaction);
        //   if (res) {
        //     const timestamp = getTimestampFromTransactionResponse(res);
        //     if (timestamp && Date.now() - timestamp <= 1000 * 60 * 60 * 2) {
        //       setLoading(false);
        //       return toastify(`Request limit reached, please try again after ${Math.ceil((1000 * 60 * 60 * 2 - (Date.now() - timestamp)) / 1000 / 60)} minute.`, 'error');
        //     }
        //   }
        // }

        // get Transaction
        const trans = await provider.getTransactionsForAddress(account);
        const res = await provider.getTransactionWithEffectsBatch(trans);
        let isGetFaucet = false;
        for (let i = 0; i < res.length; i++) {
          const timestamp = getTimestampFromTransactionResponse(res[i]);
          if (timestamp) {
            if (Date.now() - timestamp > 1000 * 60 * 60 * 2) {
              break;
            } else {
              const cert = getCertifiedTransaction(res[i]);
              const sender = cert && getTransactionSender(cert);
              if (sender === paySuiAddress) {
                toastify(`Request limit reached, please try again after ${Math.ceil((1000 * 60 * 60 * 2 - (Date.now() - timestamp)) / 1000 / 60)} minute.`, 'error');
                isGetFaucet = true;
                break;
              }
            }
          }
        }

        if (isGetFaucet) {
          setLoading(false);
          return;
        }

        //get faucet
        await provider.requestSuiFromFaucet(
          account
        );
        const transactions = await provider.getTransactionsForAddress(account);
        localStorage.setItem('lastFaucetTransaction', transactions[0]);
        toastify(<div>Successfully received 0.05 SUI, please check in your wallet.<a className='view' target={'_blank'} href={`https://explorer.sui.io/transaction/${encodeURIComponent(transactions[0])}?network=devnet`}>View In Explorer</a></div>);
      }
    } catch (err: any) {
      // toastify(`Request limit reached, please try again after 120 minute.`, 'error');
      toastify(err.message, 'error');
      // toastify('Network error, please switch to the devnet.', 'error');
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
              <p>0.05 SUI</p>
            </div>
          </div>
          {
            !connecting && !connected && !account ?
              <SuiWalletButton isButton={true} btnClassName={'btn-outline'} /> :
              <div className='btn btn-outline' onClick={airdrop}>
                {loading ? <Loading /> : 'Airdrop'}
              </div>
          }
          <div className={styles['faucet-li-network']}>Devnet</div>
        </li>
      </ul>
    </div>
  )
}


export default Faucet;