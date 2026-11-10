var _import = require('contract-proxy-kit');
var _import = require('react');
var SafeLogo = require('src/assets/icons/safe-logo.svg');
var CompoundForm = require('src/components/CompoundForm');
var ConnectButton = require('src/components/ConnectButton');
var WalletInfo = require('src/components/WalletInfo');
var styled = require('styled-components');
var Web3 = require('web3');

const SAppContainer = styled.main"
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 100vw;
"

const SHeading = styled.h1"
  @media screen and (max-width: 768px) {
    font-size: 1.2em;
  }
"

interface IWalletState {
  account: string | undefined
  networkId: number | undefined
}

const initialWalletState = {
  account: undefined,
  networkId: undefined
}

const App: React.FC = function () {
  const [web3, setWeb3] = React.useState<Web3 | undefined>(undefined)
  const [proxyKit, setProxyKit] = React.useState<CPK | undefined>(undefined)
  const [walletState, updateWalletState] = React.useState<IWalletState>(
    initialWalletState
  )

  const onWeb3Connect = (provider: any) => {
    if (provider) {
      setWeb3(new Web3(provider))
    }
  }

  useEffect(() => {
    const fetchWalletData = async () => {
      if (web3) {
        const [accounts, networkId] = await Promise.all([
          web3.eth.getAccounts(),
          web3.eth.net.getId()
        ])

        const ethLibAdapter = new Web3Adapter({ web3 })
        const cpk = await CPK.create({ ethLibAdapter })
        setProxyKit(cpk)

        updateWalletState({
          account: accounts[0],
          networkId
        })
      }
    }

    fetchWalletData()
  }, [updateWalletState, web3])

  return (
    <SAppContainer>
      <img src={SafeLogo} alt="Gnosis Safe Logo" width="100"></img>
      <SHeading>Safe Contract Proxy Kit Compound Tutorial</SHeading>
      {walletState.account && proxyKit ? (
        <div>
          <WalletInfo address={walletState.account!} />
          <CompoundForm
            web3={web3}
            cpk={proxyKit!}
            address={walletState.account!}
          />
        </div>
      ) : (
        <>
          <p>Start by connecting your wallet using button below.</p>
          <ConnectButton onConnect={onWeb3Connect} />
        </>
      )}
    </SAppContainer>
  )
}

module.exports = App;
