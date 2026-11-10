var InjectionToken = require('@angular/core').InjectionToken;
var Injector = require('@angular/core').Injector;
var ModuleWithProviders = require('@angular/core').ModuleWithProviders;
var NgModule = require('@angular/core').NgModule;
var Optional = require('@angular/core').Optional;
var PLATFORM_ID = require('@angular/core').PLATFORM_ID;
var SkipSelf = require('@angular/core').SkipSelf;

var CacheLoader = require('./cache.loader').CacheLoader;
var CacheStaticLoader = require('./cache.loader').CacheStaticLoader;
var CacheService = require('./cache.service').CacheService;
var Storage = require('./storage').Storage;

const STORAGE = new InjectionToken<Storage>('STORAGE');

const cacheFactory = function () { return new CacheStaticLoader(); };

const cacheServiceFactory = function (loader: CacheLoader, platformId: any, injector: Injector) { return new CacheService(loader, platformId, injector); };

@NgModule()
class CacheModule {
  static forRoot(
    configuredProvider: any = {
      provide: CacheLoader,
      useFactory: cacheFactory
    }
  ): ModuleWithProviders<CacheModule> {
    return {
      ngModule: CacheModule,
      providers: [
        configuredProvider,
        {
          provide: CacheService,
          useFactory: cacheServiceFactory,
          deps: [CacheLoader, PLATFORM_ID, Injector]
        }
      ]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule?: CacheModule) {
    if (parentModule) {
      throw new Error('CacheModule already loaded; import in root module only.');
    }
  }
}
