'use strict';

var ExtensionContext = require('vscode').ExtensionContext;
var window = require('vscode').window;

var GitHubIssuesPrsProvider = require('./github-issues-prs').GitHubIssuesPrsProvider;

function activate(context: ExtensionContext) {
	window.registerTreeDataProvider('githubIssuesPrs', new GitHubIssuesPrsProvider(context));
}
