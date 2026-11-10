/*==================================================
  Modules
  ==================================================*/

var sdk = require('../../sdk');
var _ = require('underscore');
var BigNumber = require("bignumber.js");
var abi = require('./abi.json');

/*==================================================
  Settings
  ==================================================*/

var aaveLendingPoolCore = "0x3dfd23A6c5E8BbcFc9581d2E864a68feb6a076d3";
var aaveLendingPool = "0x398eC7346DcD622eDc5ae82352F02bE94C62d119";
var aaveReserves = []

var uniswapLendingPoolCore = "0x1012cfF81A1582ddD0616517eFB97D02c5c17E25";
var uniswapLendingPool = "0x2F60C3EB259D63dcCa81fDE7Eaa216D9983D7C60";
var uniswapReserves = []

var aaveStakingContract = "0x4da27a545c0c5b758a6ba100e3a049001de870f5";
var aaveBalancerContractImp = "0xC697051d1C6296C24aE3bceF39acA743861D9A81";
var aaveTokenAddress = "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9";
var wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

var addressesProviderRegistry = "0x52D306e36E3B6B02c153d0266ff0f85d18BCD413";
var v2Atokens = [];
var v2ReserveTokens = [];
var addressSymbolMapping = {};

/*==================================================
  Helper Functions
  ==================================================*/

async function _stakingTvl(block) {
  return (
    await sdk.api.abi.call({
      target: aaveTokenAddress,
      params: aaveStakingContract,
      abi: "erc20:balanceOf",
      block
    })
  ).output;
}

async function _stakingBalancerTvl(block) {
  var aaveBal = (
    await sdk.api.abi.call({
      target: aaveTokenAddress,
      params: aaveBalancerContractImp,
      abi: "erc20:balanceOf",
      block,
    })
  ).output;

  var wethBal = (
    await sdk.api.abi.call({
      target: wethTokenAddress,
      params: aaveBalancerContractImp,
      abi: "erc20:balanceOf",
      block,
    })
  ).output;

  return {
    [aaveTokenAddress]: aaveBal,
    [wethTokenAddress]: wethBal,
  };
}

