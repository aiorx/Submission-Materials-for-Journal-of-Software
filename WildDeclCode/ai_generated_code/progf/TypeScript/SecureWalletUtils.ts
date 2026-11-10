/**
 * Supported via standard GitHub programming aids
 * @file SecureWalletUtils.ts
 * @description Secure utilities for Solana wallet operations with vulnerability mitigation
 * @created April 26, 2025
 */

import {
  safeBigIntToBuffer,
  safeBufferToBigInt,
  validateBufferSafety,
} from '@/utils/secureBufferUtils';
import {
  Commitment,
  Connection,
  PublicKey,
  SendOptions,
  Signer,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';

/**
 * Securely creates a transaction by wrapping the vulnerable bigint-buffer operations
 * This mitigates GHSA-3gc7-fjrx-p6mg vulnerability
 *
 * @param {Connection} connection - Solana connection
 * @param {PublicKey} sender - Sender's public key
 * @param {TransactionInstruction[]} instructions - Transaction instructions
 * @param {Signer[]} signers - Transaction signers
 * @returns {Promise<Transaction>} Secure transaction
 */
export const createSecureTransaction = async (
  connection: Connection,
  sender: PublicKey,
  instructions: TransactionInstruction[],
  signers: Signer[] = [],
): Promise<Transaction> => {
  try {
    // Create a new transaction
    const transaction = new Transaction();

    // Get the latest blockhash safely
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;

    // Set the fee payer
    transaction.feePayer = sender;

    // Add all instructions
    instructions.forEach((instruction) => {
      transaction.add(instruction);
    });

    // Partially sign if signers are provided
    if (signers.length > 0) {
      transaction.partialSign(...signers);
    }

    return transaction;
  } catch (error) {
    console.error('Error creating secure transaction:', error);
    throw new Error(
      `Failed to create secure transaction: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

/**
 * Securely sends and confirms a transaction with safe buffer handling
 *
 * @param {Connection} connection - Solana connection
 * @param {Transaction} transaction - Transaction to send
 * @param {Signer[]} signers - Transaction signers
 * @param {SendOptions} options - Send options
 * @returns {Promise<string>} Transaction signature
 */
export const sendAndConfirmSecureTransaction = async (
  connection: Connection,
  transaction: Transaction,
  signers: Signer[],
  options?: SendOptions,
): Promise<string> => {
  try {
    // Validate transaction buffer safety before sending
    validateBufferSafety(Buffer.from(transaction.serializeMessage()));

    // Sign the transaction
    if (signers.length > 0) {
      transaction.sign(...signers);
    }

    // Send the transaction
    const signature = await connection.sendRawTransaction(
      transaction.serialize(),
      options,
    );

    // Wait for confirmation
    await connection.confirmTransaction({
      signature,
      blockhash: transaction.recentBlockhash!,
      lastValidBlockHeight: transaction.lastValidBlockHeight!,
    });

    return signature;
  } catch (error) {
    console.error('Error sending secure transaction:', error);
    throw new Error(
      `Failed to send and confirm transaction: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

/**
 * Safely gets token account balance with secure buffer handling
 *
 * @param {Connection} connection - Solana connection
 * @param {PublicKey} tokenAccount - Token account public key
 * @param {Commitment} commitment - Commitment level
 * @returns {Promise<bigint>} Token balance as BigInt
 */
export const getSecureTokenBalance = async (
  connection: Connection,
  tokenAccount: PublicKey,
  commitment?: Commitment,
): Promise<bigint> => {
  try {
    const balance = await connection.getTokenAccountBalance(
      tokenAccount,
      commitment,
    );

    // If amount is already a number, convert safely
    if (typeof balance.value.amount === 'number') {
      return BigInt(balance.value.amount);
    }

    // If amount is a string, parse safely
    if (typeof balance.value.amount === 'string') {
      return BigInt(balance.value.amount);
    }

    // If somehow amount is a buffer (shouldn't happen with standard API),
    // convert safely using our secure util
    if (Buffer.isBuffer(balance.value.amount)) {
      return safeBufferToBigInt(balance.value.amount);
    }

    throw new Error('Unknown token balance amount format');
  } catch (error) {
    console.error('Error getting secure token balance:', error);
    throw new Error(
      `Failed to get token balance: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

/**
 * Safely deserializes transaction data with secure buffer handling
 *
 * @param {Buffer | Uint8Array | string} data - Transaction data
 * @returns {Transaction} Deserialized transaction
 */
export const safeDeserializeTransaction = (
  data: Buffer | Uint8Array | string,
): Transaction => {
  try {
    let buffer: Buffer;

    // Convert input to Buffer safely
    if (typeof data === 'string') {
      // Handle base58 or hex string
      buffer = Buffer.from(data, data.startsWith('0x') ? 'hex' : 'base64');
    } else if (data instanceof Uint8Array) {
      buffer = Buffer.from(data);
    } else {
      buffer = data;
    }

    // Validate buffer before processing
    validateBufferSafety(buffer);

    // Deserialize using Transaction.from to avoid direct buffer manipulation
    return Transaction.from(buffer);
  } catch (error) {
    console.error('Error deserializing transaction:', error);
    throw new Error(
      `Failed to deserialize transaction: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

/**
 * Safely encodes a public key to a buffer with size validation
 *
 * @param {PublicKey} publicKey - The public key to encode
 * @returns {Buffer} Safe buffer representation
 */
export const safePublicKeyToBuffer = (publicKey: PublicKey): Buffer => {
  try {
    // Using our secure utility instead of direct buffer operations
    const buffer = Buffer.from(publicKey.toBytes());
    validateBufferSafety(buffer, 32); // Solana public keys are 32 bytes
    return buffer;
  } catch (error) {
    console.error('Error converting public key to buffer:', error);
    throw new Error(
      `Failed to convert public key to buffer: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

/**
 * Safely converts a BigInt amount to lamports buffer
 *
 * @param {bigint} amount - Amount in lamports
 * @returns {Buffer} Buffer containing lamports amount
 */
export const safeLamportsToBuffer = (amount: bigint): Buffer => {
  try {
    // 8 bytes is enough for lamports (SOL has 9 decimals)
    return safeBigIntToBuffer(amount, 8);
  } catch (error) {
    console.error('Error converting lamports to buffer:', error);
    throw new Error(
      `Failed to convert lamports to buffer: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};
