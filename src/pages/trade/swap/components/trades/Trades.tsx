

import { getCertifiedTransaction, getTimestampFromTransactionResponse, getTransactionData, getTransactionDigest, SuiEvent, SuiEventEnvelope, SuiEvents } from '@mysten/sui.js';
import { useEffect, useState } from 'react';
import Empty from '../../../../../components/empty/Empty';
import { NetworkType, SymbolType } from '../../../../../config/config.type';
import { contractConfig } from '../../../../../config/contract.config';
import { useSuiWallet } from '../../../../../contexts/useSuiWallet';
import { provider } from '../../../../../lib/provider';
import styles from './Trades.module.css';


function Trades() {
  const {
    connecting,
    connected,
    account,
    network,
    adapter
  } = useSuiWallet();

  const [options, setOptions] = useState<any[]>([]);

  const getTrades = async () => {
    if (account && network) {
      const config = contractConfig[network as NetworkType];
      const coin = config.Coin;
      const symbols = Object.keys(coin);
      const result = await provider.getEvents({ MoveEvent: `${config.ExchangePackageId}::exchange::SwapEvent` }, null, 10);
      const trans = result.data.map((item: SuiEventEnvelope) => {
        const event = (item.event as any).moveEvent;
        const tokenInSymbol = symbols.find((item: string) => coin[item as SymbolType].PoolObjectId === event.fields.token_in_pool_id);
        const tokenOutPoolId = symbols.find((item: string) => coin[item as SymbolType].PoolObjectId === event.fields.token_out_pool_id)
        return {
          packageId: event.packageId,
          sender: event.sender,
          type: event.sender,
          timestamp: item.timestamp,
          txDigest: item.txDigest,
          receiver: event.fields.receiver,
          tokenInAmount: event.fields.token_in_amount,
          tokenInPoolId: event.fields.token_in_pool_id,
          tokenInSymbol,
          tokenOutAmount: event.fields.token_out_amount,
          tokenOutPoolId,
          tokenOutSymbol: event.fields.token_out_pool_id
        }
      });
      // setOptions(trans)
    } else {
      setOptions([]);
    }
  }

  useEffect(() => {
    getTrades()
  }, [account, network]);

  return (
    <>
      {
        options.length <= 0 ?
          <div className='container'><Empty></Empty></div> :
          options.map((item: any) => (
            <div className={styles.trades}>
              <div className={styles['trades-time']}>18 Nov 2022, 1:12 AM</div>
              <div className={styles['trades-info']}>Deposit 9.99 USD into AVAX Long</div>
            </div>
          ))

      }
    </>
  )
}

export default Trades;
