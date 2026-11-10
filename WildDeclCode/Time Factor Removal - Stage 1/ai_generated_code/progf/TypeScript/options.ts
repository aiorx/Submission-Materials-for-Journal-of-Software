// Assisted using common GitHub development utilities
// PrismWeave Options/Settings Page Script - TypeScript version

var IMessageData = require('../types/types.js').IMessageData;
var IMessageResponse = require('../types/types.js').IMessageResponse;
var ISettings = require('../types/types.js').ISettings;
var createLogger = require('../utils/logger.js').createLogger;

class PrismWeaveOptions {
  private logger = createLogger('Options');
  private settings: Partial<ISettings> = {};

  constructor() {
    this.initializeOptions();
  }

  // ...existing code...

  private async initializeOptions(): Promise<void> {
    this.logger.info('PrismWeaveOptions: Initializing options page');
    await this.loadSettings();
    this.logger.info('PrismWeaveOptions: Settings loaded', this.settings);
    this.populateForm();
    this.logger.info('PrismWeaveOptions: Form populated');
    this.setupEventListeners();
    this.logger.info('PrismWeaveOptions: Event listeners setup complete');
  }
  private getDefaultSettings(): Partial<ISettings> {
    return {
      // Repository Settings
      githubToken: '',
      githubRepo: '',

      // File Organization Settings
      defaultFolder: 'auto',
      customFolder: '',
      fileNamingPattern: 'YYYY-MM-DD-domain-title',

      // Automation Settings
      autoCommit: true,

      // Content Processing Settings
      captureImages: true,
      removeAds: true,
      removeNavigation: true,
      customSelectors: '',

      // Git & Repository Settings
      commitMessageTemplate: 'Add: {domain} - {title}',

      // Debugging Settings
      debugMode: false,

      // UI Preferences
      showNotifications: true,
      enableKeyboardShortcuts: true,
    };
  }

