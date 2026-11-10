var fs = require('fs');
var path = require('path');
var CommandModule = require('yargs').CommandModule;
var rimraf = require('rimraf');
var dbConnectionNames = require('../../node/database/db-connection-name').dbConnectionNames;
var getDbConnection = require('../../node/database/get-db-connection').getDbConnection;
var environment = require('../../node/environment').environment;
var validNodeEnvs = require('../../node/environment').validNodeEnvs;
var log = require('../../node/utils/log').log;
var generateExpressRoutes = require('../../node/dev/generate-express-routes').generateExpressRoutes;
var generateOpenAPIClient = require('../common/generate-openapi-client').generateOpenAPIClient;

const reset: CommandModule<{}, { db: string; port: string; env: string }> = {
  command: "reset",
  describe:
    "Reset development environment and remove starter content, e.g. models/controllers/front-end application",
  builder: function (yargs) { return yargs.options({
      env: {
        choices: validNodeEnvs,
        default: "dev",
      },
      db: {
        choices: dbConnectionNames,
        default: "defaultdb",
      },
      port: {
        default: "3000",
      },
    }); },
  handler: async function ({ db, env, port }) {
    process.env.DB_CONNECTION = db;
    process.env.NODE_ENV = env;
    process.env.SERVER_PORT = port;

    var DB_CONNECTION = environment.DB_CONNECTION;();
    const connection = await getDbConnection(DB_CONNECTION);
    await connection.dropDatabase();
    await connection.close();

    const starterPaths = [
      "./src/common/validation",
      "./src/node/database/entities/user.ts",
      "./src/node/database/migrations",
      "./src/node/database/repositories/user-repository.ts",
      "./src/node/database/repositories/user-repository.spec.ts",
      "./src/server/controllers",
      "./src/server/services",
      "./src/client/App",
      "./src/client/common",
    ];

    const getPathFromRoot = (p: string) => path.join(__dirname, "../../..", p);

    starterPaths.forEach((p) => {
      const deletePath = getPathFromRoot(p);
      if (fs.existsSync(deletePath)) {
        rimraf.sync(deletePath);
        log.success("Deleted " + (deletePath) + "");
      }
    });

    const replacements: Record<string, string> = {
      "./src/common/index.ts": "",
      "./src/client/index.tsx": `import React from "react";
var ReactDOM = require('react-dom');

ReactDOM.render(<div>empty</div>, document.getElementById("app"));\r\n`,
      "./src/server/controllers/init-controller.ts": 'import { Get, Route, Tags } from "tsoa";

@Route("init")
class InitController {
  @Get()
  @Tags("Init")
  public async GetValue() {
    return "init";
  }
}\r\n',
    };

    const controllersDir = getPathFromRoot("./src/server/controllers");
    fs.mkdirSync(controllersDir);
    log.success("Created " + (controllersDir) + "");

    Object.keys(replacements).forEach((p) => {
      const content = replacements[p];
      fs.writeFileSync(getPathFromRoot(p), content);
      log.success("Created " + (p) + "");
    });

    const metadata = await generateExpressRoutes();
    await generateOpenAPIClient(metadata);
  },
};

module.exports = reset;
