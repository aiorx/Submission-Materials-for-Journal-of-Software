package org.ztuit.rsa;

public class Euclidean {

    /**
     * Aided with basic GitHub coding tools and suffers from the negative sign issue
     * @param a
     * @param b
     * @return
     */
    public static long[] extendedGCD(long a, long b) {
        if (b == 0) {
            return new long[] {a, 1, 0};
        } else {
            long[] result = extendedGCD(b, a % b);
            long gcd = result[0];
            long x = result[2];
            long y = result[1] - (a / b) * result[2];
            return new long[] {gcd, x, y};
        }
    }
}