  private async loadSettings(): Promise<void> {
    try {
      this.logger.info('PrismWeaveOptions: Requesting settings from background...');
      var response = await this.sendMessage('GET_SETTINGS');
      this.logger.info('PrismWeaveOptions: Received response', response);

      if (response.success) {
        // Merge received settings with defaults to ensure all fields have values
        var defaultSettings = this.getDefaultSettings();
        this.settings = { ...defaultSettings, ...(response.data as Partial<ISettings>) };
        this.logger.info('PrismWeaveOptions: Settings updated', this.settings);
      } else {
        this.logger.warn('PrismWeaveOptions: Failed to load settings, using defaults');
        this.settings = this.getDefaultSettings();
      }
    } catch (error) {
      this.logger.error('PrismWeaveOptions: Failed to load settings', error);
      this.settings = this.getDefaultSettings();
    }
  }
  private populateForm(): void {
    // Repository Settings
    this.setInputValue('githubToken', this.settings.githubToken || '');
    this.setInputValue('githubRepo', this.settings.githubRepo || '');

    // File Organization
    this.setSelectValue('defaultFolder', this.settings.defaultFolder || 'unsorted');
    this.setInputValue('customFolder', this.settings.customFolder || '');
    this.setSelectValue(
      'fileNamingPattern',
      this.settings.fileNamingPattern || 'YYYY-MM-DD-domain-title'
    );

    // Automation Settings
    this.setCheckboxValue('autoCommit', (this.settings.autoCommit != null ? this.settings.autoCommit : true));

    // Content Processing
    this.setCheckboxValue('captureImages', (this.settings.captureImages != null ? this.settings.captureImages : true));
    this.setCheckboxValue('removeAds', (this.settings.removeAds != null ? this.settings.removeAds : true));
    this.setCheckboxValue('removeNavigation', (this.settings.removeNavigation != null ? this.settings.removeNavigation : true));
    this.setInputValue('customSelectors', this.settings.customSelectors || '');

    // Git & Repository Settings
    this.setInputValue(
      'commitMessageTemplate',
      this.settings.commitMessageTemplate || 'Add: {domain} - {title}'
    );

    // Debugging
    this.setCheckboxValue('debugMode', (this.settings.debugMode != null ? this.settings.debugMode : false));

    // UI Preferences
    this.setCheckboxValue('showNotifications', (this.settings.showNotifications != null ? this.settings.showNotifications : true));
    this.setCheckboxValue('enableKeyboardShortcuts', (this.settings.enableKeyboardShortcuts != null ? this.settings.enableKeyboardShortcuts : true));
  }
  private setupEventListeners(): void {
    // Save button
    var saveBtn = document.getElementById('save-settings');
    if (saveBtn) {
      saveBtn.addEventListener('click', function () { return this.saveSettings(); });
    }

    // Reset button
    var resetBtn = document.getElementById('reset-settings');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () { return this.resetSettings(); });
    }

    // Export button
    var exportBtn = document.getElementById('export-settings');
    if (exportBtn) {
      exportBtn.addEventListener('click', function () { return this.exportSettings(); });
    }

    // Import button
    var importBtn = document.getElementById('import-settings');
    if (importBtn) {
      importBtn.addEventListener('click', function () { return this.importSettings(); });
    }

    // Test connection button
    var testBtn = document.getElementById('test-connection');
    if (testBtn) {
      testBtn.addEventListener('click', function () { return this.testConnection(); });
    }

    // Real-time validation for GitHub fields
    var githubTokenInput = document.getElementById('githubToken') as HTMLInputElement;
    if (githubTokenInput) {
      githubTokenInput.addEventListener('input', function () { return this.validateGitHubToken(); });
      githubTokenInput.addEventListener('blur', function () { return this.validateGitHubToken(); });
    }

    var githubRepoInput = document.getElementById('githubRepo') as HTMLInputElement;
    if (githubRepoInput) {
      githubRepoInput.addEventListener('input', function () { return this.validateGitHubRepo(); });
      githubRepoInput.addEventListener('blur', function () { return this.validateGitHubRepo(); });
    }

    // Show/hide custom fields based on selections
    this.setupConditionalFields();
  }

  private validateGitHubToken(): void {
    var token = this.getInputValue('githubToken');
    var validationElement = document.getElementById('githubToken-validation');
    var inputElement = document.getElementById('githubToken') as HTMLInputElement;

    if (!validationElement || !inputElement) return;

    if (!token || token.trim() === '') {
      this.showFieldValidation(
        'githubToken',
        'GitHub token is required for repository operations',
        'error'
      );
    } else if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) {
      this.showFieldValidation(
        'githubToken',
        'Invalid token format. GitHub tokens should start with "ghp_" or "github_pat_"',
        'error'
      );
    } else if (token.length < 20) {
      this.showFieldValidation(
        'githubToken',
        'Token appears to be too short. Please check your token',
        'error'
      );
    } else {
      // Clear validation if valid
      validationElement.classList.add('pw-hidden');
      inputElement.classList.remove('error');
    }
  }

  private validateGitHubRepo(): void {
    var repo = this.getInputValue('githubRepo');
    var validationElement = document.getElementById('githubRepo-validation');
    var inputElement = document.getElementById('githubRepo') as HTMLInputElement;

    if (!validationElement || !inputElement) return;

    if (!repo || repo.trim() === '') {
      this.showFieldValidation(
        'githubRepo',
        'GitHub repository is required. Format: username/repository-name',
        'error'
      );
    } else if (!/^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/.test(repo.trim())) {
      this.showFieldValidation(
        'githubRepo',
        'Invalid format. Please use: username/repository-name',
        'error'
      );
    } else {
      // Clear validation if valid
      validationElement.classList.add('pw-hidden');
      inputElement.classList.remove('error');
    }
  }
  private setupConditionalFields(): void {
    // Show custom folder field when 'custom' is selected
    var defaultFolderSelect = document.getElementById('defaultFolder') as HTMLSelectElement;
    var customFolderField = document.getElementById('customFolderField');

    if (defaultFolderSelect && customFolderField) {
      var toggleCustomFolder = function () {
        if (defaultFolderSelect.value === 'custom') {
          customFolderField.classList.remove('pw-hidden');
        } else {
          customFolderField.classList.add('pw-hidden');
        }
      };

      defaultFolderSelect.addEventListener('change', toggleCustomFolder);
      toggleCustomFolder(); // Initial state
    }
  }
  private async saveSettings(): Promise<void> {
    try {
      // Clear previous validation messages
      this.clearValidationMessages();

      // Validate required fields before saving
      var githubToken = this.getInputValue('githubToken');
      var githubRepo = this.getInputValue('githubRepo');

      var hasErrors = false;

      // Only validate if user has entered something (allow saving with empty fields)
      if (githubToken && githubToken.trim() !== '') {
        if (!githubToken.startsWith('ghp_') && !githubToken.startsWith('github_pat_')) {
          this.showFieldValidation(
            'githubToken',
            'Invalid token format. GitHub tokens should start with "ghp_" or "github_pat_"',
            'error'
          );
          hasErrors = true;
        } else if (githubToken.length < 20) {
          this.showFieldValidation(
            'githubToken',
            'Token appears to be too short. Please check your token',
            'error'
          );
          hasErrors = true;
        }
      }

      if (githubRepo && githubRepo.trim() !== '') {
        if (!/^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/.test(githubRepo.trim())) {
          this.showFieldValidation(
            'githubRepo',
            'Invalid format. Please use: username/repository-name',
            'error'
          );
          hasErrors = true;
        }
      }

      if (hasErrors) {
        this.showMessage('Please fix the validation errors before saving', 'error');
        return;
      }

      var formData = this.collectFormData();
      var response = await this.sendMessage('UPDATE_SETTINGS', formData);

      if (response.success) {
        this.showMessage('Settings saved successfully!', 'success');
        this.settings = { ...this.settings, ...formData };
      } else {
        throw new Error(response.error || 'Failed to save settings');
      }
    } catch (error) {
      this.logger.error('Failed to save settings', error);
      this.showMessage('Failed to save settings: ' + (error as Error).message, 'error');
    }
  }

  private async resetSettings(): Promise<void> {
    if (!confirm('Are you sure you want to reset all settings to defaults?')) {
      return;
    }

    try {
      var response = await this.sendMessage('RESET_SETTINGS');

      if (response.success) {
        this.showMessage('Settings reset to defaults', 'success');
        await this.loadSettings();
        this.populateForm();
      } else {
        throw new Error(response.error || 'Failed to reset settings');
      }
    } catch (error) {
      this.logger.error('Failed to reset settings', error);
      this.showMessage('Failed to reset settings: ' + (error as Error).message, 'error');
    }
  }

  private async exportSettings(): Promise<void> {
    try {
      var response = await this.sendMessage('EXPORT_SETTINGS');

      if (response.success) {
        var blob = new Blob([response.data as string], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'prismweave-settings.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showMessage('Settings exported successfully!', 'success');
      } else {
        throw new Error(response.error || 'Failed to export settings');
      }
    } catch (error) {
      this.logger.error('Failed to export settings', error);
      this.showMessage('Failed to export settings: ' + (error as Error).message, 'error');
    }
  }

  private async importSettings(): Promise<void> {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = async function e {
      var file = ((e.target as HTMLInputElement).files == null ? undefined : (e.target as HTMLInputElement).files[0]);
      if (!file) return;

      try {
        var text = await file.text();
        var response = await this.sendMessage('IMPORT_SETTINGS', { settings: text });

        if (response.success) {
          this.showMessage('Settings imported successfully!', 'success');
          await this.loadSettings();
          this.populateForm();
        } else {
          throw new Error(response.error || 'Failed to import settings');
        }
      } catch (error) {
        this.logger.error('Failed to import settings', error);
        this.showMessage('Failed to import settings: ' + (error as Error).message, 'error');
      }
    };

    input.click();
  }
  private async testConnection(): Promise<void> {
    // Clear previous validation messages
    this.clearValidationMessages();

    // Get current form values for validation
    var githubToken = this.getInputValue('githubToken');
    var githubRepo = this.getInputValue('githubRepo');

    // Validate required fields
    var validationErrors = this.validateConnectionFields(githubToken, githubRepo);

    if (validationErrors.length > 0) {
      // Show validation errors
      validationErrors.forEach(function error {
        this.showFieldValidation(error.field, error.message, 'error');
      });

      this.showMessage('Please fix the validation errors before testing connection', 'error');
      return;
    }

    try {
      this.showMessage('Testing connection...', 'info');
      var response = await this.sendMessage('TEST_CONNECTION');

      if (response.success) {
        this.showMessage('Connection test successful!', 'success');
        this.showConnectionResult('✅ GitHub connection established successfully', 'success');
      } else {
        throw new Error(response.error || 'Connection test failed');
      }
    } catch (error) {
      this.logger.error('Connection test failed', error);
      var errorMessage = this.getDetailedErrorMessage(error as Error);
      this.showMessage('Connection test failed: ' + errorMessage, 'error');
      this.showConnectionResult('❌ ' + errorMessage, 'error');
    }
  }

  private validateConnectionFields(
    githubToken: string,
    githubRepo: string
  ): Array<{ field: string; message: string }> {
    var errors: Array<{ field: string; message: string }> = [];

    if (!githubToken || githubToken.trim() === '') {
      errors.push({
        field: 'githubToken',
        message: 'GitHub token is required. Please enter your personal access token.',
      });
    } else if (!githubToken.startsWith('ghp_') && !githubToken.startsWith('github_pat_')) {
      errors.push({
        field: 'githubToken',
        message: 'Invalid token format. GitHub tokens should start with "ghp_" or "github_pat_".',
      });
    }

    if (!githubRepo || githubRepo.trim() === '') {
      errors.push({
        field: 'githubRepo',
        message: 'GitHub repository is required. Please enter in format: username/repository-name',
      });
    } else if (!/^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/.test(githubRepo.trim())) {
      errors.push({
        field: 'githubRepo',
        message: 'Invalid repository format. Please use: username/repository-name',
      });
    }

    return errors;
  }

  private getDetailedErrorMessage(error: Error): string {
    var message = error.message.toLowerCase();

    if (message.includes('unauthorized') || message.includes('401')) {
      return 'Invalid GitHub token. Please check your personal access token.';
    } else if (message.includes('not found') || message.includes('404')) {
      return 'Repository not found. Please check the repository name and ensure you have access.';
    } else if (message.includes('forbidden') || message.includes('403')) {
      return 'Access denied. Please ensure your token has the necessary permissions.';
    } else if (message.includes('network') || message.includes('connection')) {
      return 'Network error. Please check your internet connection.';
    } else {
      return error.message;
    }
  }

  private showFieldValidation(fieldId: string, message: string, type: 'error' | 'success'): void {
    var validationElement = document.getElementById("" + (fieldId) + "-validation");
    if (validationElement) {
      validationElement.textContent = message;
      validationElement.className = "validation-message pw-validation-error " + (type) + "";
      validationElement.classList.remove('pw-hidden');
    }

    // Also highlight the input field
    var inputElement = document.getElementById(fieldId) as HTMLInputElement;
    if (inputElement) {
      inputElement.classList.toggle('error', type === 'error');
    }
  }

  private clearValidationMessages(): void {
    var validationElements = document.querySelectorAll('.validation-message');
    validationElements.forEach(function el {
      (el as HTMLElement).classList.add('pw-hidden');
    });

    // Remove error classes from inputs
    var inputElements = document.querySelectorAll('input.error');
    inputElements.forEach(function el {
      el.classList.remove('error');
    });
  }

  private showConnectionResult(message: string, type: 'success' | 'error'): void {
    var resultElement = document.getElementById('connection-test-result');
    if (resultElement) {
      resultElement.textContent = message;
      resultElement.className = "test-result pw-test-result " + (type) + "";
      resultElement.classList.remove('pw-hidden');

      // Auto-hide after 10 seconds
      setTimeout(function () {
        resultElement.classList.add('pw-hidden');
      }, 10000);
    }
  }
  private collectFormData(): Partial<ISettings> {
    return {
      githubToken: this.getInputValue('githubToken'),
      githubRepo: this.getInputValue('githubRepo'),
      defaultFolder: this.getSelectValue('defaultFolder'),
      customFolder: this.getInputValue('customFolder'),
      fileNamingPattern: this.getSelectValue('fileNamingPattern'),
      autoCommit: this.getCheckboxValue('autoCommit'),
      captureImages: this.getCheckboxValue('captureImages'),
      removeAds: this.getCheckboxValue('removeAds'),
      removeNavigation: this.getCheckboxValue('removeNavigation'),
      customSelectors: this.getInputValue('customSelectors'),
      commitMessageTemplate: this.getInputValue('commitMessageTemplate'),
      debugMode: this.getCheckboxValue('debugMode'),
      showNotifications: this.getCheckboxValue('showNotifications'),
      enableKeyboardShortcuts: this.getCheckboxValue('enableKeyboardShortcuts'),
    };
  }
  // Helper methods for form manipulation
  private setInputValue(id: string, value: string): void {
    var element = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement;
    if (element) element.value = value;
  }

  private setSelectValue(id: string, value: string): void {
    var element = document.getElementById(id) as HTMLSelectElement;
    if (element) element.value = value;
  }

  private setCheckboxValue(id: string, value: boolean): void {
    var element = document.getElementById(id) as HTMLInputElement;
    if (element) element.checked = value;
  }
  private getInputValue(id: string): string {
    var element = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement;
    return element ? element.value : '';
  }

  private getSelectValue(id: string): string {
    var element = document.getElementById(id) as HTMLSelectElement;
    return element ? element.value : '';
  }

  private getCheckboxValue(id: string): boolean {
    var element = document.getElementById(id) as HTMLInputElement;
    return element ? element.checked : false;
  }

  private showMessage(message: string, type: 'success' | 'error' | 'info'): void {
    var messageElement = document.getElementById('message');
    if (messageElement) {
      messageElement.textContent = message;
      messageElement.className = "message pw-alert " + (type) + "";
      messageElement.classList.remove('pw-hidden');

      // Auto-hide after 5 seconds
      setTimeout(function () {
        messageElement.classList.add('pw-hidden');
      }, 5000);
    }
  }

  private async sendMessage(type: string, data?: any): Promise<IMessageResponse> {
    return new Promise<IMessageResponse>(function (resolve, reject) {
      var message: IMessageData = { type, data };

      chrome.runtime.sendMessage(message, (response: IMessageResponse) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  }
}

// Make available globally for service worker importScripts compatibility
if (typeof globalThis !== 'undefined') {
  (globalThis as any).PrismWeaveOptions = PrismWeaveOptions;
} else if (typeof self !== 'undefined') {
  (self as any).PrismWeaveOptions = PrismWeaveOptions;
}

// Initialize options page when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  new PrismWeaveOptions();
});
