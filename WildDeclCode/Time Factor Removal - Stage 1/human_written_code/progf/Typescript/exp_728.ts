var Connection = require('@metaplex/js').Connection;
var NodeWallet = require('@metaplex/js').NodeWallet;
var programs = require('@metaplex/js').programs;
var actions = require('@metaplex/js').actions;
var Keypair = require('@solana/web3.js').Keypair;
var PublicKey = require('@solana/web3.js').PublicKey;

var Metadata = programs.metadata.Metadata;
var initStore = actions.initStore;

const payer = Keypair.fromSecretKey(
  new Uint8Array([
    225, 60, 117, 68, 123, 252, 1, 200, 41, 251, 54, 121, 6, 167, 204, 18, 140, 168, 206, 74, 254,
    156, 230, 10, 212, 124, 162, 85, 120, 78, 122, 106, 187, 209, 148, 182, 34, 149, 175, 173, 192,
    85, 175, 252, 231, 130, 76, 40, 175, 177, 44, 111, 250, 168, 3, 236, 149, 34, 236, 19, 46, 9,
    66, 138,
  ]),
);
const metadataPubkey = new PublicKey('CZkFeERacU42qjApPyjamS13fNtz7y1wYLu5jyLpN1WL');
const connection = new Connection('devnet');
// Wallet
const wallet = new NodeWallet(payer);

const run = async function () {
  // Find metadata by owner
  const ownedMetadata = await Metadata.findByOwnerV2(connection, payer.publicKey);
  console.log(ownedMetadata);

  // Find specific metadada
  const metadata = await Metadata.load(connection, metadataPubkey);
  console.log(metadata);

  // Transactions

  // Set store
  // var storeId = await Store.getPDA(wallet.publicKey);
  // var tx = new SetStore(
  //   { feePayer: wallet.publicKey },
  //   {
  //     admin: wallet.publicKey,
  //     store: storeId,
  //     isPublic: true,
  //   },
  // );

  // tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
  // var signedTx = await wallet.signTransaction(tx);
  // var txId = await connection.sendRawTransaction(signedTx.serialize());
  // console.log(storeId.toString(), txId);

  // Metaplex
  var storeId = await.storeId;
var txId = await.txId;initStore({ connection, wallet });
  console.log(storeId, txId);
};

run();
