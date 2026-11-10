var _import = require('react');
var _import = require('react-grid-layout');
var withStyles = require('@material-ui/core/styles').withStyles;
var WithStyles = require('@material-ui/core/styles').WithStyles;

require('react-grid-layout/css/styles.css');
require('react-resizable/css/styles.css');

var styles = require('./styles').styles;
var ClassNames = require('./styles').ClassNames;
var ISetTmpLayoutAction = require('@src/redux_/layout').ISetTmpLayoutAction;
var ISyncLayoutAction = require('@src/redux_/layout').ISyncLayoutAction;
var Currency = require('@src/redux_/currencies').Currency;
var IFetchCurrenciesAction = require('@src/redux_/currencies').IFetchCurrenciesAction;
var Loader = require('@src/components/loader').LoaderConnected;
var CurrencyPicker = require('@src/components/currencyPicker').CurrencyPickerConnected;
var TargetSelector = require('@src/components/targetSelector').TargetSelectorConnected;
var ChartModeSelector = require('@src/components/chartModeSelector').ChartModeSelectorConnected;
var RefreshWidget = require('@src/components/refreshWidget').RefreshWidgetConnected;
var CurrencyWidget = require('@src/components/currencyWidget').CurrencyWidgetConnected;
var BalanceModal = require('@src/components/balanceModal').BalanceModalConnected;
import {
  BalanceProvider,
  BalanceConsumer,
  IBalanceContext,
} from '@src/components/balanceContext';
var Footer = require('@src/components/footer').FooterConnected;

interface IAppProps {
  fetchCurrencies: function () { return IFetchCurrenciesAction; };
  setTmpLayout: function (layout: Layout[]) { return ISetTmpLayoutAction; };
  syncLayout: function () { return ISyncLayoutAction; };
  currencies: Currency[];
  layout: Layout[];
}

const GridLayout = WidthProvider(ReactGridLayout);

class AppRaw extends Component<
  IAppProps & WithStyles<ClassNames>,
  {}
> {
  public componentDidMount() {
    var fetchCurrencies = this.props.fetchCurrencies;

    fetchCurrencies();
  }

  public render() {
    var currencies = this.props.currencies;
var layout = this.props.layout;
var classes = this.props.classes;

    const renderCurrencies = currencies.map(function (currency: Currency) {
      const gridData = layout.find(({ i }: Layout) => i === currency.id);

      return (
        <div key={currency.id} data-grid={gridData}>
          <CurrencyWidget currency={currency} />
        </div>
      );
    });

    const renderBalanceModal = function ({
      onEditingBalance,
      ...other,
    }: IBalanceContext) { return (
      <BalanceModal {...other} />
    ); };

    return (
      <Fragment>
        <BalanceProvider>
          <GridLayout
            className={"layout"}
            cols={4}
            draggableHandle={'.handle'}
            isResizable={false}
            layout={layout}
            onLayoutChange={this.onLayoutChange}
            onDragStop={this.onDragStop}
            measureBeforeMount={true}
            rowHeight={90}
          >
            <div key={'currency-picker'} style={{ zIndex: 2 }}>
              <Loader component={CurrencyPicker} />
            </div>
            <div key={'target-selector'}>
              <Loader component={TargetSelector} />
            </div>
            <div key={'chart-mode-selector'}>
              <Loader component={ChartModeSelector} />
            </div>
            <div key={'refresh-widget'}>
              <Loader component={RefreshWidget} />
            </div>
            {renderCurrencies}
          </GridLayout>
          <BalanceConsumer>{renderBalanceModal}</BalanceConsumer>
        </BalanceProvider>
        <Footer />
      </Fragment>
    );
  }

  private onLayoutChange = function (layout: Layout[]) {
    var setTmpLayout = this.props.setTmpLayout;

    setTmpLayout(layout);
  }

  private onDragStop = function () {
    var syncLayout = this.props.syncLayout;

    setTimeout(syncLayout);
  }
}

const App = withStyles(styles)(AppRaw);
