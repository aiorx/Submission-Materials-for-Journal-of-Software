/*
    Author: Dov Kruger
    Cite: I got MASSIVE HELP Derived using common development resources. It basically rewrote everything.
    But I worked hard on this! I was just lost...
*/
#include <iostream>
#include <cstdint>
using namespace std;

//https://code.visualstudio.com/docs/cpp/config-mingw

int sum(int a, int b) {
    int sum = 0; // sum is a random value
    for (int i = a; i <= b; i++) {
      sum = sum + i;
      if (i == 10000) {
        cout << sum << '\n';
      }
    }
    return sum;
}


int main() {
    cout << sum(1, 1000000) << '\n';    
}