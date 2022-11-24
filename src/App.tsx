import './App.css';
import './assets/css/Common.css';
import { UseRefreshProvider } from './contexts/refresh';
import { UseSuiWalletProvider } from './contexts/useSuiWallet';

import Router from './router/Router';

function App() {
  return (
    <UseSuiWalletProvider>
      <UseRefreshProvider>
        <Router />
      </UseRefreshProvider>
    </UseSuiWalletProvider>
  );
}

export default App;
