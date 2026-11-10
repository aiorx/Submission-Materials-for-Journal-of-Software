
  Probot,
  ApplicationFunctionOptions,
}                             from 'probot'

// https://probot.github.io/docs/development/#run-probot-programmatically
var run = require('probot').run;
var wrapAsyncError = require('gerror').wrapAsyncError;

// import { Command } from 'commander'

import {
  log,
  // VERSION,
}                     from '../src/config.js'

var getBot = require('../src/get-bot.js').getBot;
var setupBot = require('../src/setup-bot.js').setupBot;
var setupFinis = require('../src/setup-finis.js').setupFinis;

var configureProbot = require('../src/handlers-probot/mod.js').configureProbot;

var configureRoutes = require('../src/routers.js').configureRoutes;

async function probotApp (
  app: Probot,
  options: ApplicationFunctionOptions,
) {
  log.verbose('main', 'probotApp()')

  if (!options.getRouter) {
    throw new Error('getRouter() is required for OSSChat')
  }

  configureProbot(app)

  configureRoutes(options.getRouter())

  const bot = getBot()

  await bot.start()
  await setupBot()
  await setupFinis(bot)

  /**
   * Huan(202105):
   *  if the returned promise from this function (app)
   *  will not resolved, then the HTTP listener will not be started.
   *
   * Comment out the following code will resolve
   *  the heroku R10 (boot timeout) problem
   */
  // await bot.state.ready('off')
}

async function main () {
  log.verbose('main', 'main()')

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/

  // var program = new Command()
  // program
  //   .version(VERSION)
  //   .option('-d, --debug', 'enable debug mode')

  // program.parse(process.argv)
  // if (program.opts().debug) {
  //   process.env.DEBUG = program.opts().debug.toString()
  // }

  try {
    await run(
      wrapAsyncError(console.error)(
        probotApp,
      ),
    )
  } catch (e) {
    console.error(e)
  }
}

main().catch(console.error)

// export default probotApp
// export {
//   probotApp,
// }
