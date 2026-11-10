var _import = require('react');
var Router = require('react-router-dom').BrowserRouter;
var Redirect = require('react-router-dom').Redirect;
var Route = require('react-router-dom').Route;
var Switch = require('react-router-dom').Switch;
var useWallet = require('@binance-chain/bsc-use-wallet').useWallet;
var ResetCSS = require('@pancakeswap-libs/uikit').ResetCSS;
var BigNumber = require('bignumber.js');
var useFetchPublicData = require('state/hooks').useFetchPublicData;
var GlobalStyle = require('./style/Global');
var Menu = require('./components/Menu');
var PageLoader = require('./components/PageLoader');

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page'
const Home = lazy(function () { return import('./views/Home'); })
const Farms = lazy(function () { return import('./views/Farms'); })
// var Lottery = lazy(() => import('./views/Lottery'))
const Pools = lazy(function () { return import('./views/Pools'); })
const Ifos = lazy(function () { return import('./views/Ifos'); })
const NotFound = lazy(function () { return import('./views/NotFound'); })
const Buy = lazy(function () { return import('./views/Buy'); })
const Trade = lazy(function () { return import('./views/BuyNow'); })
const Liquidity = lazy(function () { return import('./views/Liquidity'); })
const Launchpad = lazy(function () { return import('./views/Teaser'); })
const KingOfElephants = lazy(function () { return import('./views/KingOfElephants'); })
// var Nft = lazy(() => import('./views/Nft'))

// This config is required for number formating
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = function () {
  var account = useWallet.account;
var connect = useWallet.connect;()
  useEffect(() => {
    if (!account && window.localStorage.getItem('accountStatus')) {
      connect('injected')
    }
  }, [account, connect])

  useFetchPublicData()

  return (
    <Router>
      <ResetCSS />
      <GlobalStyle />
      <Menu>
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/farms">
              <Farms />
            </Route>
            <Route path="/pools">
              <Farms tokenMode/>
            </Route>
            <Route path="/junglepools">
             <Pools />
            </Route>
            <Route path="/buy">
             <Trade />
            </Route>
            <Route path="/liquidity">
             <Liquidity />
            </Route>
            <Route path="/ido">
             <Ifos />
            </Route>
            <Route path="/nft">
             <Launchpad />
            </Route>
            <Route path="/kingOfElephants">
             <KingOfElephants />
            </Route>
            {/* <Route path="/lottery"> */}
            {/*  <Lottery /> */}
            {/* </Route> */}
            {/* <Route path="/ifo"> */}
            {/*  <Ifos /> */}
            {/* </Route> */}
            {/* <Route path="/nft"> */}
            {/*  <Nft /> */}
            {/* </Route> */}
            {/* Redirect */}
            {/* <Route path="/syrup"> */}
            {/*  <Redirect to="/pools" /> */}
            {/* </Route> */}
            {/* 404 */}
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </Menu>
      

    </Router>
  )
}

module.exports = React.memo(App);
