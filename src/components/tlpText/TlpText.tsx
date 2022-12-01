import styles from './TlpText.module.css';

function TlpText() {
  return (
    <div className={styles['tlp-text']}>
      <div className={styles['tlp-text-title']}> What is TLP</div>
      <div className={styles['tlp-text-des']}>TLP is the platform's liquidity provider token.
      </div>
      <div className={styles['tlp-text-des']}>TLP is a total fund pool composed of a series of crypto assets. Any crypto can be used to mint TLP, such as SUI,
        ETH and USDC. TLP also includes asset index for perpetual contracts and Swaps. The price formula for the TPL
        mint and redemption is: Total assets in the index (including all not-closed positions/TLP supply). <a href="https://turbos.gitbook.io/turbos/tlp" target="_blanck"> Learn more {'>'} </a>
      </div>

      <div className={styles['tlp-text-title']}> TLP Rewards</div>
      <div className={styles['tlp-text-des']}>60% of the platform income will be allocated to TLP holders. Users grow with the platform and share the dividends
        of platform development by holding TLP. TLP holders are liquidity providers of platform. When perpetual contract
        traders lose money, TLP value gains, when the perpetual contract trader gains, TLP value loses.</div>

      <div className={styles['tlp-text-title']}>Mint TLP</div>
      <div className={styles['tlp-text-des']}>Users are able to mint TLP with any crypto assets supported by the platform. Buying TLP on the transaction page
        means minting TLP. </div>
      <div className={styles['tlp-text-des']}>After you successfully mint TLP, the TLP tokens will be automatically mortgaged to earn platform commission
        income and other rewards.</div>

      <div className={styles['tlp-text-title']}>Burn TLP</div>
      <div className={styles['tlp-text-des']}>Burn TLP to redeem the assets you want on TLP transaction page. TLP must be held for at least 15 minutes before it is burned.</div>
    </div >
  )
}

export default TlpText;