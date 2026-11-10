/* eslint-disable prefer-const */
var PairHourData = require('./../types/schema').PairHourData;
var BigInt = require('@graphprotocol/graph-ts').BigInt;
var BigDecimal = require('@graphprotocol/graph-ts').BigDecimal;
var ethereum = require('@graphprotocol/graph-ts').ethereum;
var Pair = require('../types/schema').Pair;
var Bundle = require('../types/schema').Bundle;
var Token = require('../types/schema').Token;
var UniswapFactory = require('../types/schema').UniswapFactory;
var UniswapDayData = require('../types/schema').UniswapDayData;
var PairDayData = require('../types/schema').PairDayData;
var TokenDayData = require('../types/schema').TokenDayData;
var ONE_BI = require('./helpers').ONE_BI;
var ZERO_BD = require('./helpers').ZERO_BD;
var ZERO_BI = require('./helpers').ZERO_BI;
var FACTORY_ADDRESS = require('./helpers').FACTORY_ADDRESS;

function updateUniswapDayData(event: ethereum.Event): UniswapDayData {
  var uniswap = UniswapFactory.load(FACTORY_ADDRESS)
  var timestamp = event.block.timestamp.toI32()
  var dayID = timestamp / 86400
  var dayStartTimestamp = dayID * 86400
  var uniswapDayData = UniswapDayData.load(dayID.toString())
  if (uniswapDayData === null) {
    uniswapDayData = new UniswapDayData(dayID.toString())
    uniswapDayData.date = dayStartTimestamp
    uniswapDayData.dailyVolumeUSD = ZERO_BD
    uniswapDayData.dailyVolumeETH = ZERO_BD
    uniswapDayData.totalVolumeUSD = ZERO_BD
    uniswapDayData.totalVolumeETH = ZERO_BD
    uniswapDayData.dailyVolumeUntracked = ZERO_BD
  }

  uniswapDayData.totalLiquidityUSD = uniswap.totalLiquidityUSD
  uniswapDayData.totalLiquidityETH = uniswap.totalLiquidityETH
  uniswapDayData.txCount = uniswap.txCount
  uniswapDayData.save()

  return uniswapDayData as UniswapDayData
}

function updatePairDayData(event: ethereum.Event): PairDayData {
  var timestamp = event.block.timestamp.toI32()
  var dayID = timestamp / 86400
  var dayStartTimestamp = dayID * 86400
  var dayPairID = event.address
    .toHexString()
    .concat('-')
    .concat(BigInt.fromI32(dayID).toString())
  var pair = Pair.load(event.address.toHexString())
  var pairDayData = PairDayData.load(dayPairID)
  if (pairDayData === null) {
    pairDayData = new PairDayData(dayPairID)
    pairDayData.date = dayStartTimestamp
    pairDayData.token0 = pair.token0
    pairDayData.token1 = pair.token1
    pairDayData.pairAddress = event.address
    pairDayData.dailyVolumeToken0 = ZERO_BD
    pairDayData.dailyVolumeToken1 = ZERO_BD
    pairDayData.dailyVolumeUSD = ZERO_BD
    pairDayData.dailyTxns = ZERO_BI
  }

  pairDayData.totalSupply = pair.totalSupply
  pairDayData.reserve0 = pair.reserve0
  pairDayData.reserve1 = pair.reserve1
  pairDayData.reserveUSD = pair.reserveUSD
  pairDayData.dailyTxns = pairDayData.dailyTxns.plus(ONE_BI)
  pairDayData.save()

  return pairDayData as PairDayData
}

function updatePairHourData(event: ethereum.Event): PairHourData {
  var timestamp = event.block.timestamp.toI32()
  var hourIndex = timestamp / 3600 // get unique hour within unix history
  var hourStartUnix = hourIndex * 3600 // want the rounded effect
  var hourPairID = event.address
    .toHexString()
    .concat('-')
    .concat(BigInt.fromI32(hourIndex).toString())
  var pair = Pair.load(event.address.toHexString())
  var pairHourData = PairHourData.load(hourPairID)
  if (pairHourData === null) {
    pairHourData = new PairHourData(hourPairID)
    pairHourData.hourStartUnix = hourStartUnix
    pairHourData.pair = event.address.toHexString()
    pairHourData.hourlyVolumeToken0 = ZERO_BD
    pairHourData.hourlyVolumeToken1 = ZERO_BD
    pairHourData.hourlyVolumeUSD = ZERO_BD
    pairHourData.hourlyTxns = ZERO_BI
  }

  pairHourData.reserve0 = pair.reserve0
  pairHourData.reserve1 = pair.reserve1
  pairHourData.reserveUSD = pair.reserveUSD
  pairHourData.hourlyTxns = pairHourData.hourlyTxns.plus(ONE_BI)
  pairHourData.save()

  return pairHourData as PairHourData
}

function updateTokenDayData(token: Token, event: ethereum.Event): TokenDayData {
  var bundle = Bundle.load('1')
  var timestamp = event.block.timestamp.toI32()
  var dayID = timestamp / 86400
  var dayStartTimestamp = dayID * 86400
  var tokenDayID = token.id
    .toString()
    .concat('-')
    .concat(BigInt.fromI32(dayID).toString())

  var tokenDayData = TokenDayData.load(tokenDayID)
  if (tokenDayData === null) {
    tokenDayData = new TokenDayData(tokenDayID)
    tokenDayData.date = dayStartTimestamp
    tokenDayData.token = token.id
    tokenDayData.priceUSD = token.derivedETH.times(bundle.ethPrice)
    tokenDayData.dailyVolumeToken = ZERO_BD
    tokenDayData.dailyVolumeETH = ZERO_BD
    tokenDayData.dailyVolumeUSD = ZERO_BD
    tokenDayData.dailyTxns = ZERO_BI
    tokenDayData.totalLiquidityUSD = ZERO_BD
  }
  tokenDayData.priceUSD = token.derivedETH.times(bundle.ethPrice)
  tokenDayData.totalLiquidityToken = token.totalLiquidity
  tokenDayData.totalLiquidityETH = token.totalLiquidity.times(token.derivedETH as BigDecimal)
  tokenDayData.totalLiquidityUSD = tokenDayData.totalLiquidityETH.times(bundle.ethPrice)
  tokenDayData.dailyTxns = tokenDayData.dailyTxns.plus(ONE_BI)
  tokenDayData.save()

  /**
   * @todo test if this speeds up sync
   */
  // updateStoredTokens(tokenDayData as TokenDayData, dayID)
  // updateStoredPairs(tokenDayData as TokenDayData, dayPairID)

  return tokenDayData as TokenDayData
}
