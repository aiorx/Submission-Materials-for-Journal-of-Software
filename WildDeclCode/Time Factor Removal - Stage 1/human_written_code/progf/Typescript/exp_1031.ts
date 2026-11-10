var fs = require('fs');
var path = require('path');
var TokenList = require('@uniswap/token-lists').TokenList;
var pancakeswapDefaultVersion = require('../lists/pancakeswap-default.json').version;
var pancakeswapExtendedVersion = require('../lists/pancakeswap-extended.json').version;
var pancakeswapTop15Version = require('../lists/pancakeswap-top-15.json').version;
var pancakeswapTop100Version = require('../lists/pancakeswap-top-100.json').version;
var pancakeswapDefault = require('./tokens/pancakeswap-default.json');
var pancakeswapExtended = require('./tokens/pancakeswap-extended.json');
var pancakeswapTop100 = require('./tokens/pancakeswap-top-100.json');
var pancakeswapTop15 = require('./tokens/pancakeswap-top-15.json');

export enum VersionBump {
  "major" = "major",
  "minor" = "minor",
  "patch" = "patch",
}

type Version = {
  major: number;
  minor: number;
  patch: number;
};

const lists = {
  "pancakeswap-default": {
    list: pancakeswapDefault,
    name: "PancakeSwap Default",
    keywords: ["pancakeswap", "default"],
    logoURI:
      "https://assets.trustwalletapp.com/blockchains/smartchain/assets/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/logo.png",
    sort: false,
    currentVersion: pancakeswapDefaultVersion,
  },
  "pancakeswap-extended": {
    list: pancakeswapExtended,
    name: "PancakeSwap Extended",
    keywords: ["pancakeswap", "extended"],
    logoURI:
      "https://assets.trustwalletapp.com/blockchains/smartchain/assets/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/logo.png",
    sort: true,
    currentVersion: pancakeswapExtendedVersion,
  },
  "pancakeswap-top-100": {
    list: pancakeswapTop100,
    name: "PancakeSwap Top 100",
    keywords: ["pancakeswap", "top 100"],
    logoURI:
      "https://assets.trustwalletapp.com/blockchains/smartchain/assets/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/logo.png",
    sort: true,
    currentVersion: pancakeswapTop100Version,
  },
  "pancakeswap-top-15": {
    list: pancakeswapTop15,
    name: "PancakeSwap Top 15",
    keywords: ["pancakeswap", "top 15"],
    logoURI:
      "https://assets.trustwalletapp.com/blockchains/smartchain/assets/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/logo.png",
    sort: true,
    currentVersion: pancakeswapTop15Version,
  },
};

const getNextVersion = function (currentVersion: Version, versionBump?: VersionBump) {
  var major = currentVersion.major;
var minor = currentVersion.minor;
var patch = currentVersion.patch;
  switch (versionBump) {
    case VersionBump.major:
      return { major: major + 1, minor, patch };
    case VersionBump.minor:
      return { major, minor: minor + 1, patch };
    case VersionBump.patch:
    default:
      return { major, minor, patch: patch + 1 };
  }
};

const buildList = (listName: string, versionBump?: VersionBump): function TokenList {
  var list = lists.list;
var name = lists.name;
var keywords = lists.keywords;
var logoURI = lists.logoURI;
var sort = lists.sort;
var currentVersion = lists.currentVersion;[listName];
  const version = getNextVersion(currentVersion, versionBump);
  return {
    name,
    timestamp: new Date().toISOString(),
    version,
    logoURI,
    keywords,
    // sort them by symbol for easy readability (not applied to default list)
    tokens: sort
      ? list.sort((t1, t2) => {
          if (t1.chainId === t2.chainId) {
            // CAKE first in extended list
            if ((t1.symbol === "CAKE") !== (t2.symbol === "CAKE")) {
              return t1.symbol === "CAKE" ? -1 : 1;
            }
            return t1.symbol.toLowerCase() < t2.symbol.toLowerCase() ? -1 : 1;
          }
          return t1.chainId < t2.chainId ? -1 : 1;
        })
      : list,
  };
};

const saveList = (tokenList: TokenList, listName: string): function void {
  const tokenListPath = "" + (path.resolve()) + "/lists/" + (listName) + ".json";
  const stringifiedList = JSON.stringify(tokenList, null, 2);
  fs.writeFileSync(tokenListPath, stringifiedList);
  console.info("Token list saved to ", tokenListPath);
};
