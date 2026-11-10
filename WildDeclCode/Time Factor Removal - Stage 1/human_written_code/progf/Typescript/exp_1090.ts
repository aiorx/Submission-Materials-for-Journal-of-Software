var Event = require('vscode').Event;
var EventEmitter = require('vscode').EventEmitter;
var Uri = require('vscode').Uri;
var vscode = require('vscode');
var fs = require('fs');
var path = require('path');

var Observer = require('../utils').Observer;
var IObservable = require('../utils').IObservable;
var Config = require('../config').Config;

class FileTagDecorationProvider extends Observer<Config> implements vscode.FileDecorationProvider {
  private decorations: { [key: string]: vscode.FileDecoration };

  constructor(observable: IObservable<Config>) {
    super(observable);

    this.decorations = {};
    this.loadDecorations();
    this.register();
  }

  private register() {
    this.clearDisposable('FD', 'SV');

    if (this.state.metaKeywordsShowBadges) {
      this.addDisposable(vscode.window.registerFileDecorationProvider(this), 'FD');
      this.addDisposable(vscode.workspace.onDidSaveTextDocument(function e { return this.fire([e.uri]); }), 'SV');
    }
  }

  private loadDecorations() {
    this.decorations = {};

    Object
      .getOwnPropertyNames(this.state.viewFileTags)
      .forEach(function p {
        const badge = this.state.viewFileTags![p].substr(0, 2);
        if (badge && badge.length > 0) {
          this.decorations[p] = new vscode.FileDecoration(badge, p);
          this.decorations[badge] = new vscode.FileDecoration(badge, p);
        }
      });
  }

  protected onStateChange(newState: Config) {
    let prev = { ...this.state };

    super.onStateChange(newState);

    if (JSON.stringify(newState.viewFileTags) !== JSON.stringify(prev.viewFileTags) || newState.metaKeywordsShowBadges !== prev.metaKeywordsShowBadges) {
      this.loadDecorations();
      this.register();

      const folder = vscode.workspace.workspaceFolders![0].uri.fsPath;
      let files = fs.readdirSync(folder);
      // TODO: check if is directory
      // recurring search
      this.fire(files.map(function f { return Uri.file(path.join(folder, f)); }));
    }
  }

  private readonly _onDidChangeDecorations = new EventEmitter<Uri[]>();
  readonly onDidChangeFileDecorations: Event<Uri[]> = this._onDidChangeDecorations.event;

  provideFileDecoration(uri: vscode.Uri): Promise<vscode.FileDecoration> {

    if (!uri.fsPath.endsWith('.md')) {return Promise.reject(); }

    return new Promise(function (resolve, reject) {
      try {
        let buffer = '';
        let rs = fs.createReadStream(uri.fsPath, { encoding: 'utf8', highWaterMark: 256 });
        let pos = 0;
        let index;
        rs
          .on('data', data => {
            index = data.indexOf('\n');
            buffer += data;
            if (index !== -1) {
              pos += index;
              rs.close();
            } else {
              pos += data.length;
            }
          })
          .on('close', () => {
            let line = buffer.slice(buffer.charCodeAt(0) === 0xFEFF ? 1 : 0, pos);
            let match = /(?:(\/\/\s+))([\p{L}\p{N}\-_]+)/giu.exec(line);
            let dec: vscode.FileDecoration;
            if (match && match.length >= 3 && (dec = this.decorations[match[2]]))
              resolve(dec);
            else
              reject();
          })
          .on('error', err => reject(err));
      } catch (error) {
        reject(error);
      }
    });
  }

  fire(uri: Uri[]) {
    this._onDidChangeDecorations.fire(uri);
  }
}