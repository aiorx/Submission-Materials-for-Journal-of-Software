'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "wg-getters-and-setters" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable = vscode.commands.registerCommand('extension.generateGettersAndSetters', function () {
        // The code you place here will be executed every time your command is executed

        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        var code = "";
        var reverse: boolean = false;

        for (var selection of editor.selections) {
            reverse = selection.isReversed;
        }

        var selections: vscode.Selection[];
        if (reverse) {
            selections = editor.selections.reverse();
        } else {
            selections = editor.selections;
        }

        for (var selection of selections) {
            code += editor.document.getText(selection);
            code += "\n";
        }

        var text = code;

        if (text.length < 1) {
            vscode.window.showErrorMessage('No selected properties.');
            return;
        }

        try {
            var getterAndSetter = createGetterAndSetter(text);
            editor.edit(e => e.insert(selections[selections.length - 1].end, getterAndSetter));
        }
        catch (error) {
            console.log(error);
            vscode.window.showErrorMessage('Something went wrong! Try that the properties are in this format: "private String name;"');
        }
    });

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposableES6 = vscode.commands.registerCommand('extension.generateGettersAndSettersES6', function () {
        // The code you place here will be executed every time your command is executed

        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        var code = "";
        var reverse: boolean = false;

        for (var selection of editor.selections) {
            reverse = selection.isReversed;
        }

        var selections: vscode.Selection[];
        if (reverse) {
            selections = editor.selections.reverse();
        } else {
            selections = editor.selections;
        }

        for (var selection of selections) {
            code += editor.document.getText(selection);
            code += "\n";
        }

        var text = code;

        if (text.length < 1) {
            vscode.window.showErrorMessage('No selected properties.');
            return;
        }

        try {
            var getterAndSetter = createGetterAndSetterES6(text);
            editor.edit(e => e.insert(selections[selections.length - 1].end, getterAndSetter));
        }
        catch (error) {
            console.log(error);
            vscode.window.showErrorMessage('Something went wrong! Try that the properties are in this format: "private String name;"');
        }
    });

    context.subscriptions.push(disposable);
    context.subscriptions.push(disposableES6);
}

function toCamelCase(str: string) {
    return str.replace(/\w+/g, function w { return w[0].toUpperCase() + w.slice(1); });
}

function createGetterAndSetter(textProperties: string) {
    var rows = textProperties.split('\n').map(function x { return x.replace(';', ''); });
    var properties: Array<string> = [];

    for (var row of rows) {
        if (row.trim() !== "") {
            properties.push(row);
        }
    }

    var generatedCode = "
";
    for (var p in properties) {
        while (properties[p].startsWith(" ")) { properties[p] = properties[p].substr(1); }
        while (properties[p].startsWith("\t")) { properties[p] = properties[p].substr(1); }
        var words: Array<string> = [];

        var rows = properties[p].split(" ").map(function x { return x.replace('\r\n', ''); });
        for (var row of rows) {
            if (row.trim() !== '') {
                words.push(row.replace('\r',''));
            }
        }
        var type, attribute, Attribute = "";
        var create = false;

        // if words === ["private", "name:", "string"];
        if (words.length === 3) {
            var attributeArray = words[1].split(":");
            type = words[2];
            attribute = attributeArray[0];
            Attribute = toCamelCase(attribute);

            create = true;
            // if words === ["private", "name:string"];
        } else if (words.length === 2) {
            var array = words[1].split(":");
            type = array[1];
            attribute = array[0];
            Attribute = toCamelCase(attribute);
            create = true;
            // if words === ["private", "name", ":", "string"];
        } else if (words.length === 4) {

            var array: Array<string> = [];
            for (var word of words) {
                if (word !== ':') {
                    array.push(word);
                }
            }
            type = array[2].trim();
            attribute = array[1];
            Attribute = toCamelCase(attribute);
            create = true;
        } else {
            vscode.window.showErrorMessage('Something went wrong! Try that the properties are in this format: "private name: string;"');
            generatedCode = "";
            break;
        }

        if (create) {

            var code = "
    public " + ((type === "Boolean" || type === "boolean" ? "is" : "get")) + "" + (Attribute) + "(): " + (type) + " {
        return this." + (attribute) + ";
    }

    public set" + (Attribute) + "(" + (attribute) + ": " + (type) + "): void {
        this." + (attribute) + " = " + (attribute) + ";
    }
";
            generatedCode += code;
        }
    }

    return generatedCode;
}

function createGetterAndSetterES6(textProperties: string) {
    var rows = textProperties.split('\n').map(function x { return x.replace(';', ''); });
    var properties: Array<string> = [];

    for (var row of rows) {
        if (row.trim() !== "") {
            properties.push(row);
        }
    }

    var generatedCode = "
";
    for (var p in properties) {
        while (properties[p].startsWith(" ")) { properties[p] = properties[p].substr(1); }
        while (properties[p].startsWith("\t")) { properties[p] = properties[p].substr(1); }
        var words: Array<string> = [];

        var rows = properties[p].split(" ").map(function x { return x.replace('\r\n', ''); });
        for (var row of rows) {
            if (row.trim() !== '') {
                words.push(row);
            }
        }
        var type, attribute = "";
        var create = false;

        // if words === ["private", "name:", "string"];
        if (words.length === 3) {
            var attributeArray = words[1].split(":");
            type = words[2];
            attribute = attributeArray[0];

            create = true;
            // if words === ["private", "name:string"];
        } else if (words.length === 2) {
            var array = words[1].split(":");
            type = array[1];
            attribute = array[0];
            create = true;
            // if words === ["private", "name", ":", "string"];
        } else if (words.length === 4) {

            var array: Array<string> = [];
            for (var word of words) {
                if (word !== ':') {
                    array.push(word);
                }
            }
            type = array[2].trim();
            attribute = array[1];
            create = true;
        } else {
            vscode.window.showErrorMessage('Something went wrong! Try that the properties are in this format: "private name: string;"');
            generatedCode = "";
            break;
        }

        if (create) {

            var code = "
    public get " + (attribute.replace('_', '')) + "(): " + (type) + " {
        return this." + (attribute) + ";
    }

    public set " + (attribute.replace('_', '')) + "(" + (attribute.replace('_', '')) + ": " + (type) + ") {
        this." + (attribute) + " = " + (attribute.replace('_', '')) + ";
    }
";
            generatedCode += code;
        }
    }

    return generatedCode;
}

// this method is called when your extension is deactivated
function deactivate() {
}