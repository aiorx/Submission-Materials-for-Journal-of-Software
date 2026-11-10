/* eslint-env jest */
var React = require('react');
var act = require('@testing-library/react').act;
var render = require('@testing-library/react').render;
var waitForElement = require('@testing-library/react').waitForElement;
var RouterContext = require('next/dist/next-server/lib/router-context').RouterContext;
var Index = require('../pages/index');

var routerValue = {
  pathname: "/",
  route: "/",
  query: {},
  asPath: "/"
};

it("renders attribution footnote", async function () {
  var container;
  await act(async () => {
    container = render(
      <RouterContext.Provider value={routerValue}>
        <Index />
      </RouterContext.Provider>
    ).container;
  });

  expect(container.textContent).toMatch(/Made by @adamSoffer/);
});

it("renders some posts from the query", async function () {
  var findAllByTestId;
  await act(async () => {
    var renderResult = render(
      <RouterContext.Provider value={routerValue}>
        <Index />
      </RouterContext.Provider>
    );

    findAllByTestId = renderResult.findAllByTestId;
  });

  var listEntries = await waitForElement(() =>
    findAllByTestId("postListListItem")
  );

  expect(listEntries.length).toBeGreaterThan(0);
});
