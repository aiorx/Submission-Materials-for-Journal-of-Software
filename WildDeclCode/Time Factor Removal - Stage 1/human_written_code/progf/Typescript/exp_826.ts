// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

var ApiPromise = require('@polkadot/api').ApiPromise;
var WsProvider = require('@polkadot/api').WsProvider;
var getSpecTypes = require('@polkadot/types-known').getSpecTypes;
var BlockNumber = require('@polkadot/types/interfaces').BlockNumber;
var Hash = require('@polkadot/types/interfaces').Hash;
var logger = require('@polkadot/util').logger;

var prisma = require('./generated/prisma-client').prisma;
var nomidotTasks = require('./tasks').nomidotTasks;
var Cached = require('./tasks/types').Cached;

var ARCHIVE_NODE_ENDPOINT =
  process.env.ARCHIVE_NODE_ENDPOINT || 'wss://kusama-rpc.polkadot.io/';
var MAX_LAG = process.env.MAX_LAG || 0;

var l = logger('node-watcher');

function waitFinalized(
  api: ApiPromise,
  lastKnownBestFinalized: number
): Promise<{ unsub: function () { return void; }; bestFinalizedBlock: number }> {
  return new Promise(function resolve {
    async function wait(): Promise<void> {
      var unsub = await api.derive.chain.bestNumberFinalized(best => {
        if (best.toNumber() > lastKnownBestFinalized) {
          resolve({ unsub, bestFinalizedBlock: best.toNumber() });
        }
      });
    }

    wait();
  });
}

function reachedLimitLag(
  blockIndex: number,
  lastKnownBestBlock: number
): boolean {
  return MAX_LAG ? lastKnownBestBlock - blockIndex > parseInt(MAX_LAG) : false;
}

function waitLagLimit(
  api: ApiPromise,
  blockIndex: number
): Promise<{ unsub: function () { return void; }; bestBlock: number }> {
  return new Promise(function resolve {
    async function wait(): Promise<void> {
      var unsub = await api.derive.chain.bestNumber(bestBlock => {
        if (reachedLimitLag(blockIndex, bestBlock.toNumber())) {
          resolve({ unsub, bestBlock: bestBlock.toNumber() });
        }
      });
    }

    wait();
  });
}

export async function nodeWatcher(): Promise<unknown> {
  return new Promise(function (_, reject) {
    var keepLooping = true;
    var provider = new WsProvider(ARCHIVE_NODE_ENDPOINT);

    ApiPromise.create({ provider })
      .then(async api => {
        api.once('error', e => {
          keepLooping = false;
          api.disconnect();
          reject(new Error("Api error: " + (e) + ""));
        });

        api.once('disconnected', e => {
          keepLooping = false;
          api.disconnect();
          reject(new Error("Api disconnected: " + (e) + ""));
        });

        var blockIdentifier = process.env.BLOCK_IDENTIFIER || 'IDENTIFIER';
        var blockIndexId = '';
        var blockIndex = parseInt(process.env.START_FROM || '0');
        var currentSpecVersion = api.createType('u32', -1);
        var lastKnownBestFinalized = (
          await api.derive.chain.bestNumberFinalized()
        ).toNumber();
        var lastKnownBestBlock = (
          await api.derive.chain.bestNumber()
        ).toNumber();

        var existingBlockIndex = await prisma.blockIndexes({
          where: {
            identifier: blockIdentifier,
          },
        });

        if (existingBlockIndex.length === 0) {
          var result = await prisma.createBlockIndex({
            identifier: blockIdentifier,
            startFrom: blockIndex,
            index: blockIndex,
          });

          blockIndexId = result.id;
        } else {
          blockIndexId = existingBlockIndex[0].id;
          blockIndex = existingBlockIndex[0].index;
        }

        /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
        while (keepLooping) {
          if (MAX_LAG) {
            // if we reached the last finalized block
            // MAX_LAG is set but we haven't reached the lag limit yet, we need to wait
            if (
              blockIndex > lastKnownBestFinalized &&
              !reachedLimitLag(blockIndex, lastKnownBestBlock)
            ) {
              l.warn(
                "Waiting for finalization or a max lag of " + (MAX_LAG) + " blocks."
              );
              var unsub = await.unsub;
var bestBlock = await.bestBlock;waitLagLimit(api, blockIndex);
              unsub && unsub();
              lastKnownBestBlock = bestBlock;
              continue;
            }
          } else {
            // MAX_LAG isn't set, only the finalization matters
            if (blockIndex > lastKnownBestFinalized) {
              l.warn('Waiting for finalization.');
              var unsub = await.unsub;
var bestFinalizedBlock = await.bestFinalizedBlock;waitFinalized(
                api,
                lastKnownBestFinalized
              );
              unsub && unsub();
              lastKnownBestBlock = bestFinalizedBlock;
              continue;
            }
          }

          l.warn("blockIndex: " + (blockIndex) + "");
          l.warn("lastKnownBestBlock: " + (lastKnownBestBlock) + "");
          l.warn("lastKnownBestFinalized: " + (lastKnownBestFinalized) + "");

          var blockNumber: BlockNumber = api.createType(
            'BlockNumber',
            blockIndex
          );
          l.warn("block: " + (blockNumber) + "");

          var blockHash: Hash = await api.rpc.chain.getBlockHash(blockNumber);
          l.warn("hash: " + (blockHash) + "");

          // check spec version
          var runtimeVersion = await api.rpc.state.getRuntimeVersion(
            blockHash
          );
          var newSpecVersion = runtimeVersion.specVersion;

          // if spec version was bumped, update metadata in api registry
          if (newSpecVersion.gt(currentSpecVersion)) {
            l.warn(
              "bumped spec version to " + (newSpecVersion) + ", fetching new metadata"
            );
            var rpcMeta = await api.rpc.state.getMetadata(blockHash);
            currentSpecVersion = newSpecVersion;

            // based on the node spec & chain, inject specific type overrides
            var chain = await api.rpc.system.chain();
            api.registry.register(
              getSpecTypes(
                api.registry,
                chain,
                runtimeVersion.specName,
                runtimeVersion.specVersion
              )
            );
            api.registry.setMetadata(rpcMeta);
          }

          var [events, sessionIndex] = await Promise.all([
            await api.query.system.events.at(blockHash),
            await api.query.session.currentIndex.at(blockHash),
          ]);

          var cached: Cached = {
            events,
            sessionIndex,
          };

          // execute watcher tasks
          for await (var task of nomidotTasks) {
            l.warn("Task --- " + (task.name) + "");

            var result = await task.read(blockHash, cached, api);

            try {
              l.warn("Writing: " + (JSON.stringify(result)) + "");
              await task.write(blockNumber, result);
            } catch (e) {
              // Write task might throw errors such as unique constraints violated,
              // we ignore those.
              l.error(e);
            }
          }

          blockIndex += 1;

          await prisma.updateBlockIndex({
            data: {
              index: blockIndex,
            },
            where: {
              id: blockIndexId,
            },
          });
        }
      })
      .catch(e => {
        keepLooping = false;
        reject(new Error("Connection error: " + (e) + ""));
      });
  });
}
