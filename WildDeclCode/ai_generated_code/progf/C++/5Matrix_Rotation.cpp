https://leetcode.com/problems/rotate-image/

// In this one i took help Referenced via basic programming materials
// Firstly i wrote a very complex code, where i had errors. 
// I asked chatgpt for errors, so it told me this method. 
// In this method we first transpose the matrix and then reverse each row. This way we get 90 rotated matrix. 
class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {
        int n = matrix.size();

        // Transposing the matrix
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                swap(matrix[i][j], matrix[j][i]);
            }
        }

        // Reversing each row
        for (int i = 0; i < n; i++) {
            reverse(matrix[i].begin(), matrix[i].end());
        }
    }
};
