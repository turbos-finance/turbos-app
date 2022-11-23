import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import BuySell from '../pages/earn/buySell/BuySell';
import Earn from '../pages/earn/Earn';
// import Earn from '../pages/earn/Earn';
import Liquidity from '../pages/earn/liquidity/Liquidity';
import Layout from '../pages/layout/Layout';
import Perpetual from '../pages/trade/perpetual/Perpetual';
import Swap from '../pages/trade/swap/Swap';
import Trade from '../pages/trade/Trade';

function Router() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Layout />}>
          <Route path="" element={<Navigate to="/trade/perpetual" />} />

          <Route path="trade" element={<Trade />} >
            <Route path="" element={<Navigate to="/trade/perpetual" />} />
            <Route path="perpetual" element={<Perpetual />} />
            <Route path="swap" element={<Swap />} />
          </Route>


          <Route path="earn" element={<Earn />}>
            <Route path="" element={<Navigate to="/earn/buy-sell" />} />
            <Route path="buy-sell" element={<BuySell />}></Route>
            <Route path="liquidity" element={<Liquidity />}></Route>
          </Route>

        </Route>

        <Route path="*" element={<Navigate to="/trade/perpetual" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router;