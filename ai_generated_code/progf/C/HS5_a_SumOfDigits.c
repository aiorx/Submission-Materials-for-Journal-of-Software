//  Write a function to find sum of digits of a number without recursion

// with help of GitHub CoPilot
#include <stdio.h>

int sumOfDigits(int n);

int main (){
    int n;
    printf("Enter a number: ");
    scanf("%d", &n);
    printf("Sum of digits of %d is %d\n", n, sumOfDigits(n));
    return 0;
    
}

int sumOfDigits(int n) {
    int sum = 0;
    while (n > 0) {
        sum += n % 10;
        n /= 10;
    }
    return sum;
}

// Try with recursion as well

