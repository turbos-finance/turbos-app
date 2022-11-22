import { Link } from 'react-router-dom';
import styles from './Menus.module.css';
import logo from '../../../../assets/images/logo.png';

function Menus() {
  return (
    <>
      <div className={styles.logo}>
        <Link to='/' ><img src={logo} alt="TURBOS" /></Link>
      </div>
      <div className={styles.nav}>
        <Link to="/trade">

          <span>Trade</span>
        </Link>
        <Link to="/trade">
          <span>Earn</span>
        </Link>
      </div>
      <div>
        <a href='https://twitter.com/Turbos_finance' className={styles.link} target='_blank' rel="noreferrer">
          {/* <TwitterIcon sx={{ color: '#000000', fontSize: 36 }} /> */}
          <span>Twitter</span>
        </a>
        <a href='https://t.me/TurbosFinance' className={styles.link} target='_blank' rel="noreferrer">
          {/* <img src={DiscordIcon} alt="" height={30} /> */}
          {/* <TelegramIcon sx={{ color: '#000000', fontSize: 40 }} /> */}
          <span>Telegram</span>
        </a>
        <a href='https://medium.com/@turbos' className={styles.link} target='_blank' rel="noreferrer">
          {/* <img src={MediumIcon} alt="" height={36} /> */}
          <span>Medium</span>
        </a>
        <a href='https://turbos.gitbook.io/turbos/' className={styles.link} target='_blank' rel="noreferrer">
          {/* <img src={GitbookIcon} alt="" height={30} /> */}
          <span>Gitbook</span>
        </a>
        <a href='https://github.com/turbos-finance' className={styles.link} target='_blank' rel="noreferrer">
          {/* <GitHubIcon sx={{ color: '#000000', fontSize: 38 }} /> */}
          <span>GitHub</span>
        </a>
      </div>
      <div>
        <div>

        </div>
        <div>
          TURBOS.FINANCE<br />
          ©2022
        </div>
      </div>
    </>
  )
}

export default Menus;