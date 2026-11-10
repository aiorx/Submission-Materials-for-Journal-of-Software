var App = require('vue').App;
var createApp = require('vue').createApp;
var defineComponent = require('vue').defineComponent;

function appendAppDivToBody(): void {
  const appDiv: HTMLDivElement = document.createElement("div");
  appDiv.id = "app";
  document.body.appendChild(appDiv);
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
function createAppWithComponent() {
  // eslint-disable-next-line @typescript-eslint/typedef
  const appComponent = defineComponent({
    name: "App",
    render() {
      return null;
    },
  });
  const app: App<Element> = createApp(appComponent);
  return { app, component: appComponent };
}

function resetHtml(): void {
  const html: HTMLHtmlElement = document.getElementsByTagName("html")[0] as HTMLHtmlElement;
  html.innerHTML = "";
}

function resetDataLayer(): void {
  delete window["dataLayer"];
}
