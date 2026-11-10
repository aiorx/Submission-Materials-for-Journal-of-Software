var _import = require('react');
require('./App.css');
var LoginControl = require('./login/login-control').LoginControl;
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
var MyMeetingsGroups = require('./meetings/my-meeting-groups/my-meetings-groups').MyMeetingsGroups;
var CreateMeetingGroup = require('./meetings/my-meeting-groups/create-meeting-group').CreateMeetingGroup;
var AdministrationMeetingGroupProposalsList = require('./administration/MeetingGroupProposals/meeting-group-proposals-list').AdministrationMeetingGroupProposalsList;
var SubscriptionBuy = require('./payments/subscriptions/subscription-buy').SubscriptionBuy;
var MeetingGroupDetails = require('./meetings/meeting-groups/meeting-group-details').MeetingGroupDetails;
var CreateMeeting = require('./meetings/create-meeting').CreateMeeting;
var MeetingDetails = require('./meetings/meeting-details').MeetingDetails;
var UserRegistrationForm = require('./user-registration/user-registration-form').UserRegistrationForm;
var AllEmailsList = require('./emails/all-emails-list').AllEmailsList;
var RegistrationConfirm = require('./user-registration/registration-confirm').RegistrationConfirm;
var AllMeetingGrups = require('./meetings/meeting-groups/all-meeting-groups').AllMeetingGrups;
var MyMeetings = require('./meetings/my-meetings/my-meetings').MyMeetings;
var AuthenticationService = require('./login/authentication/authentication-service').AuthenticationService;
var HttpClient = require('./shared/http-client').HttpClient;
var SubscriptionDetails = require('./payments/subscriptions/subscription-details').SubscriptionDetails;
var SubscriptionPaymentStatus = require('./payments/subscriptions/subscription-payment-status').SubscriptionPaymentStatus;
var SubscriptionPaymentSuccess = require('./payments/subscriptions/subscription-payment-success').SubscriptionPaymentSuccess;


interface Permission {
    code: string;
}


function App() {

    const [permissions, setPermissions] = useState<Array<Permission>>([]);

    useEffect(function () {
        loadPermissions();
    }, []);

    function loadPermissions() {
        const isAuthenticated = AuthenticationService.isAuthenticated();

        if (isAuthenticated) {
            HttpClient.get<Array<Permission>>('api/userAccess/authenticatedUser/permissions')
                .then(function response { return setPermissions(response); });
        }
    }

    function isAuthenticated(): boolean {
        return AuthenticationService.isAuthenticated();
    }

    function hasPermission(permission: string): boolean {
        return permissions.map(function x { return x.code; }).includes(permission);
    }

    return (
        <div className="App">
            <header className="App-header">


                <LoginControl />

                <Router>
                    <div className="container">
                        <div id="menu">

                            <span><Link to="/">Home</Link></span>

                            {hasPermission('MyMeetingsGroupsView') &&
                                <span><Link to="/my-meeting-groups">My Meeting Groups</Link></span>
                            }

                            {hasPermission('MyMeetingsView') &&
                                <span><Link to="/my-meetings">My Meetings</Link></span>
                            }

                            {hasPermission('AllMeetingGroupsView') &&
                                <span><Link to="/meeting-groups">Explore Meeting Groups</Link></span>
                            }

                            {hasPermission('AdministrationsView') &&
                                <span><Link to="/administration/meetingGroupProposals">Administration</Link></span>
                            }

                            {hasPermission('SubscriptionView') &&
                                <span><Link to="/subscription">Subscription</Link></span>
                            }

                            {!isAuthenticated() &&
                                <span><Link to="/register">Registration</Link></span>
                            }


                            <span><Link to="/emails">Emails</Link></span>

                        </div>

                        <Route exact path="/my-meeting-groups/" component={MyMeetingsGroups} />
                        <Route exact path="/meeting-groups/" component={AllMeetingGrups} />
                        <Route exact path="/meeting-groups-create/" component={CreateMeetingGroup} />
                        <Route exact path="/meeting-groups/:meetingGroupId/meetings/create" component={CreateMeeting} />
                        <Route exact path="/meeting-groups/:meetingGroupId" component={MeetingGroupDetails} />
                        <Route exact path="/subscription" component={SubscriptionDetails} />
                        <Route exact path="/subscription/buy" component={SubscriptionBuy} />
                        <Route exact path="/subscription/payment-status" component={SubscriptionPaymentStatus} />
                        <Route exact path="/subscription/payment-success" component={SubscriptionPaymentSuccess} />
                        <Route exact path="/administration/meetingGroupProposals" component={AdministrationMeetingGroupProposalsList} />
                        <Route exact path="/my-meetings" component={MyMeetings} />
                        <Route exact path="/meetings/:meetingId" component={MeetingDetails} />
                        <Route exact path="/register" component={UserRegistrationForm} />
                        <Route exact path="/emails" component={AllEmailsList} />
                        <Route exact path="/registration-confirm/:registrationId" component={RegistrationConfirm} />
                    </div>
                </Router>

            </header>
        </div>
    );
}

module.exports = App;
