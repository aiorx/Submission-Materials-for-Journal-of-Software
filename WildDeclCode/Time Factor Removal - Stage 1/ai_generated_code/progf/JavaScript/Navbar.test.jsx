//Navbar.test.jsx

// Tests Originally Designed via basic programming aids
// Modified to fit the needs of Team12
var React = require('react');
var render = require('@testing-library/react').render;
var screen = require('@testing-library/react').screen;
require('@testing-library/jest-dom');
var Navigation = require('../Navbar/Navbar');
var BrowserRouter = require('react-router-dom').BrowserRouter;

describe('Navigation Component', function () {
    test('renders Navigation with links and buttons', () => {
        render(
            <BrowserRouter>
                <Navigation />
            </BrowserRouter>
        );
        expect(screen.getByText(/home/i)).toBeInTheDocument();
        expect(screen.getByText(/about us/i)).toBeInTheDocument();
        expect(screen.getByText(/products/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });
});
