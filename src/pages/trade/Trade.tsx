import { Link, Outlet, useLocation } from "react-router-dom";

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

export default Trade;