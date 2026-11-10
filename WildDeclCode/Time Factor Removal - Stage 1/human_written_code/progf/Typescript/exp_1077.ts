var WebDriver = require('selenium-webdriver').WebDriver;
var By = require('selenium-webdriver').By;

class AddClientPage {

    constructor(private browser: WebDriver) { }

    private find = function (cssPath: string) {
        return this.browser.findElement(By.css(cssPath));
    }

    tab = function () { return this.find('md-pagination-wrapper>md-tab-item:nth-child(2)')
    clock = {
        hour: '[ng-model="ctrl.unit.hour"]',
        minuts: '[ng-model="ctrl.unit.minute"]'
    }; };
    lastName = function () { return this.find('[ng-model="ctrl.unit.fam"]'); };
    firstName = function () { return this.find('[ng-model="ctrl.unit.name"]'); };
    birthday = {
        day: function () { return this.find('[ng-model="ctrl.unit.birthday.day"]'); },
        mounth: function () { return this.find('[ng-model="ctrl.unit.birthday.mounth"]'); },
        year: function () { return this.find('[ng-model="ctrl.unit.birthday.year"]'); }};
    phone1 = function () { return this.find('[ng-model="ctrl.unit.phone1"]'); };
    btnClear = function () { return this.find('[ng-click="ctrl.clear()"]'); };
    btnSave = function () { return this.find('[ng-click="ctrl.save()"]')

    async setClock (hour: string, minute: string) {
        (await this.find('[ng-model="ctrl.unit.hour"]  option[value="' + (hour) + '"]')).click();
        (await this.find('[ng-model="ctrl.unit.minute"]  option[value="' + (minute) + '"]')).click();
    }; };
}
