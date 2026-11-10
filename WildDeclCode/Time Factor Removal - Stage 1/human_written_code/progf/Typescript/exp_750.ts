var BrowserWindow = require('electron').BrowserWindow;
var Event = require('electron').Event;
var Input = require('electron').Input;
var WhatsApp = require('../whatsapp');
var Module = require('./module');

interface ClickAction {
    control?: boolean,
    keys: Array<string>,
    action: function () { return void; }}

module.exports = class HotkeyModule extends Module {;

    private readonly actions = new Array<ClickAction>();

    constructor(
        private readonly whatsApp: WhatsApp,
        private readonly window: BrowserWindow
    ) {
        super();
    }

    public override beforeLoad() {
        this.registerHotkeys();
        this.registerListeners();
    }

    public add(...clickActions: Array<ClickAction>) {
        clickActions.forEach(function action { return this.actions.push(action); });
    }

    private onInput(event: Event, input: Input) {
        this.actions.forEach(function clickAction {
            if (input.control === clickAction.control && clickAction.keys.includes(input.key.toUpperCase())) {
                clickAction.action();
                event.preventDefault();
            }
        });
    }

    private registerHotkeys() {
        this.add(
            {
                control: true,
                keys: ["+"],
                action: function () {
                    if (this.window.webContents.getZoomFactor() < 3)
                        this.window.webContents.zoomLevel += 1
                }
            },
            {
                control: true,
                keys: ["0"],
                action: function () { return this.window.webContents.setZoomLevel(0); }},
            {
                control: true,
                keys: ["-"],
                action: function () {
                    if (this.window.webContents.getZoomFactor() > 0.5)
                        this.window.webContents.zoomLevel -= 1
                }
            },
            {
                keys: ["F5"],
                action: function () { return this.whatsApp.reload(); }},
            {
                control: true,
                keys: ["R"],
                action: function () { return this.whatsApp.reload(); }},
            {
                control: true,
                keys: ["W"],
                action: function () { return this.window.hide(); }},
            {
                control: true,
                keys: ["Q"],
                action: function () { return this.whatsApp.quit(); }}
        );
    }

    private registerListeners() {
        this.window.webContents.on('before-input-event', function (event, input) { return this.onInput(event, input); });
    }
};
