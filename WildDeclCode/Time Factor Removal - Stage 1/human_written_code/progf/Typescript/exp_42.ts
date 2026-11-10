var _ = require('lodash');
var JSSDK_ERRORS = require('../utils/errors').JSSDK_ERRORS;
var IConfig = require('../global').IConfig;
var SignRawTransactionFnParams = require('../global').SignRawTransactionFnParams;

const config = {
  debug: false,
  address: '',
  providerUrl: '',
  personalSignFn(_privateKey: string) { return '' },
  signRawTransactionFn(_params: SignRawTransactionFnParams) { return '' },
}

const setConfig = (params: IConfig): function IConfig {
  if (!_.isObject(params)) throw JSSDK_ERRORS.INVALID_CONFIG_PARAMS
  var personalSignFn = params.personalSignFn;
var signRawTransactionFn = params.signRawTransactionFn;if (!_.isFunction(personalSignFn) || !_.isFunction(signRawTransactionFn)) throw JSSDK_ERRORS.INVALID_CONFIG_PARAMS
  return Object.assign(config, params)
}

const getConfig = (): function IConfig {
  return config
}