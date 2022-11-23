import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { style } from '@mui/system';
import { useState } from 'react';
import { useCopyToClipboard, createBreakpoint } from "react-use";
import { useSuiWallet } from "../../contexts/useSuiWallet";
import walletIcon from '../../assets/images/wallet.png'

import styles from './WalletButton.module.css';

function SuiWalletButton() {
  const { account, connected, connecting, connect, disconnect } = useSuiWallet();

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  }

  const handleConnect = async () => {
    connect('suiWallet');
    handleOpen();
  }

  return (
    <>
      {
        !connected && !connecting ?
          <div onClick={handleOpen} className={styles.wallet}>
            <img src={walletIcon} alt="" />
            <span>Connect Wallet</span>
          </div> :
          <div onClick={disconnect} className={styles.wallet}>
            disconnect Wallet
          </div>
      }

      <Dialog onClose={handleOpen} open={open}>
        <DialogTitle>Connect a Wallet</DialogTitle>
        <DialogContent>
          <div style={{ border: "1px solid #cccccc", height: '48px', lineHeight: '48px', borderRadius: '24px', textAlign: "center", cursor: "pointer" }}
            onClick={handleConnect}
          >
            Sui Wallet
          </div>
          <div style={{ border: "1px solid #cccccc", height: '48px', lineHeight: '48px', borderRadius: '24px', textAlign: "center", cursor: "pointer" }}
            onClick={handleConnect}
          >
            Sui Wallet
          </div>
        </DialogContent>

      </Dialog>
    </>
  )
}
export default SuiWalletButton;