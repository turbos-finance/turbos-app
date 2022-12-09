import { useMemo, useState } from 'react';
import { useCopyToClipboard } from "react-use";
// import { useSuiWallet, StandardWalletAdapter } from "../../contexts/useWallet/useWallet";
import { useSuiWallet, WalletType } from '../../contexts/useSuiWallet';
import walletIcon from '../../assets/images/wallet.png'
import suietIcon from '../../assets/images/suiet.webp'
import suiIcon from '../../assets/images/suiwallet.svg';
import martiansuiwalletIcon from '../../assets/images/martiansuiwallet.png'
import styles from './WalletButton.module.css';
import TurbosDialog from '../UI/Dialog/Dialog';
import downIcon from '../../assets/images/down.png';
import upIcon from '../../assets/images/up.png';
import copyIcon from '../../assets/images/copy.png';
import explorerIcon from '../../assets/images/explorer.png'
import disconnectIcon from '../../assets/images/disconnect.png'
import walleticonIcon from '../../assets/images/walleticon.png';

import Dropdown from 'rc-dropdown';
import Menu, { Item as MenuItem } from 'rc-menu';
import 'rc-dropdown/assets/index.css';
import { useToastify } from '../../contexts/toastify';
import { supplyWallets, SupplyWalletType } from '../../contexts/useWallet/supplyWallet';


type SuiWalletButtonProps = {
  isButton?: boolean,
  btnClassName?: string
}

