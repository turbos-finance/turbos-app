import Bignumber from 'bignumber.js';

import styles from '../../Perpetual.module.css';
import Empty from "../../../../../components/empty/Empty";
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
import { findContractConfigCoinSymbol, findsupplyTokenSymbol, findSupplyTradeTokeSymbol, getContractConfigCoinSymbol } from '../../../../../lib';
import { useAllPool } from '../../../../../hooks/usePool';
import { useAllSymbolBalance } from '../../../../../hooks/useSymbolBalance';
import { bignumberDivDecimalFixed } from '../../../../../utils/tools';

type PositionsProps = {
  options: any[]
}

function Positions(props: PositionsProps) {
  const { options } = props;
  const {
    account,
    network,
  } = useSuiWallet();

  const { refreshTime } = useRefresh();
  const { allSymbolPrice } = useAllSymbolPrice();

  const [data, setData] = useState<any[]>([]);

  const [check, setCheck] = useState(false);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [option, setOption] = useState<{ [x: string]: any } | undefined>();

  const toggleCheck = (value?: any) => {
    value && setOption(value);
    setCheck(!check);
  }

  const toggleEdit = (value?: any) => {
    value && setOption(value);
    setEdit(!edit);
  }

  const getPositions = async () => {
    if (account && network) {
      const config = contractConfig[network as NetworkType];
      const objects = await provider.getObject(config.PositionsObjectId);
      const filed = getObjectFields(objects);
      const result = filed?.user_position.fields.contents.find((item: any) => account === item.fields.key);
      if (!result) {
        return;
      }
      const resultObjects = await provider.getObjectBatch(result.fields.value);
      const options: any[] = []
      resultObjects.forEach((item: GetObjectDataResponse) => {
        const field = getObjectFields(item);
        if (field && field.account === account) {
          options.push(field);
        }
      });
      setData(options);
    } else {
      setData([]);
    }
  }

  useEffect(() => {
    getPositions();
  }, [network, account, refreshTime]);

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
            data.length > 0 && account && network ?
              data.map((item: any, index: number) => {

                const coin = contractConfig[network as NetworkType].Coin;
                const symbol = Object.keys(coin).find((k: string) => item.index_pool_address === coin[k as SymbolType].PoolObjectId);
                const symbolPrice = allSymbolPrice[symbol as SymbolType];

                const supplyTradeToken = supplyTradeTokens.find((item: SupplyTokenType) => item.symbol === symbol);

                const leverage = Bignumber(item.size).div(item.collateral)
                const differencePrice = Bignumber(item.average_price).div(leverage);
                const liqPirce = item.is_long ?
                  Bignumber(item.average_price).minus(differencePrice)
                  :
                  Bignumber(item.average_price).plus(differencePrice);

                const isGreaterThanOrEqual = Bignumber(symbolPrice.originalPrice).minus(item.average_price).isGreaterThanOrEqualTo(0);
                const isLessThanOrEqual = Bignumber(symbolPrice.originalPrice).minus(item.average_price).isLessThanOrEqualTo(0)
                const isGreen = (item.is_long && isGreaterThanOrEqual) || (!item.is_long && !isLessThanOrEqual) ? true : false;

                const pnlPrice = Bignumber(symbolPrice.originalPrice)
                  .minus(item.average_price)
                  .div(Bignumber(item.average_price)
                    .div(leverage))
                  .multipliedBy(item.collateral);
                const pnl = pnlPrice.div(item.collateral).multipliedBy(100).toFixed(2);

                return (<tr key={index}>
                  <td align='left'>
                    <div className={styles['table-position']}>
                      <img src={supplyTradeToken?.icon} alt="" height="24" />
                      <span>{symbol}</span>
                    </div>
                    <div className={styles['table-position']}>
                      {Bignumber(item.size).div(item.collateral).toFixed(1)}x&nbsp;&nbsp;
                      <span className={item.is_long ? styles.green : styles.red}>
                        {item.is_long ? 'Long' : 'Short'}
                      </span>
                    </div>
                  </td>
                  <td align='left'>
                    ${numberWithCommas(Bignumber(item.size).div(10 ** 9).toFixed(2))}
                  </td>
                  <td align='left'>
                    <div className={styles['table-position']}>
                      <span>${numberWithCommas(Bignumber(item.collateral).div(10 ** 9).toFixed(2))}</span>
                      <img src={addIcon} alt="" height="24" className={styles.icon} onClick={() => toggleEdit(item)} />
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
                    <button className={styles[item.is_long ? 'table-btn-green' : 'table-btn-red']} onClick={() => { toggleCheck(item) }}>Close</button>
                  </td>
                </tr>)
              })
              :
              <tr>
                <td colSpan={8}><Empty /></td>
              </tr>
          }
        </tbody>
      </table>

      <div className='container mobile-container'>
        {
          data.length > 0 && account && network ?
            data.map((item: any, index: number) => {
              const coin = contractConfig[network as NetworkType].Coin;
              const symbol = Object.keys(coin).find((k: string) => item.index_pool_address === coin[k as SymbolType].PoolObjectId);
              const symbolPrice = allSymbolPrice[symbol as SymbolType];

              const supplyTradeToken = supplyTradeTokens.find((item: SupplyTokenType) => item.symbol === symbol);

              const leverage = Bignumber(item.size).div(item.collateral)
              const differencePrice = Bignumber(item.average_price).div(leverage);
              const liqPirce = item.is_long ?
                Bignumber(item.average_price).minus(differencePrice)
                :
                Bignumber(item.average_price).plus(differencePrice);

              const isGreaterThanOrEqual = Bignumber(symbolPrice.originalPrice).minus(item.average_price).isGreaterThanOrEqualTo(0);
              const isLessThanOrEqual = Bignumber(symbolPrice.originalPrice).minus(item.average_price).isLessThanOrEqualTo(0)
              const isGreen = (item.is_long && isGreaterThanOrEqual) || (!item.is_long && !isLessThanOrEqual) ? true : false;

              const pnlPrice = Bignumber(symbolPrice.originalPrice)
                .minus(item.average_price)
                .div(Bignumber(item.average_price)
                  .div(leverage))
                .multipliedBy(item.collateral);
              const pnl = pnlPrice.div(item.collateral).multipliedBy(100).toFixed(2);

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
                        <img src={addIcon} alt="" height="24" className={styles.icon} onClick={() => toggleEdit(item)} />
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
                        <span className={isGreen ? styles.green : styles.red}>
                          {pnlPrice.div(10 ** 9).toFixed(2).indexOf('-') > -1 ? pnlPrice.div(10 ** 9).toFixed(2).replace('-', '-$') : `\$${pnlPrice.div(10 ** 9).toFixed(2)}`}
                        </span>
                        <div className={styles['table-position']}>
                          <span className={isGreen ? styles.green : styles.red}>{pnl}%</span>
                          {/* <img src={shareIcon} alt="" height="24" className={styles.icon} /> */}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='line'>
                    <div className='ll'></div>
                    <div className='lr'>
                      {/* <button className={styles['table-btn']}>TP/SL</button> */}
                      <button className={styles['table-btn-green']} onClick={() => { toggleCheck(item) }}>Close</button>
                    </div>
                  </div>

                </div>
              )
            })
            :
            <Empty />
        }

      </div>

      <ClosePositionTurbosDialog open={check} onClose={toggleCheck} data={option} />
      <AddAndRemoveMarginTurbosDialog open={edit} onClose={toggleEdit} data={option} />
      <ShareTurbosDialog></ShareTurbosDialog>

    </>
  )
}

