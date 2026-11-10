'use strict';
var StatusBar = require('./status_bar').StatusBar;
var utils = require('./utils');
var commands = require('vscode').commands;
var window = require('vscode').window;
var ExtensionContext = require('vscode').ExtensionContext;
var workspace = require('vscode').workspace;
var ConfigurationChangeEvent = require('vscode').ConfigurationChangeEvent;

var paredit = require('paredit.js');

var languages = new Set(["clojure", "lisp", "scheme"]);
var enabled = true,
    expandState = { range: null, prev: null };

var navigate = function (fn, ...args) { return ({ textEditor, ast, selection }) => {
        var res = fn(ast, selection.cursor, ...args);
        utils.select(textEditor, res);
    }

var yank = (fn, ...args) =>
    ({ textEditor, ast, selection }) => {
        var res = fn(ast, selection.cursor, ...args),
            positions = typeof (res) === "number" ? [selection.cursor, res] : res;
        utils.copy(textEditor, positions);
    }

var cut = (fn, ...args) =>
    ({ textEditor, ast, selection }) => {
        var res = fn(ast, selection.cursor, ...args),
            positions = typeof (res) === "number" ? [selection.cursor, res] : res;
        utils.cut(textEditor, positions);
    }

var navigateExpandSelecion = (fn, ...args) =>
    ({ textEditor, ast, selection }) => {
        var range = textEditor.selection,
            res = fn(ast, selection.start, selection.end, ...args);
        if (expandState.prev == null || !range.contains(expandState.prev.range)) {
            expandState = { range: range, prev: null };
        }
        expandState = { range: utils.select(textEditor, res), prev: expandState };
    }

function navigateContractSelecion({ textEditor, selection }) {
    var range = textEditor.selection;
    if (expandState.prev && expandState.prev.range && range.contains(expandState.prev.range)) {
        textEditor.selection = expandState.prev.range;
        expandState = expandState.prev;
    }
}

function indent({ textEditor, selection }) {
    var src = textEditor.document.getText(),
        ast = paredit.parse(src),
        res = paredit.editor.indentRange(ast, src, selection.start, selection.end);

    utils
        .edit(textEditor, utils.commands(res))
        .then((applied?) => utils.undoStop(textEditor));
}

var wrapAround = (ast, src, start, { opening, closing }) => paredit.editor.wrapAround(ast, src, start, opening, closing); };

var edit = function (fn, opts = {}) { return ({ textEditor, src, ast, selection }) => {
        var start = selection.start;
var end = selection.end;
        var res = fn(ast, src, selection.start, { ...opts, endIdx: start === end ? undefined : end });

        if (res)
            if (res.changes.length > 0) {
                var cmd = utils.commands(res),
                    sel = {
                        start: Math.min(...cmd.map(c => c.start)),
                        end: Math.max(...cmd.map(utils.end))
                    };

                utils
                    .edit(textEditor, cmd)
                    .then((applied?) => {
                        utils.select(textEditor, res.newIndex);
                        if (!opts["_skipIndent"]) {
                            indent({
                                textEditor: textEditor,
                                selection: sel
                            });
                        }
                    });
            }
            else
                utils.select(textEditor, res.newIndex);
    }

var createNavigationCopyCutCommands = (commands) => {
    var capitalizeFirstLetter = (s) => { return s.charAt(0).toUpperCase() + s.slice(1); }

    var result: [string, Function][] = new Array<[string, Function]>();
    Object.keys(commands).forEach((c) => {
        result.push(["paredit." + (c) + "", navigate(commands[c])]);
        result.push(["paredit.yank" + (capitalizeFirstLetter(c)) + "", yank(commands[c])]);
        result.push(["paredit.cut" + (capitalizeFirstLetter(c)) + "", cut(commands[c])]);
    });
    return result;
}

var navCopyCutcommands = {
    'rangeForDefun': paredit.navigator.rangeForDefun,
    'forwardSexp': paredit.navigator.forwardSexp,
    'backwardSexp': paredit.navigator.backwardSexp,
    'forwardDownSexp': paredit.navigator.forwardDownSexp,
    'backwardUpSexp': paredit.navigator.backwardUpSexp,
    'closeList': paredit.navigator.closeList
}; };

