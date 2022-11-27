import { Link } from "react-router-dom";
import { useState } from "react";
import TlpText from "../../../components/tlpText/TlpText";
import styles from './Liquidity.module.css';

import ethereumIcon from '../../../assets/images/ethereum.png';
import btcIcon from '../../../assets/images/ic_usdc_40.svg';
import usdcIcon from '../../../assets/images/ic_btc_40.svg';

import downIcon from '../../../assets/images/down.png';
import upIcon from '../../../assets/images/up.png';
import suiIcon from '../../../assets/images/ic_sui_40.svg';

import TurbosTooltip from "../../../components/UI/Tooltip/Tooltip";
import Dropdown from "rc-dropdown";
import Menu, { Item as MenuItem } from 'rc-menu';


const data = [
  {
    icon: btcIcon,
    token: 'BTC',
    name: 'Bitcoin',
    price: '$15,384.93',
    available: '$99,968,269.72',
    wallet: '0.00 BTC ($0.00)',
    fee: '-',
    address: ''
  },
  {
    icon: ethereumIcon,
    token: 'ETH',
    name: 'Ethereum',
    price: '$1,080.02',
    available: '$149,896,890.29',
    wallet: '0.00 ETH ($0.00)',
    fee: '-',
    address: ''
  },
  {
    icon: usdcIcon,
    token: 'USDC',
    name: 'USD Coin',
    price: '$1.02',
    available: '$19,896,890.29',
    wallet: '0.00 USDC ($0.00)',
    fee: '-',
    address: ''
  }
];

function Liquidity() {
  const [visible, setVisible] = useState<Boolean[]>([]);

  const visibleChange = (index: number, value: boolean) => {
    const newVisible = [...visible]
    newVisible[index] = value;
    setVisible(newVisible)
  }

  const tooltipTitle = (
    <>
      <div className="line linetop">
        <p className="ll">Current Pool Amount:</p>
        <p className="lr lr-right">$312,865,072,578,130 <br></br> (20,000,000,000 BTC)</p>
      </div>
      <div className="line">
        <p className="ll">Max Pool Capacity:</p>
        <p className="lr">$100,000,000</p>
      </div>
    </>
  )

  return (
    <>
      <table width='100%' className={styles.table}>
        <thead>
          <tr>
            <th align="left">token</th>
            <th align="right">price</th>
            <th align="right">
              <TurbosTooltip title={<div className="tooltip">Available amount to deposit into GLP.</div>}>
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
            data.map((item: any, index: number) => {
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
                    <p className="lr lr-right">$312,865,072,578,130 <br></br> (20,000,000,000 BTC)</p>
                  </div>
                  <div className="line">
                    <p className="ll">Max Pool Capacity:</p>
                    <p className="lr">$100,000,000</p>
                  </div>
                </>
              )

              return (
                <tr key={index}>
                  <td align="left">
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
                  </td>
                  <td align="right">{item.price}</td>
                  <td align="right">
                    <TurbosTooltip title={tooltipTitle}>
                      <span className="underline">{item.available}</span>
                    </TurbosTooltip>
                  </td>
                  <td align="right">{item.wallet}</td>
                  <td align="right">-</td>
                  <td align="right">
                    <div className={styles['liquidity-btn']}>
                      <Link to="/earn/buy-sell">Buy with {item.token}</Link>
                    </div>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>




      {
        data.map((item: any, index: number) => {
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
                <p className="lr lr-right">$312,865,072,578,130 <br></br> (20,000,000,000 BTC)</p>
              </div>
              <div className="line">
                <p className="ll">Max Pool Capacity:</p>
                <p className="lr">$100,000,000</p>
              </div>
            </>
          )
          return (
            <div className="container mobile-container">
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
                    <TurbosTooltip title={<div className="tooltip">Available amount to deposit into GLP.</div>}>
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

export default Liquidity;