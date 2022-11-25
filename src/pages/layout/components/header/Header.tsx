import { Link } from "react-router-dom";
import SuiWalletButton from "../../../../components/walletButton/WalletButton";
import styles from './Header.module.css';
import logo from '../../../../assets/images/logo.png';

import mobilemenusleftIcon from '../../../../assets/images/mobilemenusleft.png';
import MenuIcon from '@mui/icons-material/Menu';

function Header() {
    return (
        <div className={styles['header']}>
            <div className={styles['header-left']}>
                <div className={styles.menus}>
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
        </div>
    )
}

export default Header;