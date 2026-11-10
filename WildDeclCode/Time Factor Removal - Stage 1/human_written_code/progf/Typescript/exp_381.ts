var NgModule = require('@angular/core').NgModule;
var CommonModule = require('@angular/common').CommonModule;
var LoginComponent = require('./containers/login/login.component').LoginComponent;
var ReactiveFormsModule = require('@angular/forms').ReactiveFormsModule;
var HttpClientModule = require('@angular/common/http').HttpClientModule;
var HTTP_INTERCEPTORS = require('@angular/common/http').HTTP_INTERCEPTORS;
var RouterModule = require('@angular/router').RouterModule;
var MatButtonModule = require('@angular/material').MatButtonModule;
var MatFormFieldModule = require('@angular/material').MatFormFieldModule;
var MatInputModule = require('@angular/material').MatInputModule;
var AuthGuard = require('./guards/auth.guard').AuthGuard;
var AuthService = require('./services/auth.service').AuthService;
var RandomGuard = require('./guards/random.guard').RandomGuard;
var TokenInterceptor = require('./token.interceptor').TokenInterceptor;

@NgModule({
  declarations: [LoginComponent],
  providers: [
    AuthGuard,
    AuthService,
    RandomGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
class AuthModule { }
