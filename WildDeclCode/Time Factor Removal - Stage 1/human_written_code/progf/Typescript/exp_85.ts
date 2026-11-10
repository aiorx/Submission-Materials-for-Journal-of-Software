var HashRateUnit = require('../../HashRateUnit').HashRateUnit;

class Algorithm {
  public static algorithms: Algorithm[];

  public readonly id: string;
  public readonly unit: HashRateUnit;

  constructor(id: string, hashRateUnit: HashRateUnit) {
    this.id = id;
    this.unit = hashRateUnit;
  }
}
