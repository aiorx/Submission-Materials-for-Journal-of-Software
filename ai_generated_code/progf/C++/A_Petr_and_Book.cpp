#include <bits/stdc++.h>
using namespace std;

int main()
{
    int n;
    cin >> n;
    vector<int>v(7);
    for (int i = 0; i < 7; i++)
    {
        cin >> v[i];
    }
    int i = 0;
    int total = 0;
    while (total < n)
    {
        total += v[i];
        if (total >= n)
        {
            cout << i+1;
        }
        i++;
        if (i >= 7)
        i = 0;
    }
}


// improved Assisted with basic coding tools:



// #include <bits/stdc++.h>
// using namespace std;

// int main() {
//     int n;
//     cin >> n;
//     vector<int> v(7);
//     for (int i = 0; i < 7; i++) {
//         cin >> v[i];
//     }

//     int i = 0;
//     int total = 0;
    
//     while (true) { // Use an infinite loop for simplicity
//         total += v[i];
//         if (total >= n) {
//             cout << i + 1; // Output the result
//             break; // Exit the loop once the condition is met
//         }
//         i = (i + 1) % 7; // Cycle through the week
//     }

//     return 0;
// }
