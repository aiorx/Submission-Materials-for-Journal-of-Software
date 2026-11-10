import { Dispatch, SetStateAction } from 'react';

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
  setRequests: (requests: TNetworkRequest[]) => void;
  selectedRequests: Record<string, TNetworkRequest>;
  setSelectedRequests: (selected: Record<string, TNetworkRequest>) => void;
  selectedRequestList: TNetworkRequest[];
  selectedRequestQueryKeys: Record<string, boolean>;
  selectedRequestBodyKeys: Record<string, boolean>;
  selectedResponseBodyKeys: Record<string, boolean>;
  setSelectedRequestQueryKeys: (
    requestQueryKeys: Record<string, boolean>
  ) => void;
  setSelectedRequestBodyKeys: (
    requestBodyKeys: Record<string, boolean>
  ) => void;
  setSelectedResponseBodyKeys: (
    responseBodyKeys: Record<string, boolean>
  ) => void;
  intercepts: string[];
  setIntercepts: Dispatch<SetStateAction<string[]>>;
  confirmRequestSelection: () => void;
  cancelRequestSelection: () => void;
  confirmKeySelection: () => void;
  cancelKeySelection: () => void;
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
  startRecording: () => void;
  cancel: () => void;
};
