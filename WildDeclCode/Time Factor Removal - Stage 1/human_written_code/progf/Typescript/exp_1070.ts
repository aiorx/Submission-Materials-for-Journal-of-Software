var TestBed = require('@angular/core/testing').TestBed;
var async = require('@angular/core/testing').async;
var AppComponent = require('./app.component').AppComponent;
var APP_BASE_HREF = require('@angular/common').APP_BASE_HREF;
var CommonModule = require('@angular/common').CommonModule;
var HttpClientModule = require('@angular/common/http').HttpClientModule;
var FormsModule = require('@angular/forms').FormsModule;
var ReactiveFormsModule = require('@angular/forms').ReactiveFormsModule;
var RouterModule = require('@angular/router').RouterModule;
var StoreModule = require('@ngrx/store').StoreModule;
var EffectsModule = require('@ngrx/effects').EffectsModule;
var BrowserModule = require('@angular/platform-browser').BrowserModule;

describe('AppComponent', function () {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([]),
        StoreModule,
        EffectsModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue : '/' }
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it("should have as title 'NgRx Games CRUD Demo'", async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('NgRx Games CRUD Demo');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to NgRx Games CRUD Demo!');
  }));
});
