/* tslint:disable */
/**
* @module SDKModule
* @author Jonathan Casarrubias <t:@johncasarrubias> <gh:jonathan-casarrubias>
* @license MIT 2016 Jonathan Casarrubias
* @version 2.1.0
* @description
* The SDKModule is a generated Software Development Kit automatically built by
* the LoopBack SDK Builder open source module.
*
* The SDKModule provides Angular 2 >= RC.5 support, which means that NgModules
* can import this Software Development Kit as follows:
*
*
* APP Route Module Context
* ============================================================================
* import { NgModule }       from '@angular/core';
* import { BrowserModule }  from '@angular/platform-browser';
* // App Root 
* import { AppComponent }   from './app.component';
* // Feature Modules
* import { SDK[Browser|Node|Native]Module } from './shared/sdk/sdk.module';
* // Import Routing
* import { routing }        from './app.routing';
* @NgModule({
*  imports: [
*    BrowserModule,
*    routing,
*    SDK[Browser|Node|Native]Module.forRoot()
*  ],
*  declarations: [ AppComponent ],
*  bootstrap:    [ AppComponent ]
* })
* export class AppModule { }
*
**/
var JSONSearchParams = require('./services/core/search.params').JSONSearchParams;
var ErrorHandler = require('./services/core/error.service').ErrorHandler;
var LoopBackAuth = require('./services/core/auth.service').LoopBackAuth;
var LoggerService = require('./services/custom/logger.service').LoggerService;
var SDKModels = require('./services/custom/SDKModels').SDKModels;
var InternalStorage = require('./storage/storage.swaps').InternalStorage;
var SDKStorage = require('./storage/storage.swaps').SDKStorage;
var HttpModule = require('@angular/http').HttpModule;
var CommonModule = require('@angular/common').CommonModule;
var NgModule = require('@angular/core').NgModule;
var ModuleWithProviders = require('@angular/core').ModuleWithProviders;
var CookieBrowser = require('./storage/cookie.browser').CookieBrowser;
var StorageBrowser = require('./storage/storage.browser').StorageBrowser;
var UserApi = require('./services/custom/User').UserApi;
var QuestionApi = require('./services/custom/Question').QuestionApi;
var AnswerApi = require('./services/custom/Answer').AnswerApi;
/**
* @module SDKBrowserModule
* @description
* This module should be imported when building a Web Application in the following scenarios:
*
*  1.- Regular web application
*  2.- Angular universal application (Browser Portion)
*  3.- Progressive applications (Angular Mobile, Ionic, WebViews, etc)
**/
@NgModule({
  imports:      [ CommonModule, HttpModule ],
  declarations: [ ],
  exports:      [ ],
  providers:    [
    ErrorHandler
  ]
})
class SDKBrowserModule {
  static forRoot(internalStorageProvider: any = {
    provide: InternalStorage,
    useClass: CookieBrowser
  }): ModuleWithProviders {
    return {
      ngModule  : SDKBrowserModule,
      providers : [
        LoopBackAuth,
        LoggerService,
        JSONSearchParams,
        SDKModels,
        UserApi,
        QuestionApi,
        AnswerApi,
        internalStorageProvider,
        { provide: SDKStorage, useClass: StorageBrowser }
      ]
    };
  }
}
/**
* Have Fun!!!
* - Jon
**/
export * from './models/index';
export * from './services/index';
export * from './lb.config';
export * from './storage/storage.swaps';
module.exports.CookieBrowser = CookieBrowser;
module.exports.StorageBrowser = StorageBrowser;

