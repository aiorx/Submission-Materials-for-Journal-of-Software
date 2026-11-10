'use strict';

var vscode = require('vscode');
var utils = require('./utils');
var MarkdownHeaderProvider = require('./markdownHeaderProvider').MarkdownHeaderProvider;
var MarkdownTocTools = require('./markdownTocTools').MarkdownTocTools;

function activate(context: vscode.ExtensionContext) {
    var markdownHeaderProvider = new MarkdownHeaderProvider();
    var markdownTocTools = new MarkdownTocTools(markdownHeaderProvider);
    markdownTocTools.updateToc();
    context.subscriptions.push(vscode.window.registerTreeDataProvider('MarkdownNavigation', markdownHeaderProvider));
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(function () { return markdownTocTools.updateToc(); }));
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(function () { return markdownTocTools.updateToc(); }));
    context.subscriptions.push(vscode.commands.registerCommand('extension.selectHeader', function lineNum { return utils.revealLine(lineNum); }));
}
