import { Link, Outlet, useLocation } from "react-router-dom";

type routerType = {
  url: string,
  name: string,
}

const routes: routerType[] = [
  {
    url: '/earn/buy-sell',
    name: 'Buy / Sell'
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
      <div className="menus-tabs">
        {
          routes.map((item: routerType) => (
            <Link to={item.url} key={item.url} className={location.pathname.indexOf(item.url) > -1 ? "active" : ''}>{item.name}</Link>
          ))
        }
      </div>
      <Outlet />
    </>
  )
}

export default Earn;