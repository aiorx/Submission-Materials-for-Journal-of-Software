var IRemmeKeys = require('remme-keys').IRemmeKeys;
var ECDSA = require('remme-keys').ECDSA;
/**
 * Account that is used for signing transactions and storing public keys which he was signed.
 * @example
 * ```typescript
 * var account = new RemmeAccount("ac124700cc4325cc2a78b22b9acb039d9efe859ef673b871d55d1078391934f9");
 * console.log(account.privateKeyHex); // "ac124700cc4325cc2a78b22b9acb039d9efe859ef673b871d55d1078391934f9";
 *
 * var anotherAccount = new RemmeAccount();
 * console.log(anotherAccount.privateKeyHex); // "b5167700cc4325cc2a78b22b9acb039d9efe859ef673b871d55d10783919129f";
 *
 * var data = "some data";
 * var signedData = account.sign(data);
 *
 * var isVerify = account.verify(signedData, data);
 * console.log(isVerify); // true
 *
 * var isVerifyInAnotherAccount = anotherAccount.verify(signedData, data);
 * console.log(isVerifyInAnotherAccount); // false
 * ```
 */
declare class RemmeAccount extends ECDSA implements IRemmeKeys {
    [key: string]: any;
    /**
     * Get or generate private key, create signer by using private key,
     * generate public key from private key and generate account address by using public key and family name
     * (https://docs.remme.io/remme-core/docs/family-account.html#addressing)
     * @example
     * Get private key;
     * ```typescript
     * var account = new RemmeAccount("ac124700cc4325cc2a78b22b9acb039d9efe859ef673b871d55d1078391934f9");
     * console.log(account.privateKeyHex); // "ac124700cc4325cc2a78b22b9acb039d9efe859ef673b871d55d1078391934f9";
     * ```
     *
     * Generate new private key;
     * ```typescript
     * var account = new RemmeAccount();
     * console.log(account.privateKeyHex); // "b5167700cc4325cc2a78b22b9acb039d9efe859ef673b871d55d10783919129f";
     * ```
     * @param {string} privateKeyHex
     */
    constructor(privateKeyHex?: string);
}
module.exports.RemmeAccount = RemmeAccount;
module.exports.IRemmeKeys = IRemmeKeys;
module.exports.as = as;
module.exports.IRemmeAccount = IRemmeAccount;
