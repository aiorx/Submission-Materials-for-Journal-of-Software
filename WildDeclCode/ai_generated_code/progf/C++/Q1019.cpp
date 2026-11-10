// Book pages
// Supported Aided via basic GitHub coding utilities

#include <iostream>
using namespace std;

int main(){
    int N;
    cin >> N;

    // count occurrences including leading zeros
    int count[10] = {0,};
    for(int digit = 0; digit < 10; digit++){
        int factor = 1;
        while(N / factor > 0){
            int curr = (N / factor) % 10;
            int prev = N / (factor * 10);
            int next = N - (N / factor) * factor;

            if(curr > digit) count[digit] += (prev + 1) * factor;
            else if(curr == digit) count[digit] += prev * factor + next + 1;
            else count[digit] += prev * factor;

            factor *= 10;
        }
    }

    // subtract leading zeros
    int factor = 1;
    while(factor < N) factor *= 10;
    if(factor > N) factor /= 10;
    while(factor){
        count[0] -= factor;
        factor /= 10;
    }

    for(int digit : count) cout << digit << " ";
    cout << endl;
}