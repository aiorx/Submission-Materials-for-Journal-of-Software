// Copyright (c) 2018 Nguyen Vu Nhat Minh
// Distributed under the MIT software license, see the accompanying file LICENSE

var sha256 = require('ethereumjs-util').sha256;

var Wallet = require('ethereumjs-wallet');
var crypto = require('crypto');
var web3 = require('../ethereum/web3');
var utils = require('../support/Utils');
var EventHandler = require('./EventHandler');
var appDispatcher = require('../core/AppDispatcher');
var TransactionManager = require('./TransactionManager');
var Constant = require('../support/Constant');
var Config = require('../support/Config');

class AccountManager {
    constructor(storageManager) {
        this.isJoined = false;
        this.balance = 0;
        this.name = "";
        this.avatarUrl = "";
        this.storageManager = storageManager;
        this.loadPrivateKey();
        this.loadInfoFromstorageManager();
    }

    loadInfoFromstorageManager = function () {
        this.balance = this.storageManager.getBalance();
        this.name = this.storageManager.getName();
        this.avatarUrl = this.storageManager.getAvatarUrl();
        this.isJoined = this.storageManager.getJoinedStatus();
        this.askForTransactionApproval = this.storageManager.getAskForTransactionApproval();
    }

    setProfile = function (name, avatarUrl, isJoined) {
        this.name = name;
        this.avatarUrl = avatarUrl;
        this.isJoined = isJoined;
    }

    // Update balance of the current account
    updateBalance = async function () {
        this.balance = await web3.eth.getBalance(this.walletAccount.getAddress().toString('hex'));
        this.storageManager.setBalance(this.balance);
        appDispatcher.dispatch({
            action: Constant.EVENT.ACCOUNT_BALANCE_UPDATED
        })
    }

    setAskForTransactionApproval = function (askForApproval) {
        this.storageManager.setAskForTransactionApproval(askForApproval);
        this.askForTransactionApproval = askForApproval;
    }

    // Load private key from browser's local storage
    loadPrivateKey = function () {
        var privateKeyHex = this.storageManager.getPrivateKey();
        if (privateKeyHex) {
            var privateKeyBuffer = Buffer.from(privateKeyHex, 'hex');
            this.walletAccount = Wallet.fromPrivateKey(privateKeyBuffer);
            this.updateBalance();
        }
    }

    storePrivateKey = function (privateKey) {
        var isValid = false;
        try {
            var privateKeyBuffer = Buffer.from(privateKey, 'hex');
            this.walletAccount = Wallet.fromPrivateKey(privateKeyBuffer);
            this.storageManager.storePrivateKeyAndAddress(privateKey, this.getAddress());
            isValid = true;
        } catch (err) {
        }
        this.updateBalance();
        return isValid;
    }

    getPublicKeyBuffer() {
        return this.walletAccount.getPublicKey();
    }

    getPrivateKeyBuffer() {
        return this.walletAccount.getPrivateKey();
    }

    getAddress = function () {
        if (this.walletAccount) {
            return '0x' + this.walletAccount.getAddress().toString('hex');
        } else {
            return "";
        }
    }

    // Compute a secret key for messages encryption/decryption
    computeSecret = function (publicKeyBuffer) {
        var a = crypto.createECDH('secp256k1');
        a.generateKeys();
        a.setPrivateKey(this.getPrivateKeyBuffer());
        return a.computeSecret(publicKeyBuffer);
    }
}

module.exports = AccountManager;
