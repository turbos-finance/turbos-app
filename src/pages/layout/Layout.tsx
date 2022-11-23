import { Link, Outlet } from 'react-router-dom';
import Header from './components/header/Header';
import Menus from './components/menus/Menus';
import styles from './Layout.module.css';

function Layout() {
  return (
    <div className={styles['content']}>
      <div className={styles['left']}>
        <Menus />
      </div>

      <div className={styles['right']}>
       <Header/>

        <div className={styles['main']}>
          <Outlet />
        </div>

      </div>
    </div>
  )
}

export default Layout;