type TurbosDialogProps = {
  open: boolean,
  onClose: () => void,
  data: { [x: string]: any } | undefined
}

function ClosePositionTurbosDialog(props: TurbosDialogProps) {
  const { open, onClose, data } = props;

  const {
    account,
    network,
    adapter
  } = useSuiWallet();

  const { changeRefreshTime, refreshTime } = useRefresh();
  const { toastify } = useToastify();

  const [loading, setLoading] = useState(false);
  const [btnInfo, setBtnInfo] = useState({ state: 1, text: 'Enter a amount' });

  const [fromToken, setFromToken] = useState({ symbol: '', value: '', price: '0', size: '', balance: '0' });
  const [toToken, setToToken] = useState({ symbol: '', value: '', price: '0', size: '', balance: '0' });

  const { allSymbolPrice } = useAllSymbolPrice();
  const { allPool } = useAllPool();

  useEffect(() => {
    if (network && data && open) {
      if (!fromToken.value) {
        setBtnInfo({ state: 1, text: 'Enter a amount' })
      } else if (Bignumber(fromToken.size).minus(data.size).isGreaterThan(0)) {
        const symbol = findContractConfigCoinSymbol(network, data.index_pool_address, 'PoolObjectId');
        setBtnInfo({ state: 2, text: `Insufficient ${symbol} balance` });
      } else {
        setBtnInfo({ state: 0, text: 'Approve' });
      }
    }
  }, [fromToken, network, data, open]);

  useEffect(() => {
    if (data && network && open) {
      if (data.index_pool_address) {
        const symbol = findContractConfigCoinSymbol(network, data.index_pool_address, 'PoolObjectId');
        setFromToken({
          ...fromToken,
          symbol: symbol || '',
          price: allSymbolPrice[symbol as SymbolType].price || '0',
          balance: Bignumber(data.size).div(data.average_price).toString()
        })
      }
    }
  }, [data, allSymbolPrice, network, open]);

  useEffect(() => {
    if (data && network && open) {
      if (data.collateral_pool_address && fromToken.symbol) {
        const symbol = findContractConfigCoinSymbol(network, data.collateral_pool_address, 'PoolObjectId');
        setToToken({
          ...toToken,
          symbol: symbol || '',
          price: allSymbolPrice[symbol as SymbolType].price || '0',
          value: fromToken.value ? Bignumber(fromToken.value)
            .multipliedBy(allSymbolPrice[fromToken.symbol as SymbolType].originalPrice)
            .div(allSymbolPrice[symbol as SymbolType].originalPrice).toFixed(2) : '0.00'
        })
      }
    }
  }, [data, allSymbolPrice, network, open, fromToken])

  if (!network || !account || !open || !data) {
    return null;
  }

  const changeClose = () => {
    onClose();
    setFromToken({
      ...fromToken,
      value: '',
      size: ''
    });
  }

  const changeMax = () => {
    setFromToken({
      ...fromToken,
      value: fromToken.balance,
      size: data.size
    });

    setToToken({
      ...toToken,
      value: Bignumber(fromToken.balance)
        .multipliedBy(allSymbolPrice[fromToken.symbol as SymbolType].originalPrice)
        .div(allSymbolPrice[toToken.symbol as SymbolType].originalPrice).toFixed(2),
    })
  }

  const changeValue = (e: any) => {
    setFromToken({
      ...fromToken,
      value: e.target.value,
      size: e.target.value ? Bignumber(e.target.value).multipliedBy(data.average_price).toString() : ''
    });

    setToToken({
      ...toToken,
      value: e.target.value ? Bignumber(e.target.value)
        .multipliedBy(allSymbolPrice[fromToken.symbol as SymbolType].originalPrice)
        .div(allSymbolPrice[toToken.symbol as SymbolType].originalPrice).toFixed(2) : '0.00',
    })
  }

  const decrease_position = async () => {
    if (network && account && adapter) {
      setLoading(true);

      const config = contractConfig[network as NetworkType];
      const toSymbolConfig = config.Coin[(toToken.symbol) as SymbolType];
      const fromSymbolConfig = config.Coin[(fromToken.symbol) as SymbolType];

      let argumentsVal: (string | number | boolean | string[])[] = [
        config.VaultObjectId,
        data.collateral_pool_address,
        data.index_pool_address,
        config.PriceFeedStorageObjectId,
        config.PositionsObjectId,
        Bignumber(Bignumber(fromToken.value).multipliedBy(10 ** 9).multipliedBy(fromToken.price).toFixed(0)).toNumber(),
        data.is_long ? true : false,
        Bignumber(fromToken.size).toNumber(),
        Bignumber(fromToken.price).multipliedBy(!data.is_long ? 1.01 : 0.99).multipliedBy(10 ** 9).toNumber(),
        account,
        config.TimeOracleObjectId
      ];

      let typeArgumentsVal: string[] = [
        toSymbolConfig.Type,
        fromSymbolConfig.Type
      ];

      try {
        let executeTransactionTnx = await adapter.executeMoveCall({
          packageObjectId: config.ExchangePackageId,
          module: 'exchange',
          function: 'decrease_position',
          typeArguments: typeArgumentsVal,
          arguments: argumentsVal,
          gasBudget: 10000
        });

        console.log(executeTransactionTnx);
        if (executeTransactionTnx.error) {
          toastify(executeTransactionTnx.error.msg, 'error');
        } else {
          if (executeTransactionTnx.data) {
            executeTransactionTnx = executeTransactionTnx.data;
          }

          const effects = getTransactionEffects(executeTransactionTnx);
          const digest = getTransactionDigest(executeTransactionTnx);

          if (effects?.status.status === 'success') {
            toastify(<Explorer message={`Request decrease of ${fromToken.symbol} ${data.is_long ? 'Long' : 'Short'} by ${toToken.value} ${toToken.symbol}.`} type="transaction" digest={digest} />);
            changeClose();
            changeRefreshTime(); // reload data
          } else {
            toastify(<Explorer message={'Execute Transaction error!'} type="transaction" digest={digest} />, 'error');
          }
        }
      } catch (err: any) {
        toastify(err.message || err, 'error');
      }

      setLoading(false);
    }
  }

  const supplyTradeToken = findSupplyTradeTokeSymbol(fromToken.symbol);
  const symbolPrice = allSymbolPrice[fromToken.symbol as SymbolType] || {};

  const leverage = Bignumber(data.size).div(data.collateral);
  const differencePrice = Bignumber(data.average_price).div(leverage);
  const liqPirce = data.is_long ?
    Bignumber(data.average_price).minus(differencePrice)
    :
    Bignumber(data.average_price).plus(differencePrice);

  const pnlPrice = Bignumber(symbolPrice.originalPrice)
    .minus(data.average_price)
    .div(Bignumber(data.average_price)
      .div(leverage))
    .multipliedBy(data.collateral);
  const pnl = pnlPrice.div(data.collateral).multipliedBy(100).toFixed(2);

  return (
    <TurbosDialog open={open} title={`Close ${data.is_long ? 'Long' : 'Short'} ${fromToken.symbol}`} onClose={changeClose}>
      <div className="section section-marbottom">
        <div className="sectiontop">
          <span>Pay</span>
          <div>
            <span className="section-balance">Balance: {fromToken.balance}</span>
            <span> | </span><span className='section-max' onClick={changeMax}>MAX</span>
          </div>
        </div>
        <div className="sectionbottom">
          <div className="sectioninputcon" >
            <input type="number" className="sectioninput" value={fromToken.value} placeholder="0.0" onChange={changeValue} />
          </div>
          <div className="sectiontokens">
            <img src={supplyTradeToken?.icon} alt="" />
            <span>{fromToken.symbol}</span>
          </div>
        </div>
      </div>
      <div className="line line-top-16">
        <p className="ll">Mark Price</p>
        <p className="lr">${numberWithCommas(Bignumber(data.average_price).div(10 ** 9).toFixed(2))}</p>
      </div>
      <div className="line">
        <p className="ll">Entry Price</p>
        <p className="lr">${numberWithCommas(symbolPrice.price)}</p>
      </div>
      <div className="line">
        <p className="ll">Liq. Price</p>
        <p className="lr">${numberWithCommas(liqPirce.div(10 ** 9).toFixed(2))}</p>
      </div>
      <div className="line-hr"></div>
      <div className="line">
        <p className="ll">Size</p>
        <p className="lr">{fromToken.size ? `\$${numberWithCommas(Bignumber(fromToken.size).div(10 ** 9).toFixed(2))}` : '-'}</p>
      </div>
      <div className="line">
        <p className="ll">Collaterlal({fromToken.symbol})</p>
        <p className="lr">{fromToken.value ? `\$${numberWithCommas(Bignumber(fromToken.value).multipliedBy(symbolPrice.price).toFixed(2))}` : '-'}</p>
      </div>
      <div className="line">
        <p className="ll">PnL</p>
        <p className="lr">{pnlPrice.div(10 ** 9).toFixed(2).indexOf('-') > -1 ? pnlPrice.div(10 ** 9).toFixed(2).replace('-', '-$') : `\$${pnlPrice.div(10 ** 9).toFixed(2)}`}({pnl}%)</p>
      </div>
      <div className="line">
        <p className="ll">Fees</p>
        <p className="lr">{fromToken.value ? `\$${Bignumber(fromToken.value).multipliedBy(symbolPrice.price).multipliedBy(0.001).toFixed(2)}` : '-'}</p>
      </div>
      <div className="line-hr"></div>
      <div className="line">
        <p className="ll">Receive</p>
        <p className="lr">
          {toToken.value} {toToken.symbol}
          (${Bignumber(toToken.price).multipliedBy(toToken.value).toFixed(2)})
        </p>
      </div>

      <div>
        <button className='btn' onClick={decrease_position} disabled={btnInfo.state > 0 || loading}>
          {loading ? <Loading /> : btnInfo.text}
        </button>
      </div>
    </TurbosDialog>
  )
}

