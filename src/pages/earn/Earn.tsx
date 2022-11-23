import { Link, Outlet } from "react-router-dom";
import styles from '../trade/Trade.module.css';

function Earn() {
  return (
    <>
      <div className={styles.menus}>
        <Link to="/earn/buy-sell" className={styles.active}>buy / sell</Link>
        <Link to="/earn/liquidity">Liquidity</Link>
      </div>
      <Outlet />
    </>
  )
}

export default Earn;