import vscode = require('vscode');
var ExtensionContext = require('vscode').ExtensionContext;
var extensions = require('vscode').extensions;
var GlobalState = require('./constants').GlobalState;
var ExtensionData = require('./constants').ExtensionData;

class VersionManager {
    private context: ExtensionContext;
    private extension: vscode.Extension<any>;

    constructor (context: ExtensionContext) {
        this.context = context;
        this.extension = extensions.getExtension(ExtensionData.ExtensionIdentifier);
    }

    public getSavedVersion (): string {
        return this.context.globalState.get(GlobalState.CurrentVersion);
    }

    public getCurrentVersion (): string {
        return this.extension.packageJSON.version;
    }

    public UpdateSavedVersion (): void {
        this.context.globalState.update(
            GlobalState.CurrentVersion,
            this.getCurrentVersion()
        );
    }
}
