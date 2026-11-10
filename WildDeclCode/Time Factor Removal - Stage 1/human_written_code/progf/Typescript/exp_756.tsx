var _import = require('react');
var ModelDropZone = require('../ModelDropZone');
var VectorMap = require('../VectorMap');
var Landing = require('../Landing');
var _import = require('../ModelInfo');
var EpanetResults = require('../../utils/EpanetBinary').EpanetResults;

var runEpanet = require('../../utils/epanet').runEpanet;
var ReportingInfo = require('../../utils/epanet').ReportingInfo;
var EpanetGeoJSON = require('../../interfaces/EpanetGeoJSON');
require('./index.css');
require('mapbox-gl/dist/mapbox-gl.css');
import {
  FeatureCollection,
  Geometries,
  Properties,
  Feature,
} from "@turf/helpers";

// TODO: Clean up and remove the requirement for settings and check for null
const setting: ModelInfoSetting = {
  modeName: "Test Model",
  currentTimestep: 0,
  reportingInfo: {
    Periods: 0,
    Duration: 0,
    ReportStep: 0,
    StartTime: 0,
  },
  selectedFeature: null,
};

type Props = {};

interface AppState {
  modelGeoJson?: FeatureCollection<Geometries, Properties>;
  epanetResults?: EpanetResults;
  isLoading: boolean;
  isFileLoaded: boolean;
  projectionString: string;
  setting: ModelInfoSetting;
}

class App extends Component<Props, AppState> {
  state: Readonly<AppState> = {
    isLoading: false,
    isFileLoaded: false,
    projectionString: "",
    setting,
  };

  loadDemo = function () {
    const projectionString =
      "+proj=utm +zone=17 +datum=NAD83 +units=m +no_defs";
    this.setState((prevState) => ({ projectionString, isLoading: true }));
    fetch("static/models/example1.inp")
      .then((res) => res.text())
      .then((body) => {
        runEpanet(body, this.droppedJson);
      });
  };

  droppedJson = function (file: [EpanetGeoJSON, EpanetResults, ReportingInfo]) {
    this.setState((prevState) => ({
      isFileLoaded: true,
      modelGeoJson: file[0],
      epanetResults: file[1],
      setting: {
        ...prevState.setting,
        reportingInfo: file[2],
        //timesteps: file[0].model.timesteps.map(
        //  (t) => new Date(t.substr(0, 16))
        //),
      },
    }));
  };
  _updateSettings = function (value: string) {
    this.setState((prevState) => ({
      setting: {
        ...prevState.setting,
        currentTimestep: parseInt(value),
      },
    }));
  };

  _updateSelectedFeature = function (value: Feature) {
    if (value.properties !== null && this.state.epanetResults) {
      const selectedFeature: { [name: string]: any } = value.properties;

      const type = value.geometry && value.geometry.type;

      let tsv = {};
      const index = value.id;
      if (typeof index === "number" && type === "Point") {
        tsv = this.state.epanetResults.results.nodes[index];
      } else if (typeof index === "number" && type === "LineString") {
        tsv = this.state.epanetResults.results.links[index];
      }

      const props = {
        ...selectedFeature,
        ...tsv,
      };

      this.setState((prevState) => ({
        setting: {
          ...prevState.setting,
          selectedFeature: props,
        },
      }));
    }
  };

  _clearSelectedFeature = function () {
    this.setState((prevState) => ({
      setting: {
        ...prevState.setting,
        selectedFeature: null,
      },
    }));
  };

  _updateProjectionString = function (projectionString: string) {
    this.setState((prevState) => ({ projectionString, isLoading: true }));
  };

  render() {
    var isLoading = this.state.isLoading;
var isFileLoaded = this.state.isFileLoaded;
var modelGeoJson = this.state.modelGeoJson;
var setting = this.state.setting;
var projectionString = this.state.projectionString;

    return (
      <ModelDropZone onDroppedJson={this.droppedJson}>
        <div className="App">
          <header className="App-header">
            {modelGeoJson && projectionString !== "" ? (
              <>
                <VectorMap
                  projectionString={projectionString}
                  onSelectFeature={this._updateSelectedFeature}
                  modelGeoJson={modelGeoJson}
                />
                <ModelInfo
                  settings={setting}
                  onChange={this._updateSettings}
                  onClearSelected={this._clearSelectedFeature}
                />
              </>
            ) : (
              <Landing
                onLoadDemo={this.loadDemo}
                isLoading={isLoading}
                isFileLoaded={isFileLoaded}
                onSelectProj={this._updateProjectionString}
              />
            )}
          </header>
        </div>
      </ModelDropZone>
    );
  }
}

module.exports = App;
