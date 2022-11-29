import React, { useCallback, useEffect, useState } from 'react';
import { useContext } from 'react';

import Snackbar from '@mui/material/Snackbar';
import closeIcon from '../assets/images/close.png';

export interface SnackbarMessage {
  message: React.ReactNode;
  key: number;
}

type ToastifyType = 'success' | 'error';

type ToastifyProvider = {
  children: React.ReactNode
}

type ToastifyContextValues = {
  toastify: (message: React.ReactNode, type?: ToastifyType) => void
}

const ToastifyContext = React.createContext<ToastifyContextValues>({
  toastify: (message: React.ReactNode, type: ToastifyType = 'success') => { }
});

export const UseToastifyProvider: React.FC<ToastifyProvider> = ({ children }) => {
  const [snackPack, setSnackPack] = React.useState<readonly SnackbarMessage[]>([]);
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState<SnackbarMessage | null>(null);
  const [type, setType] = useState<ToastifyType>('success');

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(null);
  };

  const toastify = useCallback((message: React.ReactNode, type: ToastifyType = 'success') => {
    setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
    setType(type);
  }, []);

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  const action = (
    <div className='toast-close' onClick={handleClose}>
      <img src={closeIcon} alt="" height={24}
      />
    </div>
  );

  return (
    <ToastifyContext.Provider value={{ toastify }}>
      {children}
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={open}
        className={'toast-' + type}
        autoHideDuration={5000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        message={messageInfo ? messageInfo.message : undefined}
        action={action}
      />

    </ToastifyContext.Provider>
  );
};

export const useToastify = () => {
  return useContext(ToastifyContext);
};
