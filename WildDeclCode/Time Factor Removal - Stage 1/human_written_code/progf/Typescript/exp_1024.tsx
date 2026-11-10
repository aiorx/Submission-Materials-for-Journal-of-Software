// Libs
var React = require('react');
var Grid = require('semantic-ui-react').Grid;

// Redux
var connect = require('react-redux').connect;

// Actions
var addTimeEntries = require('@/stores/actions/timeEntries').addTimeEntries;
var addProjects = require('@/stores/actions/projects').addProjects;
var addTasks = require('@/stores/actions/tasks').addTasks;

// Selectors
var filtersSelector = require('@/stores/selectors/filters').filtersSelector;

// Components
var TasksByHours = require('@/components/domain/TasksByHours/TasksByHours');
var DatePicker = require('@/components/domain/DatePicker/DatePicker');
var EditForm = require('@/components/domain/EditForm/EditForm');
var TimeEntries = require('@/components/domain/TimeEntries/TimeEntries');
var DataOverview = require('@/components/domain/DataOverview/DataOverview');
var OAuthOverlay = require('@/components/domain/OAuthOverlay/OAuthOverlay');

// Hooks
var useGetTimeEntries = require('./hooks/useGetTimeEntries/useGetTimeEntries').useGetTimeEntries;
var useGetProjects = require('./hooks/useGetProjects/useGetProjects').useGetProjects;
var useGetTasks = require('./hooks/useGetTasks/useGetTasks').useGetTasks;
var useOAuthCredentials = require('./hooks/useOAuthCredentials/useOAuthCredentials').useOAuthCredentials;

// Types
var groupsType = require('@/types/Group').groupsType;
var AppProps = require('./App.types').AppProps;

// Styles
var styles = require('./App.module.scss');

var filterAPIDataForState = function (list: groupsType) {
    return list.map((item) => {
        return {
            id: item.id,
            name: item.name,
        };
    });
};

var App = function ({filters, addTimeEntries, addProjects, addTasks}: AppProps) {
    var isOAuthCredentials = useOAuthCredentials();
    useGetTasks(filterAPIDataForState, addTasks);
    useGetProjects(filterAPIDataForState, addProjects);
    useGetTimeEntries(filters, addTimeEntries);

    return (
        <>
            <nav className={styles['app-navbar']}>
                <h1 className={styles['app-title']}>Harvest V2 API Client</h1>
            </nav>
            <section className={styles.App}>
                {isOAuthCredentials ? (
                    // @ts-ignore
                    <Grid>
                        <Grid.Column width={16}>
                            <DatePicker />
                        </Grid.Column>

                        <Grid.Column width={16}>
                            <EditForm />
                        </Grid.Column>

                        <DataOverview />

                        <TasksByHours />

                        <TimeEntries />
                    </Grid>
                ) : (
                    <OAuthOverlay />
                )}
            </section>
        </>
    );
};

var mapStateToProps = function (state: any) {
    return {
        filters: filtersSelector(state),
    };
};

var mapDispatchToProps = {
    addTimeEntries,
    addProjects,
    addTasks,
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(App);
