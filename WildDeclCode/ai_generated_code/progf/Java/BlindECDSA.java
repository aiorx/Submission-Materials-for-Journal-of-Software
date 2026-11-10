// code Aided with basic GitHub coding tools
package com.example;
import java.math.BigInteger;
import java.security.*;
import java.security.spec.*;
import java.security.interfaces.ECPublicKey;
import java.util.Random;


public class BlindECDSA {
    private final ECParameterSpec ecSpec;
    private final SecureRandom random;

    public BlindECDSA() throws Exception {
        // Initialize secp256k1 curve
        ECGenParameterSpec ecGenSpec = new ECGenParameterSpec("secp256k1");
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("EC");
        keyGen.initialize(ecGenSpec);
        KeyPair tempPair = keyGen.generateKeyPair();
        ECPublicKey tempPub = (ECPublicKey) tempPair.getPublic();
        this.ecSpec = tempPub.getParams();
        this.random = new SecureRandom();
    }

    public Keys generateKeyPair() throws Exception {
        BigInteger n = ecSpec.getOrder();
        BigInteger privateKey = new BigInteger(n.bitLength(), random).mod(n);
        ECPoint publicKey = doubleAndAdd(ecSpec.getGenerator(), privateKey);
        return new Keys(privateKey, publicKey);
    }

    public BlindingResult blindMessage(byte[] message, ECPoint Q) throws Exception {
        BigInteger n = ecSpec.getOrder();
        BigInteger alpha = new BigInteger(n.bitLength(), random).mod(n);
        BigInteger beta = new BigInteger(n.bitLength(), random).mod(n);
        
        // R' = αG + βQ
        ECPoint alphaPt = doubleAndAdd(ecSpec.getGenerator(), alpha);
        ECPoint betaPt = doubleAndAdd(Q, beta);
        ECPoint RPrime = addPoints(alphaPt, betaPt);
        
        // m' = αm + βx(R')
        BigInteger m = hashMessage(message);
        BigInteger mPrime = alpha.multiply(m).add(beta.multiply(RPrime.getAffineX())).mod(n);
        
        return new BlindingResult(mPrime, alpha, beta, RPrime);
    }

    public BigInteger signBlinded(BigInteger mPrime, BigInteger privateKey) {
        BigInteger n = ecSpec.getOrder();
        BigInteger k = new BigInteger(n.bitLength(), random).mod(n);
        ECPoint R = doubleAndAdd(ecSpec.getGenerator(), k);
        BigInteger r = R.getAffineX().mod(n);
        
        // s' = k^(-1)(m' + rx)
        return k.modInverse(n).multiply(mPrime.add(r.multiply(privateKey))).mod(n);
    }

    public Signature unblindSignature(BigInteger sPrime, BigInteger alpha, BigInteger beta, ECPoint RPrime) {
        BigInteger n = ecSpec.getOrder();
        BigInteger r = RPrime.getAffineX().mod(n);
        BigInteger s = alpha.modInverse(n).multiply(sPrime.subtract(beta)).mod(n);
        return new Signature(r, s);
    }

    public boolean verify(byte[] message, Signature sig, ECPoint Q) throws Exception {
        BigInteger n = ecSpec.getOrder();
        BigInteger m = hashMessage(message);
        BigInteger sInv = sig.getS().modInverse(n);
        
        BigInteger u1 = m.multiply(sInv).mod(n);
        BigInteger u2 = sig.getR().multiply(sInv).mod(n);
        
        ECPoint point1 = doubleAndAdd(ecSpec.getGenerator(), u1);
        ECPoint point2 = doubleAndAdd(Q, u2);
        ECPoint R = addPoints(point1, point2);
        
        return R.getAffineX().mod(n).equals(sig.getR());
    }

