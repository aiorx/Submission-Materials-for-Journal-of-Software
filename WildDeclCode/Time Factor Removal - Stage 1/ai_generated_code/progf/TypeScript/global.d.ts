// Final adjustment to resolve Prettier issue
// Assisted using common GitHub development utilities
// Extend the Window interface to include the `solana` property
declare global {
  interface Window {
    solana?: {
      connect: function () { return Promise<{ publicKey: { toString: () => string } }>; };
    };
    // Extend the Window interface to include the `ethereum` property
    ethereum?: {
      request: function (args: { method: string }) { return Promise<string[]>; };
    };
  }
}

