var indexBy = require('ramda').indexBy;
var prop = require('ramda').prop;
var sortBy = require('ramda').sortBy;
var ReactNode = require('react-transition-group/node_modules/@types/react').ReactNode;

var Alert = require('./components/alert').Alert;
var alertComponent = require('./components/alert').alertComponent;
var AppBar = require('./components/appBar').AppBar;
var appBarComponent = require('./components/appBar').appBarComponent;
var Avatar = require('./components/avatar').Avatar;
var avatar = require('./components/avatar').avatar;
var AvatarGroup = require('./components/avatarGroup').AvatarGroup;
var avatarGroup = require('./components/avatarGroup').avatarGroup;
var Button = require('./components/button').Button;
var button = require('./components/button').button;
var Checkbox = require('./components/checkbox').Checkbox;
var checkbox = require('./components/checkbox').checkbox;
var DatePicker = require('./components/datePicker').DatePicker;
var datePicker = require('./components/datePicker').datePicker;
var ErrorBoundary = require('./components/errorBoundary').ErrorBoundary;
var errorBoundary = require('./components/errorBoundary').errorBoundary;
var Pagination = require('./components/pagination').Pagination;
var pagination = require('./components/pagination').pagination;
var Select = require('./components/select').Select;
var select = require('./components/select').select;
var Stepper = require('./components/stepper').Stepper;
var stepper = require('./components/stepper').stepper;
var Switch = require('./components/switch').Switch;
var switchComponent = require('./components/switch').switchComponent;
var Tabs = require('./components/tabs').Tabs;
var tabs = require('./components/tabs').tabs;
var CapitalLetter = require('./entities').CapitalLetter;
var Sentence = require('./entities').Sentence;

export type Component =
  | Alert
  | AppBar
  | Avatar
  | AvatarGroup
  | Button
  | Checkbox
  | DatePicker
  | ErrorBoundary
  | Pagination
  | Select
  | Stepper
  | Switch
  | Tabs;


type OptionId = string;

export interface Option {
  criteria: Sentence;
  name: string;
  optionId: OptionId;
  toJsx: function (any: any) { return ReactNode | string; };
  toMarkdown: function (any: any) { return string; };
}

type OptionsById = {
  [optionId in OptionId]: Option;
};

export type SuperString = string | {
  jsx: ReactNode;
  markdown: string;
};

export interface ComponentInfo {
  componentId: string;

  /** The typical name used by the layman to identify this component. */
  cannonicalName: "" + (CapitalLetter) + "" + (string) + "";

  /** The English indefinte article to be used to refer to this Component */
  indefiniteArticle: 'a' | 'an';
  description: SuperString;
  optionsById: OptionsById;
}


const componentInfo: ComponentInfo[] = sortBy(prop('componentId'), [
  appBarComponent,
  alertComponent,
  avatar,
  avatarGroup,
  button,
  checkbox,
  datePicker,
  errorBoundary,
  pagination,
  select,
  stepper,
  switchComponent,
  tabs,
]);

const componentInfoById = indexBy(prop('componentId'), componentInfo);
