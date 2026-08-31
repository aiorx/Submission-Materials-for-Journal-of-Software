#include "tests.h"

// Got this Derived using common development resources by prompting "C print address without printf"
void printAddress(void* address) {
    uintptr_t addr = (uintptr_t)address;

    // Print the hexadecimal representation of the address
    fputc('0', stderr);
    fputc('x', stderr);

    // Print each hex digit
    for (int i = sizeof(void*) * 2 - 1; i >= 0; i--) {
        // Extract each hex digit
        int digit = (addr >> (i * 4)) & 0xF;

        // Convert the digit to ASCII and print it
        if (digit < 10) {
            fputc('0' + digit, stderr);
        } else {
            fputc('a' + (digit - 10), stderr);
        }
    }
}

// Got this Derived using common development resources by prompting "C print number without printf"
void printNumber(int num) {
    if (num < 0) {
        fputc('-', stderr);
        num = -num;
    }

    // Handle the case when the number is 0
    if (num == 0) {
        fputc('0', stderr);
        return;
    }

    // Recursively print each digit
    if (num / 10 != 0) {
        printNumber(num / 10);
    }

    // Print the last digit
    fputc('0' + num % 10, stderr);
  }

// Dump the va_list to stderr
// Note that we do NOT use printf, since if something is going wrong, it would likely be effected
void dumpVAList(va_list l);

// Sum n numbers
int sum(int n, ...){
    va_list l; 
    va_start(l, n);
    dumpVAList(l);


    int sum = 0;
    for(int i = 0; i < n; i++){
        sum += va_arg(l, int);
        dumpVAList(l);
    }

    va_end(l);
    return sum;
}

double sumFloats(int n, ...){
    va_list l; 
    va_start(l, n);

    dumpVAList(l);

    double sum = 0;
    for(int i = 0; i < n; i++){
        sum += va_arg(l, double);
        dumpVAList(l);
    }

    va_end(l);
    return sum;
}

// Sum a 3 dimensional Point(x,y,z) struct
Point sumPoints(int n, ...){
    va_list l; 
    va_start(l, n);

    dumpVAList(l);

    Point sum;
    for(int i = 0; i < n; i++){
        Point p = va_arg(l, Point);
        sum.x += p.x;
        sum.y += p.y; 
        sum.z += p.z;
        dumpVAList(l);
    }

    va_end(l);
    return sum;
}

// Takes a va_list as an argument and sums all ints inside
int vsum(int n, va_list l){
    dumpVAList(l);

    int sum = 0;
    for(int i = 0; i < n; i++){
        sum += va_arg(l, int);
    }

    return sum;
}

// Makes a copy of the provided va_list, then sums the numbers
int vsum_copy(int n, va_list l){
    va_list l2; 
    va_copy(l2, l);
    dumpVAList(l);
    dumpVAList(l2);

    int sum = 0;
    for(int i = 0; i < n; i++){
        sum += va_arg(l2, int);
    }

    return sum;
}

// Helper to  call vsum
int call_vsum(int n, ...){
    va_list l; 
    va_start(l, n);

    return vsum(n, l);
}

// Helper to  call vsum_copy
int call_vsum_copy(int n, ...){
    va_list l; 
    va_start(l, n);

    return vsum_copy(n, l);
}

// Prints provided strings
void printABunch(int n, ...){
    va_list l; 
    va_start(l, n);

    dumpVAList(l);

    for(int i = 0; i < n; i++){
        fputs(va_arg(l, char *), stdout);
        dumpVAList(l);
    }

    va_end(l);
}

// Builds a string using malloc from a bunch of provided chars
char *buildStr(int n, ...){
    va_list l; 
    va_start(l, n);

    dumpVAList(l);

    char *s = (char *)malloc(n+5); //Some extra space too
    for(int i = 0; i < n; i++){
        s[i] += va_arg(l, char);
        dumpVAList(l);
    }

    va_end(l);
    return s;
}