/**
 * Assisted using common GitHub development utilities
 * Type definitions for Solana wallet adapters
 * @file SolanaWallets.ts
 * @description Type definitions for Solana wallet adapters
 * This file contains type definitions for various Solana wallet providers
 * that can be integrated with web applications.
 * Solana is a high-performance blockchain platform optimized for decentralized applications
 * and fast transactions. This file contains type definitions for various Solana wallet
 * providers that can be integrated with web applications.
 *
 * @see https://solana.com - Official Solana blockchain website
 * @see https://docs.solana.com/wallet-guide - Solana wallet documentation
 */

// Declare the module for TypeScript recognition
declare global {
  /**
   * Base interface for all Solana blockchain wallet providers
   */
  interface SolanaWallet {
    publicKey: import('@solana/web3.js').PublicKey | null;
    isConnected: boolean;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    signTransaction: <
      T extends
        | import('@solana/web3.js').Transaction
        | import('@solana/web3.js').VersionedTransaction,
    >(
      transaction: T,
    ) => Promise<T>;
    signAllTransactions: <
      T extends
        | import('@solana/web3.js').Transaction
        | import('@solana/web3.js').VersionedTransaction,
    >(
      transactions: T[],
    ) => Promise<T[]>;
    signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
    sendTransaction: <
      T extends
        | import('@solana/web3.js').Transaction
        | import('@solana/web3.js').VersionedTransaction,
    >(
      transaction: T,
      connection: import('@solana/web3.js').Connection,
      options?: import('@solana/web3.js').SendOptions,
    ) => Promise<string>;
  }

  /**
   * Phantom is a popular Solana wallet extension for browsers
   * @see https://phantom.app
   */
  interface PhantomWallet extends SolanaWallet {
    isPhantom: true;
  }

  /**
   * Solflare is a Solana wallet available as browser extension and mobile app
   * @see https://solflare.com
   */
  interface SolflareWallet extends SolanaWallet {
    isSolflare: true;
  }

  /**
   * Backpack is a multi-chain wallet with support for Solana
   * @see https://backpack.app
   */
  interface BackpackWallet extends SolanaWallet {
    isBackpack: true;
  }

  /**
   * Sollet is a web-based wallet for Solana
   * One of the earlier wallets in the Solana ecosystem
   * @see https://www.sollet.io
   */
  interface SolletWallet extends SolanaWallet {
    isSollet: true;
  }

  /**
   * Glow is a mobile wallet for Solana with built-in DeFi features
   * @see https://glow.app
   */
  interface GlowWallet extends SolanaWallet {
    isGlow: true;
  }

  /**
   * Slope is a wallet for Solana with mobile and extension support
   * @see https://slope.finance
   */
  interface SlopeWallet extends SolanaWallet {
    isSlope: true;
  }

  /**
   * Common interface for wallet detection flags
   */
  interface WalletDetectionFlags {
    isPhantom?: boolean;
    isSolflare?: boolean;
    isBackpack?: boolean;
    isSollet?: boolean;
    isGlow?: boolean;
    isSlope?: boolean;
    isCoin98?: boolean;
    isMathWallet?: boolean;
    isBrave?: boolean;
    isExodus?: boolean;
  }

  // Extend the Window interface
  interface Window {
    solana?: (
      | PhantomWallet
      | SolflareWallet
      | SolletWallet
      | GlowWallet
      | SlopeWallet
    ) &
      Partial<WalletDetectionFlags>;
    backpack?: BackpackWallet;
    glow?: GlowWallet;
  }
}

// Export an empty object to make this a module
export {};
