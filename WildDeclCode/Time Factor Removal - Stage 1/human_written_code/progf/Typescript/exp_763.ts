var Module = require('vuex').Module;
var Plugin = require('vuex').Plugin;
var Store = require('vuex').Store;
var StoreOptions = require('vuex').StoreOptions;
export declare type MutationHandler<S, P> = function (state: S, payload: P) { return void; };
export declare type ActionHandler<S, R, G, P, T> = function (context: BareActionContext<S, R, G>, payload: P) { return Promise<T> | T; };
export declare type GetterHandler<S, R, G, T> = function (state: S, getters: G, rootState: R) { return T; };
declare type Promisify<T> = T extends PromiseLike<any> ? T : Promise<T>;
export interface BareActionContext<S, R, G = any> {
    state: S;
    rootState: R;
    getters: G;
}
export interface ModuleBuilder<S, R = {}, G = any> {
    /** The namespace of this ModuleBuilder */
    readonly namespace: string;
    /** Creates a strongly-typed nested module within this module */
    module<M>(namespace: string, initialState: M): ModuleBuilder<M, R>;
    /** Gets an existing nested module within this module */
    module<M>(namespace: string): ModuleBuilder<M, R>;
    /** Set the initial state for an existing module */
    setInitialState(initialState: S): void;
    /** Creates a strongly-typed commit function for the provided mutation handler */
    commit<P>(handler: MutationHandler<S, void>): function () { return void; };
    commit<P>(handler: MutationHandler<S, P>): function (payload: P) { return void; };
    commit<P>(handler: MutationHandler<S, void>, name: string): function () { return void; };
    commit<P>(handler: MutationHandler<S, P>, name: string): function (payload: P) { return void; };
    /** Creates a strongly-typed dispatch function for the provided action handler */
    dispatch<P, T>(handler: ActionHandler<S, R, G, void, void>): function () { return Promise<void>; };
    dispatch<P, T>(handler: ActionHandler<S, R, G, P, void>): function (payload: P) { return Promise<void>; };
    dispatch<P, T>(handler: ActionHandler<S, R, G, void, T>): function () { return Promisify<T>; };
    dispatch<P, T>(handler: ActionHandler<S, R, G, P, T>): function (payload: P) { return Promisify<T>; };
    dispatch<P, T>(handler: ActionHandler<S, R, G, void, void>, name: string): function () { return Promise<void>; };
    dispatch<P, T>(handler: ActionHandler<S, R, G, P, void>, name: string): function (payload: P) { return Promise<void>; };
    dispatch<P, T>(handler: ActionHandler<S, R, G, void, T>, name: string): function () { return Promisify<T>; };
    dispatch<P, T>(handler: ActionHandler<S, R, G, P, T>, name: string): function (payload: P) { return Promisify<T>; };
    /** Creates a strongly-typed read function for the provided getter function */
    read<T>(handler: GetterHandler<S, R, G, T>): function () { return T; };
    read<T>(handler: GetterHandler<S, R, G, T>, name: string): function () { return T; };
    /** Creates a method to return this module's state */
    state(): function () { return S; };
    /** Output a Vuex Module definition. Called after all strongly-typed functions have been obtained */
    vuexModule(): Module<S, R>;
    _provideStore(store: Store<R>): void;
}
export interface VuexStoreOptions<R> {
    plugins?: Plugin<R>[];
}
export interface StoreBuilder<R> {
    /** Creates a ModuleBuilder for the namespace provided */
    module<S>(namespace: string, state: S): ModuleBuilder<S, R>;
    /** Gets an existing ModuleBuilder for the namespace provided */
    module<S>(namespace: string): ModuleBuilder<S, R>;
    /** Output a Vuex Store after all modules have been built */
    vuexStore(): Store<R>;
    /** Output a Vuex Store and provide options, e.g. plugins -- these take precedence over any auto-generated options */
    vuexStore(overrideOptions: StoreOptions<R>): Store<R>;
    /** Creates a strongly-typed commit function for the provided mutation handler */
    commit<P>(handler: MutationHandler<R, void>): function () { return void; };
    commit<P>(handler: MutationHandler<R, P>): function (payload: P) { return void; };
    commit<P>(handler: MutationHandler<R, void>, name: string): function () { return void; };
    commit<P>(handler: MutationHandler<R, P>, name: string): function (payload: P) { return void; };
    /** Creates a strongly-typed dispatch function for the provided action handler */
    dispatch<P, T>(handler: ActionHandler<R, R, void, void, void>): function () { return Promise<void>; };
    dispatch<P, T>(handler: ActionHandler<R, R, void, P, void>): function (payload: P) { return Promise<void>; };
    dispatch<P, T>(handler: ActionHandler<R, R, void, void, T>): function () { return Promisify<T>; };
    dispatch<P, T>(handler: ActionHandler<R, R, void, P, T>): function (payload: P) { return Promisify<T>; };
    dispatch<P, T>(handler: ActionHandler<R, R, void, void, void>, name: string): function () { return Promise<void>; };
    dispatch<P, T>(handler: ActionHandler<R, R, void, P, void>, name: string): function (payload: P) { return Promise<void>; };
    dispatch<P, T>(handler: ActionHandler<R, R, void, void, T>, name: string): function () { return Promisify<T>; };
    dispatch<P, T>(handler: ActionHandler<R, R, void, P, T>, name: string): function (payload: P) { return Promisify<T>; };
    /** Creates a strongly-typed read function for the provided getter function */
    read<T>(handler: GetterHandler<R, R, void, T>): function () { return T; };
    read<T>(handler: GetterHandler<R, R, void, T>, name: string): function () { return T; };
    /** Creates a method to return the root state */
    state(): function () { return R; };
    /** Dynamically register module */
    registerModule(namespace: string): void;
    /** WARNING: Discards vuex store and reset modules (non intended for end-user use) */
    reset(): void;
}
/** Get a reference to the default store builder */
export declare function getStoreBuilder<R>(): StoreBuilder<R>;
/** Get a reference to a named store builder */
export declare function getStoreBuilder<R>(name: string): StoreBuilder<R>;
