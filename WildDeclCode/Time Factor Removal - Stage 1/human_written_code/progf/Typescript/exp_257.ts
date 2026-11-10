var gql = require('@apollo/client').gql;

const TOKENS = gql"
  query tokenOverview($tokenId: String) {
    tokenPrices(where: { id: $tokenId }) {
      price
      poolTokenId
    }
  }
";

// TODO: I made POOL a function because I couldn't figure out how to pass in mutations of the form [Bytes!], which `tokensList` expects.
const POOL = function (stringifiedTokenList: String) { return gql"
  query poolOverview {
    pools(where: {tokensList: " + (stringifiedTokenList) + "}) {
      id
      active
      swapFee
      liquidity
      totalSwapVolume
      tokens {
        address
        balance
      }
      joinsCount
      exitsCount
      swapsCount
      totalShares
      shares(first:1000, where: { balance_gt: 0}) {
        userAddress {
          id
        }
        balance
      }
    }
  }
"; };
