import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import BuySell from '../pages/earn/buySell/BuySells';
import Earn from '../pages/earn/Earn';
import Liquidity from '../pages/earn/liquidity/Liquidity';
import Faucet from '../pages/faucet/Faucet';
import Layout from '../pages/layout/Layout';
import Perpetual from '../pages/trade/perpetual/Perpetual';
import Swap from '../pages/trade/swap/Swap';
import Trade from '../pages/trade/Trade';

function Router() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Layout />} >
          <Route path="" element={<Navigate to="/trade/perpetual" />} id="home" />

          <Route path="trade" element={<Trade />} id="trade">
            <Route path="" element={<Navigate to="/trade/perpetual" />} id="trade" />
            <Route path="perpetual" element={<Perpetual />} id="perpetual" />
            <Route path="swap" element={<Swap />} id="swap" />
          </Route>


          <Route path="earn" element={<Earn />}>
            <Route path="" element={<Navigate to="/earn/buy-sell" />} id="earn" />
            <Route path="buy-sell" element={<BuySell />} id="buy-sell"></Route>
            <Route path="liquidity" element={<Liquidity />} id="liquidity"></Route>
          </Route>

          <Route path="faucet" element={<Faucet />}>

          </Route>

        </Route>

        <Route path="*" element={<Navigate to="/trade/perpetual" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router;