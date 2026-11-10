var React = require('react');
var renderWithTheme = require('../../testHelpers').renderWithTheme;
var Breadcrumbs = require('../../components/Breadcrumbs/Breadcrumbs');

it("renders correctly", function () {
  var asFragment = renderWithTheme.asFragment;(<Breadcrumbs>Link</Breadcrumbs>);
  expect(asFragment()).toMatchInlineSnapshot('
    <DocumentFragment>
      <ul
        class="sc-dlfnbm lhEQuh"
      />
    </DocumentFragment>
  ');
});
