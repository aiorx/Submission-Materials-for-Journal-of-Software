/* eslint-env jest */
var React = require('react');
var act = require('@testing-library/react').act;
var render = require('@testing-library/react').render;
var RouterContext = require('next/dist/next-server/lib/router-context').RouterContext;
var About = require('../pages/about');

it('says "we integrate Apollo seamlessly with Next"', async function () {
  var router = {
    pathname: "/about",
    route: "/about",
    query: {},
    asPath: "/about"
  };

  var container;
  await act(async () => {
    container = render(
      <RouterContext.Provider value={router}>
        <About />
      </RouterContext.Provider>
    ).container;
  });

  expect(container.textContent).toMatch(
    /we integrate Apollo seamlessly with Next/
  );
});
