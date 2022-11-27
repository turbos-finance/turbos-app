import { Link } from "react-router-dom";
import Drawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';

import SuiWalletButton from "../../../../components/walletButton/WalletButton";
import styles from './Header.module.css';
import logo from '../../../../assets/images/logo.png';

import mobilemenusleftIcon from '../../../../assets/images/mobilemenusleft.png';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
import { Nav } from '../menus/Menus';

const CustomizedDrawer = styled(Drawer)`
  .MuiPaper-root{
    background-color: #000000;
  }
`;


function Header() {
  const [anchor, setAnchor] = useState(false);
  const toggleDrawer = () => {
    setAnchor(!anchor);
  }

  return (
    <div className={styles['header']}>
      <div className={styles['header-left']}>
        <div className={styles.menus} onClick={toggleDrawer}>
          <MenuIcon className={styles['mobile-logo-img']} />
        </div>
        <div className={styles.logo}>
          <Link to='/' >
            <img src={logo} alt="TURBOS" />
          </Link>
        </div>
      </div>
      <div className={styles['header-right']}>
        <SuiWalletButton />
        <div>

        </div>
      </div>

      <CustomizedDrawer
        anchor={'left'}
        open={anchor}
        onClose={toggleDrawer}
      // sx={{ backgroundColor: '#000000' }}
      >
        <Nav toggleDrawer={toggleDrawer} />
      </CustomizedDrawer>
    </div>
  )
}

export default Header;