var vscode = require('vscode');

var SymbolOutlineProvider = require('./symbolOutline').SymbolOutlineProvider;

function activate(context: vscode.ExtensionContext) {
  const symbolOutlineProvider = new SymbolOutlineProvider(context);
}
