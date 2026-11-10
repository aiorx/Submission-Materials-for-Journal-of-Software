var BrowserModule = require('@angular/platform-browser').BrowserModule;
var BrowserAnimationsModule = require('@angular/platform-browser/animations').BrowserAnimationsModule;
var NgModule = require('@angular/core').NgModule;
var FormsModule = require('@angular/forms').FormsModule;
var RouterModule = require('@angular/router').RouterModule;
var Route = require('@angular/router').Route;
import {
  MatTableModule,
  MatInputModule,
} from '@angular/material';
var AppComponent = require('./app.component').AppComponent;
var TicketingComponent = require('./ticketing/ticketing.component').TicketingComponent;
var HttpClientModule = require('@angular/common/http').HttpClientModule;
var UserComponent = require('./user/user.component').UserComponent;

const routes: Route[] = [
  {
    path: '',
    component: TicketingComponent,
  },
  {
    path: 'user',
    component: UserComponent,
  },
];

@NgModule({
  declarations: [AppComponent, UserComponent, TicketingComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatTableModule,
    MatInputModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
class AppModule {}
