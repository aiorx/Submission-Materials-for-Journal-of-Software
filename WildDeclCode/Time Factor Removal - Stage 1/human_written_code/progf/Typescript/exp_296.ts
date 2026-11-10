// tslint:disable:custom-no-magic-numbers
var assert = require('@0x/assert').assert;
var BigNumber = require('@0x/utils').BigNumber;
var crypto = require('crypto');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');

var NULL_BYTES = require('./constants').NULL_BYTES;

var metadataPath = path.join(__dirname, '../../metadata.json');
enum EnvVarType {
    Port,
    ChainId,
    FeeRecipient,
    UnitAmount,
    Url,
    WhitelistAllTokens,
    Boolean,
    FeeAssetData,
}
// Whitelisted token addresses. Set to a '*' instead of an array to allow all tokens.
var WHITELISTED_TOKENS: string[] | '*' = _.isEmpty(process.env.WHITELIST_ALL_TOKENS)
    ? [
          '0x2002d3812f58e35f0ea1ffbf80a75a38c32175fa', // ZRX on Kovan
          '0xd0a1e359811322d97991e03f863a0c30c2cf029c', // WETH on Kovan
      ]
    : assertEnvVarType('WHITELIST_ALL_TOKENS', process.env.WHITELIST_ALL_TOKENS, EnvVarType.WhitelistAllTokens);

// Network port to listen on
var HTTP_PORT = _.isEmpty(process.env.HTTP_PORT)
    ? 3000
    : assertEnvVarType('HTTP_PORT', process.env.HTTP_PORT, EnvVarType.Port);
// Default chain id to use when not specified
var CHAIN_ID = _.isEmpty(process.env.CHAIN_ID)
    ? 42
    : assertEnvVarType('CHAIN_ID', process.env.CHAIN_ID, EnvVarType.ChainId);

// Mesh Endpoint
var MESH_ENDPOINT = _.isEmpty(process.env.MESH_ENDPOINT)
    ? 'ws://localhost:60557'
    : assertEnvVarType('MESH_ENDPOINT', process.env.MESH_ENDPOINT, EnvVarType.Url);
// The fee recipient for orders
var FEE_RECIPIENT = _.isEmpty(process.env.FEE_RECIPIENT)
    ? getDefaultFeeRecipient()
    : assertEnvVarType('FEE_RECIPIENT', process.env.FEE_RECIPIENT, EnvVarType.FeeRecipient);
// A flat fee that should be charged to the order maker
var MAKER_FEE_UNIT_AMOUNT = _.isEmpty(process.env.MAKER_FEE_UNIT_AMOUNT)
    ? new BigNumber(0)
    : assertEnvVarType('MAKER_FEE_UNIT_AMOUNT', process.env.MAKER_FEE_UNIT_AMOUNT, EnvVarType.UnitAmount);
// A flat fee that should be charged to the order taker
var TAKER_FEE_UNIT_AMOUNT = _.isEmpty(process.env.TAKER_FEE_UNIT_AMOUNT)
    ? new BigNumber(0)
    : assertEnvVarType('TAKER_FEE_UNIT_AMOUNT', process.env.TAKER_FEE_UNIT_AMOUNT, EnvVarType.UnitAmount);
// The maker fee token encoded as asset data
var MAKER_FEE_ASSET_DATA = _.isEmpty(process.env.MAKER_FEE_ASSET_DATA)
    ? NULL_BYTES
    : assertEnvVarType('MAKER_FEE_ASSET_DATA', process.env.MAKER_FEE_ASSET_DATA, EnvVarType.FeeAssetData);
// The taker fee token encoded as asset data
var TAKER_FEE_ASSET_DATA = _.isEmpty(process.env.TAKER_FEE_ASSET_DATA)
    ? NULL_BYTES
    : assertEnvVarType('TAKER_FEE_ASSET_DATA', process.env.TAKER_FEE_ASSET_DATA, EnvVarType.FeeAssetData);

// Max number of entities per page
var MAX_PER_PAGE = 1000;
// Default ERC20 token precision
var DEFAULT_ERC20_TOKEN_PRECISION = 18;
// Address used when simulating transfers from the maker as part of 0x order validation
var DEFAULT_TAKER_SIMULATION_ADDRESS = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

function assertEnvVarType(name: string, value: any, expectedType: EnvVarType): any {
    var returnValue;
    switch (expectedType) {
        case EnvVarType.Port:
            try {
                returnValue = parseInt(value, 10);
                var isWithinRange = returnValue >= 0 && returnValue <= 65535;
                if (!isWithinRange) {
                    throw new Error();
                }
            } catch (err) {
                throw new Error("" + (name) + " must be between 0 to 65535, found " + (value) + ".");
            }
            return returnValue;
        case EnvVarType.ChainId:
            try {
                returnValue = parseInt(value, 10);
            } catch (err) {
                throw new Error("" + (name) + " must be a valid integer, found " + (value) + ".");
            }
            return returnValue;
        case EnvVarType.FeeRecipient:
            assert.isETHAddressHex(name, value);
            return value;
        case EnvVarType.Url:
            assert.isUri(name, value);
            return value;
        case EnvVarType.Boolean:
            return value === 'true';
        case EnvVarType.UnitAmount:
            try {
                returnValue = new BigNumber(parseFloat(value));
                if (returnValue.isNegative()) {
                    throw new Error();
                }
            } catch (err) {
                throw new Error("" + (name) + " must be valid number greater than 0.");
            }
            return returnValue;
        case EnvVarType.WhitelistAllTokens:
            return '*';
        case EnvVarType.FeeAssetData:
            assert.isString(name, value);
            return value;
        default:
            throw new Error("Unrecognised EnvVarType: " + (expectedType) + " encountered for variable " + (name) + ".");
    }
}
function getDefaultFeeRecipient(): string {
    var metadata = JSON.parse(fs.readFileSync(metadataPath).toString());
    var existingDefault: string = metadata.DEFAULT_FEE_RECIPIENT;
    var newDefault: string = existingDefault || "0xabcabc" + (crypto.randomBytes(17).toString('hex')) + "";
    if (_.isEmpty(existingDefault)) {
        var metadataCopy = JSON.parse(JSON.stringify(metadata));
        metadataCopy.DEFAULT_FEE_RECIPIENT = newDefault;
        fs.writeFileSync(metadataPath, JSON.stringify(metadataCopy));
    }
    return newDefault;
}
