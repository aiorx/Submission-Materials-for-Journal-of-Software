// I got the answer Referenced via basic programming materials
#include <stdio.h>
#include <limits.h>

int main() {
    // Using standard headers
    printf("Ranges of signed types from standard headers:\n");
    printf("char: %d to %d\n", CHAR_MIN, CHAR_MAX);
    printf("short: %d to %d\n", SHRT_MIN, SHRT_MAX);
    printf("int: %d to %d\n", INT_MIN, INT_MAX);
    printf("long: %ld to %ld\n", LONG_MIN, LONG_MAX);

    printf("\nRanges of unsigned types from standard headers:\n");
    printf("unsigned char: 0 to %u\n", UCHAR_MAX);
    printf("unsigned short: 0 to %u\n", USHRT_MAX);
    printf("unsigned int: 0 to %u\n", UINT_MAX);
    printf("unsigned long: 0 to %lu\n", ULONG_MAX);

    // Direct computation
    printf("\nRanges of signed types by direct computation:\n");
    printf("char: %d to %d\n", -(char)((unsigned char)~0 >> 1) - 1, (char)((unsigned char)~0 >> 1));
    printf("short: %d to %d\n", -(short)((unsigned short)~0 >> 1) - 1, (short)((unsigned short)~0 >> 1));
    printf("int: %d to %d\n", -(int)((unsigned int)~0 >> 1) - 1, (int)((unsigned int)~0 >> 1));
    printf("long: %ld to %ld\n", -(long)((unsigned long)~0 >> 1) - 1, (long)((unsigned long)~0 >> 1));

    printf("\nRanges of unsigned types by direct computation:\n");
    printf("unsigned char: 0 to %u\n", (unsigned char)~0);
    printf("unsigned short: 0 to %u\n", (unsigned short)~0);
    printf("unsigned int: 0 to %u\n", (unsigned int)~0);
    printf("unsigned long: 0 to %lu\n", (unsigned long)~0);

    return 0;
}
