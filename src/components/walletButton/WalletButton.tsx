import { useState } from 'react';
import { useCopyToClipboard } from "react-use";
import { useSuiWallet, WalletType } from "../../contexts/useSuiWallet";
import walletIcon from '../../assets/images/wallet.png'
import suietIcon from '../../assets/images/suiet.webp'
import suiIcon from '../../assets/images/ic_sui_40.svg'
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
import { Toast } from '../../utils/toastify';

type SuiWalletButtonProps = {
  isButton?: boolean
}

function SuiWalletButton(props: SuiWalletButtonProps) {
  const { account, connected, connecting, connect, disconnect } = useSuiWallet();
  const [, copyToClipboard] = useCopyToClipboard();
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
          Toast.success("Address copied to your clipboard");
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
          <div className='btn' onClick={handleOpen}>
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
        <div onClick={() => { handleConnect('suiWallet') }} className={styles.walletlist}>
          <span>Sui Wallet</span>
          <img src={suiIcon} alt="" />
        </div>
        <div onClick={() => { handleConnect('suietWallet') }} className={styles.walletlist}>
          <span>Suiet</span>
          <img src={suietIcon} alt="" />
        </div>
      </TurbosDialog>

    </>
  )
}
export default SuiWalletButton;