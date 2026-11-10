var React = require('react');

var ToastContainer = require('react-toastify').ToastContainer;
var toast = require('react-toastify').toast;
var ApiService = require('../services/ApiService').ApiService;
var AuthService = require('../services/AuthService').AuthService;

var AuthContent = require('./AuthContent');
var Buttons = require('./Buttons');

module.exports = class AppContent extends React.Component<any, any> {;
  public authService: AuthService;
  public apiService: ApiService;
  private shouldCancel: boolean;

  constructor(props: any) {
    super(props);

    this.authService = new AuthService();
    this.apiService = new ApiService();
    this.state = { user: {}, api: {} };
    this.shouldCancel = false;
  }

  public componentDidMount() {
    this.getUser();
  }

  public login = function () {
    this.authService.login();
  };

  public callApi = function () {
    this.apiService
      .callApi()
      .then(data => {
        this.setState({ api: data.data });
        toast.success('Api return successfully data, check in section - Api response');
      })
      .catch(error => {
        toast.error(error);
      });
  };

  public componentWillUnmount() {
    this.shouldCancel = true;
  }

  public renewToken = function () {
    this.authService
      .renewToken()
      .then(user => {
        toast.success('Token has been sucessfully renewed. :-)');
        this.getUser();
      })
      .catch(error => {
        toast.error(error);
      });
  };

  public logout = function () {
    this.authService.logout();
  };

  public getUser = function () {
    this.authService.getUser().then(user => {
      if (user) {
        toast.success('User has been successfully loaded from store.');
      } else {
        toast.info('You are not logged in.');
      }

      if (!this.shouldCancel) {
        this.setState({ user });
      }
    });
  };

  public render() {
    return (
      <>
        <ToastContainer />

        <Buttons
          login={this.login}
          logout={this.logout}
          renewToken={this.renewToken}
          getUser={this.getUser}
          callApi={this.callApi}
        />

        <AuthContent api={this.state.api} user={this.state.user} />
      </>
    );
  }
}
