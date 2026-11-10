var inputActions = require('../inputActions');
var Store = require('../../store').Store;

describe("actions/input", function () {
    it("should create action to set input", () => {
        expect(
            inputActions.setInput("foo")
        ).toEqual({
            type: "SET_INPUT",
            input: "foo"
        });
    });
});