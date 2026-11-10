var WebDriver = require('selenium-webdriver').WebDriver;
var By = require('selenium-webdriver').By;
var SeleniumUtils = require('../utils/se.utils').SeleniumUtils;

class CalendarPage {
    constructor(private browser: WebDriver) { }

    private seleniumUtils = new SeleniumUtils(this.browser);

    private find = function (cssPath: string) { 
        return this.browser.findElement(By.css(cssPath));
    }

    buttonExit = function () { return this.find('[ng-click="exit()"]'); };

    isPage() {
        let blockOnLoginPage = this.find('calendar-component');
        return this.seleniumUtils.existElement(blockOnLoginPage);
    }
    
    isLoad = function () { return this.seleniumUtils.wait('calendar-component'); };
}