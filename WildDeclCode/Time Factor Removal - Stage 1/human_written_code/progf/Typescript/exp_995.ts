var NgModule = require('@angular/core').NgModule;
var NO_ERRORS_SCHEMA = require('@angular/core').NO_ERRORS_SCHEMA;
var NativeScriptModule = require('nativescript-angular/nativescript.module').NativeScriptModule;
var AppRoutingModule = require('./app.routing').AppRoutingModule;
var AppComponent = require('./app.component').AppComponent;

var ItemService = require('./item/item.service').ItemService;
var ItemsComponent = require('./item/items.component').ItemsComponent;
var ItemDetailComponent = require('./item/item-detail.component').ItemDetailComponent;



var app = require('application');
var utils = require('utils/utils');
if (app.android) {
    const TNSTwitter = require("nativescript-twitter").TNSTwitter;
    TNSTwitter.init("nMOzsRotT4uil8j2Y1hRmFzG6", "DPhkK4lZiwC4hcByiczxswBAorwoUgJrCjpxwBIo3JX8BXNcKz");
} else if (app.ios) {
    app.ios.delegate = require('./custom-app-delegate').CustomAppDelegate;
}

var registerElement = require('nativescript-angular/element-registry').registerElement;
registerElement("TNSTwitterButton", function () { return require("nativescript-twitter").TNSTwitterButton; });

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        ItemsComponent,
        ItemDetailComponent
    ],
    providers: [
        ItemService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
class AppModule { }
