import Bignumber from 'bignumber.js';

import styles from '../../Perpetual.module.css';
import Empty from "../../../../../components/empty/Empty";
import ethereumIcon from '../../../../../assets/images/ethereum.png';
import addIcon from '../../../../../assets/images/add.png';
import shareIcon from '../../../../../assets/images/share.png';
import { useEffect, useState } from 'react';
import { useSuiWallet } from '../../../../../contexts/useSuiWallet';
import { provider } from '../../../../../lib/provider';
import { contractConfig } from '../../../../../config/contract.config';
import { NetworkType, SymbolType } from '../../../../../config/config.type';
import { Coin, GetObjectDataResponse, getObjectFields, getObjectType, getTransactionDigest, getTransactionEffects, SuiObjectInfo } from '@mysten/sui.js';
import TurbosDialog from '../../../../../components/UI/Dialog/Dialog';
import { numberWithCommas } from '../../../../../utils';
import Loading from '../../../../../components/loading/Loading';
import { useRefresh } from '../../../../../contexts/refresh';
import { useToastify } from '../../../../../contexts/toastify';
import { Explorer } from '../../../../../components/explorer/Explorer';
import { useAllSymbolPrice } from '../../../../../hooks/useSymbolPrice';
import { SupplyTokenType, supplyTradeTokens } from '../../../../../config/tokens';

type PositionsProps = {
  options: any[]
}

