// This file is testing the search functionality and input functionality
import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Songdisplay from "./Songdisplay";
import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";

// The fetchMock part is Built using basic development resources4
fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
  fetch.mockResponse(
    JSON.stringify([
      // Mock data: Array of song objects
      { id: 1, username: "user1", artist: "artist1", song: "song1", rating: 3 },
      { id: 2, username: "user2", artist: "artist2", song: "song2", rating: 5 },
    ])
  );
});

test("Test of simulating user search function", async () => {
  render(
    <BrowserRouter>
      <Songdisplay />
    </BrowserRouter>
  );

  // Wait for mock songs to be fetched and displayed
  await screen.findByText("song1");

  // Find the search input box and type a non-matching term
  const searchInput = screen.getByPlaceholderText("Search");
  await act(async () => {
    userEvent.type(searchInput, "song1");
  });

  expect(screen.queryByText("song1")).toBeInTheDocument();
  global.fetch.mockRestore();
});
