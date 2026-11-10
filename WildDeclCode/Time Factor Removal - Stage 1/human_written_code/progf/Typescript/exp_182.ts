var Address = require('@graphprotocol/graph-ts').Address;
var Stake = require('../generated/schema').Stake;
var Unstake = require('../generated/schema').Unstake;

var StakeCall = require('../generated/OlympusStakingV2Helper/OlympusStakingV2Helper').StakeCall;
var toDecimal = require('./utils/Decimals').toDecimal;
var loadOrCreateOHMie = require('./utils/OHMie').loadOrCreateOHMie;
var updateOhmieBalance = require('./utils/OHMie').updateOhmieBalance;
var loadOrCreateTransaction = require('./utils/Transactions').loadOrCreateTransaction;

function handleStake(call: StakeCall): void {
    let ohmie = loadOrCreateOHMie(call.from as Address)
    let transaction = loadOrCreateTransaction(call.transaction, call.block)
    let value = toDecimal(call.inputs._amount, 9)

    let stake = new Stake(transaction.id)
    stake.transaction = transaction.id
    stake.ohmie = ohmie.id
    stake.amount = value
    stake.timestamp = transaction.timestamp;
    stake.save()

    updateOhmieBalance(ohmie, transaction)
}