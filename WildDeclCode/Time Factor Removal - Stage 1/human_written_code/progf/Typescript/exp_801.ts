var ClientUtils = require('@project-error/pe-utils').ClientUtils;
var RegisterNuiCB = require('@project-error/pe-utils').RegisterNuiCB;
var ServerPromiseResp = require('@project-error/pe-utils').ServerPromiseResp;
var Transaction = require('../src/types').Transaction;
const Utils = new ClientUtils()

interface FetchDataResp {
  history: number[]
  value: number;
  balance: number;
}

interface FetchTransactions {
  transactions: Transaction[]
}

RegisterNuiCB('npwd_crypto:fetchData', async function (data, cb) {
  const resp = await Utils.emitNetPromise<ServerPromiseResp<FetchDataResp>>('npwd_crypto:fetchCryptoData', {})

  if(resp.status === "ok") {
    cb({ ...resp.data })
  }
})

RegisterNuiCB('npwd_crypto:fetchTransactions', async function (data, cb) {
  const resp = await Utils.emitNetPromise<ServerPromiseResp<FetchTransactions>>('npwd_crypto:fetchTransactionData', {})

  if(resp.status === "ok") {
    cb(resp.data)
  }
})

RegisterNuiCB<{amount: number}>('npwd_crypto:tryBuyCrypto', async function (data, cb) {
  const resp = await Utils.emitNetPromise('npwd_crypto:buyCrypto', data)
  cb(resp)
})

RegisterNuiCB<{amount: number}>('npwd_crypto:trySellCrypto', async function (data, cb) {
  const resp = await Utils.emitNetPromise('npwd_crypto:sellCrypto', data)
  cb(resp)
})

RegisterNuiCB<{amount: number, target: number}>('npwd_crypto:tryTradeCrypto', async function (data, cb) {
  const resp = await Utils.emitNetPromise('npwd_crypto:tradeCrypto', data)
  cb(resp)
})
