var RuleTester = require('eslint').RuleTester;
var rule = require('../require-memo');

const ruleTester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    ecmaFeatures: { jsx: true },
  },
});

ruleTester.run("memo", rule, {
  valid: [
    {
      code: "var Component = React.memo(() => <div />)",
    },
    {
      code: "var Component = memo(() => <div />)",
    },
    {
      code: "var Component = memo(useRef(() => <div />))",
    },
    {
      code: "var Component = React.useRef(React.memo(() => <div />))",
    },
    {
      code: "var myFunction = () => <div />",
    },
    {
      code: "var myFunction = wrapper(() => <div />)",
    },
    {
      code: "var Component = React.memo(function() { return <div />; });",
    },
    {
      code: "var Component = memo(function Component() { return <div />; });",
    },
    {
      code: "var myFunction = () => <div />",
    },
    {
      code: "var myFunction = wrapper(() => <div />)",
    },
    {
      code: "function myFunction() { return <div />; }",
    },
    {
      code: "var myFunction = wrapper(function() { return <div /> })",
    },
    {
      filename: "dir/myFunction.js",
      parserOptions: { ecmaVersion: 6, sourceType: "module" },
      code: "export default function() { return <div /> };",
    },
  ],
  invalid: [
    {
      code: "var Component = () => <div />",
      errors: [{ messageId: "memo-required" }],
    },
    {
      code: "var Component = useRef(() => <div />)",
      errors: [{ messageId: "memo-required" }],
    },
    {
      code: "var Component = function Component() { return <div />; }",
      errors: [{ messageId: "memo-required" }],
    },
    {
      code: "var Component = useRef(function() { return <div />; })",
      errors: [{ messageId: "memo-required" }],
    },
    {
      code: "function Component() { return <div />; }",
      errors: [{ messageId: "memo-required" }],
    },
    // {
    //   filename: "dir/Component.js",
    //   parserOptions: { ecmaVersion: 6, sourceType: "module" },
    //   code: `export default function() { return <div /> };`,
    //   errors: [{ messageId: "memo-required" }],
    // },
  ],
});
