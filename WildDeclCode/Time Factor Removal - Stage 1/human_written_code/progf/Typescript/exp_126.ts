"use strict";
var vscode = require('vscode');
var Commands = require('./commands').Commands;

var commands = new Commands();

function activate(context: vscode.ExtensionContext) {

    var run = vscode.commands.registerCommand("octave.run", function (fileUri: vscode.Uri) {
        commands.executeCommand(fileUri);
    });

    var stop = vscode.commands.registerCommand("octave.stop", function () {
        commands.stopCommand();
    });

    context.subscriptions.push(run);
    context.subscriptions.push(commands);
}

function deactivate() {
    commands.stopCommand();
}
