//SignUp.test.jsx

// Tests Originally Formed using common development resources
// Modified to fit the needs of Team12
var React = require('react');
var render = require('@testing-library/react').render;
var fireEvent = require('@testing-library/react').fireEvent;
var screen = require('@testing-library/react').screen;
require('@testing-library/jest-dom');
var SignUp = require('./SignUp');
var axios = require('axios');

jest.mock('axios');

describe('SignUp Component', function () {
    test('renders SignUp form with required fields', () => {
        render(<SignUp />);
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    // Passwords do not match test. It should make a non-popup window alert.
    // test('displays error when passwords do not match', () => {
    //     render(<SignUp />);
    //     fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    //     fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'different123' } });
    //     fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    //     expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
    // });

    // Add more tests here as needed, such as form submission, axios mocking, etc.
});
