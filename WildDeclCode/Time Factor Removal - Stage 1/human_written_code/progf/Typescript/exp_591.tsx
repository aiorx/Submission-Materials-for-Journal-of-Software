var React = require('react');
var render = require('@testing-library/react').render;
var Message = require('../Message');

test('find text "test message name"', function () {
    var getByText = render.getByText;((
        <Message
            avatar=""
            name="test message name"
            message=""
            time=""
        />
    ))
    const linkElement = getByText(/test message name/i)
    expect(linkElement).toBeInTheDocument()
})
test('find text "test message"', function () {
    var getByText = render.getByText;((
        <Message
            avatar=""
            name=""
            message="test message"
            time=""
        />
    ))
    const linkElement = getByText(/test message/i)
    expect(linkElement).toBeInTheDocument()
})
test('find text "test message time"', function () {
    var getByText = render.getByText;((
        <Message
            avatar=""
            name=""
            message=""
            time="test message time"
        />
    ))
    const linkElement = getByText(/test message time/i)
    expect(linkElement).toBeInTheDocument()
})
