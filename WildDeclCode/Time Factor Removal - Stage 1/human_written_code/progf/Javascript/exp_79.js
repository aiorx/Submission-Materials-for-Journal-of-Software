var webpack = require('webpack');
var NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {;
  plugins: [
    // fixes Module not found: Error: Can't resolve 'stream' in '.../node_modules/nofilter/lib'
    new NodePolyfillPlugin({}),
    // Note: stream-browserify has assumption about `Buffer` global in its
    // dependencies causing runtime errors. This is a workaround to provide
    // global `Buffer` until https://github.com/isaacs/core-util-is/issues/29
    // is fixed.
    new webpack.ProvidePlugin({
      global: ['global']
    })
  ]
};
