import styles from './SelectToken.module.css';
import closeIcon from '../../assets/images/close.png';
import searchIcon from '../../assets/images/search.png';
import { debounce } from '../../utils';
import { useEffect, useState } from 'react';

export type SelectTokenOption = {
  icon: string,
  name: string,
  symbol: string,
  balance?: string | number,
  price?: string | number,
  address?: string
}

type SelectTokenProps = {
  visible: boolean,
  options: SelectTokenOption[],
  onClose?: Function,
  onSelect?: (value: SelectTokenOption) => void
}

function SelectToken(props: SelectTokenProps) {

  const { visible, onClose, onSelect, options } = props;
  const [data, setData] = useState<SelectTokenOption[]>([]);

  const handleSelect = (value: SelectTokenOption) => {
    onSelect && onSelect(value);
    onClose && onClose();
  }

  const handleChange = (e: any) => {
    if (!e.target.value) {
      return setData(options);
    }
    setData(options.filter((item: SelectTokenOption) => item.name.toLocaleLowerCase().indexOf(e.target.value.toLocaleLowerCase()) > -1 || item.symbol.toLocaleLowerCase().indexOf(e.target.value.toLocaleLowerCase()) > -1))
  }

  useEffect(() => {
    if (visible) {
      setData(options);
    }
  }, [options, visible])

  return (
    <div className={styles['token-con']} style={{ display: visible ? 'block' : 'none' }}>
      <div className={styles['token-top']}>
        <div className={styles['token-top-title']}>Select Token</div>
        <div className={styles['token-top-close']} onClick={() => { onClose && onClose() }}><img src={closeIcon} alt="" height='24' /></div>
      </div>
      <div className={styles['token-search']}>
        <input type="text" className={styles['token-input']} placeholder="Search Token" onChange={debounce(handleChange, 100)} />
        <img src={searchIcon} alt="" height='24' />
      </div>
      <ul className={styles['token-list']}>
        {
          data.map((item: SelectTokenOption, index: number) => (
            <li onClick={() => { handleSelect(item) }} key={index}>
              <img src={item.icon} alt="" height="24" />
              <div className={styles['token-name']}>
                <p className={styles['token-value1']}>{item.name}</p>
                <p className={styles['token-value2']}>{item.symbol}</p>
              </div>
              <div>
                <p className={styles['token-value1']}>{item.balance}</p>
                <p className={styles['token-value2']}>$ {item.price}</p>
              </div>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default SelectToken;