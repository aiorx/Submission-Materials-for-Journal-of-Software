var App = require('next/app');
var ViewProvider = require('@providers/view').ViewProvider;
var PageTransition = require('next-page-transitions').PageTransition;
require('@/theme/antd.less');
require('@/theme/reset.scss');
require('@/theme/markdown.scss');

let lastUrl;

const addView = function url {
  if (/admin/.test(url)) {
    return;
  }

  ViewProvider.addView({ url });
};

class MyApp extends App {
  componentDidMount() {
    try {
      const el = document.querySelector("#holderStyle");
      el.parentNode.removeChild(el);
    } catch (e) {}

    const url = window.location.href;
    lastUrl = url;
    addView(url);
  }

  componentDidUpdate() {
    const url = window.location.href;

    if (url === lastUrl) {
      return;
    }

    lastUrl = url;
    addView(url);
  }

  render() {
    var Component = this.props.Component;
var pageProps = this.props.pageProps;
var router = this.props.router;
    // var pathname = router.pathname;
    // var isAdmin = /admin/.test(pathname);

    return (
      <div>
        <style
          id="holderStyle"
          dangerouslySetInnerHTML={{
            __html: " * {
      transition: none !important;
    }"
          }}
        ></style>
        {/* {isAdmin ? (
          <Component {...pageProps} />
        ) : (
          <PageTransition
            timeout={250}
            classNames="page-transition"
            loadingComponent={null}
            loadingDelay={500}
            loadingTimeout={{
              enter: 250,
              exit: 0
            }}
          >
            <Component {...pageProps} />
          </PageTransition>
        )} */}
        <Component {...pageProps} />
      </div>
    );
  }
}

module.exports = MyApp;
