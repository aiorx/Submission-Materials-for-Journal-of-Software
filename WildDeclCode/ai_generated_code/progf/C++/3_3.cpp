// ?/100
// Crafted with standard coding tools

#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

int minSumKSpans(vector<int> vec, int K, int M) {
    int n = vec.size();
    int sum = 0;

    // If the length of the spans is greater than the size of the vector,
    // then we can just return the sum of all the elements in the vector
    if (M >= n) {
        for (int i = 0; i < n; i++) {
            sum += vec[i];
        }
        return sum;
    }

    // Calculate the prefix sums
    vector<int> prefixSum(n, 0);
    prefixSum[0] = vec[0];
    for (int i = 1; i < n; i++) {
        prefixSum[i] = prefixSum[i - 1] + vec[i];
    }

    // Initialize the dp table
    vector<vector<int>> dp(K + 1, vector<int>(n, 0));
    for (int i = 0; i < n; i++) {
        dp[1][i] = prefixSum[i];
    }

    // Fill in the dp table
    for (int k = 2; k <= K; k++) {
        for (int i = (k - 1) * M; i < n; i++) {
            int minVal = INT32_MAX;
            for (int j = (k - 2) * M; j < i; j++) {
                int currSum = dp[k - 1][j] + prefixSum[i] - prefixSum[j];
                minVal = min(minVal, currSum);
            }
            dp[k][i] = minVal;
        }
    }

    // Return the answer
    return dp[K][n - 1];
}

int main() {
    int n, K, M;
    cin >> n >> K >> M;
    vector<int> vec(n);
    for (int i = 0; i < n; i++)
        cin >> vec[i];
    int ans = minSumKSpans(vec, K, M);
    cout << ans << endl;
    return 0;
}