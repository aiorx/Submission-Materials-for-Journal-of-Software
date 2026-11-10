/// <reference types="node" />
var EventEmitter = require('events').EventEmitter;
/**
 * Asteroid DDP - add known properties to avoid TS lint errors
 */
export interface IAsteroidDDP extends EventEmitter {
    readyState: 1 | 0;
}
/**
 * Asteroid type
 * @todo Update with typing from definitely typed (when available)
 */
export interface IAsteroid extends EventEmitter {
    connect: function () { return Promise<void>; };
    disconnect: function () { return Promise<void>; };
    createUser: function (usernameOrEmail: string, password: string, profile: IUserOptions) { return Promise<any>; };
    loginWithLDAP: function (...params: any[]) { return Promise<any>; };
    loginWithFacebook: function (...params: any[]) { return Promise<any>; };
    loginWithGoogle: function (...params: any[]) { return Promise<any>; };
    loginWithTwitter: function (...params: any[]) { return Promise<any>; };
    loginWithGithub: function (...params: any[]) { return Promise<any>; };
    loginWithPassword: function (usernameOrEmail: string, password: string) { return Promise<any>; };
    logout: function () { return Promise<null>; };
    subscribe: function (name: string, ...params: any[]) { return ISubscription; };
    subscriptions: ISubscription[];
    call: function (method: string, ...params: any[]) { return IMethodResult; };
    apply: function (method: string, params: any[]) { return IMethodResult; };
    getCollection: function (name: string) { return ICollection; };
    resumeLoginPromise: Promise<string>;
    ddp: IAsteroidDDP;
}
/**
 * Asteroid user options type
 * @todo Update with typing from definitely typed (when available)
 */
export interface IUserOptions {
    username?: string;
    email?: string;
    password: string;
}
/**
 * Asteroid subscription type.
 * ID is populated when ready promise resolves.
 * @todo Update with typing from definitely typed (when available)
 */
export interface ISubscription {
    stop: function () { return void; };
    ready: Promise<IReady>;
    id?: string;
}
export interface IReady {
    state: string;
    value: string;
}
/**
 * If the method is successful, the `result` promise will be resolved with the
 * return value passed by the server. The `updated` promise will be resolved
 * with nothing once the server emits the updated message, that tells the client
 * that any side-effect that the method execution caused on the database has
 * been reflected on the client (for example, if the method caused the insertion
 * of an item into a collection, the client has been notified of said
 * insertion).
 *
 * If the method fails, the `result` promise will be rejected with the error
 * returned by the server. The `updated` promise will be rejected as well
 * (with nothing).
 */
export interface IMethodResult {
    result: Promise<any>;
    updated: Promise<any>;
}
/**
 *
 */
export interface ICollection {
    name: string;
    insert: function (item: any) { return ICollectionResult; };
    update: function (id: string, item: any) { return ICollectionResult; };
    remove: function (id: string) { return ICollectionResult; };
    reactiveQuery: function (selector: object | Function) { return IReactiveQuery; };
}
/**
 * The `local` promise is immediately resolved with the `_id` of the updated
 * item. That is, unless an error occurred. In that case, an exception will be
 * raised.
 * The `remote` promise is resolved with the `_id` of the updated item if the
 * remote update is successful. Otherwise it's rejected with the reason of the
 * failure.
 */
export interface ICollectionResult {
    local: Promise<any>;
    remote: Promise<any>;
}
/**
 * A reactive subset of a collection. Possible events are:
 * `change`: emitted whenever the result of the query changes. The id of the
 * item that changed is passed to the handler.
 */
export interface IReactiveQuery {
    on: function (event: string, handler: Function) { return void; };
    result: any[];
}
/** Credentials for Asteroid login method */
export interface ICredentials {
    password: string;
    username?: string;
    email?: string;
    ldap?: boolean;
    ldapOptions?: object;
}
