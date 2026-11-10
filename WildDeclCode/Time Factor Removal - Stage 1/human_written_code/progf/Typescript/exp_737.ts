var Store = require('vuex').Store;
export interface VuexModuleOptions {
    namespaced?: string;
    target?: "nuxt";
    enableLocalWatchers?: boolean | string;
    strict?: boolean;
}
export interface VuexModuleAddons {
    $store: Store<any>;
}
export interface VuexModule extends VuexModuleAddons {
}
export declare class VuexModule {
    static With(options?: VuexModuleOptions): typeof VuexModule;
}
export declare type VuexModuleConstructor = typeof VuexModule & VuexModuleInternals;
export interface VuexModuleInternals {
    prototype: VuexModuleInternalsPrototype;
}
export interface VuexModuleInternalsPrototype {
    __options__: VuexModuleOptions | undefined;
    __namespacedPath__: string;
    __vuex_module_cache__: undefined | {
        [path: string]: VuexObject;
    };
    __vuex_proxy_cache__: {} | undefined;
    __vuex_local_proxy_cache__: {} | undefined;
    __submodules_cache__: Map;
    __context_store__: Map | undefined;
    __mutations_cache__: {
        __explicit_mutations__: {};
        __setter_mutations__: {};
    } | undefined;
    __explicit_getter_names__: string[];
    __decorator_getter_names__: string[] | undefined;
    __explicit_mutations_names__: string[];
    __actions__: {
        __name__: string;
        __type__: ActionType;
    }[] | undefined;
    __watch__: Map;
    __store_cache__: any;
}
export interface SubModuleType<T> {
    __submodule_type__: "submodule";
    __submodule_class__: T;
}
export declare type DictionaryField = string | number | symbol;
export interface VuexObject {
    namespaced: boolean | undefined;
    state: Map | Function;
    mutations: Map;
    getters: Map;
    actions: Map;
    modules: Record<DictionaryField, VuexObject>;
}
export declare type Map = Record<DictionaryField, any>;
export interface FieldPayload {
    field: string;
    payload: any;
}
export declare type MutationDescriptor = TypedPropertyDescriptor<function (payload?: any) { return void>; };
export declare type ActionType = "raw" | "mutate";
export declare type ActionOption = {
    mode?: ActionType;
};
export declare type ActionDescriptor = TypedPropertyDescriptor<function (payload?: any) { return Promise<any>>; };
export interface ProxyWatchers {
    $watch(getterField: string, callback: (function (newVal: string, oldVal: string) { return void; }) | object, options?: {
        deep: boolean;
        immediate: boolean;
    }): function () { return void; };
    $subscribe(mutationfield: string, callback: function (payload: any) { return void; }): function () { return void; };
    $subscribeAction(actionField: string, callbackOrObj: SubScribeActionCallback | SubScribeActionObject): function () { return void; };
}
declare type SubScribeActionCallback = function (payload: any) { return void; };
declare type SubScribeActionObject = {
    before: function (payload: any) { return void; };
    after: function (payload: any) { return void; };
};
