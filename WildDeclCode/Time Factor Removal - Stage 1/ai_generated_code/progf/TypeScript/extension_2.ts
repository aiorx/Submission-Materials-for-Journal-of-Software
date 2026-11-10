// Assisted using common GitHub development utilities (GPT-4) on 2025-01-26
// VS Code extension to monitor container logs for VS Code CLI updates
// Provides GUI notifications and one-click approval for updates

var vscode = require('vscode');
var exec = require('child_process').exec;
var promisify = require('util').promisify;

var execAsync = promisify(exec);

interface UpdateStatus {
  updateAvailable: boolean;
  installedVersion?: string;
  candidateVersion?: string;
  timestamp: Date;
}

function activate(context: vscode.ExtensionContext) {
  console.log('VS Code Container Updater extension is now active');

  var updater = new ContainerUpdater(context);
  
  // Register commands
  var checkCommand = vscode.commands.registerCommand('vscode-container-updater.checkUpdates', function () {
    updater.checkForUpdates();
  });

  var approveCommand = vscode.commands.registerCommand('vscode-container-updater.approveUpdate', function () {
    updater.approveUpdate();
  });

  var configureCommand = vscode.commands.registerCommand('vscode-container-updater.configure', function () {
    updater.showConfiguration();
  });

  context.subscriptions.push(checkCommand, approveCommand, configureCommand);

  // Start monitoring if auto-check is enabled
  var config = vscode.workspace.getConfiguration('vscode-container-updater');
  if (config.get('autoCheck', true)) {
    updater.startMonitoring();
  }
}

class ContainerUpdater {
  private context: vscode.ExtensionContext;
  private statusBarItem: vscode.StatusBarItem;
  private monitoringInterval?: NodeJS.Timeout;
  private lastUpdateStatus: UpdateStatus = { updateAvailable: false, timestamp: new Date() };

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    
    // Create status bar item
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.statusBarItem.command = 'vscode-container-updater.checkUpdates';
    this.statusBarItem.text = '$(cloud-download) Container Updates';
    this.statusBarItem.tooltip = 'Check for VS Code container updates';
    this.statusBarItem.show();
    
    context.subscriptions.push(this.statusBarItem);
  }

  startMonitoring() {
    var config = vscode.workspace.getConfiguration('vscode-container-updater');
    var intervalSeconds = config.get('checkInterval', 300); // Default 5 minutes
    
    // Initial check
    this.checkForUpdates();
    
    // Set up periodic checking
    this.monitoringInterval = setInterval(function () {
      this.checkForUpdates();
    }, intervalSeconds * 1000);

    vscode.window.showInformationMessage('Container update monitoring started');
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
  }

  async checkForUpdates() {
    try {
      // Check for local VS Code CLI updates (running inside the container)
      var updateStatus = await this.parseSystemLogs();
      
      if (updateStatus.updateAvailable && !this.lastUpdateStatus.updateAvailable) {
        // New update detected
        this.showUpdateNotification(updateStatus);
      }

      this.lastUpdateStatus = updateStatus;
      this.updateStatusBar(
        updateStatus.updateAvailable ? 'Update Available!' : 'Up to date',
        updateStatus.updateAvailable ? '$(warning)' : '$(check)'
      );

    } catch (error) {
      console.error('Error checking for updates:', error);
      this.updateStatusBar('Check failed', '$(error)');
    }
  }

  private async parseSystemLogs(): Promise<UpdateStatus> {
    try {
      // Check the entrypoint logs for VS Code CLI update notifications
      var logsDir = process.env.HOME + '/LOGS';
      var cmd = 'find ' + logsDir + ' -name "entrypoint-log-*.log" -exec tail -50 {} \\; 2>/dev/null || echo ""';
      var stdout = await.stdout;execAsync(cmd);
      
      // Look for update notification pattern from the entrypoint script
      var updatePattern = /Update available for VS Code CLI \(installed: ([^,]+), candidate: ([^)]+)\)/;
      var match = stdout.match(updatePattern);
      
      if (match) {
        return {
          updateAvailable: true,
          installedVersion: match[1],
          candidateVersion: match[2],
          timestamp: new Date()
        };
      }

      return { updateAvailable: false, timestamp: new Date() };
    } catch (error) {
      console.error('Error parsing system logs:', error);
      return { updateAvailable: false, timestamp: new Date() };
    }
  }

  private showUpdateNotification(updateStatus: UpdateStatus) {
    var message = 'VS Code CLI update available: ' + updateStatus.installedVersion + ' -> ' + updateStatus.candidateVersion;
    
    vscode.window.showWarningMessage(
      message,
      'Approve Update',
      'Check Later',
      'Stop Monitoring'
    ).then(function (selection: string | undefined) {
      switch (selection) {
        case 'Approve Update':
          this.approveUpdate();
          break;
        case 'Stop Monitoring':
          this.stopMonitoring();
          break;
        // 'Check Later' - do nothing
      }
    });
  }

  async approveUpdate() {
    try {
      // Create approval file in the local filesystem (inside the container)
      var approvalFile = process.env.HOME + '/APPROVE_CODE_UPDATE';
      var cmd = 'touch ' + approvalFile;
      await execAsync(cmd);

      vscode.window.showInformationMessage(
        'Update approved! The container will install the update on the next check cycle.',
        'Check Status'
      ).then(function (selection: string | undefined) {
        if (selection === 'Check Status') {
          this.checkForUpdates();
        }
      });

    } catch (error) {
      var errorMsg = 'Failed to approve update: ' + String(error);
      vscode.window.showErrorMessage(errorMsg);
    }
  }

  private updateStatusBar(text: string, icon: string) {
    this.statusBarItem.text = icon + ' ' + text;
    this.statusBarItem.tooltip = 'Container Updates: ' + text;
  }

  showConfiguration() {
    vscode.commands.executeCommand('workbench.action.openSettings', 'vscode-container-updater');
  }

  dispose() {
    this.stopMonitoring();
    this.statusBarItem.dispose();
  }
}

function deactivate() {
  // Cleanup is handled by dispose methods
}
