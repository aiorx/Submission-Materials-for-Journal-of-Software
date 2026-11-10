var React = require('react');
var mount = require('enzyme').mount;
var Dashboard = require('src/components/HomePage/Dashboard/Dashboard');
var Router = require('react-router-dom').BrowserRouter;
var NetworkContext = require('src/services/network/networkProvider').NetworkContext;

describe('Isolated Server <Dashboard />', function () {

  const dashboard = mount(
    <Router>
      <NetworkContext.Provider value={{
        isValidUrl: null,
        isIsolatedServer: true,
        dataService: null,
        nodeUrl: '',
        inTransition: true,
        isLoadingUrls: true
      }}>
        <Dashboard />
      </NetworkContext.Provider>
    </Router>
  )

  it('matches snapshot', () => {
    expect(dashboard).toMatchSnapshot()
  })

})

describe('Non-Isolated Server <Dashboard />', function () {

  const dashboard = mount(
    <Router>
      <NetworkContext.Provider value={{
        isValidUrl: null,
        isIsolatedServer: false,
        dataService: null,
        nodeUrl: '',
        inTransition: true,
        isLoadingUrls: true
      }}>
        <Dashboard />
      </NetworkContext.Provider>
    </Router>
  )

  it('matches snapshot', () => {
    expect(dashboard).toMatchSnapshot()
  })

})