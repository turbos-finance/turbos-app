import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { cssTransition, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import '../../assets/css/resettoast.css';

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

      <ToastContainer
        limit={1}
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        theme="light"
      />
    </div>
  )
}

export default Layout;