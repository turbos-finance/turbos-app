import { Link, Outlet, useLocation } from "react-router-dom";
import styles from '../trade/Trade.module.css';


type routerType = {
  url: string,
  name: string,
}

const routes: routerType[] = [
  {
    url: '/earn/buy-sell',
    name: 'buy / sell'
  },
  {
    url: '/earn/liquidity',
    name: 'Liquidity'
  },
]


function Earn() {

  const location = useLocation();
  return (
    <>
      <div className={styles.menus}>
        {
          routes.map((item: routerType) => (
            <Link to={item.url} key={item.url} className={location.pathname.indexOf(item.url) > -1 ? styles.active : ''}>{item.name}</Link>
          ))
        }
      </div>
      <Outlet />
    </>
  )
}

export default Earn;