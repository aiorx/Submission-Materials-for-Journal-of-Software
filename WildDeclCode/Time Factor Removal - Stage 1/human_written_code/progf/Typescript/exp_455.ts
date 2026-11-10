"use strict";

var vscode = require('vscode');
var Context = require('./context').Context;
var IVerificationResult = require('./IVerificationResult').IVerificationResult;

class CounterModelProvider {

    constructor(private context: Context) { }

    public update() {
        // TODO: Refactor editor window out and check for existance
        var editor: vscode.TextEditor = vscode.window.activeTextEditor!;

        var res: undefined | IVerificationResult = this.context.verificationResults[editor.document.uri.toString()];

        if (res !== undefined && res.counterModel && res.counterModel.States) {
            if (this.context.decorators[editor.document.uri.toString()]) {
                this.context.decorators[editor.document.uri.toString()].dispose();
            }

            var decorators: vscode.DecorationOptions[] = [];
            for (var state of res.counterModel.States) {
                var decorator = this.createDecorator(state);
                if (decorator) {
                    decorators.push(decorator);
                }
            }

            var variableDisplay = vscode.window.createTextEditorDecorationType({
                dark: {
                    after: {
                        backgroundColor: "#cccccc",
                        color: "#161616",
                        margin: "0 0 0 30px",
                    },
                },
                light: {
                    after: {
                        backgroundColor: "#161616",
                        color: "#cccccc",
                    },
                },
            });
            this.context.decorators[editor.document.uri.toString()] = variableDisplay;
            editor.setDecorations(variableDisplay, decorators);
        }
    }

    private createDecorator(state: any): vscode.DecorationOptions | null {

        var line = state.Line - 1;
        if (line < 0) { return null; }

        var variables = "";
        for (var j = 0; j < state.Variables.length; j++) {
            if (j > 0) { variables += ", "; }
            variables += state.Variables[j].Name + "=" + state.Variables[j].Value;
        }

        var renderOptions: vscode.DecorationRenderOptions = {
            after: {
                contentText: variables,
            },
        };

        return {
            range: new vscode.Range(new vscode.Position(line, state.Column), new vscode.Position(line, Number.MAX_VALUE)),
            renderOptions,
        };
    }
}
