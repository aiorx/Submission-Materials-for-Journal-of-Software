var React = require('react');
import {
  BrowserRouter,
  Route,
  Redirect,
  RouteComponentProps,
} from 'react-router-dom';
var AuthScreen = require('./components/AuthScreen');
var ChatRoomScreen = require('./components/ChatRoomScreen');
var ChatsListScreen = require('./components/ChatsListScreen');
var ChatCreationScreen = require('./components/ChatCreationScreen');
var AnimatedSwitch = require('./components/AnimatedSwitch');
var withAuth = require('./services/auth.service').withAuth;

const App: React.FC = function () { return (
  <BrowserRouter>
    <AnimatedSwitch>
      <Route exact path="/sign-(in|up)" component={AuthScreen} />
      <Route exact path="/chats" component={withAuth(ChatsListScreen)} />

      <Route
        exact
        path="/chats/:chatId"
        component={withAuth(
          ({ match, history }: RouteComponentProps<{ chatId: string }>) => (
            <ChatRoomScreen chatId={match.params.chatId} history={history} />
          )
        )}
      />

      <Route exact path="/new-chat" component={withAuth(ChatCreationScreen)} />
    </AnimatedSwitch>
    <Route exact path="/" render={redirectToChats} />
  </BrowserRouter>
); };

const redirectToChats = function () { return <Redirect to="/chats" />; };

module.exports = App;
