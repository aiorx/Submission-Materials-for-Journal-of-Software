var React = require('react');
require('./App.css');
var OrgChart = require('@unicef/react-org-chart');
var BrowserRouter = require('react-router-dom').BrowserRouter;
var Route = require('react-router-dom').Route;
var tree = require('./Tree').tree;
var tree1 = require('./Tree').tree1;
var tree2 = require('./Tree').tree2;
var tree3 = require('./Tree').tree3;
var tree4 = require('./Tree').tree4;
var avatarPersonnel = require('./assets/avatar-personnel.svg');

module.exports = class App extends React.Component {;
  constructor(props) {
    super(props)

    this.state = {
      tree: tree,
      downloadingChart: false,
      config: {},
      highlightPostNumbers: [1],
    }
  }

  getChild = function id {
    switch (id) {
      case 100:
        return tree1
      case 36:
        return tree2
      case 56:
        return tree3
      case 25:
        return tree4
      default:
        return console.log('no children')
    }
  }

  getParent = function d {
    if (d.id === 100) {
      return {
        id: 500,
        person: {
          id: 500,
          avatar: avatarPersonnel,
          department: '',
          name: 'Pascal ruth',
          title: 'Member',
          totalReports: 1,
        },
        hasChild: false,
        hasParent: true,
        children: [d],
      }
    } else if (d.id === 500) {
      return {
        id: 1,
        person: {
          id: 1,
          avatar: avatarPersonnel,
          department: '',
          name: 'Bryce joe',
          title: 'Director',
          totalReports: 1,
        },
        hasChild: false,
        hasParent: false,
        children: [d],
      }
    } else {
      return d
    }
  }

  handleDownload = function () {
    this.setState({ downloadingChart: false })
  }

  handleOnChangeConfig = function config {
    this.setState({ config: config })
  }

  handleLoadConfig = function () {
    var config = this.state.config;return config
  }

  render() {
    var tree = this.state.tree;
var downloadingChart = this.state.downloadingChart;//For downloading org chart as image or pdf based on id
    const downloadImageId = 'download-image'
    const downloadPdfId = 'download-pdf'

    return (
      <BrowserRouter basename="/react-org-chart">
        <Route exact path="/">
          <React.Fragment>
            <div className="zoom-buttons">
              <button
                className="btn btn-outline-primary zoom-button"
                id="zoom-in"
              >
                +
              </button>
              <button
                className="btn btn-outline-primary zoom-button"
                id="zoom-out"
              >
                -
              </button>
            </div>
            <div className="download-buttons">
              <button className="btn btn-outline-primary" id="download-image">
                Download as image
              </button>
              <button className="btn btn-outline-primary" id="download-pdf">
                Download as PDF
              </button>
              <a
                className="github-link"
                href="https://github.com/unicef/react-org-chart"
              >
                Github
              </a>
              {downloadingChart && <div>Downloading chart</div>}
            </div>
            <OrgChart
              tree={tree}
              downloadImageId={downloadImageId}
              downloadPdfId={downloadPdfId}
              onConfigChange={function config {
                this.handleOnChangeConfig(config)
              }}
              loadConfig={function d {
                let configuration = this.handleLoadConfig(d)
                if (configuration) {
                  return configuration
                }
              }}
              downlowdedOrgChart={function d {
                this.handleDownload()
              }}
              loadImage={function d {
                return Promise.resolve(avatarPersonnel)
              }}
              loadParent={function d {
                const parentData = this.getParent(d)
                return parentData
              }}
              loadChildren={function d {
                const childrenData = this.getChild(d.id)
                return childrenData
              }}
            />
          </React.Fragment>
        </Route>
      </BrowserRouter>
    )
  }
}
