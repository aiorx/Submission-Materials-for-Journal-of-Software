require('../styles/globals.css');
var WalletProvider = require('@mysten/wallet-adapter-react').WalletProvider;
var WalletAdapter = require('@mysten/wallet-adapter-base').WalletAdapter;
var SuietWalletAdapter = require('@suiet/wallet-adapter').SuietWalletAdapter;

const suietAdapter = new SuietWalletAdapter();
const supportedWallets: { adapter: WalletAdapter }[] = [
  {
    adapter: suietAdapter,
  },
];

function MyApp({Component, pageProps}: AppProps) {
  return (
    <WalletProvider supportedWallets={supportedWallets}>
      <Component {...pageProps} />
    </WalletProvider>
  )
}

module.exports = MyApp;