function AddAndRemoveMarginTurbosDialog(props: TurbosDialogProps) {
  const { open, onClose, data } = props;

  const {
    account,
    network,
    adapter
  } = useSuiWallet();

  const { changeRefreshTime, refreshTime } = useRefresh();
  const { toastify } = useToastify();

  const { allSymbolPrice } = useAllSymbolPrice();
  const { allPool } = useAllPool();
  const { allSymbolBalance } = useAllSymbolBalance(account);

  const [loading, setLoading] = useState(false);
  const [tabActive, setTabActive] = useState(0);
  const [btnInfo, setBtnInfo] = useState({ state: 1, text: 'Enter a amount' });

  const [fromToken, setFromToken] = useState({ symbol: '', value: '', price: '0', size: '', balance: '' });
  const [toToken, setToToken] = useState({ symbol: '', value: '0.00', price: '0', size: '', balance: '' });

  const [afterData, setAfterData] = useState({ margin: '', leverage: '', liqPrice: '' })

  useEffect(() => {
    if (network && data && open) {
      if (!fromToken.value) {
        setBtnInfo({ state: 1, text: 'Enter a amount' })
      } else if (Bignumber(fromToken.value).minus(fromToken.balance).isGreaterThan(0)) {
        setBtnInfo({ state: 2, text: `Insufficient ${fromToken.symbol} balance` });
      } else if (Bignumber(afterData.leverage).minus(1.1).isLessThan(0)) {
        setBtnInfo({ state: 3, text: `Min leverage :  1.1x` });
      } else if (Bignumber(afterData.leverage).minus(30).isGreaterThan(0)) {
        setBtnInfo({ state: 3, text: `Max leverage :  30.0x` });
      } else {
        setBtnInfo({ state: 0, text: 'Approve' });
      }
    }
  }, [fromToken, network, data, open, allPool, afterData]);

  useEffect(() => {
    if (data && network && open) {
      if (data.collateral_pool_address) {
        const symbol = findContractConfigCoinSymbol(network, data.collateral_pool_address, 'PoolObjectId');
        const _allSymbolBalance = allSymbolBalance[symbol as SymbolType];
        const _allSymbolPrice = allSymbolPrice[symbol as SymbolType];
        const price = _allSymbolPrice.originalPrice;
        const balance = _allSymbolBalance.balance;

        setFromToken({
          ...fromToken,
          symbol: symbol || '',
          price: price || '0',
          balance: !tabActive ? balance : Bignumber(data.collateral).div(price).toFixed()
        })
      }
    }
  }, [data, allSymbolPrice, network, open, allSymbolBalance, tabActive]);

  useEffect(() => {
    if (fromToken.value && data) {
      const size = Bignumber(fromToken.value).multipliedBy(fromToken.price);
      const afterMargin = !tabActive ? size.plus(data.collateral) : Bignumber(data.collateral).minus(size);
      const afterLeveage = Bignumber(data.size).div(afterMargin);
      const afterLiqPrice = Bignumber(data.average_price).minus(Bignumber(data.average_price).div(afterLeveage));

      setAfterData({
        margin: afterMargin.div(10 ** 9).toFixed(2),
        leverage: afterLeveage.isGreaterThan(0) ? afterLeveage.toFixed(1) : '0',
        liqPrice: afterLiqPrice.isGreaterThan(0) ? afterLiqPrice.div(10 ** 9).toFixed(2) : '0.00'
      });
    } else {
      setAfterData({ margin: '', leverage: '', liqPrice: '' })
    }
  }, [fromToken, data, tabActive]);


  if (!network || !account || !open || !data) {
    return null;
  }

  const changeTabActive = (value: number) => {
    setTabActive(value);
    setFromToken({
      ...fromToken,
      value: '',
    });
  }

  const changeClose = () => {
    onClose();
    setFromToken({
      ...fromToken,
      value: '',
    });
  }

  const changeMax = () => {
    setFromToken({
      ...fromToken,
      value: fromToken.balance,
    });
  }

  const changeValue = (e: any) => {
    setFromToken({
      ...fromToken,
      value: e.target.value,
    });
  }

  const increase_position = async () => {
    if (network && account) {
      setLoading(true);

      const symbol = findContractConfigCoinSymbol(network, data.index_pool_address, 'PoolObjectId');
      const config = contractConfig[network as NetworkType];
      const toSymbolConfig = getContractConfigCoinSymbol(network, symbol);
      const fromSymbolConfig = getContractConfigCoinSymbol(network, fromToken.symbol);

      const fromType = fromSymbolConfig?.Type === '0x0000000000000000000000000000000000000002::sui::SUI' ? '0x2::sui::SUI' : fromSymbolConfig?.Type;
      const coinBalance = await provider.getCoinBalancesOwnedByAddress(account, fromType);
      const amount = Bignumber(fromToken.value).multipliedBy(10 ** 9).toNumber();
      const balanceResponse = Coin.selectCoinSetWithCombinedBalanceGreaterThanOrEqual(coinBalance, BigInt(amount));
      const balanceObjects = balanceResponse.map((item) => Coin.getID(item));

      let argumentsVal: (string | number | boolean | BigInt | string[])[] = [
        config.VaultObjectId,
        balanceObjects,
        Bignumber(fromToken.value).multipliedBy(10 ** 9).toNumber(),
        data.collateral_pool_address,
        data.index_pool_address,
        config.PriceFeedStorageObjectId,
        config.PositionsObjectId,
        data.is_long ? true : false,
        0,
        Bignumber(Bignumber(allSymbolPrice[symbol].originalPrice).multipliedBy(data.is_long ? 1.01 : 0.99).toFixed(0)).toNumber(),
        config.TimeOracleObjectId
      ];

      let typeArgumentsVal: (string | undefined)[] = [
        fromSymbolConfig?.Type,
        toSymbolConfig?.Type
      ];

      try {
        let executeTransactionTnx = await adapter.executeMoveCall({
          packageObjectId: config.ExchangePackageId,
          module: 'exchange',
          function: 'increase_position',
          typeArguments: typeArgumentsVal,
          arguments: argumentsVal,
          gasBudget: 10000
        });

        if (executeTransactionTnx.error) {
          toastify(executeTransactionTnx.error.msg, 'error');
        } else {
          if (executeTransactionTnx.data) {
            executeTransactionTnx = executeTransactionTnx.data;
          }

          const effects = getTransactionEffects(executeTransactionTnx);
          const digest = getTransactionDigest(executeTransactionTnx);

          if (effects?.status.status === 'success') {
            toastify(<Explorer message={`Request increase of ${fromToken.symbol} ${data.is_long ? 'Long' : 'Short'} by ${toToken.value} ${toToken.symbol}.`} type="transaction" digest={digest} />);
            changeClose();
            changeRefreshTime(); // reload data
          } else {
            toastify(<Explorer message={'Execute Transaction error!'} type="transaction" digest={digest} />, 'error');
          }
        }
      } catch (err: any) {
        toastify(err.message || err, 'error');
      }

      setLoading(false);
    }
  }

  const decrease_position = async () => {
    if (network && account && adapter) {
      setLoading(true);

      const symbol = findContractConfigCoinSymbol(network, data.index_pool_address, 'PoolObjectId');

      const config = contractConfig[network as NetworkType];

      const toSymbolConfig = getContractConfigCoinSymbol(network, symbol);
      const fromSymbolConfig = getContractConfigCoinSymbol(network, fromToken.symbol);

      let argumentsVal: (string | number | boolean | string[])[] = [
        config.VaultObjectId,
        data.collateral_pool_address,
        data.index_pool_address,
        config.PriceFeedStorageObjectId,
        config.PositionsObjectId,
        Bignumber(Bignumber(fromToken.value).multipliedBy(fromToken.price).toFixed(0)).toNumber(),
        data.is_long ? true : false,
        Bignumber(fromToken.size).toNumber(),
        Bignumber(Bignumber(allSymbolPrice[symbol].originalPrice).multipliedBy(!tabActive ? 1.01 : 0.99).toFixed(0)).toNumber(),
        account,
        config.TimeOracleObjectId
      ];

      let typeArgumentsVal: (string | undefined)[] = [
        fromSymbolConfig?.Type,
        toSymbolConfig?.Type
      ];

      try {
        let executeTransactionTnx = await adapter.executeMoveCall({
          packageObjectId: config.ExchangePackageId,
          module: 'exchange',
          function: 'decrease_position',
          typeArguments: typeArgumentsVal,
          arguments: argumentsVal,
          gasBudget: 10000
        });

        if (executeTransactionTnx.error) {
          toastify(executeTransactionTnx.error.msg, 'error');
        } else {
          if (executeTransactionTnx.data) {
            executeTransactionTnx = executeTransactionTnx.data;
          }

          const effects = getTransactionEffects(executeTransactionTnx);
          const digest = getTransactionDigest(executeTransactionTnx);

          if (effects?.status.status === 'success') {
            toastify(<Explorer message={`Request decrease of ${fromToken.symbol} ${data.is_long ? 'Long' : 'Short'} by ${toToken.value} ${toToken.symbol}.`} type="transaction" digest={digest} />);
            changeClose();
            changeRefreshTime(); // reload data
          } else {
            toastify(<Explorer message={'Execute Transaction error!'} type="transaction" digest={digest} />, 'error');
          }
        }
      } catch (err: any) {
        toastify(err.message || err, 'error');
      }

      setLoading(false);
    }
  }

  const approve = () => {
    !tabActive ? increase_position() : decrease_position();
  }

  const supplyTradeToken = findsupplyTokenSymbol(fromToken.symbol);

  const leverage = Bignumber(data.size).div(data.collateral)
  const differencePrice = Bignumber(data.average_price).div(leverage);
  const liqPirce = data.is_long ?
    Bignumber(data.average_price).minus(differencePrice)
    :
    Bignumber(data.average_price).plus(differencePrice);


  return (
    <TurbosDialog open={open} title={`Edit ${data.is_long ? 'Long' : 'Short'} ${fromToken.symbol}`} onClose={changeClose}>
      <div className='tabs'>
        <div className={tabActive === 0 ? 'active' : ''} onClick={() => { changeTabActive(0) }}>
          <span>Add Margin</span>
        </div>
        <div className={tabActive === 1 ? 'active' : ''} onClick={() => { changeTabActive(1) }}>
          <span>Remove Margin</span>
        </div>
      </div >

      <div className="section section-marbottom">
        <div className="sectiontop">
          <span>Pay</span>
          <div>
            <span className="section-balance">Balance: {fromToken.balance}</span>
            <span> | </span><span className='section-max' onClick={changeMax}>MAX</span>
          </div>
        </div>
        <div className="sectionbottom">
          <div className="sectioninputcon" >
            <input type="number" value={fromToken.value} className="sectioninput" placeholder="0.0" onChange={changeValue} />
          </div>
          <div className="sectiontokens">
            <img src={supplyTradeToken?.icon} alt="" />
            <span>{fromToken.symbol}</span>
          </div>
        </div>
      </div>

      <div className="line line-top-16">
        <p className="ll">Total</p>
        <p className="lr">
          ${numberWithCommas(bignumberDivDecimalFixed(Bignumber(data.size)))}
        </p>
      </div>
      <div className="line">
        <p className="ll">Margin</p>
        <p className="lr">
          ${numberWithCommas(bignumberDivDecimalFixed(Bignumber(data.collateral)))}
          {afterData.margin && ` → \$${afterData.margin}`}
        </p>
      </div>
      <div className="line">
        <p className="ll">Leverage</p>
        <p className="lr">
          {Bignumber(data.size).div(data.collateral).toFixed(1)}x
          {afterData.leverage && ` → ${afterData.leverage}x`}
        </p>
      </div>
      <div className="line">
        <p className="ll">Mark Price</p>
        <p className="lr"> ${numberWithCommas(Bignumber(data.average_price).div(10 ** 9).toFixed(2))}</p>
      </div>
      <div className="line">
        <p className="ll">Liq. Price</p>
        <p className="lr">
          ${numberWithCommas(liqPirce.div(10 ** 9).toFixed(2))}
          {afterData.liqPrice && ` → \$${afterData.liqPrice}`}
        </p>
      </div>
      <div className="line">
        <p className="ll">Execution Fees</p>
        <p className="lr">-</p>
      </div>
      <div>
        <button className='btn' onClick={approve} disabled={btnInfo.state > 0 || loading}>
          {loading ? <Loading /> : btnInfo.text}
        </button>
      </div>
    </TurbosDialog >
  )
}

function ShareTurbosDialog() {
  return (
    <TurbosDialog open={false} title={`Share Position`}>
      <div className='share-logo'>
        <img src="" height={32} />
      </div>
      <div className='share-position'>
        LONG | 4.60x AVAX USD
      </div>
      <div className='share-price'>
        <div>
          <p>Entry Price</p>
          <p>$11.11</p>
        </div>
        <div>
          <p>Entry Price</p>
          <p>$11.11</p>
        </div>
      </div>
      <div className='share-url'>
        <div></div>
        <div>https://turbos.finance/</div>
      </div>
      <div className='share-btn'>
        <div className='share-btn-copy'>
          <span>copy</span>
        </div>
        <div className='share-btn-download'>download</div>
        <div className='share-btn-twitter'>twitter</div>
      </div>
    </TurbosDialog>
  )
}

export default Positions;