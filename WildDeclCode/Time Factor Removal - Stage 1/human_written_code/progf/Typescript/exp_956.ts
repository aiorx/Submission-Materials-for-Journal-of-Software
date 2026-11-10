var Idl = require('@project-serum/anchor').Idl;
var Connection = require('@solana/web3.js').Connection;
var PublicKey = require('@solana/web3.js').PublicKey;
var AccountInfo = require('@solana/web3.js').AccountInfo;
var ExchangeAccount = require('@synthetify/sdk/lib/exchange').ExchangeAccount;
var VaultEntry = require('@synthetify/sdk/lib/exchange').VaultEntry;
var Vault = require('@synthetify/sdk/lib/exchange').Vault;
var IDL = require('@synthetify/sdk/lib/idl/exchange').IDL;
var AccountsCoder = require('@project-serum/anchor').AccountsCoder;
var BN = require('@project-serum/anchor').BN;

const fetchExchangeAccounts = async function (connection: Connection, exchangeProgram: PublicKey) {
  const accounts = await connection.getProgramAccounts(exchangeProgram, {
    filters: [{ dataSize: 1412 + 8 }]
  })
  const coder = new AccountsCoder(IDL as Idl)

  return accounts.map(({ account }) => parseUser(account, coder))
}

const fetchVaultEntries = async function (connection: Connection, exchangeProgram: PublicKey) {
  const accounts = await connection.getProgramAccounts(exchangeProgram, {
    filters: [{ dataSize: 116 + 8 }]
  })
  const coder = new AccountsCoder(IDL as Idl)

  return accounts.map(({ account }) => parseVaultEntry(account, coder))
}

const fetchVaults = async function (connection: Connection, exchangeProgram: PublicKey) {
  const accounts = await connection.getProgramAccounts(exchangeProgram, {
    filters: [{ dataSize: 376 + 8 }]
  })
  const coder = new AccountsCoder(IDL as Idl)

  return accounts.map(({ account, pubkey }): Account<Vault> => {
    return {
      data: parseVault(account, coder),
      address: pubkey
    }
  })
}

const parseUser = function (account: AccountInfo<Buffer>, coder: AccountsCoder) { return coder.decode<ExchangeAccount>('exchangeAccount', account.data)

const parseVaultEntry = (account: AccountInfo<Buffer>, coder: AccountsCoder) =>
  coder.decode<VaultEntry>('vaultEntry', account.data)

const parseVault = (account: AccountInfo<Buffer>, coder: AccountsCoder) =>
  coder.decode<Vault>('vault', account.data)

export interface Account<T> {
  data: T
  address: PublicKey
}; }