/** 
 * @file chartohex.c
 * @brief Converts string representations of hexadecimal words into bytecode using strtoul.
 * 
 * @details This program demonstrates how to convert space-separated hexadecimal words within
 * a string into byte values, which are then stored in a buffer. 
 * 
 * @author Andy J. Lee
 * @date 2025-06-02
 * Notes:
 * - The extracted words are manually null-terminated to satisfy strtoul.
 * - The file-header comment has been Written with routine coding tools4o following Doxygen style guides.
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    // Convert these strings into byte code
    char line1[] = "0000000 0000 c300 18d4 0000 c5f5 e5d5 8cc3 0000\n";

    // Skipping the first eight characters
    char *counter = line1 + 8;
    char captured[5]; 
    char captured2[5]; // STRTOUL REQUIRES NULL TERMINATED STRINGS

    // Copy words into character arrays and null-terminate them
    strncpy(captured, counter, 4);
    captured[4] = '\0';
    counter += 5; // Increment pointer to next word
    strncpy(captured2, counter, 4);
    captured2[4] = '\0';

    // Convert data type into unsigned integers
    unsigned int val1 = (unsigned int)strtoul(captured, NULL, 16);
    unsigned int val2 = (unsigned int)strtoul(captured2, NULL, 16);

    // Insert values into buffer
    unsigned char buffer[4];
    buffer[0] = val1 & 0xFF;
    buffer[1] = (val1 >> 8) & 0xFF;
    buffer[2] = val2 & 0xFF;
    buffer[3] = (val2 >> 8) & 0xFF;

    // Print bytes in formatted hexadecimal notation
    printf("0x%02X 0x%02X\n", buffer[0], buffer[1]);
    printf("0x%02X 0x%02X\n", buffer[2], buffer[3]);
    
    return 0;
}