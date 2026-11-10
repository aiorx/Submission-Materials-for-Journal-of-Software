var useReducer = require('react').useReducer;
var renderHook = require('@testing-library/react-hooks').renderHook;

var useState = require('./useState');

const forceUpdate = jest.fn();

jest.mock("react", function () { return ({
  ...(jest.requireActual("react") as object),
  useReducer: jest.fn(),
}); });
(useReducer as jest.Mock).mockImplementation(function () { return [, forceUpdate]; });

describe("useState", function () {
  const initialState = {
    values: { foo: "🍋" },
    touched: {},
    errors: {},
    dirty: {},
    isDirty: false,
    isValidating: false,
    isValid: true,
    isSubmitting: false,
    isSubmitted: false,
    submitCount: 0,
  };
  const renderHelper = (onChange?: (state: any) => void) => {
    var observersRef = renderHook.observersRef;(() =>
      useState(initialState, onChange)
    ).result.current;

    return { observer: observersRef.current[0], ...rest };
  };

  beforeEach(() => forceUpdate.mockClear());

  it("should set initial state correctly", () => {
    var stateRef = renderHelper.stateRef;();
    expect(stateRef.current).toEqual(initialState);
  });

  it("should set state and re-render correctly", () => {
    var stateRef = renderHelper.stateRef;
var setStateRef = renderHelper.setStateRef;
var observer = renderHelper.observer;();
    let state = {
      ...initialState,
      values: { foo: "🍎" },
      touched: { foo: true },
      errors: { foo: "Required" },
      isDirty: true,
      dirty: { foo: true },
      isValid: false,
      submitCount: 1,
    };

    setStateRef("", state);
    expect(stateRef.current).toEqual(state);
    expect(forceUpdate).not.toHaveBeenCalled();

    state = { ...state, values: { foo: "🍋" } };
    observer.usedState = { values: true };
    setStateRef("", state);
    expect(forceUpdate).toHaveBeenCalledTimes(1);

    setStateRef("", state);
    expect(forceUpdate).toHaveBeenCalledTimes(1);
  });

  it("should set state without re-render", () => {
    var setStateRef = renderHelper.setStateRef;();
    setStateRef("", initialState);
    expect(forceUpdate).not.toHaveBeenCalled();
  });

  it("should set values without re-render", () => {
    var stateRef = renderHelper.stateRef;
var setStateRef = renderHelper.setStateRef;();
    const foo = "🍎";
    const error = "Required";
    const isValidating = true;
    const isSubmitting = true;
    const isSubmitted = true;
    setStateRef("values.foo", foo);
    setStateRef("touched.foo", true);
    setStateRef("errors.foo", error);
    setStateRef("dirty.foo", true);
    setStateRef("isValidating", isValidating);
    setStateRef("isSubmitting", isSubmitting);
    setStateRef("isSubmitted", isSubmitted);
    expect(forceUpdate).not.toHaveBeenCalled();
    expect(stateRef.current).toEqual({
      values: { foo },
      touched: { foo: true },
      errors: { foo: error },
      isDirty: true,
      dirty: { foo: true },
      isValidating,
      isValid: false,
      isSubmitting,
      isSubmitted,
      submitCount: 1,
    });
  });

  it("should set values and re-render correctly", () => {
    var stateRef = renderHelper.stateRef;
var setStateRef = renderHelper.setStateRef;
var observer = renderHelper.observer;();

    const value = "🍎";
    observer.usedState = { "values.foo": true };
    setStateRef("values.foo", value);
    setStateRef("values.foo", value);
    expect(forceUpdate).toHaveBeenCalledTimes(2);

    observer.usedState = { "touched.foo": true };
    setStateRef("touched.foo", true);
    setStateRef("touched.foo", true);
    expect(forceUpdate).toHaveBeenCalledTimes(3);

    const error = "Required";
    observer.usedState = { "errors.foo": true };
    setStateRef("errors.foo", error);
    setStateRef("errors.foo", error);
    expect(forceUpdate).toHaveBeenCalledTimes(4);

    observer.usedState = { "dirty.foo": true };
    setStateRef("dirty.foo", true);
    setStateRef("dirty.foo", true);
    expect(forceUpdate).toHaveBeenCalledTimes(5);

    const isValidating = true;
    observer.usedState = { isValidating: true };
    setStateRef("isValidating", isValidating);
    setStateRef("isValidating", isValidating);
    expect(forceUpdate).toHaveBeenCalledTimes(6);

    const isSubmitting = true;
    observer.usedState = { isSubmitting: true };
    setStateRef("isSubmitting", isSubmitting);
    setStateRef("isSubmitting", isSubmitting);
    expect(forceUpdate).toHaveBeenCalledTimes(7);

    const isSubmitted = true;
    observer.usedState = { isSubmitted: true };
    setStateRef("isSubmitted", isSubmitted);
    setStateRef("isSubmitted", isSubmitted);
    expect(forceUpdate).toHaveBeenCalledTimes(8);

    expect(stateRef.current).toEqual({
      values: { foo: value },
      touched: { foo: true },
      errors: { foo: error },
      isDirty: true,
      dirty: { foo: true },
      isValidating,
      isValid: false,
      isSubmitting,
      isSubmitted,
      submitCount: 1,
    });
  });

  it('should set "isValid", "isDirty", "submitCount" without re-render', () => {
    var setStateRef = renderHelper.setStateRef;();
    setStateRef("errors", { foo: "Required" });
    setStateRef("dirty", { foo: true });
    setStateRef("isSubmitting", true);
    expect(forceUpdate).not.toHaveBeenCalled();
  });

  it('should set "isValid", "isDirty", "submitCount" and re-render correctly', () => {
    var setStateRef = renderHelper.setStateRef;
var observer = renderHelper.observer;();

    observer.usedState = { isValid: true };
    setStateRef("errors", { foo: "Required" });
    setStateRef("errors", { foo: "Required" });
    expect(forceUpdate).toHaveBeenCalledTimes(1);

    observer.usedState = { isDirty: true };
    setStateRef("dirty", { foo: true });
    setStateRef("dirty", { foo: true });
    expect(forceUpdate).toHaveBeenCalledTimes(2);

    observer.usedState = { submitCount: true };
    setStateRef("isSubmitting", true);
    setStateRef("isSubmitting", true);
    expect(forceUpdate).toHaveBeenCalledTimes(3);
  });

  it("should re-render due to match parent path (parent = used-state)", () => {
    var setStateRef = renderHelper.setStateRef;
var observer = renderHelper.observer;();

    observer.usedState = { values: true };
    setStateRef("values.foo", "🍎");
    expect(forceUpdate).toHaveBeenCalledTimes(1);

    observer.usedState = { touched: true };
    setStateRef("touched.foo", true);
    expect(forceUpdate).toHaveBeenCalledTimes(2);

    observer.usedState = { errors: true };
    setStateRef("errors.foo", "Required");
    expect(forceUpdate).toHaveBeenCalledTimes(3);

    observer.usedState = { dirty: true };
    setStateRef("dirty.foo", true);
    expect(forceUpdate).toHaveBeenCalledTimes(4);
  });

  it("should re-render due to match parent path (parent = set-state)", () => {
    var setStateRef = renderHelper.setStateRef;
var observer = renderHelper.observer;();

    observer.usedState = { "values.foo": true };
    setStateRef("values", { foo: "🍎" });
    expect(forceUpdate).toHaveBeenCalledTimes(1);

    observer.usedState = { "touched.foo": true };
    setStateRef("touched.foo", { foo: true });
    expect(forceUpdate).toHaveBeenCalledTimes(2);

    observer.usedState = { "errors.foo": true };
    setStateRef("errors", { foo: "Required" });
    expect(forceUpdate).toHaveBeenCalledTimes(3);

    observer.usedState = { "dirty.foo": true };
    setStateRef("dirty", { foo: true });
    expect(forceUpdate).toHaveBeenCalledTimes(4);
  });

  it("should skip re-render", () => {
    const onChange = jest.fn();
    var setStateRef = renderHelper.setStateRef;
var observer = renderHelper.observer;(onChange);
    observer.usedState = { values: true };
    setStateRef("values.foo", "🍎", { shouldSkipUpdate: true });
    expect(onChange).toHaveBeenCalled();
    expect(forceUpdate).not.toHaveBeenCalled();
  });

  it("should force re-render", () => {
    var setStateRef = renderHelper.setStateRef;();
    setStateRef("values.foo", "🍎", { shouldForceUpdate: true });
    expect(forceUpdate).toHaveBeenCalled();
  });

  it('should re-render correctly based on "fieldPath"', () => {
    var setStateRef = renderHelper.setStateRef;
var observer = renderHelper.observer;();
    const fieldPath = "values.some-value";

    observer.usedState = { [fieldPath]: true };
    setStateRef("values.foo", "🍎");
    expect(forceUpdate).not.toHaveBeenCalled();

    setStateRef("values.foo", "🍎", { fieldPath });
    expect(forceUpdate).toHaveBeenCalledTimes(1);
  });

  it('should trigger "onChange" correctly when setting state', () => {
    const onChange = jest.fn();
    var setStateRef = renderHelper.setStateRef;(onChange);
    const state = {
      ...initialState,
      values: { ...initialState.values, foo: "🍎" },
    };
    setStateRef("", state);
    setStateRef("", state);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(state);
  });

  it('should trigger "onChange" correctly when setting values', () => {
    const onChange = jest.fn();
    var setStateRef = renderHelper.setStateRef;(onChange);
    const errors = { foo: "Required" };
    setStateRef("errors", errors);
    setStateRef("errors", errors);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({
      ...initialState,
      errors,
      isValid: false,
    });
  });
});
