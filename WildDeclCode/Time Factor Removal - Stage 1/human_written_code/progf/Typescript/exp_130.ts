var platformBrowserDynamic = require('@angular/platform-browser-dynamic').platformBrowserDynamic;

var AppModule = require('./app.module').AppModule;

platformBrowserDynamic().bootstrapModule(AppModule);
