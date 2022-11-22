import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import BuySell from '../pages/earn/buySell/buySell';
// import Earn from '../pages/earn/Earn';
import Liquidity from '../pages/earn/liquidity/Liquidity';
import Layout from '../pages/layout/Layout';
import Perpetual from '../pages/trade/perpetual/Perpetual';
import Swap from '../pages/trade/swap/Swap';

function Router() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Layout />}>
          <Route path="" element={<Navigate to="/trade/perpetual" />} />

          <Route path="trade" element={<Navigate to="/trade/perpetual" />} />

          <Route path="trade/perpetual" element={<Perpetual />} />
          <Route path="trade/swap" element={<Swap />} />

          <Route path="earn" element={<Navigate to="/earn/buy-sell" />} />

          <Route path="earn/buy-sell" element={<BuySell />}></Route>
          <Route path="earn/liquidity" element={<Liquidity />}></Route>

        </Route>

        <Route path="*" element={<Navigate to="/trade/perpetual" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router;