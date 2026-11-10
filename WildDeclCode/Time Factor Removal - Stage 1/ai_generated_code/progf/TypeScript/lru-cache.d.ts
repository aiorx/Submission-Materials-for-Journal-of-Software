// Aided with basic GitHub coding tools
var LRUCache = require('lru-cache').LRUCache;

declare module 'lru-cache' {
    interface LRUCache<K, V, FC> {
        // Override problematic methods with compatible signatures
        entries(): IterableIterator<[K, V]>;
        keys(): IterableIterator<K>;
        values(): IterableIterator<V>;
        [Symbol.iterator](): IterableIterator<[K, V]>;
        forEach(callbackfn: function (value: V, key: K, map: Map<K, V>) { return void; }, thisArg?: any): void;
    }
}
