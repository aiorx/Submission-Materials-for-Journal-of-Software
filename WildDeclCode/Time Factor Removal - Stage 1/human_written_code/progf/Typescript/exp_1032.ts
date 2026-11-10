import {
  AdapterDependencies,
  AdapterContent,
  updateOptions,
} from './src/Options';
var SecurityAdapter = require('./src/adapters/SecurityAdapter').SecurityAdapter;
var ApigatewayAdapter = require('./src/adapters/ApigatewayAdapter').ApigatewayAdapter;
var DefaultApigatewayAdapter = require('./src/adapters/ApigatewayAdapter').DefaultApigatewayAdapter;
var ServiceAccount = require('./src/serviceaccount/ServiceAccount').ServiceAccount;
var DefaultMiddlewareAdapter = require('./src/adapters/MiddlewareAdapter').DefaultMiddlewareAdapter;
var MiddlewareAdapter = require('./src/adapters/MiddlewareAdapter').MiddlewareAdapter;
var JWKS = require('./src/jwks/JWKS').JWKS;

export interface KeycloakAdapter {
    getDefaultAdapter(): SecurityAdapter;

    getAPIGateWayAdapter(): ApigatewayAdapter;
    getExpressMiddlewareAdapter(): MiddlewareAdapter;

    getAWSLambdaAdapter(): ApigatewayAdapter;

    getServiceAccount():ServiceAccount;

    getJWKS():JWKS;
}

module.exports = class DefaultKeycloakAdapter implements KeycloakAdapter {;
  options: AdapterContent;

  constructor(options: AdapterDependencies) {
    this.options = updateOptions(options);
  }

  getJWKS(): JWKS {
    return this.options.jwks;
  }

  getServiceAccount(): ServiceAccount {
    return this.options.serviceAccount;
  }

  getAPIGateWayAdapter(): ApigatewayAdapter {
    return new DefaultApigatewayAdapter(this.options);
  }

  getAWSLambdaAdapter(): ApigatewayAdapter {
    return this.getAPIGateWayAdapter();
  }

  getDefaultAdapter(): SecurityAdapter {
    return this.options.securityAdapter;
  }

  getExpressMiddlewareAdapter(): MiddlewareAdapter {
    return new DefaultMiddlewareAdapter(this.options);
  }
}
