import { Link, Outlet } from 'react-router-dom';
import SuiWalletButton from '../../components/walletButton/WalletButton';
import Menus from './components/menus/Menus';
import styles from './Layout.module.css';

function Layout() {
  return (
    <div className={styles['content']}>
      <div className={styles['left']}>
        <Menus />
      </div>

      <div className={styles['right']}>
        <div className={styles['header']}>
          <SuiWalletButton />
        </div>

        <div className={styles['main']}>
          <div className={styles.menus}>
            <Link to="/trade">Perpetual</Link>
            <Link to="/trade">Swap</Link>
          </div>
          <Outlet />
        </div>
        
      </div>
    </div>
  )
}

export default Layout;