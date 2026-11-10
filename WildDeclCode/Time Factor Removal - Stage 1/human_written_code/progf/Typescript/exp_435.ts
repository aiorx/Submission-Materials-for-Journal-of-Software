/**
* Copyright 2018 Comcast Cable Communications Management, LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

// 1) Module imports work slightly different in TypeScript (when the module
// doesn't have a default export).
var pxsceneUI = require('pxscene-ui');
// 2) Import a component written in JavaScript.
var WidgetJS = require('WidgetJS');
// 3) Import the same component written in TypeScript.
var WidgetTS = require('WidgetTS');
var pxObject = pxsceneUI.pxObject;

// 4) We're choosing to not declare any types for App's state and props, so App
// will just be a class that extends pxComponent<any, any>. This is the same
// pattern used by React.
module.exports = class App extends pxsceneUI.pxComponent<any, any> {;
  render() {
    var widget1 = new WidgetJS({
      x: 100,
      y: 100,
      w: 100,
      h: 50,
      // 5) WidgetJS is written in JavaScript, so the TypeScript compiler won't
      // consider it an error if we pass in something like this.
      bogus: 'WidgetJS does not recognize this as one of its props',
      label: 'Widget 1'
    });

    var widget2 = new WidgetTS({
      // 6) FIXME: THIS CAUSES A TYPESCRIPT ERROR. 'x' must be a number.
      x: '100',
      y: 200,
      w: 100,
      h: 50,
      // 7) FIXME: THIS CAUSES A TYPESCRIPT ERROR. 'bogus' isn't a valid prop.
      bogus: 'WidgetTS does not declare this as one of its props',
      label: 'Widget 2'
    });

    return new pxObject({ x: 0, y: 0 }).addChildren(widget1, widget2);
  }
}
