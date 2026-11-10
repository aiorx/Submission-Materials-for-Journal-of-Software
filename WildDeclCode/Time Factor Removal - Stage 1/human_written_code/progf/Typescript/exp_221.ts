var CompletionItemProvider = require('vscode').CompletionItemProvider;
var TextDocument = require('vscode').TextDocument;
var Position = require('vscode').Position;
var CancellationToken = require('vscode').CancellationToken;
var CompletionItem = require('vscode').CompletionItem;
var Range = require('vscode').Range;
var CompletionItemKind = require('vscode').CompletionItemKind;
var workspace = require('vscode').workspace;
var NodeMap = require('./nodemap');
var fs = require('fs');

class DivertCompletionProvider implements CompletionItemProvider {

    public provideCompletionItems (document: TextDocument, position: Position) : CompletionItem[] {
        // Make sure we are at the end of a valid divert arrow.
        // Ignore a > at the start of a line.
        const before = document.getText(new Range(position.with(position.line, 0), position));
        if (!/(->|<-) ?$/.test(before)) return;
        if (/-> ?-> ?$/.test(before)) return;
        return NodeMap.getDivertCompletionTargets(document.uri.fsPath, position.line);
    }

}