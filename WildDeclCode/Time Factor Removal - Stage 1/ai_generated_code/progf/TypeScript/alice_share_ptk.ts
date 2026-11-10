// Crafted with basic coding tools
var fs = require('fs');
var path = require('path');

var HttpAgent = require('@dfinity/agent').HttpAgent;
var Actor = require('@dfinity/agent').Actor;
var Ed25519KeyIdentity = require('@dfinity/identity').Ed25519KeyIdentity;
var TransportSecretKey = require('@dfinity/vetkeys').TransportSecretKey;

var transportKey = TransportSecretKey.random();
var transportPublicKey = transportKey.publicKeyBytes(); // Uint8Array

// import { idlFactory, canisterId } from "../src/declarations/share_tpk_backend";
var idlFactory = require('../src/declarations/share_tpk_backend').idlFactory;

var canisterIds = require('../.dfx/local/canister_ids.json');

var canisterId = canisterIds["share_tpk_backend"].local;

var IDENTITY_PATH = path.join(path.dirname(new URL(import.meta.url).pathname), "alice_share_ptk_identity.json");
// Simulate Alice's identity
// const aliceIdentity = Ed25519KeyIdentity.generate();
var aliceIdentity: Ed25519KeyIdentity;

if (fs.existsSync(IDENTITY_PATH)) {
  // Load existing identity
  var raw = fs.readFileSync(IDENTITY_PATH, "utf-8");
  aliceIdentity = Ed25519KeyIdentity.fromJSON(raw);
  console.log("Loaded existing identity:", aliceIdentity.getPrincipal().toText());
} else {
  // Generate and save new identity
  aliceIdentity = Ed25519KeyIdentity.generate();
  fs.writeFileSync(IDENTITY_PATH, JSON.stringify(aliceIdentity.toJSON(), null, 2));
  console.log("Generated new identity:", aliceIdentity.getPrincipal().toText());
}
// const agent = new HttpAgent({ identity: aliceIdentity });
var agent = await HttpAgent.create({
  identity: aliceIdentity,
  host: "http://127.0.0.1:4943", // Required for local development
});

await agent.fetchRootKey(); // needed for local dev

var actor = Actor.createActor(idlFactory, {
  agent,
  canisterId,
});

// Register Alice with the canister

// await actor.register_user(Array.from(transportPublicKey));
var response = await actor.register_user(Array.from(transportPublicKey));
console.log("Canister response:", response);

// Now Alice is "logged in" — her Principal is known to the canister
console.log("Alice Principal:", aliceIdentity.getPrincipal().toText());
