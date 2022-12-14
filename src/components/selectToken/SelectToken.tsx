import styles from './SelectToken.module.css';
import closeIcon from '../../assets/images/close.png';
import searchIcon from '../../assets/images/search.png';
import { debounce, numberWithCommas } from '../../utils';
import { useEffect, useState } from 'react';
import Bignumber from 'bignumber.js';
import { useSymbolPrice } from '../../hooks/useSymbolPrice';
import { useSymbolBalance } from '../../hooks/useSymbolBalance';
import { useSuiWallet } from '../../contexts/useSuiWallet';
import { SymbolType } from '../../config/config.type';

export type SelectTokenOption = {
  icon: string,
  name: string,
  symbol: SymbolType | string,
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
          data.map((item: SelectTokenOption, index: number) => <SelectTokenList key={index} item={item} handleSelect={handleSelect} />)
        }
      </ul>
    </div>
  )
}


type SelectTokenListProps = {
  handleSelect: (value: SelectTokenOption) => void,
  item: SelectTokenOption,
}

function SelectTokenList(props: SelectTokenListProps) {
  const { item, handleSelect } = props;
  const { account } = useSuiWallet();

  const { symbolPrice } = useSymbolPrice(item.symbol as SymbolType);
  const { coinBalance } = useSymbolBalance(account, item.symbol as SymbolType);

  return (
    <li onClick={() => { handleSelect(item) }}>
      <img src={item.icon} alt="" height="24" />
      <div className={styles['token-name']}>
        <p className={styles['token-value1']}>{item.name}</p>
        <p className={styles['token-value2']}>{item.symbol}</p>
      </div>
      <div className={styles['token-name-right']}>
        <p className={styles['token-value1']}>{numberWithCommas(coinBalance)}</p>
        <p className={styles['token-value2']}>${numberWithCommas(Bignumber(coinBalance).multipliedBy(Bignumber(symbolPrice.price || 0).toNumber()).toFixed(2)) || 0}</p>
      </div>
    </li>
  )
}

export default SelectToken;