import { Link } from "react-router-dom";
import React, { useState } from "react";
import TlpText from "../../../components/tlpText/TlpText";
import styles from './Liquidity.module.css';

import downIcon from '../../../assets/images/down.png';
import upIcon from '../../../assets/images/up.png';
import suiIcon from '../../../assets/images/ic_sui_40.svg';

import TurbosTooltip from "../../../components/UI/Tooltip/Tooltip";
import Dropdown from "rc-dropdown";
import Menu, { Item as MenuItem } from 'rc-menu';
import { supplyTokens } from '../../../config/tokens';
import Bignumber from 'bignumber.js';
import { numberWithCommas } from "../../../utils";
import { setLocalStorage, TurbosBuySell, TurbosBuySellActive } from "../../../lib";
import { useStore } from "../../../contexts/store";

function Liquidity() {
  return (
    <>
      <table width='100%' className={styles.table}>
        <thead>
          <tr>
            <th align="left">token</th>
            <th align="right">price</th>
            <th align="right">
              <TurbosTooltip title={<div className="tooltip">Available amount to deposit into TLP.</div>}>
                <span className="underline">Available</span>
              </TurbosTooltip>
            </th>
            <th align="right">wallet</th>
            <th align="right">fees</th>
            <th align="right"></th>
          </tr>
        </thead>

        <tbody>
          {
            supplyTokens.map((item: any, index: number) =>
              <TrLiquidity
                key={index}
                item={item}
              />
            )
          }
        </tbody>
      </table>
      {
        supplyTokens.map((item: any, index: number) => <MobileTrLiquidity key={index} item={item} />)
      }
      <TlpText></TlpText>
    </>
  )
}

type TrLiquidityProps = {
  item: any,
}

function TrLiquidity(props: TrLiquidityProps) {

  const { item } = props;
  const [visible, setVisible] = useState(false);

  const { store } = useStore();
  const pool = store.allPool ? store.allPool[item.symbol] : {};
  const symbolPrice = store.allSymbolPrice ? store.allSymbolPrice[item.symbol] : {};
  const coinBalance = store.allSymbolBalance ? store.allSymbolBalance[item.symbol] : {};

  const linkTo = (symbol: string) => {
    setLocalStorage(TurbosBuySellActive, '0');
    setLocalStorage(TurbosBuySell, symbol);
  }

  const menu = (
    <Menu className="overlay-dropdown-ul">
      <MenuItem>
        <a href={`https://explorer.sui.io/object/${pool.poolDataObjectId}`} rel="noreferrer" target='_blank' className="overlay-dropdown-li" onClick={() => { setVisible(false) }}>
          <img src={suiIcon} alt="" height={24} />
          <span>View in Explorer</span>
        </a>
      </MenuItem>
    </Menu>
  );

  const tooltipTitle = (
    <>
      <div className="line linetop">
        <p className="ll">Current Pool Amount:</p>
        <p className="lr lr-right">${pool.turbos_tusd_amounts || 0} <br></br> ({pool.turbos_coin_amounts || 0} {item.symbol})</p>
      </div>
      <div className="line">
        <p className="ll">Max Pool Capacity:</p>
        <p className="lr">${pool.turbos_max_tusd_amounts || 0}</p>
      </div>
    </>
  );


  return (
    <tr>
      <td align="left">
        <div className={styles['liquidity']}>
          <div className={styles['liquidity-img']}><img src={item.icon} alt='' /></div>
          <div className={styles['liquidity-info']}>
            <div className={styles['liquidity-name']}>
              <span>{item.name}</span>
              <Dropdown overlay={menu} trigger={['click']}
                overlayClassName={'overlay-dropdown menus-dropdown'}
                onVisibleChange={(visible: boolean) => (setVisible(visible))}
              >
                <img src={visible ? upIcon : downIcon} alt='' />
              </Dropdown>
            </div>
            <div className={styles['liquidity-token']}>{item.symbol}</div>
          </div>
        </div>
      </td>
      <td align="right">${numberWithCommas(symbolPrice.price || '0')}</td>
      <td align="right">
        <TurbosTooltip title={tooltipTitle}>
          <span className="underline">${pool?.turbos_available || '0'}</span>
        </TurbosTooltip>
      </td>
      <td align="right">{coinBalance.balance ? numberWithCommas(coinBalance.balance) : 0} {item.symbol}
        (${numberWithCommas(Bignumber(coinBalance.balance || 0).multipliedBy(Bignumber(symbolPrice.price || 0).toNumber()).toFixed(2))})
      </td>
      <td align="right">${pool.turbos_fee_reserves || '0.00'}</td>
      <td align="right">
        <div className={styles['liquidity-btn']}>
          <Link to="/earn/buy-sell" onClick={() => { linkTo(item.symbol) }}>Buy with {item.symbol}</Link>
        </div>
      </td>
    </tr>
  )
}


