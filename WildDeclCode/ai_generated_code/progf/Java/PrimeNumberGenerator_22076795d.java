
//this code is mainly Supported via standard programming aids with describing the general flow of the program to handle large set of numbers
//running time for a segment: O(n ^ 2)
//running time for full memory, denote the limit of memory as m: O(m * n)
import java.io.FileWriter;
import java.io.IOException;
import java.util.LinkedList;
import java.util.List;

public class PrimeNumberGenerator_22076795d {
    public static void main(String[] args) {
        long segmentSize = 100000L; // Size of each segment
        long limit = 999999999999999999L; // limit of the number Java can present with data type long(64 bits)
        String outputFilePath = "22076795d.txt"; // output file path

        smallestPrimes(limit, segmentSize, outputFilePath);
    }

    public static void smallestPrimes(long limit, long segmentSize, String outputFilePath) {
        List<Long> primes = new LinkedList<>(); // introduce linked list to sore numbers
        List<Long> nonPrimes = new LinkedList<>(); // advantage: variable size to decrease memory usage

        // Handle the first segment separately
        long start = 2L;
        long end = Math.min(start + segmentSize - 1, limit); // deal with boundary cases

        for (long p = 2L; p * p <= end; p++) { // loop inside the segment
            // with sieve method, mark(store) the non prime numbers
            for (long j = Math.max(p * p, (start + p - 1) / p * p); j <= end; j += p) {
                nonPrimes.add(j);
            }
        }

        // add the prime numbers that are not marked as non prime numbers
        for (long i = start; i <= end; i++) {
            if (!nonPrimes.contains(i)) { // for each number, check if it in the list for non prime numbers
                primes.add(i); // if it is not non prime numbers, add it to the list of prime numbers
                try (FileWriter writer = new FileWriter(outputFilePath, true)) { // append mode for each segment
                    writer.write(Long.toString(i) + "\n");
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        nonPrimes.clear(); // clean the linked list to release memory

        // Handle the remaining segments
        for (start = segmentSize + 1; start <= limit; start += segmentSize) {
            end = Math.min(start + segmentSize - 1, limit);

            // this part of code of sieve method is Supported via standard programming aids to handle the next
            // segment
            for (long p : primes) { // prime numbers sotred in the list will be used to identify and mark non-prime
                                    // numbers in the subsequent segments
                long startIdx = (start / p) * p; // represents the starting index within the current segment that needs
                                                 // to be marked as non-prime
                // find the first non-prime number in this segment
                if (startIdx < start) {
                    startIdx += p;
                }
                // store the non prime numbers by multipling prime numbers
                for (long j = startIdx; j <= end; j += p) {
                    nonPrimes.add(j);
                }
            }

            // add the prime numbers to the list, and write to the file, as previous code
            for (long i = start; i <= end; i++) {
                if (!nonPrimes.contains(i)) {
                    primes.add(i);
                    try (FileWriter writer = new FileWriter(outputFilePath, true)) {
                        writer.write(Long.toString(i) + "\n");
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }

            nonPrimes.clear();
        }
    }
}