var action = require('mobx').action;
var observable = require('mobx').observable;
var classNames = require('./../../lib/utils').classNames;
var widgetSettings = require('./../../lib/utils').widgetSettings;
var extend = require('lodash-es').extend;
var IWidgetSetting = require('../app/app').IWidgetSetting;
var observer = require('mobx-react').observer;
var _import = require('../../lib/r3e');
var React = require('react');
var style = require('./<%= name.toCamelCase() %>.scss');

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}

@observer
module.exports = class <%= name.toPascalCase() %> extends React.Component<IProps, {}> {;
	@observable
	sessionType = -1;

	constructor(props: IProps) {
		super(props);

		registerUpdate(this.update);
	}

	componentWillUnmount() {
		unregisterUpdate(this.update);
	}

	@action
	private update = function () {
		this.sessionType = r3e.data.SessionType;
	}

	render() {
		return (
			<div 
				{...widgetSettings(this.props)}
				className={
					classNames(style.<%= name.toCamelCase() %>, this.props.className)
				}
			>
				{this.sessionType}
			</div>
		);
	}
}
