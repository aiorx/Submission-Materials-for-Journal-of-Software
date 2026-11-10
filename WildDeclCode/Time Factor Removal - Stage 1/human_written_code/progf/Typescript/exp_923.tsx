/** @prettier */
var React = require('react');
require('./include/bootstrap');
require('react-toastify/dist/ReactToastify.css');
require('./App.scss');
var store = require('./Store').store;
var AppNav = require('./components/nav/nav.component');
var BrowserRouter = require('react-router-dom').BrowserRouter;
var Switch = require('react-router-dom').Switch;
var Route = require('react-router-dom').Route;
var Provider = require('react-redux').Provider;
var ToastContainer = require('react-toastify').ToastContainer;
var toast = require('react-toastify').toast;
var ManagementRoutes = require('./routes/Management.routes').ManagementRoutes;
var SurveyRoutes = require('./routes/Survey.routes').SurveyRoutes;
var InterviewRoutes = require('./routes/Interview.routes').InterviewRoutes;
var DashboardRoutes = require('./routes/Dashboard.routes').DashboardRoutes;

class App extends React.Component {
  public render() {
    return (
      <Provider store={store as any}>
        <BrowserRouter>
          <div>
            <AppNav />

            <div id="main-content-container">
              <Switch>
                <Route path="/management" component={ManagementRoutes} />
                <Route path="/interview" component={InterviewRoutes} />
                <Route path="/surveys" component={SurveyRoutes} />
                <Route path="/dashboard" component={DashboardRoutes} />
                <Route path="/" component={DashboardRoutes} />
              </Switch>
            </div>
            <ToastContainer
              autoClose={2000}
              position={toast.POSITION.BOTTOM_RIGHT}
            />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}
module.exports = App;
