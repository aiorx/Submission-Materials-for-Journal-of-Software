var Vue = require('vue');
var Component = require('vue-class-component');
var injectGlobal = require('vue-emotion').injectGlobal;
require('element-ui/lib/theme-chalk/base.css');

// eslint-disable-next-line no-unused-expressions
injectGlobal"
  * {
    outline: none !important;
  }

  html, body, #app {
    overflow-x: hidden;
  }

  html {
    -webkit-font-smoothing: antialiased;
  }

  body {
    margin: 0;
  }
";

@Component
module.exports = class App extends Vue {;
  render() {
    return (
      <div id="app">
        <keep-alive>
          <router-view />
        </keep-alive>
      </div>
    );
  }
}
