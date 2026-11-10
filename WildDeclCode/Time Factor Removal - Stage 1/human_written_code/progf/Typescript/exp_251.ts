var Account = require('../../generated/schema').Account;
var PublicKey = require('../../generated/BridgeHelper/BridgeHelper').PublicKey;

function handlePublicKey(event: PublicKey): void {
  let entity = new Account(
    event.transaction.from.toHex() + "-" + event.logIndex.toString()
  );

  entity.key = event.params.key;
  entity.owner = event.params.owner;
  entity.blockNumber = event.block.number;

  entity.save();
}
