var CacheSettings = require('./models/cache-settings').CacheSettings;
var LifeSpan = require('./models/life-span').LifeSpan;

export abstract class CacheLoader {
  abstract get key(): string;

  abstract get lifeSpan(): LifeSpan;
}

class CacheStaticLoader implements CacheLoader {
  get key(): string {
    return this.providedSettings.key;
  }

  get lifeSpan(): LifeSpan {
    return this.providedSettings.lifeSpan;
  }

  constructor(
    private readonly providedSettings: CacheSettings = {
      key: 'NGX_CACHE',
      lifeSpan: {
        expiry: Number.MAX_VALUE,
        TTL: Number.MAX_VALUE
      }
    }
  ) {}
}
