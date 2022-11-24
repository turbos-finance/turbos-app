import { Link, Outlet, useLocation } from "react-router-dom";
import styles from './Trade.module.css';

type routerType = {
  url: string,
  name: string,
}

const routes: routerType[] = [
  {
    url: '/trade/perpetual',
    name: 'Perpetual'
  },
  {
    url: '/trade/swap',
    name: 'Swap'
  },
]

function Trade() {
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

export default Trade;