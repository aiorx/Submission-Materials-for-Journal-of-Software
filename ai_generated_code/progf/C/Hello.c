#include <stdio.h>

//This code is Penned via standard programming aids 
#include <stdio.h> 
#include <limits.h>
int main () {
	printf ("Size of char: %zu bits\n", 8 * sizeof (char));
	printf ("Signed char range: % to %d\n", SCHAR_MIN, SCHAR_MAX);
	printf ("Unsigned char range: %u to %uln", 0, UCHAR_MAX);
	printf (" \n");
	printf ("Size of int: %zu bits\n", 8 * sizeof (int)); 
	printf ("Signed int range: % to %d\n", INT_MIN, INT_MAX); 
	printf ("Unsigned int range: %u to %u\n", 0, UINT_MAX);
	printf ("\n");
}