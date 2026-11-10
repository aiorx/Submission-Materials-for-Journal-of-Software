//Products.test.jsx

// Tests Originally Formed using common development resources
// Modified to fit the needs of Team12
var React = require('react');
var render = require('@testing-library/react').render;
var screen = require('@testing-library/react').screen;
require('@testing-library/jest-dom');
var Products = require('./Products');

// Mock products data if it's not imported in this test file
var mockProducts = [
    { id: 1, title: 'Lifetime Drones', quote: 'Product 1 Quote', buttonLabel: 'View Product 1', location: '/product1' },
    { id: 2, title: 'Construction Wizard', quote: 'Product 2 Quote', buttonLabel: 'View Product 2', location: '/product2' },
    // Add more mock products if needed
];

describe('Products Component', function () {
    test('renders products with titles, quotes, and buttons', () => {
        render(<Products />);
        mockProducts.forEach(product => {
            expect(screen.getByText(product.title)).toBeInTheDocument();
            expect(screen.getByText(product.quote)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: product.buttonLabel })).toBeInTheDocument();
        });
    });

    // You can add more tests here to verify other functionalities
});
