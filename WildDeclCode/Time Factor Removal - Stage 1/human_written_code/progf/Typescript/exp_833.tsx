var React = require('react');

var screen = require('@testing-library/react').screen;
var waitFor = require('@testing-library/react').waitFor;
var App = require('./App');
var renderWithRouter = require('./test-utils/RenderWithRouter');

const mockedComponent = function () { return <></>; };
jest.mock('./components/layout/RecentAnimalsContainer', function () { return mockedComponent; });
jest.mock('./components/layout/RecentEventsContainer', function () { return mockedComponent; });

test('full app rendering/navigating', async function () {
    // Home page
    renderWithRouter(<App />);
    await waitFor(() => {
        expect(screen.getByText(/Pets information system/i)).toBeInTheDocument();
    });

    // todo - testing router on responsive cases
    // test needs to be set with certain media
    // https://material-ui.com/components/use-media-query/#testing

    /*
      // navigation to About page
      var leftClick = { button: 0 }
      userEvent.click(screen.getByText(/About/i), leftClick)

      expect(screen.getByTestId('location-display')).toHaveTextContent('/about')
      */
});

test('landing on a bad page', async function () {
    renderWithRouter(<App />, { route: '/not-found' });

    await waitFor(() => {
        expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
    });
});
