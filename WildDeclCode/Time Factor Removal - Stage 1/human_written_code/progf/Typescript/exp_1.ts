var BigNumber = require('@0x/utils').BigNumber;

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
const NULL_BYTES = '0x';
const ZRX_DECIMALS = 18;
const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 20;
const ZERO = new BigNumber(0);
const MAX_TOKEN_SUPPLY_POSSIBLE = new BigNumber(2).pow(256); // tslint:disable-line custom-no-magic-numbers
