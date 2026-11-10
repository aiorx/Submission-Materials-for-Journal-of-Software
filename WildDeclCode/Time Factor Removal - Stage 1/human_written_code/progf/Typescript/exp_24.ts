var trace = require('./tracer').trace;
var BuildContext = require('./context').BuildContext;
var AppView = require('../types/app').AppView;

function buildApp(context: BuildContext, view: AppView) {
  trace("#buildApp", context, view);
  context.add("" + (view.appViewInfo.appComponentName) + "()");
}
