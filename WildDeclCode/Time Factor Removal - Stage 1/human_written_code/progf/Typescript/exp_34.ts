var SocketAppPage = require('./app.po').SocketAppPage;

describe('socket-app App', function () {
  let page: SocketAppPage;

  beforeEach(() => {
    page = new SocketAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
