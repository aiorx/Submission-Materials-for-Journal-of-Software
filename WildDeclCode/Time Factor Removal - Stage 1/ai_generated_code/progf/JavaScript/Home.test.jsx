// Home.test.jsx

// Tests Originally Crafted with standard coding tools
// Modified to fit the needs of Team12

var React = require('react');
var render = require('@testing-library/react').render;
var fireEvent = require('@testing-library/react').fireEvent;
var screen = require('@testing-library/react').screen;
var Home = require('./Home');
var BrowserRouter = require('react-router-dom').BrowserRouter;

// Helper function to wrap Home with BrowserRouter since it uses navigation
var renderWithRouter = function (ui, { route = '/' } = {}) {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: BrowserRouter });
};

test('renders Home component with welcome message, quote, and button', function () {
    renderWithRouter(<Home />);
    expect(screen.getByText('Welcome to WeGo!')).toBeInTheDocument();
    expect(screen.getByText(/redefine transportation/)).toBeInTheDocument(); // You can use regex for long text
    expect(screen.getByRole('button', { name: 'View Products' })).toBeInTheDocument();
});

test('renders an image with the correct src and alt attributes', function () {
    renderWithRouter(<Home />);
    var image = screen.getByRole('img', { name: 'Man Opening Box for WeGo Homepage' });
    expect(image).toHaveAttribute('src', '/happyman.png');
    expect(image).toHaveAttribute('alt', 'Man Opening Box for WeGo Homepage');
});