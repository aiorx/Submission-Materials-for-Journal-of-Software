var vscode = require('vscode');

module.exports = class SnippetProvider {;
    
    static insertText = function (value: string) {
        let editor = vscode.window.activeTextEditor;
    
        if (!editor) {
            vscode.window.showErrorMessage("Can't insert text because no document is open.");
            return;
        }
    
        let selection = editor.selection;
    
        let range = new vscode.Range(selection.start, selection.end);
    
        editor.edit((editBuilder) => {
            editBuilder.replace(range, value);
        });
    };
}