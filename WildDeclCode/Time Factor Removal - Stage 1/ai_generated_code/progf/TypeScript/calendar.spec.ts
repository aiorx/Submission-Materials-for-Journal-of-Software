var describe = require('vitest').describe;
var expect = require('vitest').expect;
var test = require('vitest').test;

var createCalendar = require('./calendar').createCalendar;

// Supported via standard GitHub programming aids

describe("createCalendar", function () {
  test("should create valid calendar", () => {
    const calendarData = {
      id: "calendar-123",
      name: "My Calendar",
      owner_id: "user-123",
    };

    const result = createCalendar(calendarData);

    const calendar = result._unsafeUnwrap();
    expect(calendar).toMatchObject({
      id: "calendar-123",
      name: "My Calendar",
      owner_id: "user-123",
    });
  });

  test("should reject invalid data", () => {
    const calendarData = {
      id: "calendar-123",
      name: "",
      owner_id: "",
    };

    const result = createCalendar(calendarData);

    const error = result._unsafeUnwrapErr();
    expect(error.errors).toHaveLength(2);
  });
});