function MobileTrLiquidity(props: TrLiquidityProps) {
  const { item } = props;
  const [visible, setVisible] = useState(false);

  const { store } = useStore();
  const pool = store.allPool ? store.allPool[item.symbol] : {};
  const symbolPrice = store.allSymbolPrice ? store.allSymbolPrice[item.symbol] : {};
  const coinBalance = store.allSymbolBalance ? store.allSymbolBalance[item.symbol] : {};

  const linkTo = (symbol: string) => {
    setLocalStorage(TurbosBuySellActive, '0');
    setLocalStorage(TurbosBuySell, symbol);
  }

  const menu = (
    <Menu className="overlay-dropdown-ul">
      <MenuItem>
        <a href={`https://explorer.sui.io/object/${pool.poolDataObjectId}`} rel="noreferrer" target='_blank' className="overlay-dropdown-li" onClick={() => { setVisible(false) }}>
          <img src={suiIcon} alt="" height={24} />
          <span>View in Explorer</span>
        </a>
      </MenuItem>
    </Menu>
  );

  const tooltipTitle = (
    <>
      <div className="line linetop">
        <p className="ll">Current Pool Amount:</p>
        <p className="lr lr-right">${pool.turbos_tusd_amounts || 0} <br></br> ({pool.turbos_coin_amounts || 0} {item.symbol})</p>
      </div>
      <div className="line">
        <p className="ll">Max Pool Capacity:</p>
        <p className="lr">${pool.turbos_max_tusd_amounts}</p>
      </div>
    </>
  );

  return (
    <div className="container mobile-container">
      <div className="line-con">
        <div className={styles['liquidity']}>
          <div className={styles['liquidity-img']}><img src={item.icon} alt='' /></div>
          <div className={styles['liquidity-info']}>
            <div className={styles['liquidity-name']}>
              <span>{item.name}</span>
              <Dropdown overlay={menu} trigger={['click']}
                overlayClassName={'overlay-dropdown menus-dropdown'}
                onVisibleChange={(visible: boolean) => (setVisible(visible))}
              >
                <img src={visible ? upIcon : downIcon} alt='' />
              </Dropdown>
            </div>
            <div className={styles['liquidity-token']}>{item.symbol}</div>
          </div>
        </div>
        <div className="line">
          <div className="ll">PRICE</div>
          <div className="lr">${numberWithCommas(symbolPrice.price)}</div>
        </div>
        <div className="line">
          <div className="ll">
            <TurbosTooltip title={<div className="tooltip">Available amount to deposit into TLP.</div>}>
              <span className="underline">Available</span>
            </TurbosTooltip>
          </div>
          <div className="lr">
            <TurbosTooltip title={tooltipTitle}>
              <span className="underline">${pool.turbos_available}</span>
            </TurbosTooltip>
          </div>
        </div>
        <div className="line">
          <div className="ll">WALLET</div>
          <div className="lr">{coinBalance.balance ? numberWithCommas(coinBalance.balance) : 0} {item.symbol}
            (${numberWithCommas(Bignumber(coinBalance.balance || 0).multipliedBy(Bignumber(symbolPrice.price || 0).toNumber()).toFixed(2))})
          </div>
        </div>
        <div className="line">
          <div className="ll">FEES</div>
          <div className="lr">${pool.turbos_fee_reserves || '0.00'}</div>
        </div>
        <div className="line">
          <div className="ll"></div>
          <div className="lr">
            <div className={styles['liquidity-btn']}>
              <Link to="/earn/buy-sell" onClick={() => { linkTo(item.symbol) }}>Buy with {item.symbol}</Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}


export default Liquidity;