var Dispatch = require('react').Dispatch;
var SetStateAction = require('react').SetStateAction;

export type TNetworkPanelView = 'list' | 'match' | 'result';

export type TNetworkRequestParam = {
  name: string;
  value: any;
};

export type TNetworkRequest = {
  id: string;
  url: string;
  requestQuery: TNetworkRequestParam[];
  requestBody: TNetworkRequestParam[] | undefined;
  method: string;
  response: {
    status: number;
    body: any;
  };
};

export type TPanelView = 'actions' | 'network' | 'test';

export type TNetworkPanelContext = {
  requests: TNetworkRequest[];
  setRequests: function (requests: TNetworkRequest[]) { return void; };
  selectedRequests: Record<string, TNetworkRequest>;
  setSelectedRequests: function (selected: Record<string, TNetworkRequest>) { return void; };
  selectedRequestList: TNetworkRequest[];
  selectedRequestQueryKeys: Record<string, boolean>;
  selectedRequestBodyKeys: Record<string, boolean>;
  selectedResponseBodyKeys: Record<string, boolean>;
  setSelectedRequestQueryKeys: function (
    requestQueryKeys: Record<string, boolean>
  ) { return void; };
  setSelectedRequestBodyKeys: function (
    requestBodyKeys: Record<string, boolean>
  ) { return void; };
  setSelectedResponseBodyKeys: function (
    responseBodyKeys: Record<string, boolean>
  ) { return void; };
  intercepts: string[];
  setIntercepts: Dispatch<SetStateAction<string[]>>;
  confirmRequestSelection: function () { return void; };
  cancelRequestSelection: function () { return void; };
  confirmKeySelection: function () { return void; };
  cancelKeySelection: function () { return void; };
  view: TNetworkPanelView;
};

// thanks chatgpt
export type TClickAction = {
  type: 'click';
  sourceFile: string;
  details: { nodes: any[]; props: Record<string, any> };
  tagName: string;
  testId: string;
};

export type TKeyboardAction = {
  type: 'keyboard';
  sourceFile: string;
  details: { nodes: any[]; props: Record<string, any> };
  tagName: string;
  text: string;
  testId: string;
};

export type TVisitAction = {
  type: 'visit';
  url: string;
};

export type TAssertExistsAction = {
  type: 'assertExists';
  sourceFile: string;
  tagName: string;
  details: { nodes: any[]; props: Record<string, any> };
  testId: string;
};

export type TAssertTextAction = {
  type: 'assertText';
  assertContainsText: string;
  sourceFile: string;
  tagName: string;
  details: { nodes: any[]; props: Record<string, any> };
  testId: string;
};

export type TAction =
  | TClickAction
  | TKeyboardAction
  | TVisitAction
  | TAssertExistsAction
  | TAssertTextAction;

// these are the items used in the prompt, which is different to TAction, which is used to populate the list of acitons
// See: `actionToPromptItem()` in util.ts
// thanks chatgpt
type TClickItem = {
  type: 'click';
  testId: string;
  tagName: string;
};

type TAssertTextItem = {
  type: 'assertText';
  text: string;
  testId: string;
  tagName: string;
};

type TAssertExistsItem = {
  type: 'assertExists';
  testId: string;
  tagName: string;
};

type TKeyboardItem = {
  type: 'keyboard';
  testId: string;
  text: string;
  tagName: string;
};

export type TItem =
  | TClickItem
  | TAssertTextItem
  | TAssertExistsItem
  | TKeyboardItem;

export type TActionsPanelContext = {
  actions: TAction[];
  startRecording: function () { return void; };
  cancel: function () { return void; };
};
