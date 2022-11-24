import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';


import styles from './Dialog.module.css';
import closeIcon from '../../../assets/images/close.png';

const CustomizedDialog = styled(Dialog)`
    .MuiDialog-paper{
        min-width:416px;
        background: rgba(40,51,62,0.98);
        box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.3);
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.1);
    }
`;

const CustomizedDialogTitle = styled(DialogTitle)`
    .MuiDialogTitle-root{
        padding:24px;
    }
`;

type TurbosDialogProps = {
  onClose: Function,
  open: boolean,
  children: React.ReactNode,
  title: string,
}


function TurbosDialog(props: TurbosDialogProps) {

  const { onClose, open, children, title } = props;

  return (
    <CustomizedDialog open={open} onClose={() => { onClose() }}>
      <CustomizedDialogTitle >
        <div className={styles['dialog-top']}>
          <div className={styles['dialog-top-title']}>{title}</div>
          <div className={styles['dialog-top-close']} onClick={() => { onClose() }}>
            <img src={closeIcon} alt="" height='24' />
          </div>
        </div>
      </CustomizedDialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
    </CustomizedDialog>
  )
}

export default TurbosDialog;