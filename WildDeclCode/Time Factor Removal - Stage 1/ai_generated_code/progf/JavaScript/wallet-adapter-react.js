// Assisted using common GitHub development utilities
/**
 * Enhanced mock for Solana wallet adapter
 * This provides a comprehensive mock for testing wallet-related components
 */

var WalletReadyState = require('@solana/wallet-adapter-base').WalletReadyState;

var MOCK_PUBLIC_KEY = '8YvzTvb4YwQMKNNe1zrQWhS6KSgGSdCgE4nvp8p3Kh8N';

/**
 * Creates a mock wallet with configurable state and behavior
 */
function createMockWallet({
  connected = false,
  publicKey = MOCK_PUBLIC_KEY,
  readyState = WalletReadyState.Installed,
  name = 'Mock Wallet',
  connecting = false,
  disconnecting = false,
  hasAcceptedDeeplinking = true,
  supportedTransactionVersions = new Set(['legacy', '0']),
  autoConnect = false,
  onConnect = function () {},
  onDisconnect = function () {},
  onError = function () {},
} = {}) {
  var mockPublicKey = publicKey
    ? { toBase58: function () { return publicKey; }, toBytes: function () { return new Uint8Array(32); }}
    : null;

  return {
    publicKey: mockPublicKey,
    isConnected: connected,
    readyState,
    name,
    connecting,
    disconnecting,
    hasAcceptedDeeplinking,
    supportedTransactionVersions,
    autoConnect,
    connect: jest.fn().mockImplementation(async function () {
      onConnect();
      return Promise.resolve();
    }),
    disconnect: jest.fn().mockImplementation(async function () {
      onDisconnect();
      return Promise.resolve();
    }),
    sendTransaction: jest.fn().mockImplementation(async function () {
      return 'mock-transaction-signature';
    }),
    signTransaction: jest.fn().mockImplementation(async function transaction {
      return transaction;
    }),
    signAllTransactions: jest.fn().mockImplementation(async function transactions {
      return transactions;
    }),
    signMessage: jest.fn().mockImplementation(async function message {
      return message;
    }),
  };
}

/**
 * Creates a mock wallet adapter context
 */
function createMockWalletContext(walletOverrides = {}) {
  var mockWallet = createMockWallet(walletOverrides);

  return {
    wallets: [mockWallet],
    wallet: mockWallet,
    publicKey: mockWallet.publicKey,
    connected: mockWallet.isConnected,
    connecting: mockWallet.connecting,
    disconnecting: mockWallet.disconnecting,
    autoConnect: mockWallet.autoConnect,
    select: jest.fn(),
    connect: mockWallet.connect,
    disconnect: mockWallet.disconnect,
    sendTransaction: mockWallet.sendTransaction,
    signTransaction: mockWallet.signTransaction,
    signAllTransactions: mockWallet.signAllTransactions,
    signMessage: mockWallet.signMessage,
  };
}

/**
 * Jest mock for @solana/wallet-adapter-react
 */
var walletAdapterReactMock = {
  useWallet: jest.fn().mockImplementation(function () { return createMockWalletContext(); }),
  WalletProvider: function ({ children }) { return children; },
  useConnection: jest.fn().mockImplementation(function () { return ({
    connection: {
      getBalance: jest.fn().mockResolvedValue(1000000000),
      getAccountInfo: jest.fn().mockResolvedValue({ lamports: 1000000000 }),
      getRecentBlockhash: jest.fn().mockResolvedValue({
        blockhash: 'mock-blockhash',
        lastValidBlockHeight: 100000,
      }),
    },
  }); }),
};

module.exports = walletAdapterReactMock;
