var EventEmitter = require('events').EventEmitter;
var callbackify = require('util').callbackify;
var inherits = require('util').inherits;
var promisify = require('util').promisify;
var MemoryStore = require('./memory-store');
var SessionStore = require('./types').SessionStore;

// no-op for compat
function expressSession(options?: any): any {}

function ExpressStore(this: any) {
  EventEmitter.call(this);
}
inherits(ExpressStore, EventEmitter);
expressSession.Store = ExpressStore;

function CallbackMemoryStore(this: MemoryStore) {
  this.store = new Map();
}
inherits(CallbackMemoryStore, ExpressStore);
CallbackMemoryStore.prototype.get = callbackify(MemoryStore.prototype.get);
CallbackMemoryStore.prototype.set = callbackify(MemoryStore.prototype.set);
CallbackMemoryStore.prototype.destroy = callbackify(
  MemoryStore.prototype.destroy
);

expressSession.MemoryStore = CallbackMemoryStore;

module.exports.expressSession = expressSession;

function promisifyStore(connectStore: any): SessionStore {
  return {
    get: promisify(connectStore.get).bind(connectStore),
    set: promisify(connectStore.set).bind(connectStore),
    destroy: promisify(connectStore.destroy).bind(connectStore),
    ...(connectStore.touch && {
      touch: promisify(connectStore.touch).bind(connectStore),
    }),
  };
}
