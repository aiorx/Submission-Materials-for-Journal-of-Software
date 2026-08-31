package com.w3itexperts.ombe.methods;

import android.util.Base64;

import java.security.Key;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

// Assisted with basic coding tools - edited by erika
public class EncryptionUtil {

    private static final String ALGORITHM = "AES";
    // 16-char secret key (IMPORTANT: must be exactly 16 characters)
    private static final String KEY = "ThisIsASecretKey";

    public static String encrypt(String data) throws Exception {
        Key key = generateKey();
        Cipher c = Cipher.getInstance(ALGORITHM);
        c.init(Cipher.ENCRYPT_MODE, key);
        byte[] encVal = c.doFinal(data.getBytes());
        return Base64.encodeToString(encVal, Base64.DEFAULT);
    }

    public static String decrypt(String encryptedData) throws Exception {
        Key key = generateKey();
        Cipher c = Cipher.getInstance(ALGORITHM);
        c.init(Cipher.DECRYPT_MODE, key);
        byte[] decodedValue = Base64.decode(encryptedData, Base64.DEFAULT);
        byte[] decValue = c.doFinal(decodedValue);
        return new String(decValue);
    }

    private static Key generateKey() {
        return new SecretKeySpec(KEY.getBytes(), ALGORITHM);
    }
}
