var defaults = require('lodash/defaults');

var _import = require('react');
var QueryEditorProps = require('@grafana/data').QueryEditorProps;
var LegacyForms = require('@grafana/ui').LegacyForms;
var QueryField = require('@grafana/ui').QueryField;
var Icon = require('@grafana/ui').Icon;
var DataSource = require('./DataSource').DataSource;
var MyQuery = require('./types').MyQuery;
var MyDataSourceOptions = require('./types').MyDataSourceOptions;
var defaultQuery = require('./types').defaultQuery;

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

interface State {}

class QueryEditor extends PureComponent<Props, State> {
  onComponentDidMount() {}

  onChangeQuery = function (value: string, override?: boolean) {
    var onChange = this.props.onChange;
var query = this.props.query;
    if (onChange) {
      onChange({ ...query, queryText: value });
    }
  };

  onDataPathTextChange = function (event: ChangeEvent<HTMLInputElement>) {
    var onChange = this.props.onChange;
var query = this.props.query;
    onChange({ ...query, dataPath: event.target.value });
  };
  onTimePathTextChange = function (event: ChangeEvent<HTMLInputElement>) {
    var onChange = this.props.onChange;
var query = this.props.query;
    onChange({ ...query, timePath: event.target.value });
  };
  onTimeFormatTextChange = function (event: ChangeEvent<HTMLInputElement>) {
    var onChange = this.props.onChange;
var query = this.props.query;
    onChange({ ...query, timeFormat: event.target.value });
  };
  onGroupByTextChange = function (event: ChangeEvent<HTMLInputElement>) {
    var onChange = this.props.onChange;
var query = this.props.query;
    onChange({ ...query, groupBy: event.target.value });
  };

  onAliasByTextChange = function (event: ChangeEvent<HTMLInputElement>) {
    var onChange = this.props.onChange;
var query = this.props.query;
    onChange({ ...query, aliasBy: event.target.value });
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    var queryText = query.queryText;
var dataPath = query.dataPath;
var timePath = query.timePath;
var timeFormat = query.timeFormat;
var groupBy = query.groupBy;
var aliasBy = query.aliasBy;

    return (
      <>
        <QueryField query={queryText || ''} onChange={this.onChangeQuery} portalOrigin="graphQL" />
        <div className="gf-form">
          <LegacyForms.FormField
            labelWidth={8}
            inputWidth={24}
            value={dataPath || ''}
            onChange={this.onDataPathTextChange}
            label="Data path"
            tooltip="dot-delimited path to data in response. Separate with commas to use multiple data paths"
          />
        </div>
        <div className="gf-form">
          <LegacyForms.FormField
            labelWidth={8}
            inputWidth={24}
            value={timePath || ''}
            onChange={this.onTimePathTextChange}
            label="Time path"
            tooltip="dot-delimited path to time under data path"
          />
        </div>
        <div className={'gf-form'}>
          <LegacyForms.FormField
            labelWidth={8}
            inputWidth={24}
            value={timeFormat || ''}
            onChange={this.onTimeFormatTextChange}
            label="Time format"
            tooltip={
              <a href="https://momentjs.com/docs/#/parsing/string-format/" title="Formatting help">
                Optional time format in moment.js format.&nbsp;
                <Icon name="external-link-alt" />
              </a>
            }
          />
        </div>
        <div className={'gf-form'}>
          <LegacyForms.FormField
            labelWidth={8}
            inputWidth={24}
            value={groupBy || ''}
            onChange={this.onGroupByTextChange}
            label="Group by"
            tooltip="dot-delimited path for the key to use. Separate with commas to use multiple fields to group by"
          />
        </div>
        <div className={'gf-form'}>
          <LegacyForms.FormField
            labelWidth={8}
            inputWidth={24}
            value={aliasBy || ''}
            onChange={this.onAliasByTextChange}
            label="Alias by"
            tooltip="The formattable text to alias by. Use $field_<field name> to replace with the value of a field, or $fieldName to replace with the name of the field"
          />
        </div>
      </>
    );
  }
}
