var AppBar = require('@material-ui/core').AppBar;
var CssBaseline = require('@material-ui/core').CssBaseline;
var Toolbar = require('@material-ui/core').Toolbar;
var Typography = require('@material-ui/core').Typography;
var IconButton = require('@material-ui/core').IconButton;
var Grid = require('@material-ui/core').Grid;
var InputBase = require('@material-ui/core').InputBase;
var Tooltip = require('@material-ui/core').Tooltip;
var ThemeProvider = require('@material-ui/styles').ThemeProvider;
var Link = require('@material-ui/core/Link');
var _import = require('react');
var RouterLink = require('react-router-dom').Link;
var Router = require('react-router-dom').Router;
var Route = require('react-router-dom').Route;
var Switch = require('react-router-dom').Switch;
var useDarkMode = require('use-dark-mode');
require('./App.css');

var Address = require('./containers/Address');
var Block = require('./containers/Block');
var Dashboard = require('./containers/Dashboard');
var NodeView = require('./containers/NodeView');
var Transaction = require('./containers/Transaction');
var ConfigurationMenu = require('./containers/ConfigurationMenu');
var darkTheme = require('./themes/moonBeamTheme').darkTheme;
var lightTheme = require('./themes/moonBeamTheme').lightTheme;
var NotesIcon = require('@material-ui/icons/Notes');

var _import = require('@etclabscore/jade-service-runner-client');
var availableServiceToNetwork = require('./helpers/availableServiceToNetwork');

var useInterval = require('use-interval');
var useServiceRunnerStore = require('./stores/useServiceRunnerStore');
var useCoreGethStore = require('./stores/useCoreGethStore');
var EthereumJSONRPC = require('@etclabscore/ethereum-json-rpc');
var ETHJSONSpec = require('@etclabscore/ethereum-json-rpc-specification/openrpc.json');
var useTranslation = require('react-i18next').useTranslation;
var LanguageMenu = require('./containers/LanguageMenu');
var createBrowserHistory = require('history').createBrowserHistory;
var NetworkDropdown = require('./components/NetworkDropdown/NetworkDropdown');
var StringParam = require('use-query-params').StringParam;
var QueryParamProvider = require('use-query-params').QueryParamProvider;
var useQueryParams = require('use-query-params').useQueryParams;
var createPreserveQueryHistory = require('./helpers/createPreserveHistory').createPreserveQueryHistory;
var BlockRawContainer = require('./containers/BlockRawContainer');
var TransactionRawContainer = require('./containers/TransactionRawContainer');
var expeditionLogo = require('./explorer.png');
var MinerStatsPage = require('./containers/MinerStatsPage');

const history = createPreserveQueryHistory(createBrowserHistory, ["network", "rpcUrl"])();

