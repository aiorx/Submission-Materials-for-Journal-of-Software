'use strict';

var vscode = require('vscode');
var CommandExplorer = require('./commandExplorer').CommandExplorer;
var CommandExecuter = require('./commandExecuter').CommandExecuter;


// this method is called when your extension is activated
function activate(context: vscode.ExtensionContext) {
  if(context.storagePath){
    new CommandExplorer('workSpaceCommandExplorer', context.storagePath);
    new CommandExecuter('workSpaceCommandExecuter', context);
  }
  new CommandExplorer('globalCommandExplorer', context.globalStoragePath);
  new CommandExecuter('globalCommandExecuter', context);
}

// this method is called when your extension is deactivated
function deactivate() {}
