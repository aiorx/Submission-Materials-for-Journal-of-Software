/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

var join = require('path').join;
var ExtensionContext = require('vscode').ExtensionContext;
var window = require('vscode').window;
var TreeViewExpansionEvent = require('vscode').TreeViewExpansionEvent;
var workspace = require('vscode').workspace;
var TextDocument = require('vscode').TextDocument;
var Uri = require('vscode').Uri;
import {
	LanguageClient,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient';

var MezzuriteDataProvider = require('./models/MezzuriteDataProvider');
var MezzuriteComponent = require('./models/MezzuriteComponent');
var MezzuriteTreeItem = require('./models/MezzuriteTreeItem');

var client: LanguageClient;

function activate (context: ExtensionContext) {
	// The server is implemented in node
  var serverModule = context.asAbsolutePath(
		join('server', 'out', 'server.js')
	);
	// The debug options for the server
	// --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
  var debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
  var serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions
    }
  };

	// Create the language client and start the client.
  client = new LanguageClient(
		'vscode-mezzurite',
		'Mezzurite',
		serverOptions,
		undefined
  );

  var treeView = window.createTreeView('mezzuriteComponentList', {
    treeDataProvider: new MezzuriteDataProvider([], context.extensionPath)
  });

	// Start the client. This will also launch the server
  client.start();

  client.onReady()
    .catch(function () { return client.info('The client could not be initialized.'); })
    .then(function () {
      client.onNotification('custom/mezzuriteComponents', (message: { value: MezzuriteComponent[] }) => {
        treeView = window.createTreeView('mezzuriteComponentList', {
          treeDataProvider: new MezzuriteDataProvider(message.value, context.extensionPath)
        });

        treeView.onDidCollapseElement(onTreeViewExpansionEvent);

        treeView.onDidExpandElement(onTreeViewExpansionEvent);
      });
    });

  var fileWatcher = workspace.createFileSystemWatcher('**/*.{ts,js,tsx,jsx}', false, false, false);

  fileWatcher.onDidChange(function (event: Uri) {
    client.sendNotification('custom/fileChanged', event.fsPath);
  });

  fileWatcher.onDidDelete(function (event: Uri) {
    client.sendNotification('custom/fileDeleted', event.fsPath);
  });

  function onTreeViewExpansionEvent (event: TreeViewExpansionEvent<MezzuriteTreeItem>): void {
    if (event.element.resourceUri != null) {
      workspace.openTextDocument(event.element.resourceUri.path)
        .then(function (document: TextDocument) {
          window.showTextDocument(document);
        });
    }
  }
}

function deactivate (): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
