var nodeResolve = require('@rollup/plugin-node-resolve');
var json = require('@rollup/plugin-json');
var typescript = require('rollup-plugin-typescript2');
var terser = require('rollup-plugin-terser').terser;
var babel = require('@rollup/plugin-babel');

const dev = process.env.ROLLUP_WATCH;

module.exports = {;
  input: "src/main.ts",
  output: {
    file: "auto-entities.js",
    format: "es",
  },
  plugins: [
    nodeResolve(),
    json(),
    typescript(),
    babel({
      exclude: "node_modules/**",
    }),
    !dev && terser({ format: { comments: false } }),
  ],
};
