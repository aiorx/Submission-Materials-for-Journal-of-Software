var NgModule = require('@angular/core').NgModule;
var Routes = require('@angular/router').Routes;
var RouterModule = require('@angular/router').RouterModule;

var GettingStarted = require('./getting-started/getting-started').GettingStarted;
var Home = require('./home/home').Home;

const DEMO_DECLARATIONS = [
  GettingStarted,
  Home
];

const routes: Routes = [
  {
    path: 'button', loadChildren: function () { return import('./components/button/module').then(m => m.ButtonModule); }},
  {path: 'card', loadChildren: function () { return import('./components/card/module').then(m => m.CardModule); }},
  {
    path: 'checkbox', loadChildren: function () { return import('./components/checkbox/module').then(m => m.CheckboxModule); }},
  {
    path: 'chips', loadChildren: function () { return import('./components/chips/module').then(m => m.ChipsModule); }},
  {path: 'theme', loadChildren: function () { return import('./components/theme/module').then(m => m.ThemeModule); }},
  {
    path: 'data-table', loadChildren: function () { return import('./components/data-table/module').then(m => m.DataTableModule); }},
  {path: 'dialog', loadChildren: function () { return import('./components/dialog/module').then(m => m.DialogModule); }},
  {path: 'drawer', loadChildren: function () { return import('./components/drawer/module').then(m => m.DrawerModule); }},
  {
    path: 'elevation', loadChildren: function () { return import('./components/elevation/module').then(m => m.ElevationModule); }},
  {path: 'fab', loadChildren: function () { return import('./components/fab/module').then(m => m.FabModule); }},
  {
    path: 'form-field', loadChildren: function () { return import('./components/form-field/module').then(m => m.FormFieldModule); }},
  {path: 'getting-started', component: GettingStarted},
  {path: 'home', component: Home, pathMatch: 'full'},
  {path: 'icon', loadChildren: function () { return import('./components/icon/module').then(m => m.IconModule); }},
  {
    path: 'icon-button', loadChildren: function () { return import('./components/icon-button/module').then(m => m.IconButtonModule); }},
  {
    path: 'image-list', loadChildren: function () { return import('./components/image-list/module').then(m => m.ImageListModule); }},
  {
    path: 'linear-progress', loadChildren: function () { return import('./components/linear-progress/module').then(m => m.LinearProgressModule); }},
  {path: 'list', loadChildren: function () { return import('./components/list/module').then(m => m.ListModule); }},
  {path: 'menu', loadChildren: function () { return import('./components/menu/module').then(m => m.MenuModule); }},
  {
    path: 'menu-surface', loadChildren: function () { return import('./components/menu-surface/module').then(m => m.MenuSurfaceModule); }},
  {path: 'radio', loadChildren: function () { return import('./components/radio/module').then(m => m.RadioModule); }},
  {path: 'ripple', loadChildren: function () { return import('./components/ripple/module').then(m => m.RippleModule); }},
  {path: 'select', loadChildren: function () { return import('./components/select/module').then(m => m.SelectModule); }},
  {path: 'shape', loadChildren: function () { return import('./components/shape/module').then(m => m.ShapeModule); }},
  {path: 'slider', loadChildren: function () { return import('./components/slider/module').then(m => m.SliderModule); }},
  {
    path: 'snackbar', loadChildren: function () { return import('./components/snackbar/module').then(m => m.SnackbarModule); }},
  {path: 'switch', loadChildren: function () { return import('./components/switch/module').then(m => m.SwitchModule); }},
  {path: 'tabs', loadChildren: function () { return import('./components/tabs/module').then(m => m.TabsModule); }},
  {path: 'textarea', loadChildren: function () { return import('./components/textarea/module').then(m => m.TextareaModule); }},
  {
    path: 'text-field', loadChildren: function () { return import('./components/text-field/module').then(m => m.TextFieldModule); }},
  {
    path: 'top-app-bar', loadChildren: function () { return import('./components/top-app-bar/module').then(m => m.TopAppBarModule); }},
  {
    path: 'typography', loadChildren: function () { return import('./components/typography/module').then(m => m.TypographyModule); }},
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
class AppRoutingModule {}
