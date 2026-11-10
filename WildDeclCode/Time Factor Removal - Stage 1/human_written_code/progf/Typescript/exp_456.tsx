var _import = require('react');
var Admin = require('react-admin').Admin;
var Resource = require('react-admin').Resource;
var DataProvider = require('react-admin').DataProvider;
var polyglotI18nProvider = require('ra-i18n-polyglot');

var authProvider = require('./authProvider');
var themeReducer = require('./themeReducer');
var emailReducer = require('./emailReducer');
var Login = require('./layout').Login;
var Layout = require('./layout').Layout;
var Dashboard = require('./dashboard').Dashboard;
var customRoutes = require('./routes');
var englishMessages = require('./i18n/en');

var inbox = require('./inbox');
var junk = require('./junk');
var sent = require('./sent');
var trash = require('./trash');
var projects = require('./projects');
var asset = require('./asset');
var settings = require('./settings');
var nft = require('./nft');
var dataProviderFactory = require('./dataProvider');
var GetEmail = require('./components/GetEmail');
var HideScrollInMobile = require('./components/HideScrollInMobile');

const i18nProvider = polyglotI18nProvider(function locale {
    if (locale === 'fr') {
        return import('./i18n/fr').then(messages => messages.default);
    }

    // Always fallback on english
    return englishMessages;
}, 'en');

const resources = [
    {
        name: 'mails',
        compontents: inbox,
        label: 'Inbox',
        useMock: false,
    },
    {
        name: 'junks',
        compontents: junk,
        label: 'Junk Mail',
        useMock: false,
    },
    {
        name: 'projects',
        compontents: projects,
        label: 'Subscription',
        useMock: true,
    },
    {
        name: 'sents',
        compontents: sent,
        label: 'Sent',
        useMock: false,
    },
    {
        name: 'trashs',
        compontents: trash,
        label: 'Trash',
        useMock: false,
    },
    {
        name: 'assets',
        compontents: asset,
        label: 'Assets',
        useMock: true,
    },
    {
        name: 'settings',
        compontents: settings,
        label: 'Settings',
        useMock: true,
    },
    {
        name: 'nfts',
        compontents: nft,
        label: 'NFT Market',
        useMock: true,
    },
]

const App = function () {
    return (
        <Admin
            title="Dmail"
            dataProvider={dataProviderFactory(
                'rest'
            )}
            customReducers={{ theme: themeReducer, email: emailReducer }}
            customRoutes={customRoutes}
            authProvider={authProvider}
            dashboard={Dashboard}
            loginPage={Login}
            layout={Layout}
            i18nProvider={i18nProvider}
            disableTelemetry
        >
            <GetEmail />
            <HideScrollInMobile />
            {resources.map(({ name, compontents, label }) => (
                <Resource
                    key={name}
                    name={name}
                    options={{ label }}
                    {...compontents}
                />
            ))}
        </Admin>
    );
};

module.exports = App;
