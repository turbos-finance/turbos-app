import emptyIcon from '../../assets/images/empty.png';
import styles from './Empty.module.css';

type EmptyProps = {
    text?: string
}

function Empty(props: EmptyProps) {
    const { text } = props;
    return (
        <div className={styles.empty}>
            <img src={emptyIcon} alt="" height="60" />
            <span>{text || 'No open positions'}</span>
        </div>
    )
}

export default Empty;