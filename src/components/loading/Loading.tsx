import LoadingIcon from '../../assets/images/loading.png';
import styles from './Loading.module.css';

function Loading() {
    return (
        <span className={styles.loading}>
            <img src={LoadingIcon} alt="" height={24} />
        </span>
    )
}


export default Loading;