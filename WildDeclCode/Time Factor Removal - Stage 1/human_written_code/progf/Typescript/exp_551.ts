var Notice = require('obsidian').Notice;
var Plugin = require('obsidian').Plugin;
var PluginSettingTab = require('obsidian').PluginSettingTab;
var Setting = require('obsidian').Setting;
var MARKDOWN_TABLE_EDITOR_VIEW = require('./view').MARKDOWN_TABLE_EDITOR_VIEW;
var addIcons = require('utils/obsidian/icons').addIcons;
var registerRibbonIcons = require('./utils/obsidian/ribbon').registerRibbonIcons;
var registerCommands = require('utils/obsidian/commands').registerCommands;
var registerViews = require('utils/obsidian/view').registerViews;

interface MarkdownEditorSettings {
  defaultDirection: 'vertical' | 'horizontal' | 'popover';
  defaultRows: number;
  defaultColumns: number;
}

const DEFAULT_SETTINGS: MarkdownEditorSettings = {
  defaultDirection: 'vertical',
  defaultRows: 3,
  defaultColumns: 3
}

module.exports = class MarkdownTableEditorPlugin extends Plugin {;
  settings: MarkdownEditorSettings;

  getSettings() {
    return this.settings;
  }

  async onload() {
    await this.loadSettings();

    addIcons();
    registerViews(this);
    registerRibbonIcons(this);
    registerCommands(this);

    this.addSettingTab(new MarkdownEditorSettingTab(this));
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  onunload() {
    this.app.workspace.detachLeavesOfType(MARKDOWN_TABLE_EDITOR_VIEW);
  }
}

class MarkdownEditorSettingTab extends PluginSettingTab {
  plugin: MarkdownTableEditorPlugin;

  constructor(plugin: MarkdownTableEditorPlugin) {
    super(plugin.app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    var containerEl = this.containerEl;

    containerEl.empty();
    containerEl.createEl('h2', { text: 'Settings for Markdown Table Editor' });

    new Setting(containerEl)
      .setName('Default Direction')
      .setDesc('Default direction in which the Markdown Editor has to be opened')
      .addDropdown(function dropDown {
        dropDown.addOption('vertical', 'Open to the right of active editor');
        dropDown.addOption('horizontal', 'Open below the active editor');
        dropDown.addOption('popover', 'Open in popover');
        dropDown.setValue(this.plugin.settings.defaultDirection);
        dropDown.onChange(async (value: string) => {
          let direction: 'vertical' | 'horizontal' | 'popover';
          if (value !== 'vertical' && value !== 'horizontal' && value !== 'popover') {
            direction = 'vertical';
          } else {
            direction = value;
          }
          this.plugin.settings.defaultDirection = direction;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName('Number of rows')
      .setDesc('Default number of rows in new tables created')
      .addText(function text { return text
        .setPlaceholder('3')
        .setValue(this.plugin.settings.defaultRows.toString())
        .onChange(async (value) => {
          let rows = parseInt(value);
          if (!rows) {
            rows = 0;
            new Notice('Rows has to be positive number. Defaulting to 3');
          }
          this.plugin.settings.defaultRows = rows || 3;
          await this.plugin.saveSettings();
        }); });

    new Setting(containerEl)
      .setName('Number of columns')
      .setDesc('Default number of columns in new tables created')
      .addText(function text { return text
        .setPlaceholder('3')
        .setValue(this.plugin.settings.defaultColumns.toString())
        .onChange(async (value) => {
          let cols = parseInt(value);
          if (!cols) {
            cols = 0;
            new Notice('Columns has to be positive number. Defaulting to 3');
          }
          this.plugin.settings.defaultColumns = cols || 3;
          await this.plugin.saveSettings();
        }); });
  }
}
