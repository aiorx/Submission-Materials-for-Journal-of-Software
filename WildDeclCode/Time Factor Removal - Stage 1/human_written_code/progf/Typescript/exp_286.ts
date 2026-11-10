var basename = require('path').basename;
var existsSync = require('fs').existsSync;
var mkdirSync = require('fs').mkdirSync;
var writeFileSync = require('fs').writeFileSync;

interface VSCodeWindow {
    showErrorMessage(message: string): Thenable<string>;
    showWarningMessage(message: string): Thenable<string>;
}

const createFolder = (path: string, window: VSCodeWindow): function void {
    const folderName = basename(path);
    try {
        existsSync(path) ? window.showWarningMessage("Folder " + (folderName) + " already exists") : mkdirSync(path);
    } catch (err) {
        window.showErrorMessage("Something went wrong creating " + (folderName) + " folder");
    }
};

const createFile = function (path: string, contents: string, window: VSCodeWindow) {
    const fileName = basename(path);
    try {
        existsSync(path) ? window.showWarningMessage("File " + (fileName) + " already exists") : writeFileSync(path, contents);
    } catch (err) {
        window.showErrorMessage("Something went wrong creating " + (fileName) + " file");
    }
};

module.exports.createFolder = createFolder;
module.exports.createFile = createFile;
