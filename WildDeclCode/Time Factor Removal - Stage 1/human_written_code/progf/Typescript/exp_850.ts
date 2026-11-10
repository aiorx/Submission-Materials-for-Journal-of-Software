var Address = require('@entropy1729/aleo-sdk').Address;
var PrivateKey = require('@entropy1729/aleo-sdk').PrivateKey;
var Signature = require('@entropy1729/aleo-sdk').Signature;
var ViewKey = require('@entropy1729/aleo-sdk').ViewKey;

interface AccountParam {
  privateKey?: string;
  seed?: Uint8Array;
}
/**
 * Class that represents an Aleo Account with a PrivateKey, from which an Address and a ViewKey derive.
 * Can be created with an existing private key, a seed or simply be randomly generated.
 * A seed consists of 32 bytes.
 * @example
 * var myRandomAccount = new Account();
 * var seed = 'ce8b23470222bdee5f894ee77b607391';
 * var arr = Uint8Array.from(seed)
 * var mySeededAccount = new Account({seed: 'ce8b23470222bdee5f894ee77b607391'});
 * var myExistingAccount = new Account({privateKey: 'myExistingPrivateKey'})
 */
class Account {
  pk: PrivateKey;
  vk: ViewKey;
  adr: Address;

  constructor(params: AccountParam = {}) {
    try {
      this.pk = this.privateKeyFromParams(params);
    } catch (e) {
      console.error("Wrong parameter", e);
      throw new Error("Wrong Parameter");
    }
    this.vk = ViewKey.from_private_key(this.pk);
    this.adr = Address.from_private_key(this.pk);
  }
  private privateKeyFromParams(params: AccountParam) {
    if (params.seed) {
      return PrivateKey.from_seed_unchecked(params.seed);
    }
    if (params.privateKey) {
      return PrivateKey.from_string(params.privateKey);
    }
    return new PrivateKey();
  }

  keys() {
    return {
      Address: this.adr.to_string(),
      ViewKey: this.vk.to_string(),
      PrivateKey: this.pk.to_string(),
    };
  }

  privateKey() {
    return this.pk;
  }

  viewKey() {
    return this.vk;
  }

  address() {
    return this.adr;
  }

  /**
   * Decrypts a Record given a ciphertext.
   * @param {string} ciphertext
   * @returns {Record}
   *
   * @example
   * var account = new Account();
   * var record = account.decryptRecord("record1...");
   */
  decryptRecord(ciphertext: string) {
    return this.vk.decrypt(ciphertext);
  }

  /**
   * Decrypts a set of Records given an array of ciphertexts.
   * @param {string[]} ciphertexts
   * @returns {Record[]}
   *
   * @example
   * var account = new Account();
   * var record = account.decryptRecords(["record1...", "record2..."]);
   */
  decryptRecords(ciphertexts: string[]) {
    return ciphertexts.map(function (ciphertext) { return this.vk.decrypt(ciphertext); });
  }

  /**
   * Signs a message with the account's private key.
   * Returns a Signature.
   *
   * @param {Uint8Array} message
   * @returns {Signature}
   *
   * @example
   * var account = new Account();
   * account.sign("a message");
   */
  sign(message: Uint8Array) {
    return this.pk.sign(message);
  }

  /**
   * Verifies the Signature on a message.
   *
   * @param {Uint8Array} message
   * @param {Signature} signature
   * @returns {boolean}
   *
   * @example
   * var account = new Account();
   * var message = "a message";
   * var signature = account.sign(message);
   * account.verify(message, signature);
   */
  verify(message: Uint8Array, signature: Signature) {
    return this.adr.verify(message, signature);
  }
}
