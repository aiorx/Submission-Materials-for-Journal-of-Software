var fetchMock = require('fetch-mock');
var _import = require('xhr-mock');
var parse = require('query-string').parse;
import {
  Scenarios,
  MockConfig,
  Mock,
  HttpMock,
  GraphQLMock,
  Operation,
} from './types';

/**
 * Gets the corresponding value for `scenario` key in the browser's Location object.
 */
const extractScenarioFromLocation = (location: Location): function string {
  var scenario = parse.scenario;(location.search);
  if (Array.isArray(scenario)) {
    throw new Error('Only one scenario may be used at a time');
  }
  return scenario;
};

/**
 * Orchestrator for setting up mocks.
 */
const injectMocks = (
  scenarios: Scenarios,
  scenario: keyof Scenarios = 'default',
  config?: MockConfig
): function void {
  XHRMock.setup();

  fetchMock.config.fallbackToNetwork = config?(.allowFetchPassthrough != null ? .allowFetchPassthrough : false);
  fetchMock.config.warnOnFallback =
    config?(.disableConsoleWarningsForFetch != null ? .disableConsoleWarningsForFetch : true);

  const mocks: Mock[] =
    scenario !== 'default'
      ? reduceAllMocksForScenario(scenarios, scenario)
      : scenarios.default;

  if (!mocks || mocks.length === 0) {
    throw new Error('Unable to instantiate mocks');
  }

  const restMocks = mocks.filter((m) => m.method !== 'GRAPHQL') as HttpMock[];
  const graphQLMocks = mocks.filter(
    (m) => m.method === 'GRAPHQL'
  ) as GraphQLMock[];

  restMocks.forEach(handleRestMock);
  graphQLMocks.forEach(handleGraphQLMock);

  if (config?.allowXHRPassthrough) {
    XHRMock.use(proxy);
  }
};

/**
 * Returns all mocks for a given scenarios + everything in the default mocks
 * that don't have a matching scenario mock.
 */
const reduceAllMocksForScenario = (
  scenarios: Scenarios,
  scenario: keyof Scenarios
): Mock[] => {
  if (scenario === 'default') {
    return scenarios.default;
  }

  const defaultMocks = scenarios.default;
  const scenarioMocks = scenarios[scenario];

  if (!scenarioMocks) {
    throw new Error("No mocks found for scenario '" + (scenario) + "'");
  }

  const mocks = defaultMocks.concat(scenarioMocks);

  const initialHttpMocks = mocks.filter(
    function ({ method }) { return method !== 'GRAPHQL'; }) as HttpMock[];
  const initialGraphQlMocks = mocks.filter(
    function ({ method }) { return method === 'GRAPHQL'; }) as GraphQLMock[];

  const httpMocksByUrlAndMethod = initialHttpMocks.reduce<
    Record<string, HttpMock>
  >(function (result, mock) {
    var url = mock.url;
var method = mock.method;
    // Always take the latest mock
    result["" + (url.toString()) + "" + (method) + ""] = mock;

    return result;
  }, {});
  const httpMocks = Object.values(httpMocksByUrlAndMethod);

  const graphQlMocksByUrlAndOperations = initialGraphQlMocks.reduce<
    Record<
      string,
      { operationsByNameAndType: Record<string, Operation>; url: RegExp }
    >
  >(function (result, mock) {
    var url = mock.url;
var operations = mock.operations;

    const operationsByNameAndType: Record<string, Operation> =
      result[url.toString()]?(.operationsByNameAndType != null ? .operationsByNameAndType : {});

    operations.forEach((operation) => {
      // Always take the latest operation
      operationsByNameAndType[
        "" + (operation.operationName) + "" + (operation.type) + ""
      ] = operation;
    });

    result[url.toString()] = {
      url,
      operationsByNameAndType,
    };
    return result;
  }, {});
  const graphQlMocks = Object.values(graphQlMocksByUrlAndOperations).map(
    function ({ url, operationsByNameAndType }) {
      return {
        method: 'GRAPHQL',
        url,
        operations: Object.values(operationsByNameAndType),
      };
    }
  ) as GraphQLMock[];

  return (httpMocks as any).concat(graphQlMocks);
};

/**
 * Mocks the right HTTP method for a REST mock.
 */
