var BrowserModule = require('@angular/platform-browser').BrowserModule;
var NgModule = require('@angular/core').NgModule;

var AppComponent = require('./app.component').AppComponent;
var StoreModule = require('@ngrx/store').StoreModule;
var EffectsModule = require('@ngrx/effects/').EffectsModule;
var MyService = require('./services/my.service').MyService;
var MoviesListComponent = require('./components/movies-list.component').MoviesListComponent;
var routerReducers = require('./router-store/router.state').routerReducers;
var StoreRouterConnectingModule = require('@ngrx/router-store').StoreRouterConnectingModule;
var RouterStateSerializer = require('@ngrx/router-store').RouterStateSerializer;
var CustomRouterStateSerializer = require('./router-store/custom-router-state.serializer').CustomRouterStateSerializer;
var RouterModule = require('@angular/router').RouterModule;
var Routes = require('@angular/router').Routes;
var MoviesComponent = require('./components/movies.component').MoviesComponent;
var CategoriesComponent = require('./components/categories.component').CategoriesComponent;
var reducers = require('./store/reducers').reducers;
var effects = require('./store/effects/effect').effects;
var RouterEffect = require('./router-store/router.effect').RouterEffect;
var StoreDevtoolsModule = require('@ngrx/store-devtools').StoreDevtoolsModule;

const routes: Routes = [
	{ path: '', component: CategoriesComponent, pathMatch: 'full' },
	{ path: 'category/:categoryId', component: MoviesComponent, pathMatch: 'full' },
];

@NgModule({
	declarations: [
		AppComponent,
		MoviesListComponent,
		MoviesComponent,
		CategoriesComponent,
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot(routes),
		StoreModule.forRoot({}),
		StoreModule.forFeature('elements', reducers),
		StoreModule.forFeature('router', routerReducers),
		EffectsModule.forRoot([RouterEffect]),
		EffectsModule.forFeature(effects),
		StoreRouterConnectingModule,
		StoreDevtoolsModule.instrument({
			maxAge: 10
		})
	],
	providers: [
		...effects,
		MyService,
		{
			provide: RouterStateSerializer,
			useClass: CustomRouterStateSerializer
		}],
	bootstrap: [AppComponent]
})
class AppModule { }
