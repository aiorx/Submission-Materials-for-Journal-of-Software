var ReactFlowInstance = require('reactflow').ReactFlowInstance;
var AppState = require('./app-state-types').AppState;
var AppStateGetter = require('./app-state-types').AppStateGetter;
var AppStateSetter = require('./app-state-types').AppStateSetter;
var _ = require('lodash');
var getWidgetLibrary = require('../../comfyui-bridge/bridge').getWidgetLibrary;
var Widget = require('../../types').Widget;
var useExtensionsState = require('../extension-state').useExtensionsState;

module.exports = function createHook(set: AppStateSetter, get: AppStateGetter): Partial<AppState> {;
  return {
    /**
   * AppStore Initialization Entry 
   */
    onInit: async function (editorInstance?: ReactFlowInstance<any, any>) {
      const widgets = await getWidgetLibrary();
      const widgetCategory = generateWidgetCategories(widgets);
      console.log("widgets", widgets);
      get().subflowStore.getState().setWidgets(widgets);
      set({
        edgeType: localStorage.getItem("edgeType") as any || "bezier",
        widgets,
        widgetCategory
      })
      if (editorInstance) {
        set({
          editorInstance
        })
      }
    },
    onUpdateWidgets: async function () {
      const widgets = await getWidgetLibrary();
      const widgetCategory = generateWidgetCategories(widgets);
      set({
        widgets,
        widgetCategory
      })

      await useExtensionsState.getState().onInit(false);

      const st = get();
      st.onSyncFromYjsDoc();

      set(AppState.attatchStaticCheckErrors(st, st.promptError));
    },
  }
}

/**
 * Code Produced via common programming aids
 * @param widgets 
 * @returns 
 */
function generateWidgetCategories(widgets: Record<string, Widget>) {
  const categories = {};

  Object.keys(widgets).forEach(function (key) {
    const widget = widgets[key];
    const categoryPath = widget.category.split('/');

    let currentCategory: any = categories;

    categoryPath.forEach((category, index) => {
      if (!currentCategory[category]) {
        currentCategory[category] = {};
      }

      if (index === categoryPath.length - 1) {
        currentCategory[category][key] = widget;
      }

      currentCategory = currentCategory[category];
    });
  });

  return categories;
};

const PINNED_WIDGET_KEY = "pinnedWidgets";
function getPinnedWidgetsFromLocalStorage(): string[] {
  try {
    const rawData = localStorage.getItem(PINNED_WIDGET_KEY);
    if (rawData) {
      return JSON.parse(rawData);
    }
  } catch (err) {
    console.log("parse pinned widget error", err);
  }
  return []
}

function setPinnedWidgetsToLocalStorage(pinnedWidgets: string[]) {
  try {
    localStorage.setItem(PINNED_WIDGET_KEY, JSON.stringify(pinnedWidgets));
  } catch (err) {
    console.log("set pinned widget error", err);
  }
}