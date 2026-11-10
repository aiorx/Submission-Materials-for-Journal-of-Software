var BrowserModule = require('@angular/platform-browser').BrowserModule;
var BrowserAnimationsModule = require('@angular/platform-browser/animations').BrowserAnimationsModule;
var NgModule = require('@angular/core').NgModule;
var StoreModule = require('@ngrx/store').StoreModule;


var AppComponent = require('./app.component').AppComponent;
var FilmItemComponent = require('./components/film-item/film-item.component').FilmItemComponent;
var FilmListComponent = require('./components/film-list/film-list.component').FilmListComponent;

var reducers = require('./store/reducers').reducers;
var metaReducers = require('./store/reducers').metaReducers;
var FilmSelectedComponent = require('./components/film-selected/film-selected.component').FilmSelectedComponent;

var MatToolbarModule = require('@angular/material/toolbar').MatToolbarModule;
var MatListModule = require('@angular/material/list').MatListModule;
var MatCardModule = require('@angular/material/card').MatCardModule;

const MATERIAL_MODULES = [
  MatToolbarModule,
  MatListModule,
  MatCardModule
];

@NgModule({
  declarations: [
    AppComponent,
    FilmItemComponent,
    FilmListComponent,
    FilmSelectedComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ...MATERIAL_MODULES,
    StoreModule.forRoot(reducers, { metaReducers }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
class AppModule { }
