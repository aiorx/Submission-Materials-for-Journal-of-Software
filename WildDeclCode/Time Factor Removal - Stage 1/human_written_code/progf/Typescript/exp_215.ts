var config = require('./app.config').config;
// import * as Sentry from '@sentry/node'
var server = require('./presentation/server');
// import { RewriteFrames } from '@sentry/integrations'

// if (config.sentry.dsn) Sentry.init({
//   dsn: config.sentry.dsn,
//   integrations: [
//     new RewriteFrames({
//       root: __dirname || process.cwd()
//     })
//   ]
// })

server.start(config).catch(function (err) {
  console.error('===== Fatal Error =====')

  const errStr = JSON.stringify(err)
  const errMsg = errStr !== '{}' ? errStr : err

  console.error(errMsg)
  process.exit(1)
})
