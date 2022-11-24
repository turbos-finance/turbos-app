import emptyIcon from '../../assets/images/empty.png';
import styles from './Empty.module.css';

function Empty() {
    return (
        <div className={styles.empty}>
            <img src={emptyIcon} alt="" height="60" />
            <span>No open positions</span>
        </div>
    )
}

export default Empty;