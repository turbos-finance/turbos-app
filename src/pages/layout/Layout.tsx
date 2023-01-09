import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useRefresh } from '../../contexts/refresh';
import { useStore } from '../../contexts/store';
import { useSuiWallet } from '../../contexts/useSuiWallet';
import { useAllPool } from '../../hooks/usePool';
import { useAllSymbolBalance } from '../../hooks/useSymbolBalance';
import { useAllSymbolPrice } from '../../hooks/useSymbolPrice';
import { useVault } from '../../hooks/useVault';

import Header from './components/header/Header';
import Menus from './components/menus/Menus';
import styles from './Layout.module.css';

function Layout() {
  const [show, setShow] = useState(false);
  const toggleShow = () => {
    setShow(!show);
  }

  const { account } = useSuiWallet();
  const { changeStore } = useStore();
  // const { changeRefreshTime } = useRefresh();
  // const location = useLocation();
  const { vault } = useVault();
  const { allPool } = useAllPool();
  const { allSymbolPrice } = useAllSymbolPrice();
  const { allSymbolBalance } = useAllSymbolBalance(account);

  useEffect(() => {
    if (vault) {
      changeStore({ vault });
    }
  }, [vault]);

  useEffect(() => {
    if (allPool) {
      changeStore({ allPool });
    }
  }, [allPool]);

  useEffect(() => {
    if (allSymbolPrice) {
      changeStore({ allSymbolPrice });
    }
  }, [allSymbolPrice]);

  useEffect(() => {
    changeStore({ allSymbolBalance });
  }, [allSymbolBalance]);

  // useEffect(() => {
  //   changeRefreshTime();
  // }, [location.pathname]);

  return (
    <div className={!show ? styles['content'] : styles['contenthide']}>
      <Menus toggleShow={toggleShow} show={show} />

      <div className={styles['right']}>
        <div className={styles['right-content']}>
          <Header />
          <div className={styles['main']}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout;