import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { useState } from 'react';
import { useSuiWallet } from "../../contexts/useSuiWallet";

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
    <div>
      {
        !connected && !connecting ?
          <div onClick={handleOpen}>
            Connect Wallet
          </div> :
          <div onClick={disconnect}>
            disconnect Wallet
          </div>
      }

      {account}


      <Dialog onClose={handleOpen} open={open}>
        <DialogTitle>Connect a Wallet</DialogTitle>
        <DialogContent>
          <div style={{ border: "1px solid #cccccc", height: '48px', lineHeight: '48px', borderRadius: '24px', textAlign: "center", cursor: "pointer" }}
            onClick={handleConnect}
          >
            Sui Wallet
          </div>
        </DialogContent>

      </Dialog>
    </div>
  )
}
export default SuiWalletButton;