function handleRestMock({
  method,
  url,
  response,
  responseCode = 200,
  responseHeaders,
  delay = 0,
}: HttpMock) {
  const finalResponse = {
    body: response,
    status: responseCode,
    headers: responseHeaders,
  };

  switch (method) {
    case 'GET':
      fetchMock.get(url, function () { return addDelay(delay).then(() => finalResponse); }, {
        overwriteRoutes: false,
      });
      XHRMock.get(url, xhrMockDelay(finalResponse, delay));
      break;
    case 'POST':
      fetchMock.post(url, function () { return addDelay(delay).then(() => finalResponse); }, {
        overwriteRoutes: false,
      });
      XHRMock.post(url, xhrMockDelay(finalResponse, delay));
      break;
    case 'PUT':
      fetchMock.put(url, function () { return addDelay(delay).then(() => finalResponse); }, {
        overwriteRoutes: false,
      });
      XHRMock.put(url, xhrMockDelay(finalResponse, delay));
      break;
    case 'PATCH':
      fetchMock.patch(url, function () { return addDelay(delay).then(() => finalResponse); }, {
        overwriteRoutes: false,
      });
      XHRMock.patch(url, xhrMockDelay(finalResponse, delay));
      break;
    case 'DELETE':
      fetchMock.delete(url, function () { return addDelay(delay).then(() => finalResponse); }, {
        overwriteRoutes: false,
      });
      XHRMock.delete(url, xhrMockDelay(finalResponse, delay));
      break;
    default:
      throw new Error(
        "Unrecognised HTTP method " + (method) + " - please check your mock configuration"
      );
  }
}

/**
 * Mocks the right HTTP method for a GraphQL mock.
 */
function handleGraphQLMock({ url, operations }: GraphQLMock) {
  const graphQLErrorResponse = { errors: [] };
  const findOperation = function (operationName: string) { return operations.find((o) => o.operationName === operationName); };
  const findOperationPost = function (postBody) {
    const jsonBody =
      typeof postBody === 'string' ? JSON.parse(postBody) : postBody;
    return findOperation(jsonBody.operationName);
  };
  const delayedResponse = function (
    delay: number | undefined,
    response: object | string
  ) {
    return addDelay(delay ? delay : 0).then(() => response);
  };

  fetchMock.get(url, function (u) {
    const parsedUrl = new URL(u);
    const operationName = parsedUrl.searchParams.get('operationName') || '';
    const operation = findOperation(operationName);

    if (!operation || operation?.type === 'mutation') {
      return graphQLErrorResponse;
    }

    const finalResponse = {
      body: operation.response,
      status: operation.responseCode,
      headers: operation.responseHeaders,
    };

    return delayedResponse(operation.delay, finalResponse);
  });

  fetchMock.post(
    url,
    function (_, { body }) {
      const operation = findOperationPost(body);

      if (!operation) {
        return graphQLErrorResponse;
      }

      const finalResponse = {
        body: operation.response,
        status: operation.responseCode,
        headers: operation.responseHeaders,
      };

      return delayedResponse(operation.delay, finalResponse);
    },
    {
      overwriteRoutes: false,
    }
  );

  XHRMock.get(url, function (req, res) {
    const operationName = req.url().query?.operationName || '';
    const operation = findOperation(operationName);

    if (!operation || operation?.type === 'mutation') {
      return res.body(graphQLErrorResponse);
    }

    var response = operation.response;
var responseCode = operation.responseCode;
var responseHeaders = operation.responseHeaders;
var delay = operation.delay;
    if (responseHeaders) {
      res.headers(responseHeaders);
    }
    return addDelay(delay ? delay : 0).then(() => {
      return res.status((responseCode != null ? responseCode : 200)).body(response);
    });
  });

  XHRMock.post(url, function (req, res) {
    const operation = findOperationPost(req.body());

    if (!operation) {
      return res.body(graphQLErrorResponse);
    }

    var response = operation.response;
var responseCode = operation.responseCode;
var responseHeaders = operation.responseHeaders;
var delay = operation.delay;
    if (responseHeaders) {
      res.headers(responseHeaders);
    }
    return addDelay(delay ? delay : 0).then(() =>
      res.status((responseCode != null ? responseCode : 200)).body(response)
    );
  });
}

/**
 * Adds delay (in ms) before resolving a promise.
 */
const addDelay = function (delay: number) { return new Promise((res) => setTimeout(res, delay)); };
