var ApolloClient = require('@apollo/client').ApolloClient;
var gql = require('@apollo/client').gql;
var InMemoryCache = require('@apollo/client').InMemoryCache;
var offsetLimitPagination = require('@apollo/client/utilities').offsetLimitPagination;
var BN = require('bn.js');
var constructN = require('ramda').constructN;
var ifElse = require('ramda').ifElse;
var isNil = require('ramda').isNil;
var viewerVar = require('./cache').viewerVar;

const asBN = ifElse(isNil, function () { return new BN(0); }, constructN(1, BN))

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT

const typeDefs = gql"
  type Viewer {
    id: ID
    balance: Number
  }

  extend type Query {
    viewer(address: String!): Viewer
  }
"

const client = new ApolloClient({
  uri: GRAPHQL_ENDPOINT,
  typeDefs,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          nfts: offsetLimitPagination(),
          viewer: {
            read() {
              return viewerVar()
            },
          },
        },
      },
      MintStats: {
        fields: {
          volume24hr: {
            read: asBN,
          },
          volumeTotal: {
            read: asBN,
          },
          average: {
            read: asBN,
          },
          floor: {
            read: asBN,
          },
        },
      },
      PricePoint: {
        fields: {
          price: {
            read: asBN,
          },
        },
      },
      StoreCreator: {
        keyFields: ['creatorAddress', 'storeConfigAddress'],
      },
      Marketplace: {
        keyFields: ['ownerAddress'],
      },
      Nft: {
        keyFields: ['address'],
      },
      Wallet: {
        keyFields: ['address'],
      },
      Creator: {
        keyFields: ['address'],
      },
      NftCreator: {
        keyFields: ['address'],
      },
      NftOwner: {
        keyFields: ['address'],
      },
      Purchase: {
        keyFields: ['id'],
        fields: {
          price: {
            read: asBN,
          },
        },
      },
      AhListing: {
        keyFields: ['id'],
        fields: {
          price: {
            read: asBN,
          },
        },
      },
      NftActivity: {
        keyFields: ['id'],
        fields: {
          price: {
            read: asBN,
          },
        },
      },
      Offer: {
        keyFields: ['id'],
        fields: {
          price: {
            read: asBN,
          },
        },
      },
      NftAttribute: {
        keyFields: ['traitType', 'value'],
      },
    },
  }),
})

module.exports = client;
