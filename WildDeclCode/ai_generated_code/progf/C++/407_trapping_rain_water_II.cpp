#include <iostream>
#include <string>
#include <vector>
#include <deque>
#include <algorithm>
#include <queue>
using namespace std;

/*
question:

note: 
    naive
    how to define a block can trap water?
        surrounded by higher blocks
    
    key: from outside to inside
    nope 
    it works
    but you need to take the smallest blcok first
    with priority queue

    key: Liebig's law of the minimum

    # the code is partially Aided with basic GitHub coding tools

improve:
    
*/

// Class Solution copy here

class Solution {
public:
    int trapRainWater(vector<vector<int>>& heightMap) {
        if (heightMap.empty() || heightMap[0].empty()) return 0;
        
        int m = heightMap.size();
        int n = heightMap[0].size();
        vector<vector<bool>> visited(m, vector<bool>(n, false));
        vector<pair<int, int>> dirs = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
        priority_queue<pair<int, pair<int, int>>, vector<pair<int, pair<int, int>>>, greater<pair<int, pair<int, int>>>> q;
        
        for (int i = 0; i < m; i++) {
            q.push({heightMap[i][0], {i, 0}});
            q.push({heightMap[i][n-1], {i, n-1}});
            visited[i][0] = true;
            visited[i][n-1] = true;
        }
        for (int j = 0; j < n; j++) {
            q.push({heightMap[0][j], {0, j}});
            q.push({heightMap[m-1][j], {m-1, j}});
            visited[0][j] = true;
            visited[m-1][j] = true;
        }
        
        int ans = 0;
        while (!q.empty()) {
            auto cell = q.top();
            q.pop();
            int height = cell.first;
            int x = cell.second.first;
            int y = cell.second.second;
            
            for (auto dir : dirs) {
                int nx = x + dir.first;
                int ny = y + dir.second;
                
                if (nx >= 0 && nx < m && ny >= 0 && ny < n && !visited[nx][ny]) {
                    visited[nx][ny] = true;
                    ans += max(0, height - heightMap[nx][ny]);
                    q.push({max(height, heightMap[nx][ny]), {nx, ny}});
                }
            }
        }
        
        return ans;
    }
};

// test function
int main(){
    // given values
    vector<int> nums = {0};
    int target = 0;
    string s = "";

    // call solution function
    /*
    Solution sol;
    int ans = sol.function("arguments");

    // print out answers 
    cout << ans;
    */

    return 0;
}