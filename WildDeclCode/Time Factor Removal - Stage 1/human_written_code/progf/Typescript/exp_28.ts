// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var TagTreeView = require('./tag-tree-view').TagTreeView;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context: vscode.ExtensionContext) {
  new TagTreeView(context);
}

// this method is called when your extension is deactivated
function deactivate() {}
