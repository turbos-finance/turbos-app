import { Link, useLocation } from 'react-router-dom';
import styles from './Menus.module.css';

import logosmall from '../../../../assets/images/logosmall.png';
import logo from '../../../../assets/images/logo.png';
import menusIcon from '../../../../assets/images/menus.png';
import menus1Icon from '../../../../assets/images/menus1.png';
import faucetIcon from '../../../../assets/images/faucet.png';
import twitterIcon from '../../../../assets/images/twitter.png';
import telegramIcon from '../../../../assets/images/telegram.png';
import mediumIcon from '../../../../assets/images/medium.png';
import gitbookIcon from '../../../../assets/images/gitbook.png';
import githubIcon from '../../../../assets/images/github.png';
import discordIcon from '../../../../assets/images/discord.png';

import mobilemenusleftIcon from '../../../../assets/images/mobilemenusleft.png';
import mobilemenusrightIcon from '../../../../assets/images/mobilemenusright.png';

type routerType = {
  url: string,
  name: string,
  icon: string
}

const routers: routerType[] = [
  {
    url: '/trade',
    name: 'Trade',
    icon: menusIcon
  },
  {
    url: '/earn',
    name: 'Earn',
    icon: menus1Icon
  },
  // {
  //   url: '/faucet',
  //   name: 'Faucet',
  //   icon: faucetIcon
  // },
];

type MenusProps = {
  show?: boolean,
  toggleShow?: Function
}

function Menus(props: MenusProps) {
  const { show } = props;
  return (
    <div className={!show ? styles.left : styles.left + ' ' + styles.lefthide}>
      <Nav {...props}></Nav>
    </div>
  )
}

type NavProps = {
  toggleDrawer?: Function
} & MenusProps

export function Nav(props: NavProps) {
  const location = useLocation();
  const { show, toggleShow, toggleDrawer } = props;
  return (
    <div className={styles.leftcon}>
      <div>
        <div className={styles.logo}>
          <Link to='/' onClick={() => { toggleDrawer && toggleDrawer() }}>
            <img src={!show ? logo : logosmall} alt="TURBOS" />
          </Link>
        </div>

        <div className={styles.nav}>
          {
            routers.map((item: routerType) => (
              <Link to={item.url} key={item.url} className={location.pathname.indexOf(item.url) > -1 ? styles.active : ''} onClick={() => { toggleDrawer && toggleDrawer() }}>
                <img src={item.icon} alt='' />
                <span>{item.name}</span>
              </Link>
            ))
          }
        </div>
      </div>
      <div>
        <div className={styles.link}>
          <a href='https://twitter.com/Turbos_finance' className={styles.twitter} target='_blank' rel="noreferrer">
            <img src={twitterIcon} alt='' />
            <span>Twitter</span>
          </a>
          <a href='https://t.me/TurbosFinance' className={styles.telegram} target='_blank' rel="noreferrer">
            <img src={telegramIcon} alt='' />
            <span>Telegram</span>
          </a>
          <a href='https://medium.com/@turbos' className={styles.medium} target='_blank' rel="noreferrer">
            <img src={mediumIcon} alt='' />
            <span>Medium</span>
          </a>
          <a href='https://turbos.gitbook.io/turbos/' className={styles.gitbook} target='_blank' rel="noreferrer">
            <img src={gitbookIcon} alt='' />
            <span>Gitbook</span>
          </a>
          <a href='https://github.com/turbos-finance' className={styles.github} target='_blank' rel="noreferrer">
            <img src={githubIcon} alt='' />
            <span>GitHub</span>
          </a>
          <a href='https://t.co/k11LYUR3rv' className={styles.github} target='_blank' rel="noreferrer">
            <img src={discordIcon} alt='' />
            <span>Discord</span>
          </a>
        </div>

        <div className={styles.copyright}>
          ©2022 TURBOS
        </div>

        {/* <div className={styles.mobilemenus} onClick={() => { toggleShow && toggleShow() }}>
          <img src={show ? mobilemenusrightIcon : mobilemenusleftIcon} alt='' />
        </div> */}
      </div>
    </div>
  )
}

export default Menus;