var React = require('react');
var Structure = require('./MainStructure');
var WelcomePage = require('./Welcome');
var ComfortPricing = require('./ComfortPricing');
var SummerSpecial = require('./SummerSpecial');
var LastMinute = require('./LastMinute');
var FraudDetection = require('./FraudDetection');

var Router = require('react-router-dom').BrowserRouter;
var Switch = require('react-router-dom').Switch;
var Route = require('react-router-dom').Route;
var PricingTest = require('./PricingTest');

const App = function () {
    return (
        <Router>
            <Switch>
                <Structure>
                    <Route path="/" exact>
                        <WelcomePage />
                    </Route>
                    <Route path="/comfort" exact>
                        <ComfortPricing />
                    </Route>
                    <Route path="/summer" exact>
                        <SummerSpecial />
                    </Route>
                    <Route path="/last-minute" exact>
                        <LastMinute />
                    </Route>
                    <Route path="/fraud-detection" exact>
                        <FraudDetection />
                    </Route>
                    <Route path="/pricing-test" exact>
                        <PricingTest />
                    </Route>
                </Structure>
            </Switch>
        </Router>
    );
};

module.exports = App;
