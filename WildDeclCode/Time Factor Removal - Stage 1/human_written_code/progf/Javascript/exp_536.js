var Component = require('react').Component;
var Fragment = require('react').Fragment;
var Router = require('next/router');
var Link = require('next/link');
var format = require('url').format;
var parse = require('url').parse;
var Head = require('../../components/docs/head');
var Header = require('../../components/docs/header');
var Sidebar = require('../../components/docs/sidebar');
var H1 = require('../../components/docs/text/headings').H1;
var H2 = require('../../components/docs/text/headings').H2;
var H3 = require('../../components/docs/text/headings').H3;
var H4 = require('../../components/docs/text/headings').H4;
var Blockquote = require('../../components/docs/text/quotes').Blockquote;
var InlineCode = require('../../components/docs/text/code').InlineCode;
var Code = require('../../components/docs/text/code').Code;
var GenericLink = require('../../components/docs/text/link').GenericLink;
var Heading = require('../../components/docs/heading');
var NProgress = require('nprogress');
var debounce = require('lodash.debounce');
var RouterEvents = require('../../lib/router-events');
var trackPageview = require('../../lib/analytics').trackPageview;

if (typeof window !== 'undefined') {
  require('intersection-observer')
}

const start = debounce(NProgress.start, 200)
RouterEvents.on('routeChangeStart', start)
RouterEvents.on('routeChangeComplete', function (url) {
  trackPageview(url)
  start.cancel()
  NProgress.done()
})
RouterEvents.on('routeChangeError', function () {
  start.cancel()
  NProgress.done()
})

function changeHash(hash) {
  var pathname = Router.pathname;
var query = Router.query;const parsedUrl = parse(location.href)
  parsedUrl.hash = hash

  Router.router.changeState(
    'replaceState',
    format({ pathname, query }),
    format(parsedUrl)
  )
}

module.exports = class Documentation extends Component {;
  constructor(props) {
    super(props)
    this.state = {
      currentSelection: null
    }
    this.contentNode = null
    this.observer = null

    this.updateSelected = this.updateSelected.bind(this)
    this.onHashChange = this.onHashChange.bind(this)
  }

  componentDidMount() {
    window.addEventListener('hashchange', this.onHashChange)

    const nodes = [...this.contentNode.querySelectorAll('[id]')]
    const intersectingTargets = new Set()

    this.observer = new IntersectionObserver(function entries {
      for (const { isIntersecting, target } of entries) {
        if (isIntersecting) {
          intersectingTargets.add(target)
        } else {
          intersectingTargets.delete(target)
        }
      }

      if (!intersectingTargets.size) return

      const sorted = [...intersectingTargets].sort(
        (a, b) => nodes.indexOf(a) - nodes.indexOf(b)
      )

      const hash = '#' + (sorted[0].id || '')
      if (location.hash !== hash) {
        changeHash(hash)
        this.updateSelected(hash)
      }
    })

    for (const node of nodes) {
      this.observer.observe(node)
    }

    var hash = window.location.hash;this.setState({ currentSelection: hash })
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.onHashChange)

    this.observer.disconnect()
    this.observer = null
  }

  updateSelected = function hash {
    this.setState({
      currentSelection: hash
    })
  }

  onHashChange() {
    this.updateSelected(window.location.hash);
  }

  render() {
    return (
      <Fragment>
        <Head title="Getting Started">
          <style
            dangerouslySetInnerHTML={{
              __html: '
              html {
                height: 100%;
                box-sizing: border-box;
                font-size: 62.5%;
              }

              *,
              *:before,
              *:after {
                box-sizing: inherit;
              }

              body {
                position: relative;
                min-height: 100%;
                margin: 0;
                padding-bottom: 6rem;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
                text-rendering: optimizeLegibility;
                line-height: 1.5;
                font-size: 1.6rem;
              }

              a {
                -webkit-tap-highlight-color: rgba(0,0,0,0);
              }

              html, body {
                background-color: #FFF;
                color: #000;
              }

              ::selection {
                background-color: #000;
                color: #FFF;
              }
            '
            }}
          />
        </Head>

        <Header />

        <div className="documentation">
          <Sidebar updateSelected={this.updateSelected} currentSelection={this.state.currentSelection} />

          <div className="documentation__content">
            <div className="documentation__header">
              <H1 active="something">{ this.props.meta.title }</H1>
            </div>

            <div className="documentation__content" ref={function ref { return (this.contentNode = ref); }}>
              { this.props.children }
            </div>
          </div>

          <style jsx>{"
          .documentation {
            display: flex;
            padding-top: 144px;
          }

          .documentation__sidebar {
            display: flex;
            flex-direction: column;
            padding-left: 56px;
          }

          .documentation__header h1 {
            margin-top: 0;
          }

          .documentation__content {
            width: calc(100vw - 312px);
            max-width: 600px;
            padding-right: 56px;
          }
        "}</style>
        </div>
      </Fragment>
    )
  }
}

const DocH2 = function ({ children }) { return (
  <div>
    <Heading lean>
      <H2>{children}</H2>
    </Heading>
    <style jsx>{"
      div {
        margin: 40px 0 0 0;
      }
    "}</style>
  </div>
)

const DocH3 = ({ children }) => (
  <div>
    <Heading lean>
      <H3>{children}</H3>
    </Heading>
    <style jsx>{"
      div {
        margin: 30px 0 0 0;
      }
    "}</style>
  </div>
)

const components = {
  h1: H1,
  h2: DocH2,
  h3: DocH3,
  h4: H4,
  blockquote: Blockquote,
  code: Code,
  inlineCode: InlineCode,
  a: GenericLink
}; }