async function _getV1Assets(lendingPoolCore, block) {
  var reserves = (
    await sdk.api.abi.call({
      target: lendingPoolCore,
      abi: abi["getReserves"],
      block
    })
  ).output;

  var decimalsOfReserve = (
    await sdk.api.abi.multiCall({
      calls: _.map(reserves, function (reserve) { return ({
        target: reserve
      }); }),
      abi: "erc20:decimals"
    })
  ).output;

  var symbolsOfReserve = (
    await sdk.api.abi.multiCall({
      calls: _.map(reserves, function reserve { return ({
        target: reserve
      }); }),
      abi: "erc20:symbol"
    })
  ).output;

  var assets = []

  reserves.map(function (reserve, i) {
    if (reserve === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') return;

    var symbol;
    switch(reserve) {
      case "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2": // MKR doesn't include symbol in contract 🤷‍♂️
        symbol = { output: 'MKR' }; break
      default:
        symbol = symbolsOfReserve[i]
    }

    var decimals = decimalsOfReserve[i]
    if (decimals.success) {
      assets.push({ address: reserve, symbol: symbol.output, decimals: decimals.output })
    }
  })

  return assets
}

async function _multiMarketV1Tvl(lendingPoolCore, reserves, block) {
  var balances = {
    "0x0000000000000000000000000000000000000000": (
      await sdk.api.eth.getBalance({ target: lendingPoolCore, block })
    ).output,
  };

  var balanceOfResults = await sdk.api.abi.multiCall({
    block,
    calls: _.map(reserves, function (reserve) { return ({
      target: reserve.address,
      params: lendingPoolCore,
    }); }),
    abi: "erc20:balanceOf",
  });

  sdk.util.sumMultiBalanceOf(balances, balanceOfResults);

  return balances;
}

async function _multiMarketV1Rates(lendingPool, reserves, block) {
  var calls = _.map(reserves, function (reserve) { return ({
    target: lendingPool,
    params: reserve.address,
  }); });

  var reserveDataResults = (
    await sdk.api.abi.multiCall({
      block,
      calls,
      abi: abi["getReserveData"],
    })
  ).output;

  var reserveConfigResult = (
    await sdk.api.abi.multiCall({
      block,
      calls,
      abi: abi["getReserveConfigurationData"],
    })
  ).output;

  var ratesData = { lend: {}, borrow: {}, supply: {}, borrow_stable: {}, supply_stable: {} };

  reserveDataResults.map(function (result) {
    if (!result || !result.success) return;
    var address = result.input.params[0];
    var reserveData = result.output;
    var reserveDict = reserves.find(
      (reserve) => reserve.address === address
    );
    var symbol = reserveDict.symbol + "_V1";

    var outStandingBorrows = BigNumber(reserveData.totalLiquidity)
      .minus(BigNumber(reserveData.availableLiquidity))
      .div(10 ** reserveDict.decimals)
      .toFixed();
    var lendRate = BigNumber(reserveData.liquidityRate)
      .div(10 ** 25)
      .toFixed();
    var borrowRate = BigNumber(reserveData.variableBorrowRate)
      .div(10 ** 25)
      .toFixed();
    var borrowStableRate = BigNumber(reserveData.stableBorrowRate)
      .div(10 ** 25)
      .toFixed();

    ratesData.lend[symbol] = lendRate;
    ratesData.borrow[symbol] = borrowRate;
    ratesData.borrow_stable[symbol] = borrowStableRate;
    ratesData.supply[symbol] = outStandingBorrows;
    ratesData.supply_stable[symbol] = BigNumber(reserveData.totalBorrowsStable).div(10 ** reserveDict.decimals).toFixed();
  });

  reserveConfigResult.map(function (result) {
    if (!result || !result.success) return;
    var address = result.input.params[0];
    var reserveConfig = result.output;
    var reserveDict = reserves.find(
      (reserve) => reserve.address === address
    );
    var symbol = reserveDict.symbol + "_V1";

    var isActive = reserveConfig.isActive;
    var borrowingEnabled = reserveConfig.borrowingEnabled;
    var stableBorrowRateEnabled = reserveConfig.stableBorrowRateEnabled;

    if (!isActive) {
      delete ratesData.lend[symbol];
      delete ratesData.borrow[symbol];
      delete ratesData.borrow_stable[symbol];
      delete ratesData.supply[symbol];
      delete ratesData.supply_stable[symbol];
      return;
    }

    if (!borrowingEnabled) {
      delete ratesData.borrow[symbol];
      delete ratesData.borrow_stable[symbol];
      return;
    }

    if (!stableBorrowRateEnabled) {
      delete ratesData.borrow_stable[symbol];
    }
  });

  return ratesData;
}

async function getV1Reserves(block) {
  if (aaveReserves.length === 0) {
    aaveReserves = await _getV1Assets(aaveLendingPoolCore, block);
  }

  if (uniswapReserves.length === 0) {
    // Does not take into account Uniswap LP assets (not yet supported on DeFiPulse)
    if (block > 10094855) {
      uniswapReserves = await _getV1Assets(uniswapLendingPoolCore, block);
    }
  }
}

async function getV2Reserves(block) {
  if (v2Atokens.length !== 0 && v2ReserveTokens.length !== 0) return

  var addressesProviders = (
    await sdk.api.abi.call({
      target: addressesProviderRegistry,
      abi: abi["getAddressesProvidersList"],
      block
    })
  ).output;

  var protocolDataHelpers = (
    await sdk.api.abi.multiCall({
      calls: _.map(addressesProviders, function (provider) { return ({
        target: provider,
        params: "0x0100000000000000000000000000000000000000000000000000000000000000",
      }); }),
      abi: abi["getAddress"],
      block
    })
  ).output;

  var validProtocolDataHelpers = protocolDataHelpers.filter(
    function (helper) { return helper.output !== "0x0000000000000000000000000000000000000000"; });

  var aTokenMarketData = (
    await sdk.api.abi.multiCall({
      calls: _.map(validProtocolDataHelpers, function (dataHelper) { return ({
        target: dataHelper.output,
      }); }),
      abi: abi["getAllATokens"],
      block,
    })
  ).output;

  var aTokenAddresses = [];
  aTokenMarketData.map(function (aTokensData) {
    if (aTokensData.output && aTokensData.output.length) {
      aTokenAddresses = [
        ...aTokenAddresses,
        ...aTokensData.output.map((aToken) => aToken[1]),
      ];
    }
  });

  var underlyingAddressesData = (
    await sdk.api.abi.multiCall({
      calls: _.map(aTokenAddresses, function (aToken) { return ({
        target: aToken,
      }); }),
      abi: abi["getUnderlying"],
      block
    })
  ).output;

  var reserveAddresses = [];
  underlyingAddressesData.map(function (reserveData) {
    reserveAddresses.push(reserveData.output)
  });

  v2Atokens = aTokenAddresses
  v2ReserveTokens = reserveAddresses;

  // Fetch associated token info
  var symbolsOfReserves = (
    await sdk.api.abi.multiCall({
      calls: _.map(v2ReserveTokens, function (underlying) { return ({
        target: underlying,
      }); }),
      abi: "erc20:symbol",
      block
    })
  ).output;

  var decimalsOfReserves = (
    await sdk.api.abi.multiCall({
      calls: _.map(v2ReserveTokens, function (underlying) { return ({
        target: underlying,
      }); }),
      abi: "erc20:decimals",
      block
    })
  ).output

  symbolsOfReserves.map(function (r) {
    var address = r.input.target;
    var symbol;

    if (address == "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2") {
      symbol = "MKR";
    } else {
      symbol = r.output;
    }

    addressSymbolMapping[address] = { symbol };
  });

  decimalsOfReserves.map(function (r) {
    var address = r.input.target;
    var existingAddress = addressSymbolMapping[address];
    addressSymbolMapping[address] = {
      ...existingAddress,
      decimals: r.output,
    };
  });
}

async function getV2Tvl(block) {
  var underlyingAddressesDict = Object.keys(v2ReserveTokens).map(
    function (key) { return v2ReserveTokens[key]; });

  var balanceOfUnderlying = (
    await sdk.api.abi.multiCall({
      calls: _.map(v2Atokens, function (aToken, index) { return ({
        target: underlyingAddressesDict[index],
        params: aToken,
      }); }),
      abi: "erc20:balanceOf",
      block
    })
  ).output;

  var v2Data = balanceOfUnderlying.map(function (underlying, index) {
    var address = underlying.input.target
    return {
      aToken: v2Atokens[index],
      underlying: address,
      symbol: addressSymbolMapping[address].symbol,
      decimals: addressSymbolMapping[address].decimals,
      balance: underlying.output,
    };
  })

  return v2Data
}

async function getV2Rates(block) {
  var addressesProviders = (
    await sdk.api.abi.call({
      target: addressesProviderRegistry,
      abi: abi["getAddressesProvidersList"],
      block
    })
  ).output;

  var protocolDataHelpers = (
    await sdk.api.abi.multiCall({
      calls: _.map(addressesProviders, function (provider) { return ({
        target: provider,
        params: "0x0100000000000000000000000000000000000000000000000000000000000000",
      }); }),
      abi: abi["getAddress"],
      block
    })
  ).output;

  var reserveData = (
    await sdk.api.abi.multiCall({
      calls: _.map(v2ReserveTokens, function (reserve) { return ({
        target: protocolDataHelpers[0].output,
        params: reserve,
      }); }),
      abi: abi["getReserveDataV2"],
      block
    })
  ).output

  var ratesData = { lend: {}, borrow: {}, supply: {}, borrow_stable: {}, supply_stable: {} };

  reserveData.map(function result {
    if (!result || !result.success) return;
    var address = result.input.params[0]
    var reserveDetails = addressSymbolMapping[address]
    var symbol = reserveDetails.symbol + "_V2";
    var details = result.output;

    var outStandingBorrows = BigNumber(details.totalStableDebt)
      .plus(BigNumber(details.totalVariableDebt))
      .div(10 ** reserveDetails.decimals)
      .toFixed();
    var lendRate = BigNumber(details.liquidityRate)
      .div(10 ** 25)
      .toFixed();
    var borrowRate = BigNumber(details.variableBorrowRate)
      .div(10 ** 25)
      .toFixed();
    var borrowStableRate = BigNumber(details.stableBorrowRate)
      .div(10 ** 25)
      .toFixed();

    ratesData.lend[symbol] = lendRate;
    ratesData.borrow[symbol] = borrowRate;
    ratesData.borrow_stable[symbol] = borrowStableRate;
    ratesData.supply[symbol] = outStandingBorrows;
    ratesData.supply_stable[symbol] = BigNumber(details.totalStableDebt).div(10 ** reserveDetails.decimals).toFixed();
  })

  return ratesData
}

/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {
  // V1 TVLs
  await getV1Reserves(block)
  var balances = await _multiMarketV1Tvl(aaveLendingPoolCore, aaveReserves, block);

  if (block > 10094855) {
    var uniswapMarketTvlBalances = await _multiMarketV1Tvl(
      uniswapLendingPoolCore,
      uniswapReserves,
      block
    );

    // ...add v1 uniswap market TVL
    Object.keys(uniswapMarketTvlBalances).forEach(function address {
      if (balances[address]) {
        balances[address] = BigNumber(
          balances[address]
        ).plus(uniswapMarketTvlBalances[address]).toFixed();
      } else {
        balances[address] = uniswapMarketTvlBalances[address];
      }
    });
  }


  // Staking TVL
  if (block >= 10926829) {
    var stakedAaveAmount = await _stakingTvl(block);
    balances[aaveTokenAddress] = balances[aaveTokenAddress]
      ? BigNumber(balances[aaveTokenAddress]).plus(stakedAaveAmount).toFixed()
      : BigNumber(stakedAaveAmount).toFixed()

    var stakedBalancerAmounts = await _stakingBalancerTvl(block);
    Object.keys(stakedBalancerAmounts).forEach(function (address) {
      balances[address] = balances[address]
        ? BigNumber(balances[address])
          .plus(stakedBalancerAmounts[address])
          .toFixed()
        : BigNumber(stakedBalancerAmounts[address]).toFixed();
    });
  }

  // V2 TVLs
  if (block >= 11360925) {
    await getV2Reserves(block)
    var v2Tvl = await getV2Tvl(block);
    v2Tvl.map(function data {
      if (balances[data.underlying]) {
        balances[data.underlying] = BigNumber(balances[data.underlying])
          .plus(data.balance)
          .toFixed();
      } else {
        balances[data.underlying] = data.balance;
      }
    })
  }

    return balances;
  }

/*==================================================
  Rates
  ==================================================*/

async function rates(timestamp, block) {
  await getV1Reserves(block)
  var aaveReservesWithEth = aaveReserves
  aaveReservesWithEth.push({
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    symbol: "ETH",
    decimals: 18,
  });

  var ratesV1 = await _multiMarketV1Rates(aaveLendingPool, aaveReserves, block)
  var ratesV2 = {
    lend: []
  };

  if (block >= 11360925) {
    await getV2Reserves(block)
    ratesV2 = await getV2Rates(block)
  }

  if (Object.keys(ratesV2.lend).length > 0) {
    return {
      lend: { ...ratesV1.lend, ...ratesV2.lend },
      borrow: { ...ratesV1.borrow, ...ratesV2.borrow },
      borrow_stable: { ...ratesV1.borrow_stable, ...ratesV2.borrow_stable },
      supply: { ...ratesV1.supply, ...ratesV2.supply },
      supply_stable: { ...ratesV1.supply_stable, ...ratesV2.supply_stable },
    };
  } else {
    return ratesV1
  }
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: "Aave",
  website: "https://aave.com",
  token: "AAVE",
  category: "Lending",
  start: 1578555200, // 01/07/2020 @ 12:00am (UTC)
  tvl,
  rates,
  term: "1 block",
  variability: "medium",
  // chain: 'Multichain,Ethereum-Polygon'
};
