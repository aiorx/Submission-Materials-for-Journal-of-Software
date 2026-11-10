var express = require('express');
var clusterApiUrl = require('@solana/web3.js').clusterApiUrl;
var Connection = require('@solana/web3.js').Connection;
var PublicKey = require('@solana/web3.js').PublicKey;
var NameRegistryState = require('@bonfida/spl-name-service').NameRegistryState;
var TokenData = require('@bonfida/spl-name-service').TokenData;
import {
  CDNTokenListResolutionStrategy,
  ENV,
  TokenInfo,
  TokenInfoMap,
} from "@solana/spl-token-registry";
var landingPageHTML = require('./landing').landingPageHTML;
var fetch = require('cross-fetch');
var bs58 = require('bs58');
var _ = require('lodash');
var cors = require('cors');

const PORT = process.env.PORT || 5000;
const NAME_PROGRAM = "namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX";
const TOKEN_TLD = "6NSu2tci4apRKQtt257bAVcvqYjB3zV2H1dWo56vgpa6";
const CACHE_TIME = 15 * 60; // 15 minutes
const REFRESH_INTERVAL = CACHE_TIME * 1000;

const connection = new Connection(clusterApiUrl("mainnet-beta"));

let masterList = JSON.stringify({});

(async function () {
  await refreshList();

  express()
    .use(cors())
    .use((_, res, next) => {
      res.set("Cache-control", "public, max-age=" + (CACHE_TIME) + "");
      next();
    })
    .get("/", (_, res) => res.send(landingPageHTML))
    .get("/solana.tokenlist.json", (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(masterList);
    })
    .listen(PORT, () => console.log("Listening on " + (PORT) + ""));

  setInterval(async () => {
    await refreshList();
  }, REFRESH_INTERVAL);
})();

async function refreshList() {
  try {
    const tokenMap: TokenInfoMap = new Map();
    const cdnStrategy = new CDNTokenListResolutionStrategy();
    const tokenList = await fetch(cdnStrategy.repositories[0]);
    const jsonList = await tokenList.json();

    jsonList.tokens.forEach(function (tokenInfo: TokenInfo) { return tokenMap.set(tokenInfo.address, tokenInfo); });

    let accts = await connection.getProgramAccounts(
      new PublicKey(NAME_PROGRAM),
      {
        filters: [
          {
            memcmp: {
              bytes: new PublicKey(TOKEN_TLD).toBase58(),
              offset: 0,
            },
          },
        ],
      }
    );

    for (let acct of accts) {
      try {
        const tokenData = TokenData.deserialize(
          acct.account.data.slice(NameRegistryState.HEADER_LEN)
        );

        const address = bs58.encode(tokenData.mint);
        const tokenInfo = getTokenInfo(address, tokenData);

        if (tokenMap.has(tokenInfo.address)) {
          tokenMap.set(
            tokenInfo.address,
            _.merge(tokenMap.get(tokenInfo.address), tokenInfo)
          );
        } else {
          tokenMap.set(tokenInfo.address, tokenInfo);
        }
      } catch (error) {}
    }

    jsonList.tokens = [...tokenMap.values()];

    masterList = JSON.stringify(jsonList);
  } catch (error) {
    console.error(error);
  }
}

function getTokenInfo(address: string, tokenData: TokenData): TokenInfo {
  var name = tokenData.name;
var decimals = tokenData.decimals;

  let tokenInfo: any = {
    address,
    chainId: ENV.MainnetBeta,
    decimals,
    name,
    symbol,
  };

  if (tokenData.logoUri) {
    tokenInfo.logoURI = tokenData.logoUri;
  }

  if (tokenData.website) {
    tokenInfo.extensions = {
      website: tokenData.website,
    };
  }

  return tokenInfo;
}