function App(props: any) {
  var t = useTranslation.t;();
  const darkMode = useDarkMode();
  const [search, setSearch] = useState();
  const theme = darkMode.value ? darkTheme : lightTheme;

  const [selectedNetwork, setSelectedNetworkState] = useState();
  const [serviceRunner, serviceRunnerUrl, setServiceRunnerUrl, availableServices]: [ServiceRunner, string, any, IAvailableServices[]] = useServiceRunnerStore(); //tslint:disable-line
  const [erpc, setCoreGethUrlOverride]: [EthereumJSONRPC, Dispatch<string>] = useCoreGethStore();
  const [networks, setNetworks] = useState<any[]>([]);

  const [query, setQuery] = useQueryParams({
    network: StringParam,
    rpcUrl: StringParam,
  });

  const setSelectedNetwork = async function (network: any) {
    setSelectedNetworkState(network);
    if (network.service) {
      await serviceRunner.installService(network.service.name, network.service.version);
      await serviceRunner.startService(network.service.name, network.service.version, network.name);
    }
    setCoreGethUrlOverride(network.url);
  };

  useEffect(function () {
    if (availableServices && serviceRunnerUrl) {
      const n = availableServiceToNetwork(availableServices, serviceRunnerUrl);
      setNetworks(n);
    }
  }, [availableServices, serviceRunnerUrl]);

  useEffect(function () {
    if (!networks || networks.length === 0) {
      return;
    }
    if (query.rpcUrl) {
      return;
    }
    if (networks && query.network) {
      const foundNetwork = networks.find((net) => net.name === query.network);
      setSelectedNetworkState(foundNetwork);
    } else {
      setSelectedNetworkState(networks[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networks, query.network]);

  useEffect(function () {
    if (selectedNetwork === undefined) {
      return;
    }
    var name = selectedNetwork.name;as any;

    if (name !== query.network) {
      setQuery({ network: name });
      history.push({
        pathname: history.location.pathname,
        search: "?network=" + (name) + "",
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNetwork, setQuery]);

  const handleConfigurationChange = function (type: string, url: string) {
    if (type === "service-runner") {
      setServiceRunnerUrl(url);
    } else if (type === "ethereum-rpc") {
      setCoreGethUrlOverride(url);
    }
  };

  React.useEffect(function () {
    if (erpc) {
      erpc.startBatch();
    }
  }, [erpc]);

  useInterval(function () {
    if (erpc) {
      erpc.stopBatch();
      erpc.startBatch();
    }
  }, 100, true);

  const isAddress = (q: string): function boolean {
    const re = new RegExp(ETHJSONSpec.components.schemas.Address.pattern);
    return re.test(q);
  };

  const isKeccakHash = (q: string): function boolean {
    const re = new RegExp(ETHJSONSpec.components.schemas.Keccak.pattern);
    return re.test(q);
  };

  const isBlockNumber = (q: string): function boolean {
    const re = new RegExp(/^-{0,1}\d+$/);
    return re.test(q);
  };

  const handleSearch = async function (qry: string | undefined) {
    if (qry === undefined) { return; }
    const q = qry.trim();
    if (isAddress(q)) {
      history.push("/address/" + (q) + "");
    }
    if (isKeccakHash(q)) {
      let transaction;

      try {
        transaction = await erpc.eth_getTransactionByHash(q);
      } catch (e) {
        // do nothing
      }

      if (transaction) {
        history.push("/tx/" + (q) + "");
      }
      let block;
      try {
        block = await erpc.eth_getBlockByHash(q, false);
      } catch (e) {
        // do nothing
      }
      if (block) {
        history.push("/block/" + (q) + "");
      }
    }
    if (isBlockNumber(q)) {
      const block = await erpc.eth_getBlockByNumber("0x" + (parseInt(q, 10).toString(16)) + "", false);
      if (block) {
        history.push("/block/" + (block.hash) + "");
      }
    }
  };

  return (
    <Router history={history}>
      <ThemeProvider theme={theme}>
        <AppBar position="sticky" color="default" elevation={0}>
          <Toolbar>
            <Grid justify="space-between" alignItems="center" alignContent="center" container>
              <Grid item style={{ marginTop: "8px" }}>
                <Link
                  component={function ({ className, children }: { children: any, className: string }) { return (
                    <RouterLink className={className} to={"/"}>
                      {children}
                    </RouterLink>
                  ); }}>
                  <Grid container>
                    <Grid>
                      <img
                        alt="expedition-logo"
                        height="30"
                        style={{ marginRight: "10px" }}
                        src={expeditionLogo}
                      />
                    </Grid>
                    <Grid>
                      <Typography color="initial" variant="h6">
                        {t("Moonbeam Explorer")}
                      </Typography>
                    </Grid>
                  </Grid>
                </Link>
              </Grid>
              <Grid item md={6} xs={12}>
                <InputBase
                  placeholder={t("Enter an Address, Transaction Hash or Block Number")}
                  onKeyDown={
                    function (event: KeyboardEvent<HTMLInputElement>) {
                      if (event.keyCode === 13) {
                        handleSearch(search);
                      }
                    }
                  }
                  onChange={
                    function (event: ChangeEvent<HTMLInputElement>) {
                      if (event.target.value) {
                        var value = event.target.value;
                        setSearch(value as any);
                      }
                    }
                  }
                  fullWidth
          
                  style={{
                    background: "rgba(6,6,6,0.1)",
                    borderRadius: "4px",
                    padding: "5px 10px 0px 10px",
                    marginRight: "5px",
                  }}
                />
              </Grid>
              <Grid item>
                <NetworkDropdown
                  networks={networks}
                  setSelectedNetwork={setSelectedNetwork}
                  selectedNetwork={selectedNetwork}
                />
                <LanguageMenu />
                <Tooltip title={t("Moonbeam Documentation") as string}>
                  <IconButton
                    onClick={function () { return window.open("https://docs.moonbeam.network/") //tslint:disable-line; }}>
                    <NotesIcon />
                  </IconButton>
                </Tooltip>
                <ConfigurationMenu onChange={handleConfigurationChange} />
              
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <div style={{ margin: "0px 25px 0px 25px" }}>
          <QueryParamProvider ReactRouterRoute={Route}>
            <CssBaseline />
            <Switch>
              <Route path={"/"} component={Dashboard} exact={true} />
              <Route path={"/stats/miners"} component={MinerStatsPage} exact={true} />
              <Route path={"/stats/miners/:block"} component={MinerStatsPage} />
              <Route path={"/block/:hash/raw"} component={BlockRawContainer} />
              <Route path={"/block/:hash"} component={Block} />
              <Route path={"/blocks/:number"} component={NodeView} />
              <Route path={"/tx/:hash/raw"} component={TransactionRawContainer} />
              <Route path={"/tx/:hash"} component={Transaction} />
              <Route path={"/address/:address/:block"} component={Address} />
              <Route path={"/address/:address"} component={Address} />
            </Switch>
          </QueryParamProvider>
        </div>  
      
      </ThemeProvider >
    </Router >
  );
}

module.exports = App;
