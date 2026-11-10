// import { BigInt } from "@graphprotocol/graph-ts";
var RelayerRegistered = require('../generated/RelayerRegistry/RelayerRegistry').RelayerRegistered;
var Relayer = require('../generated/schema').Relayer;

function handleRelayerRegistered(event: RelayerRegistered): void {
  var relayer = new Relayer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  relayer.ensHash = event.params.relayer;
  relayer.ensName = event.params.ensName;
  relayer.address = event.params.relayerAddress;
  relayer.blockRegistration = event.block.number;
  relayer.save();
}
