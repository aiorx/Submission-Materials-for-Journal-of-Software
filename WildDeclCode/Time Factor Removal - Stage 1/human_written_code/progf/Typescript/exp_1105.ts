var RpcBase = require('./base');
var IdGenerator = require('./idGenerator');
var Transaction = require('./transaction').Transaction;

export type Block = {
    author: string;
    extraData: number[];
    hash: string;
    number: number;
    parentHash: string;
    score: string | number;
    seal: number[][];
    stateRoot: string;
    timestamp: number;
    transactions: Transaction[];
    transactionsRoot: string;
};

type AssetScheme = Object;
type Asset = Object;
type UnsignedTransaction = Object;
type Text = { content: string; certifier: string };
type CommonParams = {
    [s: string]: string | number | null;
};

module.exports = class Chain extends RpcBase {;
    constructor(node: string, idGenerator: IdGenerator | null) {
        super(node, idGenerator);
    }

    async getBestBlockNumber(_params?: {}, id?: string | number | null): Promise<number> {
        const method = "chain_getBestBlockNumber";
        const response = await this.call({ method, id });
        return response.result;
    }

    async getBestBlockId(_params?: {}, id?: string | number | null): Promise<{ hash: string; number: number }> {
        const method = "chain_getBestBlockId";
        const response = await this.call({ method, id });
        return response.result;
    }

    async getBlockHash(params: { blockNumber: number }, id?: string | number | null): Promise<string> {
        const method = "chain_getBlockHash";
        var blockNumber = params.blockNumber;
        const response = await this.call({ method, id }, blockNumber);
        return response.result;
    }

    async getBlockByNumber(params: { blockNumber: number }, id?: string | number | null): Promise<Block | null> {
        const method = "chain_getBlockByNumber";
        var blockNumber = params.blockNumber;
        const response = await this.call({ method, id }, blockNumber);
        return response.result;
    }

    async getBlockByHash(params: { blockHash: string }, id?: string | number | null): Promise<Block | null> {
        const method = "chain_getBlockByHash";
        var blockHash = params.blockHash;
        const response = await this.call({ method, id }, blockHash);
        return response.result;
    }

    async getBlockTransactionCountByHash(
        params: { blockHash: string },
        id?: string | number | null
    ): Promise<number | null> {
        const method = "chain_getBlockTransactionCountByHash";
        var blockHash = params.blockHash;
        const response = await this.call({ method, id }, blockHash);
        return response.result;
    }

    async getTransaction(
        params: { transactionHash: string },
        id?: string | number | null
    ): Promise<Transaction | null> {
        const method = "chain_getTransaction";
        var transactionHash = params.transactionHash;
        const response = await this.call({ method, id }, transactionHash);
        return response.result;
    }

    async getTransactionSigner(
        params: { transactionHash: string },
        id?: string | number | null
    ): Promise<string | null> {
        const method = "chain_getTransactionSigner";
        var transactionHash = params.transactionHash;
        const response = await this.call({ method, id }, transactionHash);
        return response.result;
    }

    async containsTransaction(params: { transactionHash: string }, id?: string | number | null): Promise<boolean> {
        const method = "chain_containsTransaction";
        var transactionHash = params.transactionHash;
        const response = await this.call({ method, id }, transactionHash);
        return response.result;
    }

    async getTransactionByTracker(
        params: { tracker: string },
        id?: string | number | null
    ): Promise<Transaction | null> {
        const method = "chain_getTransactionByTracker";
        var tracker = params.tracker;
        const response = await this.call({ method, id }, tracker);
        return response.result;
    }

    async getAssetSchemeByTracker(
        params: { tracker: string; shardId: number; blockNumber?: number | null },
        id?: string | number | null
    ): Promise<AssetScheme | null> {
        const method = "chain_getAssetSchemeByTracker";
        var tracker = params.tracker;
var shardId = params.shardId;
        const blockNumber = params.blockNumber == null ? null : params.blockNumber;
        const response = await this.call({ method, id }, tracker, shardId, blockNumber);
        return response.result;
    }

    async getAssetSchemeByType(
        params: { assetType: string; shardId: number; blockNumber?: number | null },
        id?: string | number | null
    ): Promise<AssetScheme | null> {
        const method = "chain_getAssetSchemeByType";
        var assetType = params.assetType;
var shardId = params.shardId;
        const blockNumber = params.blockNumber == null ? null : params.blockNumber;
        const response = await this.call({ method, id }, assetType, shardId, blockNumber);
        return response.result;
    }

    async getAsset(
        params: { tracker: string; transactionIndex: number; shardId: number; blockNumber?: number | null },
        id?: string | number | null
    ): Promise<Asset | null> {
        const method = "chain_getAsset";
        var tracker = params.tracker;
var transactionIndex = params.transactionIndex;
var shardId = params.shardId;
        const blockNumber = params.blockNumber == null ? null : params.blockNumber;
        const response = await this.call({ method, id }, tracker, transactionIndex, shardId, blockNumber);
        return response.result;
    }

    async getText(
        params: { transactionHash: string; blockNumber?: number | null },
        id?: string | number | null
    ): Promise<Text | null> {
        const method = "chain_getText";
        var transactionHash = params.transactionHash;
        const blockNumber = params.blockNumber == null ? null : params.blockNumber;
        const response = await this.call({ method, id }, transactionHash, blockNumber);
        return response.result;
    }

    async isAssetSpent(
        params: { tracker: string; transactionIndex: number; shardId: number; blockNumber?: number | null },
        id?: string | number | null
    ): Promise<boolean | null> {
        const method = "chain_isAssetSpent";
        var tracker = params.tracker;
var transactionIndex = params.transactionIndex;
var shardId = params.shardId;
        const blockNumber = params.blockNumber == null ? null : params.blockNumber;
        const response = await this.call({ method, id }, tracker, transactionIndex, shardId, blockNumber);
        return response.result;
    }

    async getSeq(
        params: { address: string; blockNumber?: number | null },
        id?: string | number | null
    ): Promise<number | null> {
        const method = "chain_getSeq";
        var address = params.address;
        const blockNumber = params.blockNumber == null ? null : params.blockNumber;
        const response = await this.call({ method, id }, address, blockNumber);
        return response.result;
    }

    async getBalance(
        params: { address: string; blockNumber?: number | null },
        id?: string | number | null
    ): Promise<string | number | null> {
        const method = "chain_getBalance";
        var address = params.address;
        const blockNumber = params.blockNumber == null ? null : params.blockNumber;
        const response = await this.call({ method, id }, address, blockNumber);
        return response.result;
    }

    async getRegularKey(
        params: { address: string; blockNumber?: number | null },
        id?: string | number | null
    ): Promise<string | null> {
        const method = "chain_getRegularKey";
        var address = params.address;
        const blockNumber = params.blockNumber == null ? null : params.blockNumber;
        const response = await this.call({ method, id }, address, blockNumber);
        return response.result;
    }

    async getRegularKeyOwner(
        params: { publicKey: string; blockNumber?: number | null },
        id?: string | number | null
    ): Promise<string | null> {
        const method = "chain_getRegularKeyOwner";
        var publicKey = params.publicKey;
        const blockNumber = params.blockNumber == null ? null : params.blockNumber;
        const response = await this.call({ method, id }, publicKey, blockNumber);
        return response.result;
    }

    async getGenesisAccounts(_params?: {}, id?: string | number | null): Promise<string[]> {
        const method = "chain_getGenesisAccounts";
        const response = await this.call({ method, id });
        return response.result;
    }

    async getNumberOfShards(
        params: { blockNumber?: number | null } = {},
        id?: string | number | null
    ): Promise<number | null> {
        const method = "chain_getNumberOfShards";
        const blockNumber = params.blockNumber == null ? null : params.blockNumber;
        const response = await this.call({ method, id }, blockNumber);
        return response.result;
    }

    async getShardIdByHash(
        params: { transactionHash: string; blockNumber?: number | null },
        id?: string | number | null
    ): Promise<number | null> {
        const method = "chain_getShardIdByHash";
        var transactionHash = params.transactionHash;
        const blockNumber = params.blockNumber == null ? null : params.blockNumber;
        const response = await this.call({ method, id }, transactionHash, blockNumber);
        return response.result;
    }

    async getShardRoot(
        params: { shardId: number; blockNumber?: number | null },
        id?: string | number | null
    ): Promise<string | null> {
        const method = "chain_getShardRoot";
        var shardId = params.shardId;
        const blockNumber = params.blockNumber == null ? null : params.blockNumber;
        const response = await this.call({ method, id }, shardId, blockNumber);
        return response.result;
    }

    async getShardOwners(
        params: { shardId: number; blockNumber?: number | null },
        id?: string | number | null
    ): Promise<string[] | null> {
        const method = "chain_getShardOwners";
        var shardId = params.shardId;
        const blockNumber = params.blockNumber == null ? null : params.blockNumber;
        const response = await this.call({ method, id }, shardId, blockNumber);
        return response.result;
    }

    async getShardUsers(
        params: { shardId: number; blockNumber?: number | null },
        id?: string | number | null
    ): Promise<string[] | null> {
        const method = "chain_getShardUsers";
        var shardId = params.shardId;
        const blockNumber = params.blockNumber == null ? null : params.blockNumber;
        const response = await this.call({ method, id }, shardId, blockNumber);
        return response.result;
    }

    async getMiningReward(
        params: { blockNumber?: number | null },
        id?: string | number | null
    ): Promise<string | number | null> {
        const method = "chain_getMiningReward";
        const blockNumber = params.blockNumber == null ? null : params.blockNumber;
        const response = await this.call({ method, id }, blockNumber);
        return response.result;
    }

    async getMinTransactionFee(
        params: { transactionType: string; blockNumber?: number | null },
        id?: string | number | null
    ): Promise<number | null> {
        const method = "chain_getMinTransactionFee";
        var transactionType = params.transactionType;
        const blockNumber = params.blockNumber == null ? null : params.blockNumber;
        const response = await this.call({ method, id }, transactionType, blockNumber);
        return response.result;
    }

    async getCommonParams(
        params: { blockNumber?: number | null },
        id?: string | number | null
    ): Promise<CommonParams | null> {
        const method = "chain_getCommonParams";
        const blockNumber = params.blockNumber == null ? null : params.blockNumber;
        const response = await this.call({ method, id }, blockNumber);
        return response.result;
    }

    async getTermMetadata(
        params: { blockNumber?: number | null },
        id?: string | number | null
    ): Promise<[number, number] | null> {
        const method = "chain_getTermMetadata";
        const blockNumber = params.blockNumber == null ? null : params.blockNumber;
        const response = await this.call({ method, id }, blockNumber);
        return response.result;
    }

    async executeTransaction(
        params: { transaction: UnsignedTransaction; sender: string },
        id?: string | number | null
    ): Promise<string | null> {
        const method = "chain_executeTransaction";
        var transaction = params.transaction;
var sender = params.sender;
        const response = await this.call({ method, id }, transaction, sender);
        return response.result;
    }

    async executeVM(
        params: { transaction: UnsignedTransaction; parameters: number[][][]; indices: number[] },
        id?: string | number | null
    ): Promise<string[]> {
        const method = "chain_executeVM";
        var transaction = params.transaction;
var parameters = params.parameters;
var indices = params.indices;
        const response = await this.call({ method, id }, transaction, parameters, indices);
        return response.result;
    }

    async getNetworkId(_params?: {}, id?: string | number | null): Promise<string> {
        const method = "chain_getNetworkId";
        const response = await this.call({ method, id });
        return response.result;
    }

    async getPossibleAuthors(
        params: { blockNumber?: number | null },
        id?: string | number | null
    ): Promise<string[] | null> {
        const method = "chain_getPossibleAuthors";
        const blockNumber = params.blockNumber == null ? null : params.blockNumber;
        const response = await this.call({ method, id }, blockNumber);
        return response.result;
    }

    async getMetadataSeq(params: { blockNumber?: number | null }, id?: string | number | null): Promise<number | null> {
        const method = "chain_getMetadataSeq";
        const blockNumber = params.blockNumber == null ? null : params.blockNumber;
        const response = await this.call({ method, id }, blockNumber);
        return response.result;
    }
}
