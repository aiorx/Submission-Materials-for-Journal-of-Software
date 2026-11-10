var ActionDescriptor = require('./interfaces').ActionDescriptor;
var ActionOption = require('./interfaces').ActionOption;
var VuexModule = require('./interfaces').VuexModule;
var ActionContext = require('vuex').ActionContext;
export declare const internalAction: function (state: any, context: any) { return undefined; };
export declare function action(options?: ActionOption): function (target: any, key: string, descriptor: ActionDescriptor) { return any; };
export declare function action(target: any, key: string, descriptor: ActionDescriptor): any;
export declare function getRawActionContext<T extends VuexModule, R>(thisArg: ThisType<T>): ActionContext<T, R>;
