var configureStore = require('@reduxjs/toolkit').configureStore;
var _import = require('react');
var Modal = require('react-modal');
var Provider = require('react-redux').Provider;
var Web3Provider = require('web3-react');

require('react-datepicker/dist/react-datepicker.css');
require('sanitize.css');
var Main = require('./components/main').Main;
var ContentWrapper = require('./components/modal/common_styled').ContentWrapper;
var ConnectionModalNavigation = require('./components/modal/modal_your_connection').ConnectionModalNavigation;
var SettingsModalWrapper = require('./components/modal/modal_your_connection').SettingsModalWrapper;
var SettingsViewContainer = require('./components/modal/settings/settings_view');
var ConnectedWeb3 = require('./contexts').ConnectedWeb3;
var ApolloProviderWrapper = require('./contexts/Apollo').ApolloProviderWrapper;
var balanceReducer = require('./store/reducer');
var TYPE = require('./theme').TYPE;
var ThemeProvider = require('./theme').ThemeProvider;
var theme = require('./theme').theme;
var GlobalStyle = require('./theme/global_style').GlobalStyle;
var connectors = require('./util/connectors');
var getInfuraUrl = require('./util/networks').getInfuraUrl;
var networkIds = require('./util/networks').networkIds;
var checkRpcStatus = require('./util/tools').checkRpcStatus;
var getNetworkFromChain = require('./util/tools').getNetworkFromChain;

const store = configureStore({ reducer: balanceReducer })

const App: React.FC = function (props: any) {
  const { ...restProps } = props
  const windowObj: any = window

  const ethereum = windowObj.ethereum

  const [status, setStatus] = useState(true)

  useEffect(() => {
    const handleRpcStatus = async () => {
      if (ethereum) {
        const chainId = await ethereum.request({ method: 'eth_chainId' })
        let network = getNetworkFromChain(chainId ? chainId.toString() : '-1')

        const initialRelayState =
          localStorage.getItem('relay') === 'false' || network !== networkIds.MAINNET ? false : true
        if (initialRelayState) network = networkIds.XDAI

        checkRpcStatus(getInfuraUrl(network), setStatus, network)
      }
    }
    handleRpcStatus()
  }, [ethereum])

  return (
    <ThemeProvider>
      <Web3Provider connectors={connectors} libraryName="ethers.js">
        {!status ? (
          <Modal
            isOpen={true}
            style={{
              ...theme.fluidHeightModal,
              content: { ...theme.fluidHeightModal.content, height: '510px' },
            }}
            {...restProps}
          >
            <ContentWrapper>
              <ConnectionModalNavigation>
                <TYPE.heading3 color={'text1'}>Settings</TYPE.heading3>
              </ConnectionModalNavigation>
              <SettingsModalWrapper>
                <SettingsViewContainer />
              </SettingsModalWrapper>
            </ContentWrapper>
          </Modal>
        ) : (
          <ConnectedWeb3 setStatus={setStatus}>
            <ApolloProviderWrapper>
              <Provider store={store}>
                <GlobalStyle />
                <Main />
              </Provider>
            </ApolloProviderWrapper>
          </ConnectedWeb3>
        )}
      </Web3Provider>
    </ThemeProvider>
  )
}

module.exports = App;