    private BigInteger hashMessage(byte[] message) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(message);
        return new BigInteger(1, hash).mod(ecSpec.getOrder());
    }

    private ECPoint doubleAndAdd(ECPoint P, BigInteger k) {
        // Point multiplication implementation
        ECPoint result = ECPoint.POINT_INFINITY;
        ECPoint temp = P;
        
        for (int i = 0; i < k.bitLength(); i++) {
            if (k.testBit(i)) {
                result = addPoints(result, temp);
            }
            temp = doublePoint(temp);
        }
        return result;
    }

    private ECPoint addPoints(ECPoint P, ECPoint Q) {
        // Point addition implementation
        if (P.equals(ECPoint.POINT_INFINITY)) return Q;
        if (Q.equals(ECPoint.POINT_INFINITY)) return P;
        
        BigInteger x1 = P.getAffineX();
        BigInteger y1 = P.getAffineY();
        BigInteger x2 = Q.getAffineX();
        BigInteger y2 = Q.getAffineY();
        
        if (x1.equals(x2) && y1.equals(y2)) {
            return doublePoint(P);
        }
        
        BigInteger p = ((ECFieldFp)ecSpec.getCurve().getField()).getP();
        BigInteger slope = y2.subtract(y1).multiply(x2.subtract(x1).modInverse(p)).mod(p);
        
        BigInteger x3 = slope.multiply(slope).subtract(x1).subtract(x2).mod(p);
        BigInteger y3 = slope.multiply(x1.subtract(x3)).subtract(y1).mod(p);
        
        return new ECPoint(x3, y3);
    }

    private ECPoint doublePoint(ECPoint P) {
        // Point doubling implementation
        if (P.equals(ECPoint.POINT_INFINITY)) return P;
        
        BigInteger x1 = P.getAffineX();
        BigInteger y1 = P.getAffineY();
        BigInteger p = ((ECFieldFp)ecSpec.getCurve().getField()).getP();
        
        BigInteger slope = x1.multiply(x1).multiply(BigInteger.valueOf(3))
            .add(ecSpec.getCurve().getA())
            .multiply(y1.multiply(BigInteger.valueOf(2)).modInverse(p))
            .mod(p);
        
        BigInteger x3 = slope.multiply(slope).subtract(x1.multiply(BigInteger.valueOf(2))).mod(p);
        BigInteger y3 = slope.multiply(x1.subtract(x3)).subtract(y1).mod(p);
        
        return new ECPoint(x3, y3);
    }
    public static void main(String[] args) throws Exception {
        BlindECDSA blindEcdsa = new BlindECDSA();
        
        // Generate keypair
        Keys keys = blindEcdsa.generateKeyPair();
        
        // Message to sign
        byte[] message = "Hello, World!".getBytes();
        
        // Blind the message
        BlindECDSA.BlindingResult blind = blindEcdsa.blindMessage(message, keys.getPublicKey());
        
        // Sign blinded message
        BigInteger sPrime = blindEcdsa.signBlinded(blind.mPrime, keys.getPrivateKey());
        
        // Unblind signature
        Signature sig = blindEcdsa.unblindSignature(sPrime, blind.alpha, blind.beta, blind.RPrime);
        
        // Verify
        blindEcdsa.verify(message, sig, keys.getPublicKey());
    }

    public static class BlindingResult {
        public final BigInteger mPrime;
        public final BigInteger alpha;
        public final BigInteger beta;
        public final ECPoint RPrime;

        public BlindingResult(BigInteger mPrime, BigInteger alpha, BigInteger beta, ECPoint RPrime) {
            this.mPrime = mPrime;
            this.alpha = alpha;
            this.beta = beta;
            this.RPrime = RPrime;
        }
    }
    public class Signature {
        private final BigInteger r;
        private final BigInteger s;
    
        public Signature(BigInteger r, BigInteger s) {
            this.r = r;
            this.s = s;
        }
    
        public BigInteger getR() { return r; }
        public BigInteger getS() { return s; }
    }
    public class Keys {
        private final BigInteger privateKey;
        private final ECPoint publicKey;
    
        public Keys(BigInteger privateKey, ECPoint publicKey) {
            this.privateKey = privateKey;
            this.publicKey = publicKey;
        }
    
        public BigInteger getPrivateKey() { return privateKey; }
        public ECPoint getPublicKey() { return publicKey; }
    }
}