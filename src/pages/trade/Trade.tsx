import { Link, Outlet } from "react-router-dom";
import styles from './Trade.module.css';

function Trade() {
  return (
    <>
      <div className={styles.menus}>
        <Link to="/trade/perpetual" className={styles.active}>Perpetual</Link>
        <Link to="/trade/swap">Swap</Link>
      </div>
      <Outlet />
    </>
  )
}

export default Trade;