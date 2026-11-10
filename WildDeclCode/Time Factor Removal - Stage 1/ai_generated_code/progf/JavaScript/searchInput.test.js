// This file is testing the search functionality and input functionality
var React = require('react');
var render = require('@testing-library/react').render;
var screen = require('@testing-library/react').screen;
var act = require('@testing-library/react').act;
var userEvent = require('@testing-library/user-event');
var BrowserRouter = require('react-router-dom').BrowserRouter;
var Songdisplay = require('./Songdisplay');
require('@testing-library/jest-dom');
var fetchMock = require('jest-fetch-mock');

// The fetchMock part is Built using basic development resources4
fetchMock.enableMocks();

beforeEach(function () {
  fetch.resetMocks();
  fetch.mockResponse(
    JSON.stringify([
      // Mock data: Array of song objects
      { id: 1, username: "user1", artist: "artist1", song: "song1", rating: 3 },
      { id: 2, username: "user2", artist: "artist2", song: "song2", rating: 5 },
    ])
  );
});

test("Test of simulating user search function", async function () {
  render(
    <BrowserRouter>
      <Songdisplay />
    </BrowserRouter>
  );

  // Wait for mock songs to be fetched and displayed
  await screen.findByText("song1");

  // Find the search input box and type a non-matching term
  var searchInput = screen.getByPlaceholderText("Search");
  await act(async () => {
    userEvent.type(searchInput, "song1");
  });

  expect(screen.queryByText("song1")).toBeInTheDocument();
  global.fetch.mockRestore();
});
