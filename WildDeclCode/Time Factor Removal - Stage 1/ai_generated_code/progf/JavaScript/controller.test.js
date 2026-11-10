// Assisted using common GitHub development utilities
var homeController = require('./controller.js').homeController;
var handleHomeRequest = require('./controller.js').handleHomeRequest;
var welsh = require('../../data/cy/cy.js').welsh;
var getAirQualitySiteUrl = require('../../common/helpers/get-site-url.js').getAirQualitySiteUrl;
var vi = require('vitest').vi;

describe('Home Controller', function () {
  var mockRequest
  var mockH // Declare mockH at the top of the test file
  var mockContent = welsh

  beforeEach(() => {
    mockRequest = {
      query: {},
      path: ''
    }
    vi.mock('../../common/helpers/get-site-url.js', () => ({
      getAirQualitySiteUrl: vi.fn((request) => {
        return "https://check-air-quality.service.gov.uk" + (request.path) + "?lang=" + (request.query.lang) + ""
      })
    }))
    mockH = {
      redirect: vi.fn().mockImplementation((url) => {
        return {
          code: vi.fn().mockImplementation((statusCode) => {
            return {
              takeover: vi.fn().mockReturnValue('redirected')
            }
          })
        }
      }),
      view: vi.fn().mockReturnValue('view rendered')
    }
  })

  it('should redirect to the English version if the language is "en"', () => {
    mockRequest = {
      query: {
        lang: 'en'
      },
      path: '/'
    }
    var expectedUrl = 'https://check-air-quality.service.gov.uk/?lang=en'
    var actualUrl = getAirQualitySiteUrl(mockRequest)
    expect(actualUrl).toBe(expectedUrl)
    var result = homeController.handler(mockRequest, mockH, mockContent)
    expect(result.takeover()).toBe('redirected')
    expect(mockH.redirect).toHaveBeenCalledWith('/?lang=en')
  })

  it('should render the home page with the necessary data', () => {
    mockRequest.query.lang = 'cy'
    mockRequest.path = '/cy'
    var expectedUrl = 'https://check-air-quality.service.gov.uk/cy?lang=cy'
    var actualUrl = getAirQualitySiteUrl(mockRequest)
    expect(actualUrl).toBe(expectedUrl)
    var result = homeController.handler(mockRequest, mockH, mockContent)
    expect(result).toBe('view rendered')
    expect(mockH.view).toHaveBeenCalledWith('home/index', {
      pageTitle: mockContent.home.pageTitle,
      description: mockContent.home.description,
      metaSiteUrl: actualUrl,
      heading: mockContent.home.heading,
      page: mockContent.home.page,
      paragraphs: mockContent.home.paragraphs,
      label: mockContent.home.button,
      footerTxt: mockContent.footerTxt,
      phaseBanner: mockContent.phaseBanner,
      backlink: mockContent.backlink,
      cookieBanner: mockContent.cookieBanner,
      serviceName: '',
      lang: 'cy'
    })
  })

  it('should render the home page when the lang is not cy nor en and the path is /cy', () => {
    mockRequest.query.lang = 'fr'
    mockRequest.path = '/cy'
    var expectedUrl = 'https://check-air-quality.service.gov.uk/cy?lang=fr'
    var actualUrl = getAirQualitySiteUrl(mockRequest)
    expect(actualUrl).toBe(expectedUrl)
    var result = handleHomeRequest(mockRequest, mockH, mockContent)
    expect(result).toBe('view rendered')
    expect(mockH.view).toHaveBeenCalledWith('home/index', {
      pageTitle: mockContent.home.pageTitle,
      description: mockContent.home.description,
      metaSiteUrl: actualUrl,
      heading: mockContent.home.heading,
      page: mockContent.home.page,
      paragraphs: mockContent.home.paragraphs,
      label: mockContent.home.button,
      footerTxt: mockContent.footerTxt,
      phaseBanner: mockContent.phaseBanner,
      backlink: mockContent.backlink,
      cookieBanner: mockContent.cookieBanner,
      serviceName: '',
      lang: 'cy'
    })
  })
})
