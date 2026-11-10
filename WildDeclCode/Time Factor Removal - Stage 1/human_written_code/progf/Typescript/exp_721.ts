// const child = require("child_process");
var child = require('child_process');
var path = require('path');
var fs = require('fs');
var ejs = require('ejs');
var _ = require('lodash');
var parserUtil = require('./parser-util');

var chdir = require('chdir');

class AntlrCompiler {
    private config: any;
    private jar: string;
    private grammarFile: string;
    private language: string;
    private outputDirectory: string;

    constructor(config: any) {
        this.config = config;
        this.jar = config.antlrJar;
        this.grammarFile = config.grammarFile;
        this.language = config.language;
        this.outputDirectory = config.outputDirectory;
    }

    compileTypeScriptParser(grammar: string, parser: any) {
        var className = "" + (grammar) + "Parser";
        var dest = "" + (this.outputDirectory) + "/" + (className) + ".d.ts";
        var template = fs.readFileSync("" + (__dirname) + "/templates/parser.d.ts.ejs").toString();
        var contextRules = parserUtil.contextObjectAst(parser);
        var methods = parserUtil.parserMethods(parser);

        var contents = ejs.render(template, {_, contextRules, className, methods});

        fs.writeFileSync(dest, contents);

        return dest;
    }

    capitalize = function (s: string) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    compileTypeScriptListener(grammar: string, parser: any) {
        var className = "" + (grammar) + "Listener";
        var dest = "" + (this.outputDirectory) + "/" + (className) + ".d.ts";
        var template = fs.readFileSync("" + (__dirname) + "/templates/listener.d.ts.ejs").toString();
        var map = parserUtil.ruleToContextTypeMap(parser);

        var methods = _.flatten(_.map(parser.ruleNames, function (rule) {
            return ["enter" + (this.capitalize(rule)) + "(ctx: " + (map.get(rule)) + "): void;", "exit" + (this.capitalize(rule)) + "(ctx: " + (map.get(rule)) + "): void;"];
        }));

        var imports = _.flatten(_.map(parser.ruleNames, function (rule) {
            if (grammar.indexOf('Parser') === -1) {
                return "import {" + (map.get(rule)) + "} from './" + (grammar) + "Parser';";
            } else {
                return "import {" + (map.get(rule)) + "} from './" + (grammar) + "';";
            }
        }));

        var contents = ejs.render(template, {_: _, className: className, methods: methods, imports});

        fs.writeFileSync(dest, contents);

        return dest;
    }

    compileTypeScriptLexer(grammar: string) {
        var className = "" + (grammar) + "Lexer";
        var dest = "" + (this.outputDirectory) + "/" + (className) + ".d.ts";
        var template = fs.readFileSync("" + (__dirname) + "/templates/lexer.d.ts.ejs").toString();
        var contents = ejs.render(template, {className: className});

        fs.writeFileSync(dest, contents);

        return dest;
    }

    compileTypeScript() {
        var jsCompliedResults = this.compileJavaScript();
        var grammar = jsCompliedResults.grammar;
        var parserFile = "" + (this.outputDirectory) + "/" + (grammar) + "Parser.js";


        if (fs.existsSync(parserFile)) {
            var parser = parserUtil.readParser(grammar, parserFile);
            var lines = parserUtil.exportedContextTypes(parser);

            _.each(lines, function (line) {
                fs.appendFileSync(parserFile, line);
            });


            // Read Again
            parser = parserUtil.readParser(grammar, parserFile);
            var lexerFile = this.compileTypeScriptLexer(grammar);
            jsCompliedResults.filesGenerated.push(lexerFile);

            if (this.config.listener) {
                if (fs.existsSync("" + (this.outputDirectory) + "/" + (grammar) + "Listener.js")) {
                    var listenerFile = this.compileTypeScriptListener(grammar, parser);
                    jsCompliedResults.filesGenerated.push(listenerFile);
                } else if (fs.existsSync("" + (this.outputDirectory) + "/" + (grammar) + "ParserListener.js")) {
                    var listenerFile = this.compileTypeScriptListener("" + (grammar) + "Parser", parser);
                    jsCompliedResults.filesGenerated.push(listenerFile);
                }
            }

            var parserPath = this.compileTypeScriptParser(grammar, parser);
            jsCompliedResults.filesGenerated.push(parserPath);
        }

        return jsCompliedResults;
    }

    compileJavaScript(): { grammar: string, filesGenerated: string[] } {
        var dir = path.dirname(this.grammarFile);
        var baseGrammarName = path.basename(this.grammarFile).replace('.g4', '');
        var grammarPrefix = _.first("" + (baseGrammarName) + "".split(/(?=[A-Z])/));
        var filesGenerated: string[];
        var grammar;

        chdir(dir, function () {
            child.execSync('which java');

            var cmd = this.command();
            try {
                child.execSync(cmd).toString();
            } catch (error) {
                process.exit(1);
            }

            var files = fs.readdirSync(this.outputDirectory);
            filesGenerated = _.filter(files, (file) => file.startsWith(baseGrammarName, 0));
            filesGenerated = filesGenerated.filter((file) => (file.indexOf('Listener.') !== -1 && this.config.listener) || file.indexOf('Listener.') === -1);
            filesGenerated = filesGenerated.filter((file) => (file.indexOf('Visitor.') !== -1 && this.config.visitor) || file.indexOf('Visitor.') === -1);

            var list = _.filter(filesGenerated, (file) => /(.*Lexer\..*)|(.*Parser\..*)/.test(file));
            if (!_.isEmpty(list)) {
                grammar = _.first(list).replace(/(Lexer.*)|(Parser.*)/, '');
            } else {
                grammar = baseGrammarName;
            }


            // Set the absolute paths on all the files
            filesGenerated = _.map(filesGenerated, (file) => "" + (this.outputDirectory) + "/" + (file) + "");
        });

        return {grammar, filesGenerated};
    }

    command() {
        var grammar = path.basename(this.grammarFile);
        var opts = this.additionalCommandOpts();
        return "java -jar " + (this.jar) + " -Dlanguage=" + (this.language) + " " + (opts) + " -lib . -o " + (this.outputDirectory) + " " + (grammar) + "";
    }

    additionalCommandOpts() {
        var optsStr = '';

        if (this.config.listener) {
            optsStr += " -listener";
        } else {
            optsStr += " -no-listener";
        }

        if (this.config.visitor) {
            optsStr += " -visitor";
        } else {
            optsStr += " -no-visitor";
        }

        return optsStr;
    }
}
