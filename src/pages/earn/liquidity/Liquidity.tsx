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

  return (
    <>
      <table width='100%' className={styles.table}>
        <thead>
          <tr>
            <th align="left">token</th>
            <th align="right">price</th>
            <th align="right">
              <TurbosTooltip />
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
                  <td align="right">{item.available}</td>
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

      <TlpText></TlpText>
    </>
  )
}

export default Liquidity;