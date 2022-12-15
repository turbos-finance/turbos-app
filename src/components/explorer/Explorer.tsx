import { useSuiWallet } from "../../contexts/useSuiWallet";

type ExplorerProps = {
  message: string,
  type: string,
  digest: string,
}

export function Explorer(props: ExplorerProps) {
  const {
    network
  } = useSuiWallet();

  const { message, type, digest } = props;

  return (
    <div>
      {message}
      <a className='view' target={'_blank'} href={`https://explorer.sui.io/${type}/${digest}?network=${network?.toLocaleLowerCase() || 'devnet'}`}>
        View In Explorer
      </a>
    </div>
  )
}