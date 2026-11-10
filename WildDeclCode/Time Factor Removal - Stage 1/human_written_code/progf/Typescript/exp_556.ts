'use strict';

import {
        commands,
        Disposable,
        ExtensionContext,
        Memento,
        QuickPickItem,
        TextDocumentContentProvider,
        TextEditor,
        window as Window,
        workspace,
        Uri
    } from 'vscode';
var moment = require('moment');

interface HistoricalItem
{
    content?:string,
    createdAt: Date
}

interface HistoryQuickPickItem extends QuickPickItem {
    content: string,
    key: string,
    createdAt: Date
}


module.exports = class LocalHistoryProvider implements TextDocumentContentProvider {;

    private storage: Memento;

    constructor(storage:Memento)
    {
        this.storage = storage;
    }

    /**
     *
     * @param {vscode.Uri} uri - a fake uri
     * @returns {string} - settings read from the JSON file
     **/
  public provideTextDocumentContent (uri : Uri) : string {
    var fileHistory: Array<HistoricalItem> = this.storage.get('local.history' + uri.fsPath, []);
    var content:string = '';

    fileHistory.filter(function item {
        return item.createdAt.toString() === uri.fragment;
    }).forEach(function item {
        content = item.content;
    });

    return content;
  }
}

function activate(context: ExtensionContext) {
    var StorageIntervalInSeconds = workspace.getConfiguration().get<number>('localhistory.backupInterval');
    var NumberOfStorageItems =  workspace.getConfiguration().get<number>('localhistory.numberOfLocalHistoryItems');;

    var storage: Memento;
    storage = context.globalState;

    var localHistoryProvider: LocalHistoryProvider = new LocalHistoryProvider(storage);

    var registration = Disposable.from (
        workspace.registerTextDocumentContentProvider ('localhistory-preview', localHistoryProvider)
    );

    var disposableShowLocalHistory = commands.registerCommand('extension.showLocalHistory', function () {
      var key = 'local.history' + Window.activeTextEditor.document.fileName;
        var fileHistory: Array<HistoricalItem> = storage.get(key, []);
        var items:Array<HistoryQuickPickItem> = fileHistory.map((file) => {
            var fname = Window.activeTextEditor.document.fileName.split('/').pop();
            return {
                key: key,
                label: fname,
                description: fname + ' ' + file.createdAt.toString(),
                content: file.content,
                createdAt: file.createdAt
            }
        });

        if (items.length > 0) {
          Window.showQuickPick(items)
            .then(selection => {
                if (selection !== undefined) {
                  var diffUri = Uri.parse('localhistory-preview://'+selection.key+'#'+selection.createdAt.toString());
                  commands.executeCommand('vscode.diff', diffUri, Window.activeTextEditor.document.uri, 'Local History Diff');
                }
            });
        } else {
          Window.showInformationMessage('Local history not available for the selected file.');
        }
    });

    workspace.onDidChangeTextDocument(function (e) {
        var changedDatetime = new Date();
        var key = 'local.history' + e.document.fileName;

        if (e.document.fileName.startsWith('Untitled')) {
            Window.setStatusBarMessage(e.document.fileName  + ' is not supported for local history backups.');
        } else {
            var fileHistory: Array<HistoricalItem> = storage.get(key) || [];
            // First item
            if (fileHistory.length < 1) {
                fileHistory.push({ content: e.document.getText(), createdAt: changedDatetime })
            } else {
                var lastItemCreatedAt = moment(fileHistory[0].createdAt);
                if (moment().diff(lastItemCreatedAt, 'seconds') > StorageIntervalInSeconds) {
                  Window.setStatusBarMessage('Saving file to Local History.')
                    fileHistory.unshift({ content: e.document.getText(), createdAt: changedDatetime });
                    // Every single file have only the five last revisions.
                    if (fileHistory.length > NumberOfStorageItems) {
                        // remove the last item.
                        fileHistory.pop();
                    }
                }
            }

            storage.update(key, fileHistory);
        }
    })

    context.subscriptions.push(disposableShowLocalHistory);
    context.subscriptions.push (registration);
}

function deactivate() {
}