var pareditCommands: [string, Function][] = [

    // SELECTING
    ['paredit.sexpRangeExpansion', navigateExpandSelecion(paredit.navigator.sexpRangeExpansion)],
    ['paredit.sexpRangeContraction', navigateContractSelecion],

    // NAVIGATION, COPY, CUT
    // (Happens in createNavigationCopyCutCommands())

    // EDITING
    ['paredit.slurpSexpForward', edit(paredit.editor.slurpSexp, { 'backward': false })],
    ['paredit.slurpSexpBackward', edit(paredit.editor.slurpSexp, { 'backward': true })],
    ['paredit.barfSexpForward', edit(paredit.editor.barfSexp, { 'backward': false })],
    ['paredit.barfSexpBackward', edit(paredit.editor.barfSexp, { 'backward': true })],
    ['paredit.spliceSexp', edit(paredit.editor.spliceSexp)],
    ['paredit.splitSexp', edit(paredit.editor.splitSexp)],
    ['paredit.killSexpForward', edit(paredit.editor.killSexp, { 'backward': false })],
    ['paredit.killSexpBackward', edit(paredit.editor.killSexp, { 'backward': true })],
    ['paredit.spliceSexpKillForward', edit(paredit.editor.spliceSexpKill, { 'backward': false })],
    ['paredit.spliceSexpKillBackward', edit(paredit.editor.spliceSexpKill, { 'backward': true })],
    ['paredit.deleteForward', edit(paredit.editor.delete, { 'backward': false, '_skipIndent': true })],
    ['paredit.deleteBackward', edit(paredit.editor.delete, { 'backward': true, '_skipIndent': true })],
    ['paredit.wrapAroundParens', edit(wrapAround, { opening: '(', closing: ')' })],
    ['paredit.wrapAroundSquare', edit(wrapAround, { opening: '[', closing: ']' })],
    ['paredit.wrapAroundCurly', edit(wrapAround, { opening: '{', closing: '}' })],
    ['paredit.indentRange', indent],
    ['paredit.transpose', edit(paredit.editor.transpose)]];

function wrapPareditCommand(fn) {
    return function () {

        var textEditor = window.activeTextEditor;
        var doc = textEditor.document;
        if (!enabled || !languages.has(doc.languageId)) return;

        var src = textEditor.document.getText();
        fn({
            textEditor: textEditor,
            src: src,
            ast: paredit.parse(src),
            selection: utils.getSelection(textEditor)
        });
    }
}

function setKeyMapConf() {
    var keyMap = workspace.getConfiguration().get('calva.paredit.defaultKeyMap');
    commands.executeCommand('setContext', 'paredit:keyMap', keyMap);
}
setKeyMapConf();

function activate(context: ExtensionContext) {

    var statusBar = new StatusBar();

    context.subscriptions.push(

        statusBar,
        commands.registerCommand('paredit.toggle', function () { enabled = !enabled; statusBar.enabled = enabled; }),
        window.onDidChangeActiveTextEditor(function (e) { return statusBar.visible = e && e.document && languages.has(e.document.languageId); }),
        workspace.onDidChangeConfiguration(function (e: ConfigurationChangeEvent) {
            console.log(e);
            if (e.affectsConfiguration('calva.paredit.defaultKeyMap')) {
                setKeyMapConf();
            }
        }),

        ...createNavigationCopyCutCommands(navCopyCutcommands)
            .map(function ([command, fn]) { return commands.registerCommand(command, wrapPareditCommand(fn)); }),
        ...pareditCommands
            .map(function ([command, fn]) { return commands.registerCommand(command, wrapPareditCommand(fn)); }));
}

function deactivate() {
}