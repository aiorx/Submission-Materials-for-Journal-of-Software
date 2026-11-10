var React = require('react');
var Segment = require('semantic-ui-react').Segment;
var IntlProvider = require('react-intl').IntlProvider;
var addLocaleData = require('react-intl').addLocaleData;
var en = require('react-intl/locale-data/en');
var fr = require('react-intl/locale-data/fr');
var translations = require('./translations').translations;

var BasicForm = require('./forms/Basic').BasicForm;
var ValidatedForm = require('./forms/Validated').ValidatedForm;
var AsyncForm = require('./forms/Async').AsyncForm;
var IntlForm = require('./forms/Intl').IntlForm;
var RadioForm = require('./forms/RadioButtons').RadioForm;
var LinkedInputForm = require('./forms/LinkedInput').LinkedInputForm;

addLocaleData([...en, ...fr]);

class App extends React.Component<{}, { locale: string }> {
    state = {
        locale: "en"
    };

    changeLocale = function (locale: string) { return () => this.setState({ locale }); };

    render() {
        return (
            <IntlProvider
                locale={this.state.locale}
                messages={translations[this.state.locale]}
            >
                <div>
                    <Segment padded="very">
                        <BasicForm />
                    </Segment>

                    <Segment padded="very">
                        <RadioForm />
                    </Segment>

                    <Segment padded="very">
                        <ValidatedForm />
                    </Segment>

                    <Segment padded="very">
                        <AsyncForm />
                    </Segment>

                    <Segment padded="very">
                        <IntlForm changeLocale={this.changeLocale} />
                    </Segment>

                    <Segment padded="very">
                        <LinkedInputForm />
                    </Segment>
                </div>
            </IntlProvider>
        );
    }
}
