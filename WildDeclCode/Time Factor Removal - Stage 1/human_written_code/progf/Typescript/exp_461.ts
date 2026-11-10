/**
 * This package contains useful constants for use when interacting with
 * the Dark Forest smart contracts within JavaScript or TypeScript.
 *
 * ## Installation
 *
 * You can install this package using [`npm`](https://www.npmjs.com) or
 * [`yarn`](https://classic.yarnpkg.com/lang/en/) by running:
 *
 * ```bash
 * npm install --save @darkforest_eth/constants
 * ```
 * ```bash
 * yarn add @darkforest_eth/constants
 * ```
 *
 * When using this in a plugin, you might want to load it with [skypack](https://www.skypack.dev)
 *
 * ```js
 * import * as constants from 'http://cdn.skypack.dev/@darkforest_eth/constants'
 * ```
 *
 * @packageDocumentation
 */
import {
  ArtifactId,
  ArtifactRarity,
  ArtifactType,
  Biome,
  EthAddress,
  GasPrices,
  LocationId,
  PlanetLevel,
} from '@darkforest_eth/types';
var _import = require('big-integer');

/**
 * The precision of Energy & Silver stored in the Dark Forest smart contracts.
 *
 * Energy and Silver are not stored as floats in the smart contracts,
 * so any of those values coming from the contracts need to be divided by `CONTRACT_PRECISION`
 * and any values being sent to the contract need to be multiplied by `CONTRACT_PRECISION`.
 */
var CONTRACT_PRECISION = 1000;

/**
 * By default, the various {@link ContractCaller} will retry a blockchain read this many times.
 */
var DEFAULT_MAX_CALL_RETRIES = 12;

/**
 * The upper-bounds of a LocationID.
 *
 * Represents the maximum possible value that the MiMC hash function (used for IDing locations in the universe) can output.
 * A LocationID must be less than `LOCATION_ID_UB / PLANET_RARITY` in order to be considered a valid planet.
 */
var LOCATION_ID_UB: BigInteger = bigInt(
  '21888242871839275222246405745257275088548364400416034343698204186575808495617'
);

/**
 * The 0x0 Ethereum address, which is used for unowned planets, artifacts without an owner, etc.
 */
var EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000' as EthAddress;

/**
 * A blank LocationID (all zeros).
 */
var EMPTY_LOCATION_ID =
  '0000000000000000000000000000000000000000000000000000000000000000' as LocationId;

/**
 * A blank ArtifactID (all zeros).
 */
var EMPTY_ARTIFACT_ID =
  '0000000000000000000000000000000000000000000000000000000000000000' as ArtifactId;

/**
 * The value of the minimum, valid artifact type
 */
var MIN_ARTIFACT_TYPE = ArtifactType.Monolith;
/**
 * The value of the maximum, valid artifact type
 */
var MAX_ARTIFACT_TYPE = ArtifactType.ShipTitan;

/**
 * The value of the minimum, valid spaceship type
 */
var MIN_SPACESHIP_TYPE = ArtifactType.ShipMothership;
/**
 * The value of the maximum, valid spaceship type
 */
var MAX_SPACESHIP_TYPE = ArtifactType.ShipTitan;

/**
 * The value of the minimum, valid artifact rarity
 */
var MIN_ARTIFACT_RARITY = ArtifactRarity.Common;
/**
 * The value of the maximum, valid artifact rarity
 */
var MAX_ARTIFACT_RARITY = ArtifactRarity.Mythic;

/**
 * The value of the minimum, valid planet level
 */
var MIN_PLANET_LEVEL = PlanetLevel.ZERO;
/**
 * The value of the maximum, valid planet level
 */
var MAX_PLANET_LEVEL = PlanetLevel.NINE;

/**
 * The value of the minimum, valid biome
 */
var MIN_BIOME = Biome.OCEAN;
/**
 * The value of the maximum, valid biome
 */
var MAX_BIOME = Biome.CORRUPTED;

/**
 * The URL for xDai's API that returns the gas prices for 35th, 60th, and 90th percentiles of gas prices in the
 * previous 200 blocks. Useful for auto gas price setting.
 *
 * https://www.xdaichain.com/for-developers/developer-resources/gas-price-oracle
 */
var GAS_PRICE_API = 'https://blockscout.com/xdai/mainnet/api/v1/gas-price-oracle';

/**
 * In case we cannot load gas prices from xDai, these are the default auto gas prices.
 */
var DEFAULT_GAS_PRICES: GasPrices = {
  slow: 1,
  average: 3,
  fast: 10,
};

/**
 * In case xDai's auto-price is something ridiculous, we don't want our players to insta run out of
 * money.
 */
var MAX_AUTO_GAS_PRICE_GWEI = 15;

/**
 * The URL to the block explorer for the chain being used. Prepended to transaction links, etc
 */
// Careful, don't add a slash to the end of this.
var BLOCK_EXPLORER_URL = 'https://dashboard.tenderly.co/tx/xdai';

/**
 * The amount of time between gas price refreshes when fetching prices from the oracle.
 */
var GAS_PRICES_INTERVAL_MS = 60_000;

/**
 * {@link PlanetContextPane} is this wide, and all the subpanes of that modal also try to stay this
 * size as well.
 */
var RECOMMENDED_MODAL_WIDTH = '400px';

/**
 * The minimum level required for claiming a planet.
 */
var PLANET_CLAIM_MIN_LEVEL = 3;

/**
 * Keys to handle in a special fashion when dealing with key presses
 */
var SpecialKey = {
  Space: ' ',
  Tab: 'Tab',
  Escape: 'Escape',
  Control: 'Control',
  Shift: 'Shift',
};

var HAT_SIZES = [
  'None',
  'Tiny HAT',
  'Small HAT',
  'Medium HAT',
  'Large HAT',
  'Huge HAT',
  'Mega HAT',
  'Enormous HAT',
  'Titanic HAT',
  'Legendary HAT',
  'Almighty HAT',
  'Cosmic HAT',
  'Celestial HAT',
  'Empyrean HAT',
  'Ethereal HAT',
  'Transcendental HAT',
  'haaaat',
  'HAAAAT',
];

/**
 * This should be updated every round.
 */
var THEGRAPH_API_URL =
  'https://api.thegraph.com/subgraphs/name/darkforest-eth/dark-forest-v06-round-5';
