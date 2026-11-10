var path = require('path');

var makeDatabase = require('../services/database').makeDatabase;
var Command = require('@oclif/command').Command;
var flags = require('@oclif/command').flags;
var makeFileSystem = require('../services/file-system').makeFileSystem;

var makeFancyOutput = require('../services/fancy-output').makeFancyOutput;
var makeMigrate = require('../services/migrate').makeMigrate;

module.exports = class MigrateCommand extends Command {;
  static description = 'applies the latest migrations to your database';

  static examples = ["$ mammoth migrate postgres://localhost:5432/test"];

  static flags = {
    migrationsDir: flags.string({
      description: "directory to your migrations",
      default: "migrations",
    }),
  };

  static args = [
    {
      name: "connectionString",
      required: true,
      description: "the connection string to your postgres database",
    },
  ];

  async run() {
    var flags = this.parse.flags;
var args = this.parse.args;(MigrateCommand);
    const migrationsDir = path.join(process.cwd(), flags.migrationsDir);

    const migrator = makeMigrate({
      makeFileSystem,
      makeFancyOutput,
      makeDatabase,
    });
    await migrator(migrationsDir, args.connectionString);
  }
}
