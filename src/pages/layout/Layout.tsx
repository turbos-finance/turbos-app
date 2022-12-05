import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import Header from './components/header/Header';
import Menus from './components/menus/Menus';
import styles from './Layout.module.css';

function Layout() {
  const [show, setShow] = useState(false);

  const toggleShow = () => {
    setShow(!show);
  }

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