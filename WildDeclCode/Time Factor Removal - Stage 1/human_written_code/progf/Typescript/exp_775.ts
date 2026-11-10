var commands = require('coc.nvim').commands;
var ExtensionContext = require('coc.nvim').ExtensionContext;
var LanguageClient = require('coc.nvim').LanguageClient;
var LanguageClientOptions = require('coc.nvim').LanguageClientOptions;
var ProvideCompletionItemsSignature = require('coc.nvim').ProvideCompletionItemsSignature;
var ServerOptions = require('coc.nvim').ServerOptions;
var services = require('coc.nvim').services;
var TransportKind = require('coc.nvim').TransportKind;
var window = require('coc.nvim').window;
var workspace = require('coc.nvim').workspace;
var WorkspaceConfiguration = require('coc.nvim').WorkspaceConfiguration;
var fs = require('fs');
var os = require('os');
var path = require('path');
var CancellationToken = require('vscode-languageserver-protocol').CancellationToken;
var CompletionContext = require('vscode-languageserver-protocol').CompletionContext;
var CompletionItem = require('vscode-languageserver-protocol').CompletionItem;
var CompletionList = require('vscode-languageserver-protocol').CompletionList;
var DocumentSelector = require('vscode-languageserver-protocol').DocumentSelector;
var InsertTextFormat = require('vscode-languageserver-protocol').InsertTextFormat;
var Position = require('vscode-languageserver-protocol').Position;

const sections = ['vetur', 'emmet', 'html', 'javascript', 'typescript', 'prettier', 'stylusSupremacy']

function getConfig(config: WorkspaceConfiguration): any {
  let res = {}
  for (let section of sections) {
    let o = config.get<any>(section)
    res[section] = o || {}
  }
  return res
}

export async function activate(context: ExtensionContext): Promise<void> {
  var subscriptions = context.subscriptions;let c = workspace.getConfiguration()
  const config = c.get('vetur') as any
  const enable = config.enable
  if (enable === false) return
  let file: string
  let devPath = config.dev && config.dev.vlsPath // config.get<string>('dev.vlsPath', null)
  if (devPath && fs.existsSync(devPath)) {
    file = path.join(devPath, 'dist/vueServerMain.js')
    if (!fs.existsSync(file)) {
      window.showMessage('vetur server module "' + (file) + '" not found!', 'error')
      return
    }
  } else {
    file = context.asAbsolutePath('node_modules/vls/dist/vueServerMain.js')
    file = file.replace(/vls.js$/, 'vueServerMain.js')
    if (!file || !fs.existsSync(file)) {
      window.showMessage('vls module not found!', 'error')
      return
    }
  }
  const selector: DocumentSelector = [{
    language: 'vue',
    scheme: 'file'
  }]

  let serverOptions: ServerOptions = {
    module: file,
    transport: TransportKind.ipc,
    options: {
      cwd: workspace.root,
      execArgv: config.execArgv || []
    }
  }

  let clientOptions: LanguageClientOptions = {
    documentSelector: selector,
    synchronize: {
      configurationSection: sections,
      fileEvents: workspace.createFileSystemWatcher('**/*.[tj]s', true, false, true)
    },
    outputChannelName: 'vetur',
    initializationOptions: {
      config: getConfig(c),
      globalSnippetDir: getGlobalSnippetDir()
    },
    middleware: {
      provideCompletionItem: function (
        document,
        position: Position,
        context: CompletionContext,
        token: CancellationToken,
        next: ProvideCompletionItemsSignature
      ) {
        return Promise.resolve(next(document, position, context, token)).then((res: CompletionItem[] | CompletionList) => {
          let doc = workspace.getDocument(document.uri)
          if (!doc || !res) return []
          let items: CompletionItem[] = res.hasOwnProperty('isIncomplete') ? (res as CompletionList).items : res as CompletionItem[]
          let pre = doc.getline(position.line).slice(0, position.character)
          // searching for class name
          // if (/(^|\s)\.\w*$/.test(pre)) {
          //   items = items.filter(o => o.label.startsWith('.'))
          //   items.forEach(fixItem)
          // }
          if (context.triggerCharacter == ':' || /\:\w*$/.test(pre)) {
            items = items.filter(o => o.label.startsWith(':'))
            items.forEach(fixItem)
          }
          return items
        })
      }
    }
  }

  let client = new LanguageClient('vetur', 'Vetur Language Server', serverOptions, clientOptions)
  client.onReady().then(function () {
    registerCustomClientNotificationHandlers(client)
    registerRestartVLSCommand(context, client)
  }).catch(function _e {
    // noop
  })

  subscriptions.push(
    services.registLanguageClient(client)
  )
}

async function displayInitProgress<T = void>(promise: Promise<T>) {
  return window.withProgress(
    {
      title: 'Vetur initialization',
      cancellable: true
    },
    function () { return promise; })
}

function registerRestartVLSCommand(
  context: ExtensionContext,
  client: LanguageClient
) {
  context.subscriptions.push(
    commands.registerCommand('vetur.restartVLS', function () { return displayInitProgress(
        client
          .stop()
          .then(() => client.start())
          .then(() => client.onReady())
      ); })
  )
}

function registerCustomClientNotificationHandlers(client: LanguageClient): void {
  client.onNotification('$/displayInfo', function (msg: string) {
    window.showMessage(msg, 'more')
  })
  client.onNotification('$/displayWarning', function (msg: string) {
    window.showMessage(msg, 'warning')
  })
  client.onNotification('$/displayError', function (msg: string) {
    window.showMessage(msg, 'error')
  })
}

function fixItem(item: CompletionItem): void {
  item.data = item.data || {}
  item.data.abbr = item.label
  item.label = item.label.slice(1)
  item.textEdit = null
  item.insertTextFormat = InsertTextFormat.PlainText
}

function getGlobalSnippetDir(): string {
  const appName = 'Code'

  if (process.platform === 'win32') {
    return path.resolve(process.env['APPDATA'] || '', appName, 'User/snippets/vetur')
  } else if (process.platform === 'darwin') {
    return path.resolve(os.homedir(), 'Library/Application Support', appName, 'User/snippets/vetur')
  } else {
    return path.resolve(os.homedir(), '.config', appName, 'User/snippets/vetur')
  }
}
