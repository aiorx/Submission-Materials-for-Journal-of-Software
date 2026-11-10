//Footer.test.jsx

// Tests Originally Crafted with standard coding tools
// Modified to fit the needs of Team12a
var React = require('react');
var render = require('@testing-library/react').render;
var screen = require('@testing-library/react').screen;
require('@testing-library/jest-dom');
var Footer = require('./Footer');

describe('Footer Component', function () {
    test('renders Footer with copyright text', () => {
        render(<Footer />);
        var footerElement = screen.getByText('Copyright © 2024 by WeGo. All rights reserved.');
        expect(footerElement).toBeInTheDocument();
    });
});
