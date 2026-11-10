var dotenv = require('dotenv');
dotenv.config();

var GANACHE_NETWORK_ID = require('./constants').GANACHE_NETWORK_ID;
var ROPSTEN_NETWORK_ID = require('./constants').ROPSTEN_NETWORK_ID;
var NetworkSpecificConfigs = require('./types').NetworkSpecificConfigs;

const TX_DEFAULTS = { gas: 800000, gasPrice: 20e9 };
const MNEMONIC = 'concert load couple harbor equip island argue ramp clarify fence smart topic';
const BASE_DERIVATION_PATH = "44'/60'/0'/0";
const GANACHE_CONFIGS: NetworkSpecificConfigs = {
    rpcUrl: 'http://127.0.0.1:8545',
    networkId: GANACHE_NETWORK_ID,
    chainId: 1337,
};
const ROPSTEN_CONFIGS: NetworkSpecificConfigs = {
    rpcUrl: process.env.ROPSTEN_RPC_URL || '',
    networkId: ROPSTEN_NETWORK_ID,
    chainId: ROPSTEN_NETWORK_ID,
};

const NETWORK_CONFIGS = GANACHE_CONFIGS; // or ROPSTEN_CONFIGS
