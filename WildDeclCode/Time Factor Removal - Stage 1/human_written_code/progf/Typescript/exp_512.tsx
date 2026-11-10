// @ts-nocheck
// @todo: refactor routes/web3uikit/update moralis
var useChain = require('react-moralis').useChain;
var useMoralis = require('react-moralis').useMoralis;
var Router = require('react-router-dom').BrowserRouter;
var Switch = require('react-router-dom').Switch;
var Route = require('react-router-dom').Route;
var Redirect = require('react-router-dom').Redirect;
var NFTBalance = require('web3Components/NFTBalance');
var UserDashboard = require('web3Components/User/UserDashboard');
var Layout = require('antd').Layout;
require('antd/dist/antd.css');
require('./style.css');
var Marketplace = require('views/Admin/components/NFT/Marketplace');
var useProtocol = require('views/Admin/Module/contracts/Protocol/useProtocol');
var Admin = require('views/Admin/Admin');
var Web3 = require('web3');
var useEffect = require('react').useEffect;
var useState = require('react').useState;
var AdminRoute = require('components/AdminRoute');
var HeaderMenu = require('components/HeaderMenu');
var Footer = Layout.Footer;

var styles = {
    content: {
        display: 'flex',
        justifyContent: 'center',
        fontFamily: 'Roboto, sans-serif',
        color: '#041836',
        marginTop: '130px',
        padding: '10px',
    },
};
var App = function () {
    var account = useMoralis.account;
var provider = useMoralis.provider;
var isAuthenticated = useMoralis.isAuthenticated;();
    var marketplaceAddress = useProtocol.marketplaceAddress;
var hasMarketplace = useProtocol.hasMarketplace;
var canSetProject = useProtocol.canSetProject;
var AdminAddress = useProtocol.AdminAddress;
var isFetching = useProtocol.isFetching;();
    var chainId = useChain.chainId;();

    var [web3, setWeb3] = useState();

    var isAdmin = (account: string): boolean => {
        return account && isAuthenticated && AdminAddress && AdminAddress.toUpperCase() === account.toUpperCase();
    };

    useEffect(() => {
        if (provider) {
            var web = new Web3(provider as any);
            setWeb3(web);
        }
    }, [provider]);

    return (
        <Layout style={{ height: '100vh', overflow: 'auto' }}>
            {
                <Router>
                    <HeaderMenu isAdmin={isAdmin} />
                    <div style={styles.content}>
                        <Switch>
                            <AdminRoute path="/admin">
                                <Admin />
                            </AdminRoute>
                            {hasMarketplace && (
                                <Route path="/NFTBalance">
                                    <NFTBalance
                                        web3={web3}
                                        address={account}
                                        chain={chainId}
                                        admin={AdminAddress}
                                        marketplaceAddress={marketplaceAddress}
                                    />
                                </Route>
                            )}
                            {hasMarketplace && (
                                <Route path="/user">
                                    <UserDashboard address={account} admin={AdminAddress} marketplace={marketplaceAddress} />
                                </Route>
                            )}
                            <Route path="/NFTMarketPlace">
                                {!hasMarketplace && !canSetProject && web3 && isAuthenticated && (
                                    <div>
                                        <p style={{ fontWeight: 600 }}>Marketplace coming soon ...</p>
                                        <p style={{ fontWeight: 200 }}> If you are the owner switch your account in metamask</p>
                                    </div>
                                )}
                                {!isAuthenticated && !web3 && !provider && (
                                    <div>
                                        <p style={{ fontWeight: 600 }}>This App needs web3 connectivity</p>
                                        <p style={{ fontWeight: 200 }}>Connect your wallet</p>
                                    </div>
                                )}
                                {hasMarketplace && marketplaceAddress && web3 && <Marketplace address={marketplaceAddress} />}
                                {canSetProject && !isFetching  && isAuthenticated && web3 && <Redirect to={'/admin'} />}
                            </Route>
                            {isAdmin(account) && <Redirect from="/" to={'/admin'} />}
                            <Redirect from="/" to={'/NFTMarketplace'} />
                        </Switch>
                    </div>
                </Router>
            }
            <Footer style={{ display: 'grid', placeItems: 'center' }}>Powered By Moralis</Footer>
        </Layout>
    );
};

module.exports = App;
