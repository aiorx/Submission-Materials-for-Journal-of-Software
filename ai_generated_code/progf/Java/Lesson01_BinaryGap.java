package com.punkcity.codility;

/**
 * PROBLEM STATEMENT: BinaryGap: Find longest sequence of zeros in binary representation of an integer.
 *
 * A binary gap within a positive integer N is any maximal sequence of consecutive zeros that is surrounded by ones at
 * both ends in the binary representation of N.
 *  For example, number 9 has binary representation 1001 and contains a binary gap of length 2.
 *  The number 529 has binary representation 1000010001 & contains two binary gaps: one of length 4 and one of length 3.
 *  The number 20 has binary representation 10100 and contains one binary gap of length 1.
 *  The number 15 has binary representation 1111 and has no binary gaps.
 *  The number 32 has binary representation 100000 and has no binary gaps.
 * Write a function:
 *      class Solution { public int solution(int N); }
 * that, given a positive integer N, returns the length of its longest binary gap.
 * The function should return 0 if N doesn't contain a binary gap.
 * For example, given N = 1041 the function should return 5, because N has binary representation 10000010001 and so its
 * longest binary gap is of length 5. Given N = 32 the function should return 0, because N has binary
 * representation '100000' and thus no binary gaps.
 *
 * Write an efficient algorithm for the following assumptions:
 *  N is an integer within the range [1..2,147,483,647].
 */
public class Lesson01_BinaryGap {

    /**
     * This is the default constructor for the class.
     */
    public Lesson01_BinaryGap() {
        super();
    }

    /**
     * Run ALL the "in-built" tests for the BinaryGap problem - COMPARING the 2 approaches.
     */
    public void runTestsForBinaryGap() {
        System.out.println("BinaryGap for 1041 (10000010001) Expected => 5" + getLargestGapCopilot(1041));
        System.out.println(String.format("Found through Bit-Shift: [%d] and using Copilot solution (%d)", getLargestGapBitShift(1041), getLargestGapCopilot(1041)));

        System.out.println("BinaryGap for 9 (1001) Expected 2");
        System.out.println(String.format("Found through Bit-Shift: [%d] and using Copilot solution (%d)", getLargestGapBitShift(9), getLargestGapCopilot(9)));

        System.out.println("BinaryGap for 529 (1000010001) Expected 4");
        System.out.println(String.format("Found through Bit-Shift: [%d] and using Copilot solution (%d)", getLargestGapBitShift(529), getLargestGapCopilot(529)));

        System.out.println("BinaryGap for 20 (10100) Expected 1");
        System.out.println(String.format("Found through Bit-Shift: [%d] and using Copilot solution (%d)", getLargestGapBitShift(20), getLargestGapCopilot(20)));

        System.out.println("BinaryGap for 15 (1111) Expected 0");
        System.out.println(String.format("Found through Bit-Shift: [%d] and using Copilot solution (%d)", getLargestGapBitShift(15), getLargestGapCopilot(15)));

        System.out.println("BinaryGap for 32 (100000) - Expected 0");
        System.out.println(String.format("Found through Bit-Shift: [%d] and using Copilot solution (%d)", getLargestGapBitShift(32), getLargestGapCopilot(32)));

        comparePerformance();
    }

    /**
     * This method compares the performance of the 2 approaches for finding the largest gap in the binary representation
     * of a number.
     */
    public void comparePerformance() {
        int executions = 10000000;
        long startTime = System.currentTimeMillis();
        for(int i=0; i<executions; i++) {
            getLargestGapBitShift(1041);
        }
        System.out.println("For 10 Million executions, Time taken by Bit-Shift: " + (System.currentTimeMillis() - startTime) + " millis");

        startTime = System.currentTimeMillis();
        for(int i=0; i<executions; i++) {
            getLargestGapCopilot(1041);
        }
        System.out.println("For 10 Million executions, Time taken by Copilot: " + (System.currentTimeMillis() - startTime) + " millis");
    }
    /**
     * This method calculates the largest gap in the binary representation of a number using bit-shift.
     * @param number The number for which the largest gap is to be calculated.
     * @return The largest gap in the binary representation of the number.
     */
    public static int getLargestGapBitShift(int number) {
        int max = 0;
        int theGap = 0;
        boolean processing = false;

        while (number != 0) {
            if((number & 1) == 1) {
                if (processing) {
                    //We had previously found a 1 and were calculating a gap
                    max = Math.max(max, theGap);
                    //Reset the gap
                    theGap = 0;
                } else {
                    //Potential begin of a new Gap. Initialize flag
                    processing = true;
                }
            } else {
                if (processing) {
                    theGap++;
                }
            }
            number >>= 1;
        }
        return max;
    }

    /**
     * This method was Auto-Generated Supported by standard GitHub tools for calculating the largest gap in the binary representation
     * It does use the similar concept as bit-shift but does it by finding modulus of 2.
     * @param N The number for which the largest gap is to be calculated.
     * @return The largest gap in the binary representation of the number.
     */
    public static int getLargestGapCopilot(int N) {
        int maxGap = 0;
        int currentGap = 0;
        boolean isCounting = false;
        while (N > 0) {
            if (N % 2 == 0) {
                if (isCounting) {
                    currentGap++;
                }
            } else {
                if (isCounting) {
                    maxGap = Math.max(maxGap, currentGap);
                    currentGap = 0;
                } else {
                    isCounting = true;
                }
            }
            N = N / 2;
        }
        return maxGap;
    }
}
