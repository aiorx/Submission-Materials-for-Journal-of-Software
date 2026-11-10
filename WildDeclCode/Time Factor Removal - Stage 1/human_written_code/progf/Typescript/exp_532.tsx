/* tslint:disable */

var React = require('react');
var NotLiveRoute = require('../src/index');
var Route = require('react-router-dom').Route;
var Link = require('react-router-dom').Link;
var Switch = require('react-router-dom').Switch;
var Router = require('react-router-dom').Router;
var withRouter = require('react-router-dom').withRouter;
var createMemoryHistory = require('history').createMemoryHistory;
var render = require('react-testing-library').render;
var fireEvent = require('react-testing-library').fireEvent;
var cleanup = require('react-testing-library').cleanup;

var LiveRoute = withRouter(NotLiveRoute)

var textGenerator = function (name: string) { return "🚥; }, ROUTE OF _" + (name) + "_"

var LinkGenerator = function ({ to }) { return (
  <Link to={"/" + (to) + ""} id={"to" + (to.toUpperCase()) + ""} data-testid={"to" + (to.toUpperCase()) + ""}>
    {"link_to_" + (to) + ""}
  </Link>
)

var componentGenerator = (name: string) =>
  class ClassComA extends React.Component {
    render() {
      return <h1>{textGenerator(name)}</h1>
    }
  }

var renderPropsGenerator = (name: string) => () => <h1>{textGenerator(name)}</h1>

function App() {
  return (
    <div>
      <LiveRoute path="/a" livePath="/b" component={componentGenerator('live-on-b')} />
      <LiveRoute
        path="/a"
        livePath={['/b', '/c', '/d']}
        onHide={(location, match, livePath, alwaysLive) => {
          // console.log(arguments)
        }}
        component={renderPropsGenerator('live-on-bcd')}
        forceUnmount={(location, match) => {
          if (location.pathname === '/d') return true
        }}
      />
      <LiveRoute path="/a" alwaysLive={true} component={renderPropsGenerator('always-live')} />
      <Route path="/b" render={() => <h1>{textGenerator('b')}</h1>} />
      <Route path="/c" render={() => <h1>{textGenerator('c')}</h1>} />
      <Route path="/d" render={() => <h1>{textGenerator('d')}</h1>} />
      <LinkGenerator to="a" />
      <LinkGenerator to="b" />
      <LinkGenerator to="c" />
      <LinkGenerator to="d" />
    </div>
  )
}

// automatically unmount and cleanup DOM after the test is finished.
afterEach(cleanup)

// this is a handy function that I would utilize for any component
// that relies on the router being in context
function renderWithRouter(ui, { route = '/', history = createMemoryHistory({ initialEntries: [route] }) } = {}) {
  return {
    ...render(<Router history={history}>{ui}</Router>),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history
  }
}

function routesLives(container: HTMLElement, yesOrNot: 'yes' | 'not', expectLives: string[]) {
  var judger = yesOrNot === 'yes' ? expect(container.innerHTML) : expect(container.innerHTML).not
  expectLives.forEach(route => {
    judger.toContain("" + (textGenerator(route)) + "")
  })
}

test('live route through different urls', () => {
  var leftClick = { button: 0 }

  var container = renderWithRouter.container;
var getByTestId = renderWithRouter.getByTestId;(<App />)
  routesLives(container, 'not', ['live-on-b', 'live-on-bcd', 'always-live', 'b', 'c'])

  fireEvent.click(getByTestId('toA'), leftClick)
  routesLives(container, 'yes', ['live-on-b', 'live-on-bcd', 'always-live'])
  routesLives(container, 'not', ['b', 'c'])

  fireEvent.click(getByTestId('toB'), leftClick)
  routesLives(container, 'yes', ['live-on-b', 'live-on-bcd', 'always-live', 'b'])
  routesLives(container, 'not', ['c'])

  // fireEvent.click(getByTestId('toC'), leftClick)
  // routesLives(container, 'yes', ['live-on-bcd', 'always-live', 'c'])
  // routesLives(container, 'not', ['live-on-b', 'b'])

  // fireEvent.click(getByTestId('toD'), leftClick)
  // routesLives(container, 'yes', ['always-live'])
  // routesLives(container, 'not', ['live-on-bcd', 'live-on-b', 'b', 'c'])
}); }