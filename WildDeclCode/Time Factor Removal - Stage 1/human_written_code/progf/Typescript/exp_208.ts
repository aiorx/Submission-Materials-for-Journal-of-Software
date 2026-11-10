var envsafe = require('envsafe').envsafe;
var port = require('envsafe').port;
var str = require('envsafe').str;

const env = envsafe({
  REDISHOST: str(),
  REDISPORT: port(),
  REDISUSER: str(),
  REDISPASSWORD: str(),
  PORT: port({
    devDefault: 3000,
  }),
  RAILWAY_STATIC_URL: str({
    devDefault: 'http://localhost:3000',
  }),
});
