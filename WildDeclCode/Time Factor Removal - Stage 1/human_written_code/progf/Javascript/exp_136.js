var React = require('react');
var MDXProvider = require('@mdx-js/tag').MDXProvider;
var Global = require('@emotion/core').Global;
var css = require('@emotion/core').css;

const code = function ({ className, children }) {
  if (className === 'language-cssx') {
    return (
      <Global
        styles={css"
          " + (children) + "
        "}
      />
    )
  }

  return <code>{children}</code>
}

module.exports = function ({ children, components }) { return (;
  <MDXProvider components={{ ...components, code }}>{children}</MDXProvider>
); }