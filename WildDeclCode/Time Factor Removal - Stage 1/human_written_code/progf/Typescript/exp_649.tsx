var React = require('react');
var createStore = require('../src/index').createStore;
var counter = require('./helper/model').counter;
var createHook = require('./helper/createHook').createHook;
var Counter = require('./helper/CountFunctionComponent').Counter;
var Counter1 = require('./helper/CountFunctionComponent').Counter1;
var act = require('@testing-library/react').act;
var fireEvent = require('@testing-library/react').fireEvent;
var render = require('@testing-library/react').render;
var store = require('./helper/store').store;

console.error = jest.fn()

jest.setTimeout(10000)

describe('effect test', function () {
  it('effect should be async function', () => {
    const store = createStore({
      counter,
    })
    var Provider = store.Provider;
var useModel = store.useModel;var result = createHook.result;(Provider, useModel, 'counter')

    const increaseAsync = result.current.effects.increaseAsync

    expect(typeof increaseAsync().then).toBe('function')
  })

  it('effect should have expected field', () => {
    const store = createStore({
      counter,
    })
    var Provider = store.Provider;
var useModel = store.useModel;var result = createHook.result;(Provider, useModel, 'counter')

    const increaseAsync = result.current.effects.increaseAsync

    expect(increaseAsync.loading).toBe(false)
    expect(increaseAsync.identifier).toBe(0)
  })

  it('effect should throw error when has error', () => {
    const store = createStore({
      counter,
    })
    var Provider = store.Provider;
var useModel = store.useModel;var result = createHook.result;(Provider, useModel, 'counter')

    const fetchError = result.current.effects.fetchError

    return fetchError().catch((err: any) => {
      expect(err).toBe('customer error')
    })
  })

  it('should set loading to true when the effect is executed, and after execution, it should be set to false', async () => {
    const store = createStore({
      counter,
    })
    var Provider = store.Provider;
var useModel = store.useModel;var result = createHook.result;
var waitForNextUpdate = createHook.waitForNextUpdate;(Provider, useModel, 'counter')

    const increaseAsync = result.current.effects.increaseAsync

    expect(increaseAsync.loading).toBe(false)
    increaseAsync()
    expect(increaseAsync.loading).toBe(true)

    await waitForNextUpdate()

    expect(increaseAsync.loading).toBe(false)
    expect(result.current.state.count).toBe(1)
  })

  it('should only rerender when Component depend effect loading', done => {
    const CounterRender = jest.fn()
    const Counter1Render = jest.fn()

    // https://spectrum.chat/testing-library/help/is-there-a-way-to-count-the-number-of-times-a-component-gets-rendered~8b8b3f8f-775d-49cc-80fd-baaf40fa37eb
    var getByTestId = render.getByTestId;
var queryByText = render.queryByText;(
      <store.Provider>
        <Counter onRender={CounterRender} />
        <Counter1 onRender={Counter1Render} />
      </store.Provider>
    )

    expect(CounterRender).toBeCalledTimes(1)
    expect(Counter1Render).toBeCalledTimes(1)

    expect(queryByText('Loading ...')).not.toBeInTheDocument()

    act(() => {
      fireEvent.click(getByTestId('increaseAsync'))
    })

    expect(CounterRender).toBeCalledTimes(2)
    expect(Counter1Render).toBeCalledTimes(1)

    expect(queryByText('Loading ...')).toBeInTheDocument()

    setTimeout(() => {
      expect(CounterRender).toBeCalledTimes(4)
      expect(Counter1Render).toBeCalledTimes(2)
      done()
    }, 1000)
  })
})