function Positions(props: PositionsProps) {
  const { options } = props;

  const {
    connecting,
    connected,
    account,
    network,
    adapter
  } = useSuiWallet();

  const { changeRefreshTime } = useRefresh();
  const { toastify } = useToastify();
  const { allSymbolPrice } = useAllSymbolPrice();

  const [data, setData] = useState<any[]>([]);

  const [check, setCheck] = useState(false);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleCheck = () => {
    setCheck(!check);
  }

  const toggleEdit = () => {
    setEdit(!edit);
  }

  const getPositions = async () => {
    if (account && network) {
      const config = contractConfig[network as NetworkType];
      const objects = await provider.getObject(config.PositionsObjectId);
      const filed = getObjectFields(objects);
      const reuslt = filed?.user_position.fields.contents.find((item: any) => account === item.fields.key);
      // reuslt.fields.value
      // const objectOwneByObjects = await provider.getObjectsOwnedByObject(config.PositionsObjectId);
      // const objectIds = objectOwneByObjects.map((item: SuiObjectInfo) => item.objectId);
      // const objectBatch = await provider.getObjectBatch(objectIds);
      // const objIds: string[] = [];
      // objectBatch.forEach((item: GetObjectDataResponse) => {
      //   const field = getObjectFields(item);
      //   if (field && field.name?.fields?.name) {
      //     objIds.push(field.value);
      //   }
      // });
      const resultObjects = await provider.getObjectBatch(reuslt.fields.value);
      const options: any[] = []
      resultObjects.forEach((item: GetObjectDataResponse) => {
        const field = getObjectFields(item);
        if (field && field.account === account) {
          options.push(field);
        }
      });
      console.log(options);
      setData(options);
    } else {
      setData([]);
    }
  }

  const decrease_position = async () => {
    if (network && account) {
      setLoading(true);

      // const config = contractConfig[network as NetworkType];
      // const toSymbolConfig = config.Coin[(toToken.symbol) as SymbolType];
      // const fromSymbolConfig = config.Coin[(fromToken.symbol) as SymbolType];

      // const fromType = fromSymbolConfig.Type === '0x0000000000000000000000000000000000000002::sui::SUI' ? '0x2::sui::SUI' : fromSymbolConfig.Type;

      // const coinBalance = await provider.getCoinBalancesOwnedByAddress(account, fromType);
      // const amount = Bignumber(fromToken.value).multipliedBy(10 ** 9).toNumber();
      // const balanceResponse = Coin.selectCoinSetWithCombinedBalanceGreaterThanOrEqual(coinBalance, BigInt(amount));
      // const balanceObjects = balanceResponse.map((item) => Coin.getID(item));

      // let argumentsVal: (string | number | boolean | string[])[] = [
      //   config.VaultObjectId,
      //   balanceObjects,
      //   Bignumber(fromToken.value).multipliedBy(10 ** 9).toNumber(),
      //   fromSymbolConfig.PoolObjectId,
      //   toSymbolConfig.PoolObjectId,
      //   config.PriceFeedStorageObjectId,
      //   config.PositionsObjectId,
      //   true,
      //   Bignumber(Bignumber(toToken.value).multipliedBy(10 ** 9).multipliedBy(toToken.price).toFixed(0)).toNumber(),
      //   Bignumber(toToken.price).multipliedBy(!trade ? 1.01 : 0.99).multipliedBy(10 ** 9).toNumber(),
      //   config.TimeOracleObjectId
      // ];

      // let typeArgumentsVal: string[] = [
      //   fromSymbolConfig.Type,
      //   toSymbolConfig.Type
      // ];

      // // vault: & mut Vault,
      // //   collateral_coins: vector<Coin<T>>,
      // //     collateral_amount: u64,
      // //       collateral_pool: & mut Pool<T>,
      // //         index_pool: & mut Pool<P>,
      // //           price_feed_storage: & PriceFeedStorage,
      // //             positions: & mut Positions,
      // //               is_long: bool,
      // //                 position_size_delta: u64,
      // //                   price: u64,
      // //                     timestamp: & Timestamp,



      // try {
      //   let executeTransactionTnx = await adapter.executeMoveCall({
      //     packageObjectId: config.ExchangePackageId,
      //     module: 'exchange',
      //     function: 'increase_position',
      //     typeArguments: typeArgumentsVal,
      //     arguments: argumentsVal,
      //     gasBudget: 10000
      //   });

      //   if (executeTransactionTnx.error) {
      //     toastify(executeTransactionTnx.error.msg, 'error');
      //   } else {
      //     if (executeTransactionTnx.data) {
      //       executeTransactionTnx = executeTransactionTnx.data;
      //     }

      //     const effects = getTransactionEffects(executeTransactionTnx);
      //     const digest = getTransactionDigest(executeTransactionTnx);

      //     if (effects?.status.status === 'success') {
      //       toastify(<Explorer message={`Request increase of ${fromToken.symbol} ${tradeType[trade]} by ${toToken.value} ${toToken.symbol}.`} type="transaction" digest={digest} />);
      //       toggleCheck();
      //       changeRefreshTime(); // reload data
      //     } else {
      //       toastify(<Explorer message={'Execute Transaction error!'} type="transaction" digest={digest} />, 'error');
      //     }
      //   }
      // } catch (err: any) {
      //   toastify(err.message || err, 'error');
      // }

      setLoading(false);
    }

  }

  const increase_position = async () => {
    if (network && account) {
      setLoading(true);

      // const config = contractConfig[network as NetworkType];
      // const toSymbolConfig = config.Coin[(toToken.symbol) as SymbolType];
      // const fromSymbolConfig = config.Coin[(fromToken.symbol) as SymbolType];

      // const fromType = fromSymbolConfig.Type === '0x0000000000000000000000000000000000000002::sui::SUI' ? '0x2::sui::SUI' : fromSymbolConfig.Type;

      // const coinBalance = await provider.getCoinBalancesOwnedByAddress(account, fromType);
      // const amount = Bignumber(fromToken.value).multipliedBy(10 ** 9).toNumber();
      // const balanceResponse = Coin.selectCoinSetWithCombinedBalanceGreaterThanOrEqual(coinBalance, BigInt(amount));
      // const balanceObjects = balanceResponse.map((item) => Coin.getID(item));

      // let argumentsVal: (string | number | boolean | string[])[] = [
      //   config.VaultObjectId,
      //   balanceObjects,
      //   Bignumber(fromToken.value).multipliedBy(10 ** 9).toNumber(),
      //   fromSymbolConfig.PoolObjectId,
      //   toSymbolConfig.PoolObjectId,
      //   config.PriceFeedStorageObjectId,
      //   config.PositionsObjectId,
      //   !trade ? true : false,
      //   Bignumber(Bignumber(toToken.value).multipliedBy(10 ** 9).multipliedBy(toToken.price).toFixed(0)).toNumber(),
      //   Bignumber(toToken.price).multipliedBy(!trade ? 1.01 : 0.99).multipliedBy(10 ** 9).toNumber(),
      //   config.TimeOracleObjectId
      // ];

      // let typeArgumentsVal: string[] = [
      //   fromSymbolConfig.Type,
      //   toSymbolConfig.Type
      // ];

      // try {
      //   let executeTransactionTnx = await adapter.executeMoveCall({
      //     packageObjectId: config.ExchangePackageId,
      //     module: 'exchange',
      //     function: 'increase_position',
      //     typeArguments: typeArgumentsVal,
      //     arguments: argumentsVal,
      //     gasBudget: 10000
      //   });

      //   if (executeTransactionTnx.error) {
      //     toastify(executeTransactionTnx.error.msg, 'error');
      //   } else {
      //     if (executeTransactionTnx.data) {
      //       executeTransactionTnx = executeTransactionTnx.data;
      //     }

      //     const effects = getTransactionEffects(executeTransactionTnx);
      //     const digest = getTransactionDigest(executeTransactionTnx);

      //     if (effects?.status.status === 'success') {
      //       toastify(<Explorer message={`Request increase of ${fromToken.symbol} ${tradeType[trade]} by ${toToken.value} ${toToken.symbol}.`} type="transaction" digest={digest} />);
      //       toggleCheck();
      //       changeRefreshTime(); // reload data
      //     } else {
      //       toastify(<Explorer message={'Execute Transaction error!'} type="transaction" digest={digest} />, 'error');
      //     }
      //   }
      // } catch (err: any) {
      //   toastify(err.message || err, 'error');
      // }

      // setLoading(false);
    }
  }

  useEffect(() => {
    getPositions();
  }, [network, account]);

  return (
    <>
      <table width="100%" className={styles.table}>
        <thead>
          <tr>
            <th align='left'>Position</th>
            <th align='left'>Total</th>
            <th align='left'>Margin</th>
            <th align='left'>Entry Price</th>
            <th align='left'>Mark Price</th>
            <th align='left'>Liq. Price</th>
            <th align='left'>PnL/PnL (%)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            data.length <= 0 ?
              <tr>
                <td colSpan={8}><Empty /></td>
              </tr>
              :
              data.map((item: any, index: number) => {


                const coin = contractConfig[network as NetworkType].Coin;
                const symbol = Object.keys(coin).find((k: string) => item.index_pool_address === coin[k as SymbolType].PoolObjectId);
                const symbolPrice = allSymbolPrice[symbol as SymbolType];

                const supplyTradeToken = supplyTradeTokens.find((item: SupplyTokenType) => item.symbol === symbol);

                const differencePrice = Bignumber(item.collateral).div(item.reserve_amount).multipliedBy(item.collateral);
                const liqPirce = item.is_long ?
                  Bignumber(item.average_price).minus(differencePrice)
                  :
                  Bignumber(item.average_price).plus(differencePrice);


                const isGreaterThanOrEqual = Bignumber(symbolPrice.originalPrice).minus(item.average_price).isGreaterThanOrEqualTo(0);
                const isGreen = (item.is_long && isGreaterThanOrEqual) || (!item.is_long && !isGreaterThanOrEqual) ? true : false;

                const pnlPrice = Bignumber(symbolPrice.originalPrice).minus(item.average_price).multipliedBy(item.reserve_amount).div(item.collateral);
                const pnl = pnlPrice.div(item.collateral).multipliedBy(100).toFixed(2);


                return (<tr key={index}>
                  <td align='left'>
                    <div className={styles['table-position']}>
                      <img src={supplyTradeToken?.icon} alt="" height="24" />
                      <span>{symbol}</span>
                    </div>
                    <div className={styles['table-position']}>
                      {Bignumber(item.reserve_amount).div(item.collateral).toFixed(1)}x&nbsp;&nbsp;
                      <span className={item.is_long ? styles.green : styles.red}>
                        {item.is_long ? 'Long' : 'Short'}
                      </span>
                    </div>
                  </td>
                  <td align='left'>
                    ${numberWithCommas(Bignumber(item.reserve_amount).div(10 ** 9).toFixed(2))}
                  </td>
                  <td align='left'>
                    <div className={styles['table-position']}>
                      <span>${numberWithCommas(Bignumber(item.collateral).div(10 ** 9).toFixed(2))}</span>
                      <img src={addIcon} alt="" height="24" className={styles.icon} onClick={toggleEdit} />
                    </div>
                  </td>
                  <td align='left'>
                    ${numberWithCommas(symbolPrice.price)}
                  </td>
                  <td align='left'>
                    ${numberWithCommas(Bignumber(item.average_price).div(10 ** 9).toFixed(2))}
                  </td>
                  <td align='left'>
                    ${numberWithCommas(liqPirce.div(10 ** 9).toFixed(2))}
                  </td>
                  <td align='left'>
                    <span className={isGreen ? styles.green : styles.red}>
                      {pnlPrice.div(10 ** 9).toFixed(2).indexOf('-') > -1 ? pnlPrice.div(10 ** 9).toFixed(2).replace('-', '-$') : `\$${pnlPrice.div(10 ** 9).toFixed(2)}`}
                    </span>
                    <div className={styles['table-position']}>
                      <span className={isGreen ? styles.green : styles.red}>{pnl}%</span>
                      {/* <img src={shareIcon} alt="" height="24" className={styles.icon} /> */}
                    </div>
                  </td>
                  <td>
                    {/* <button className={styles['table-btn']}>TP/SL</button> */}
                    <button className={styles['table-btn-green']} onClick={toggleCheck}>Close</button>
                  </td>
                </tr>)
              })
          }
        </tbody>
      </table>

      <div className='container mobile-container'>
        {
          data.length <= 0 ?
            <Empty />
            :
            data.map((item: any, index: number) => {
              const coin = contractConfig[network as NetworkType].Coin;
              const symbol = Object.keys(coin).find((k: string) => item.index_pool_address === coin[k as SymbolType].PoolObjectId);
              const supplyTradeToken = supplyTradeTokens.find((item: SupplyTokenType) => item.symbol === symbol);

              const differencePrice = Bignumber(item.collateral).div(item.reserve_amount).multipliedBy(item.collateral);
              const liqPirce = item.is_long ?
                Bignumber(item.average_price).minus(differencePrice)
                :
                Bignumber(item.average_price).plus(differencePrice);

              return (
                <div className='line-con' key={index}>
                  <div className='line'>
                    <div className='ll'>Position</div>
                    <div className='lr'>
                      <div>
                        <div className={styles['table-position']}>
                          <img src={supplyTradeToken?.icon} alt="" height="24" />
                          <span>{symbol}</span>
                        </div>
                        <div className={styles['table-position']}>
                          {Bignumber(item.size).div(item.collateral).toFixed(1)}x&nbsp;&nbsp;
                          <span className={styles.red}>
                            {item.is_long ? 'Long' : 'Short'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='line'>
                    <div className='ll'>Total</div>
                    <div className='lr'>
                      ${numberWithCommas(Bignumber(item.size).div(10 ** 9).toFixed(2))}
                    </div>
                  </div>

                  <div className='line'>
                    <div className='ll'>Margin</div>
                    <div className='lr'>
                      <div className={styles['table-position']}>
                        <span>${numberWithCommas(Bignumber(item.collateral).div(10 ** 9).toFixed(2))}</span>
                        <img src={addIcon} alt="" height="24" className={styles.icon} onClick={toggleEdit} />
                      </div>
                    </div>
                  </div>

                  <div className='line'>
                    <div className='ll'>Entry Price</div>
                    <div className='lr'>
                      ${numberWithCommas(allSymbolPrice[symbol as SymbolType].price)}
                    </div>
                  </div>

                  <div className='line'>
                    <div className='ll'>Mark Price</div>
                    <div className='lr'>
                      ${numberWithCommas(Bignumber(item.average_price).div(10 ** 9).toFixed(2))}
                    </div>
                  </div>

                  <div className='line'>
                    <div className='ll'>Liq. Price</div>
                    <div className='lr'>
                      ${numberWithCommas(liqPirce.div(10 ** 9).toFixed(2))}
                    </div>
                  </div>

                  <div className='line'>
                    <div className='ll'>PnL/PnL (%)</div>
                    <div className='lr'>
                      <div>
                        <span className={styles.red}>
                          +10.0
                        </span>
                        <div className={styles['table-position']}>
                          <span className={styles.red}>-1.16%</span>
                          <img src={shareIcon} alt="" height="24" className={styles.icon} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='line'>
                    <div className='ll'></div>
                    <div className='lr'>
                      <button className={styles['table-btn']}>TP/SL</button>
                      <button className={styles['table-btn-green']} onClick={toggleCheck}>Close</button>
                    </div>
                  </div>

                </div>
              )
            })
        }

      </div>

      <TurbosDialog open={check} title="Check order" onClose={toggleCheck}>
        <div className="section section-marbottom">
          <div className="sectiontop">
            <span>Pay</span>
            <div>
              <span className="section-balance">Balance: { }</span>
              <span> | </span><span className='section-max'>MAX</span>
            </div>
          </div>
          <div className="sectionbottom">
            <div className="sectioninputcon" >
              <input type="text" className="sectioninput" placeholder="0.0" />
            </div>
            <div className="sectiontokens">
              <img src={ethereumIcon} alt="" />
              <span>SUI</span>
            </div>
          </div>
        </div>
        <div className="line line-top-16">
          <p className="ll">Mark Price</p>
          <p className="lr">$</p>
        </div>
        <div className="line">
          <p className="ll">Entry Price</p>
          <p className="lr">$</p>
        </div>
        <div className="line">
          <p className="ll">Liq. Price</p>
          <p className="lr">$</p>
        </div>
        <div className="line-hr"></div>
        <div className="line">
          <p className="ll">Sise</p>
          <p className="lr"></p>
        </div>
        <div className="line">
          <p className="ll">Collaterlal(BTC)</p>
          <p className="lr">$</p>
        </div>
        <div className="line">
          <p className="ll">PnL</p>
          <p className="lr">$</p>
        </div>
        <div className="line">
          <p className="ll">Fees</p>
          <p className="lr">$</p>
        </div>
        <div className="line-hr"></div>
        <div className="line">
          <p className="ll">Receive</p>
          <p className="lr">0.00 BTC($0.00)</p>
        </div>

        <div>
          <button className='btn' onClick={decrease_position} disabled={loading}>
            {loading ? <Loading /> : 'Colse'}
          </button>
        </div>
      </TurbosDialog>

      <TurbosDialog open={edit} title="Edit Long BTC" onClose={toggleEdit}>
        <div className='tabs'>
          <div onClick={() => { }}>
            <span>Add Margin</span>
          </div>
          <div onClick={() => { }}>
            <span>Remove Margin</span>
          </div>
        </div>

        <div className="section section-marbottom">
          <div className="sectiontop">
            <span>Pay</span>
            <div>
              <span className="section-balance">Balance: { }</span>
              <span> | </span><span className='section-max'>MAX</span>
            </div>
          </div>
          <div className="sectionbottom">
            <div className="sectioninputcon" >
              <input type="text" className="sectioninput" placeholder="0.0" />
            </div>
            <div className="sectiontokens">
              <img src={ethereumIcon} alt="" />
              <span>SUI</span>
            </div>
          </div>
        </div>
        <div className="line line-top-16">
          <p className="ll">Total</p>
          <p className="lr">$</p>
        </div>
        <div className="line">
          <p className="ll">Margin</p>
          <p className="lr">$</p>
        </div>
        <div className="line">
          <p className="ll">Leverage</p>
          <p className="lr">$</p>
        </div>
        <div className="line">
          <p className="ll">Mark Price</p>
          <p className="lr"></p>
        </div>
        <div className="line">
          <p className="ll">Liq. Price</p>
          <p className="lr">$</p>
        </div>
        <div className="line">
          <p className="ll">Execution Fees</p>
          <p className="lr">$</p>
        </div>
        <div>
          <button className='btn' onClick={decrease_position} disabled={loading}>
            {loading ? <Loading /> : 'Colse'}
          </button>
        </div>
      </TurbosDialog>
    </>
  )
}

export default Positions;