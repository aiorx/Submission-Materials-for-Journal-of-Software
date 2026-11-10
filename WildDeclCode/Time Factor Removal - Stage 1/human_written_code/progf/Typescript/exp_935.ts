'use strict';

var workspace = require('vscode').workspace;
var languages = require('vscode').languages;
var Hover = require('vscode').Hover;
var ExtensionContext = require('vscode').ExtensionContext;
var LinkProvider = require('./link').LinkProvider;
var util = require('./util');

var REG = /(['"])[^'"]*\1/;

function activate(context: ExtensionContext) {
    var hover = languages.registerHoverProvider({scheme: 'file', language: 'php'}, {
        provideHover(document, position, token) {
            var linkRange = document.getWordRangeAtPosition(position, REG);
            if (linkRange) {
                var filePath = util.getFilePath(document.getText(linkRange), document);
                var workspaceFolder = workspace.getWorkspaceFolder(document.uri);
                if (filePath != null) {
                    return new Hover(workspaceFolder.name + filePath.replace(workspaceFolder.uri.fsPath, ''));
                }
            }
            return;
        }
    });
    var link = languages.registerDocumentLinkProvider({scheme: 'file', language: 'php'}, new LinkProvider());
    context.subscriptions.push(hover);
    context.subscriptions.push(link);
}

function deactivate() {
    //
}
