var React = require('react');
var ReactDOM = require('react-dom');
var serviceWorker = require('./serviceWorker');
var xdai = require('@burner-wallet/assets').xdai;
var dai = require('@burner-wallet/assets').dai;
var eth = require('@burner-wallet/assets').eth;
var BurnerCore = require('@burner-wallet/core');
var InjectedSigner = require('@burner-wallet/core/signers').InjectedSigner;
var LocalSigner = require('@burner-wallet/core/signers').LocalSigner;
var InfuraGateway = require('@burner-wallet/core/gateways').InfuraGateway;
var InjectedGateway = require('@burner-wallet/core/gateways').InjectedGateway;
var XDaiGateway = require('@burner-wallet/core/gateways').XDaiGateway;
var _import = require('@burner-wallet/exchange');
var ModernUI = require('@burner-wallet/modern-ui');
var ENSPlugin = require('@burner-wallet/ens-plugin');
var MetamaskPlugin = require('@burner-wallet/metamask-plugin');
var BurnerConnectPlugin = require('@burner-wallet/burner-connect-wallet').BurnerConnectPlugin;
require('worker-loader?name=burnerprovider.js!./burnerconnect');

const core = new BurnerCore({
  signers: [
    new LocalSigner(),
    new InjectedSigner(),
  ],
  gateways: [
    new InjectedGateway(),
    new InfuraGateway(process.env.REACT_APP_INFURA_KEY),
    new XDaiGateway(),
  ],
  assets: [xdai, dai, eth],
});

const exchange = new Exchange([new XDaiBridge(), new Uniswap('dai')]);

const BurnerWallet = function () { return <ModernUI
    core={core}
    plugins={[
      exchange,
      new ENSPlugin(),
      new MetamaskPlugin(),
      new BurnerConnectPlugin('Basic Wallet'),
    ]}
  />



ReactDOM.render(<BurnerWallet />, document.getElementById('root')); };

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
