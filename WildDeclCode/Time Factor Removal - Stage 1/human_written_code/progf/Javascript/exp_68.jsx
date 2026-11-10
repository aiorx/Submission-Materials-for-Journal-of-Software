var App = require('weact').App;
require('./pages/index.jsx');
require('./pages/page1.jsx');
require('./pages/page2.jsx');

module.exports = class extends App {;
  debug = true

  window = {
    navigationBarTitleText: '你好，小程序',
    navigationBarTextStyle: 'black',
    navigationBarBackgroundColor: '#f4f5f6',
    backgroundColor: '#f4f5f6',
    backgroundTextStyle: 'dark',
  }

  tabBar = {
    color: '#333333',
    selectedColor: '#0095d4',
    borderStyle: 'black',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '🏠',
      },
      {
        pagePath: 'pages/page1/page1',
        text: 'Page 1',
      },
      {
        pagePath: 'pages/page2/page2',
        text: 'Page 2',
      },
    ],
  }

  onLaunch() {
    console.log('app: hello world')
  }

  onShow() {
    console.log('app: yes, I am')
  }

  onHide() {
    console.log('app: just minutes')
  }

  onError() {
    console.log('app: woops')
  }
}