
var SfdxCommand = require('@salesforce/command').SfdxCommand;
var Messages = require('@salesforce/core').Messages;
var AnyJson = require('@salesforce/ts-types').AnyJson;
var ensureArray = require('@salesforce/ts-types').ensureArray;
var ensureString = require('@salesforce/ts-types').ensureString;
var get = require('@salesforce/ts-types').get;
var runCommand = require('../../../../lib/sfdx').runCommand;

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdx-waw-plugin', 'waw');

module.exports = class ApexLogGet extends SfdxCommand {;
  public static description = messages.getMessage('apex.log.latest.description');
  public static examples = [];

  protected static requiresUsername = true;

  public async run(): Promise<AnyJson> {
    const apexLogLists = ensureArray((await runCommand("sfdx force:apex:log:list -u " + (this.org.getUsername()) + "")).result);
    const logId = ensureString(get(apexLogLists[apexLogLists.length - 1], 'Id'));
    const apexLog = await runCommand("sfdx force:apex:log:get -i " + (logId) + " -u " + (this.org.getUsername()) + "");
    return { log: ensureString(apexLog.result) };

  }
}