function SuiWalletButton(props: SuiWalletButtonProps) {
  const { account, connected, connecting, connect, disconnect } = useSuiWallet();

  const [, copyToClipboard] = useCopyToClipboard();

  const { toastify } = useToastify();

  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  }

  const handleConnect = async (value: WalletType) => {
    connect(value);
    handleOpen();
  }

  const visibleChange = (visible: boolean) => {
    setVisible(visible)
  }

  const menu = (
    <Menu className="overlay-dropdown-ul">
      <MenuItem key="1">
        <div className="overlay-dropdown-li" onClick={() => {
          account && copyToClipboard(account);
          // Toast.success("Address copied to your clipboard");
          toastify('Address copied to your clipboard')
        }}>
          <img src={copyIcon} alt="" height={24} />
          <span>Copy Address</span>
        </div>
      </MenuItem>
      <MenuItem key="2">
        <a href={`https://explorer.sui.io/addresses/${account}`} rel="noreferrer" target='_blank' className="overlay-dropdown-li">
          <img src={explorerIcon} alt="" height={24} />
          <span>View in Explorer</span>
        </a>
      </MenuItem>
      <MenuItem key="3">
        <div className="overlay-dropdown-li" onClick={disconnect}>
          <img src={disconnectIcon} alt="" height={24} />
          <span className={styles.red}>Disconnect</span>
        </div>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      {
        props.isButton ?
          <div className={`btn ${props.btnClassName}`} onClick={handleOpen}>
            Connect Wallet
          </div>
          :
          !connected && !connecting && !account ?
            <div onClick={handleOpen} className={styles.wallet}>
              <img src={walletIcon} alt="" />
              <span>Connect Wallet</span>
            </div> :
            <Dropdown overlay={menu} trigger={['click']} overlayClassName={'overlay-dropdown'} onVisibleChange={visibleChange}>
              <div className={styles.wallet}>
                <img src={walleticonIcon} alt="" style={{ opacity: 1 }} />
                <span>{`${account?.slice(0, 5)}...${account?.slice(account.length - 4, account.length)}`}</span>
                <img src={visible ? upIcon : downIcon} alt="" style={{ marginLeft: '5px' }} />
              </div>
            </Dropdown>
      }

      <TurbosDialog onClose={handleOpen} open={open} title="Connect a Wallet">
        {/* {
          supplyWallets.map((item: SupplyWalletType, index: number) =>
            <div onClick={async () => { connect(item.name) }} className={styles.walletlist} key={index}>
              <span>{item.name}</span>
              <img src={item.icon} alt="" />
            </div>
          )
        } */}
        <div onClick={() => { handleConnect('suietWallet') }} className={styles.walletlist}>
          <span>Suiet</span>
          <img src={suietIcon} alt="" />
        </div>
        <div onClick={() => { handleConnect('martianSuiWallet') }} className={styles.walletlist}>
          <span>Martian</span>
          <img src={martiansuiwalletIcon} alt="" />
        </div>
        <div onClick={() => { handleConnect('ethosWallet') }} className={styles.walletlist}>
          <span>Ethos</span>
          <img src={"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iOCIgZmlsbD0iIzZEMjhEOSIvPgo8cGF0aCBvcGFjaXR5PSIwLjgiIGQ9Ik05LjEyMTg3IDYuODU3MDZIMTkuOTU4M0MyMC40NTcxIDYuODU3MDYgMjAuODYxNCA3LjI2MTQxIDIwLjg2MTQgNy43NjAyVjE5Ljk4ODZDMjAuODYxNCAyMC40ODc0IDIwLjQ1NzEgMjAuODkxOCAxOS45NTgzIDIwLjg5MThIOS4xMjE4N0M4LjYyMzA4IDIwLjg5MTggOC4yMTg3MiAyMC40ODc0IDguMjE4NzIgMTkuOTg4NlY3Ljc2MDJDOC4yMTg3MiA3LjI2MTQxIDguNjIzMDggNi44NTcwNiA5LjEyMTg3IDYuODU3MDZaIiBzdHJva2U9InVybCgjcGFpbnQwX2xpbmVhcl82OTlfMjY5OCkiIHN0cm9rZS13aWR0aD0iMC40NTE1NzIiLz4KPHBhdGggZD0iTTguNzEyNzQgNy40NTQ1OUwxNi4wOTQ1IDEwLjg4OTRDMTYuNDEyOSAxMS4wMzc2IDE2LjYxNjYgMTEuMzU3IDE2LjYxNjYgMTEuNzA4M1YyMy44MUMxNi42MTY2IDI0LjQ2MzUgMTUuOTQ0IDI0LjkwMDcgMTUuMzQ2OCAyNC42MzUzTDcuOTY1MDIgMjEuMzU1NkM3LjYzODgyIDIxLjIxMDcgNy40Mjg1OCAyMC44ODcyIDcuNDI4NTggMjAuNTMwM1Y4LjI3MzQzQzcuNDI4NTggNy42MTMxMSA4LjExNDA2IDcuMTc2MDIgOC43MTI3NCA3LjQ1NDU5WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTIzLjM3ODIgMTUuMzc2N0MyMy40MzAzIDE1LjEzMjEgMjMuNTUzOCAxNC45MDg2IDIzLjczMzIgMTQuNzM0M0MyMy45MTI1IDE0LjU2IDI0LjEzOTYgMTQuNDQzIDI0LjM4NTYgMTQuMzk3OUwyNS4wNDA0IDE0LjI3ODRMMjQuMzg1NSAxNC4xNTg4SDI0LjM4NTZDMjQuMTM5NiAxNC4xMTM3IDIzLjkxMjUgMTMuOTk2NyAyMy43MzMyIDEzLjgyMjRDMjMuNTUzOCAxMy42NDgxIDIzLjQzMDMgMTMuNDI0NiAyMy4zNzgyIDEzLjE4TDIzLjIzNDEgMTIuNTAxM0wyMy4wOSAxMy4xOEMyMy4wMzc5IDEzLjQyNDYgMjIuOTE0NCAxMy42NDgxIDIyLjczNTEgMTMuODIyNEMyMi41NTU4IDEzLjk5NjcgMjIuMzI4NyAxNC4xMTM4IDIyLjA4MjcgMTQuMTU4OEwyMS40Mjc4IDE0LjI3ODRMMjIuMDgyNyAxNC4zOTc5SDIyLjA4MjdDMjIuMzI4NyAxNC40NDMgMjIuNTU1NyAxNC41NiAyMi43MzUgMTQuNzM0M0MyMi45MTQ0IDE0LjkwODYgMjMuMDM3OSAxNS4xMzIxIDIzLjA5IDE1LjM3NjdMMjMuMjM0MSAxNi4wNTU0TDIzLjM3ODIgMTUuMzc2N1oiIGZpbGw9IndoaXRlIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfNjk5XzI2OTgiIHgxPSIyMC44NjE0IiB5MT0iMTAuNTkyNiIgeDI9IjE0LjUzOTgiIHkyPSIxMy43NTM0IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IndoaXRlIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0id2hpdGUiIHN0b3Atb3BhY2l0eT0iMCIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo="} alt="" />
        </div>
        <div onClick={() => { handleConnect('suiWallet') }} className={styles.walletlist}>
          <span>Sui Wallet</span>
          <img src={suiIcon} alt="" />
        </div>
        {/* <div onClick={() => { handleConnect('surfWallet') }} className={styles.walletlist}>
          <span>Surf Wallet</span>
          <img src={surfIcon} alt="" />
        </div> */}
      </TurbosDialog>

    </>
  )
}
export default SuiWalletButton;