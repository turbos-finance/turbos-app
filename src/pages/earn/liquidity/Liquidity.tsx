import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import TlpText from "../../../components/tlpText/TlpText";
import styles from './Liquidity.module.css';

import downIcon from '../../../assets/images/down.png';
import upIcon from '../../../assets/images/up.png';
import suiIcon from '../../../assets/images/ic_sui_40.svg';

import TurbosTooltip from "../../../components/UI/Tooltip/Tooltip";
import Dropdown from "rc-dropdown";
import Menu, { Item as MenuItem } from 'rc-menu';
import { supplyTokens } from '../../../config/tokens';
import { usePool } from "../../../hooks/usePool";
import { useSymbolPrice } from "../../../hooks/useSymbolPrice";
import { useSuiWallet } from "../../../contexts/useSuiWallet";
import { useCoinBalance } from "../../../hooks/useCoinBalance";
import Bignumber from 'bignumber.js';
import { numberWithCommas } from "../../../utils";

function Liquidity() {
  const [visible, setVisible] = useState<Boolean[]>([]);

  const visibleChange = (index: number, value: boolean) => {
    const newVisible = [...visible]
    newVisible[index] = value;
    setVisible(newVisible)
  }

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
            supplyTokens.map((item: any, index: number) => <TrLiquidity key={index} item={item} />)
          }
        </tbody>
      </table>


      {
        supplyTokens.map((item: any, index: number) => {
          const menu = (
            <Menu className="overlay-dropdown-ul">
              <MenuItem>
                <a href={`https://explorer.sui.io/addresses/${item.address}`} rel="noreferrer" target='_blank' className="overlay-dropdown-li">
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
                <p className="lr lr-right">$312,865,072,578,130 <br></br> (20,000,000,000 )</p>
              </div>
              <div className="line">
                <p className="ll">Max Pool Capacity:</p>
                <p className="lr">$100,000,000</p>
              </div>
            </>
          )
          return (
            <div className="container mobile-container" key={index}>
              <div className="line-con">
                <div className={styles['liquidity']}>
                  <div className={styles['liquidity-img']}><img src={item.icon} alt='' /></div>
                  <div className={styles['liquidity-info']}>
                    <div className={styles['liquidity-name']}>
                      <span>{item.name}</span>
                      <Dropdown overlay={menu} trigger={['click']} overlayClassName={'overlay-dropdown menus-dropdown'} onVisibleChange={(visible: boolean) => (visibleChange(index, visible))}>
                        <img src={visible[index] ? upIcon : downIcon} alt='' />
                      </Dropdown>
                    </div>
                    <div className={styles['liquidity-token']}>{item.token}</div>
                  </div>
                </div>
                <div className="line">
                  <div className="ll">PRICE</div>
                  <div className="lr">$15,384.93	</div>
                </div>
                <div className="line">
                  <div className="ll">
                    <TurbosTooltip title={<div className="tooltip">Available amount to deposit into TLP.</div>}>
                      <span className="underline">Available</span>
                    </TurbosTooltip>
                  </div>
                  <div className="lr">
                    <TurbosTooltip title={tooltipTitle}>
                      <span className="underline">{item.available}</span>
                    </TurbosTooltip>
                  </div>
                </div>
                <div className="line">
                  <div className="ll">WALLET</div>
                  <div className="lr">0.00 BTC ($0.00)	</div>
                </div>
                <div className="line">
                  <div className="ll">FEES</div>
                  <div className="lr">-</div>
                </div>
                <div className="line">
                  <div className="ll"></div>
                  <div className="lr">
                    <div className={styles['liquidity-btn']}>
                      <Link to="/earn/buy-sell">Buy with {item.token}</Link>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )
        })
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

  const { account } = useSuiWallet();

  const { pool } = usePool(item.symbol);
  const { symbolPrice } = useSymbolPrice(item.symbol);
  const { coinBalance } = useCoinBalance(account, item.symbol);

  const menu = (
    <Menu className="overlay-dropdown-ul">
      <MenuItem>
        <a href={`https://explorer.sui.io/object/${pool.poolAddress}`} rel="noreferrer" target='_blank' className="overlay-dropdown-li" onClick={() => { setVisible(false) }}>
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
        <p className="lr lr-right">{pool.tusd_amounts || 0} <br></br> ({pool.coin_amounts || 0} {item.symbol})</p>
      </div>
      <div className="line">
        <p className="ll">Max Pool Capacity:</p>
        <p className="lr">${pool.max_tusd_amounts || 0}</p>
      </div>
    </>
  );

  // console.log(symbolPrice.price,Bignumber(symbolPrice.price || '0.00').toNumber());
  // console.log(Bignumber(coinBalance).toNumber(),Bignumber(symbolPrice.price ? symbolPrice.price : 0).toNumber());

  return (
    <tr>
      <td align="left">
        <div className={styles['liquidity']}>
          <div className={styles['liquidity-img']}><img src={item.icon} alt='' /></div>
          <div className={styles['liquidity-info']}>
            <div className={styles['liquidity-name']}>
              <span>{item.name}</span>
              <Dropdown overlay={menu} trigger={['click']} overlayClassName={'overlay-dropdown menus-dropdown'} onVisibleChange={(visible: boolean) => (setVisible(visible))}>
                <img src={visible ? upIcon : downIcon} alt='' />
              </Dropdown>
            </div>
            <div className={styles['liquidity-token']}>{item.symbol}</div>
          </div>
        </div>
      </td>
      <td align="right">${symbolPrice.price}</td>
      <td align="right">
        <TurbosTooltip title={tooltipTitle}>
          <span className="underline">${pool.available}</span>
        </TurbosTooltip>
      </td>
      <td align="right">{coinBalance || 0} {item.symbol} (${numberWithCommas(Bignumber(coinBalance).multipliedBy(Bignumber(symbolPrice.price || 0).toNumber()).toFixed(2)) || 0})</td>
      <td align="right">{pool.fee_reserves || '0.00'}%</td>
      <td align="right">
        <div className={styles['liquidity-btn']}>
          <Link to="/earn/buy-sell">Buy with {item.symbol}</Link>
        </div>
      </td>
    </tr>
  )
}


function MobileTrLiquidity(props: TrLiquidityProps) {
  const { item } = props;
  const menu = (
    <Menu className="overlay-dropdown-ul">
      <MenuItem>
        <a href={`https://explorer.sui.io/object/${item.address}`} rel="noreferrer" target='_blank' className="overlay-dropdown-li">
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
        <p className="lr lr-right">$312,865,072,578,130 <br></br> (20,000,000,000 )</p>
      </div>
      <div className="line">
        <p className="ll">Max Pool Capacity:</p>
        <p className="lr">$100,000,000</p>
      </div>
    </>
  )
  return (
    <div>123123</div>
  )
}


export default Liquidity;