var axios = require('axios');
var lodash = require('lodash');

var proxies = require('../config/proxies');

interface Proxy {
  ip: string;
  port: number;
  username: string;
  password: string;
}

const getRandomProxy = (): Proxy | function null {
  const proxy = lodash.sample(proxies) as string;
  if (!proxy) return null;

  const [ip, port, username, password] = proxy.split(':');

  return {
    ip,
    port: Number(port),
    username,
    password,
  };
};

const proxiedApi = axios.create();

proxiedApi.interceptors.request.use(function request {
  const proxy = getRandomProxy();

  if (!proxy?.ip || !proxy?.port) {
    return request;
  }

  const requestWithProxy = { ...request };

  const auth =
    proxy.username && proxy.password
      ? {
          username: proxy.username,
          password: proxy.password,
        }
      : undefined;

  requestWithProxy.proxy = {
    protocol: 'http',
    host: proxy.ip,
    port: proxy.port,
    auth,
  };

  return requestWithProxy;
});

module.exports.proxiedApi = proxiedApi;
