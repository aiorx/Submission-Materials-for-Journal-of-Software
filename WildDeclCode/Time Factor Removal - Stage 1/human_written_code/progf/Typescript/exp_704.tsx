var React = require('react');
var render = require('@testing-library/react').render;
var fireEvent = require('@testing-library/react').fireEvent;
var act = require('@testing-library/react').act;
var wait = require('@testing-library/react').wait;
var App = require('./App');
var useAppHistory = require('./lib/path').useAppHistory;
var client = require('./lib/trpc').client;
var pageView = require('./lib/analytics').pageView;
var mocked = require('ts-jest/utils').mocked;
jest.mock('./lib/path')
jest.mock('./lib/analytics')
jest.mock('./lib/trpc')

describe('App', function () {  
  beforeAll(() => {
    mocked(client, true).fetchState = jest.fn().mockResolvedValue({
      type: 'data',
      data: 'Florida',
    })
    mocked(client, true).fetchAnalytics = jest.fn().mockResolvedValue({})
    mocked(client, true).fetchFeatureFlags = jest.fn().mockResolvedValue({})
  })

  it('Scrolls when clicked on Blurb page', () => {
    const pushAddress = jest.fn()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const returnValue = { pushAddress, query: {utmCampaign: '2'}} as any
    mocked(useAppHistory).mockReturnValue(returnValue)

    const mockedPageView = mocked(pageView)

    var getByTestId = render.getByTestId;(<App />)

    act(() => {
      fireEvent.change(
        getByTestId('start-zip'),
        {
          target: {
            value: '33131'
          },
        }
      )
      fireEvent(
        getByTestId('start-submit'),
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        })
      )
    })

    wait(() => expect(pushAddress).toHaveBeenCalledTimes(1))
    wait(() => expect(mockedPageView).toHaveBeenCalledTimes(1))
  })
})
