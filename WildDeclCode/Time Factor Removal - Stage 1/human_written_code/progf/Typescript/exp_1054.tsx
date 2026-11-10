var React = require('react');
var Route = require('react-router').Route;
var Switch = require('react-router').Switch;
var Sidebar = require('./components/Sidebar/Sidebar');
var appRoutes = require('./routes/app');
var withStyles = require('material-ui').withStyles;
var _import = require('./variables/styles/AppStyle');
var Footer = require('./components/Footer/Footer');

const image = require('./assets/img/sidebar.jpg');
const logo = require('./assets/img/logo.png');

class App extends React.Component<AppStyle, {}> {
  render() {
    var classes = this.props.classes;

    return (
      <div>
        <Sidebar logo={logo} logoText="" image={image} routes={appRoutes}/>
        <div className={classes.mainPanel}>
          <div className={classes.content}>
            <Switch>
              {appRoutes.map(function (prop, key) { return <Route exact={prop.exact} path={prop.path} component={prop.component} key={key}/>; })}
            </Switch>
          </div>
          <Footer/>
        </div>
      </div>
    );
  }
}

module.exports = withStyles(appStyle)<{}>(App);
