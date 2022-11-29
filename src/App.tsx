import './App.css';
import './assets/css/Common.css';
import './assets/css/Btn.css';
import './assets/css/Media.css';
import { UseRefreshProvider } from './contexts/refresh';
import { UseSuiWalletProvider } from './contexts/useSuiWallet';
import { UseToastifyProvider } from './contexts/toastify';

import Router from './router/Router';
import { UseStoreProvider } from './contexts/store';

function App() {
  return (
    <UseStoreProvider>
      <UseToastifyProvider>
        <UseSuiWalletProvider>
          <UseRefreshProvider>
            <Router />
          </UseRefreshProvider>
        </UseSuiWalletProvider>
      </UseToastifyProvider>
    </UseStoreProvider>
  );
}

export default App;
