// CCC '07 S4 - Waterpark (DMOJ): https://dmoj.ca/problem/ccc07s4
// ANNOTATED CODE - https://dmoj.ca/src/6786189
#include <bits/stdc++.h>
using namespace std;
const int MM = 1e4+3;
int N, dp[MM], a, b; vector<int> adj[MM]; // let dp[i] represent the number of ways to reach node i
// the best way to understand this solution is to draw it out and see why I am reversing the edges
/*
Instead of calculating the number of ways to go from node 1 to N
We can reverse the problem: number of ways to come backward to each node, starting from node N to 1
We want to find the number of ways to go from node N to 1
but we can only solve that if we solve the problem for node N-1 to 1
..... we start all the way from node 1, solving each subproblem to the base case: dp[1] = 1
let's say we didn't reverse the edges, then the only way to process the nodes in order is by doing topological sort to find the ordering and perform dp based on that ordering
you would also have to do dp[nxt] += dp[i] instead of dp[i] += dp[nxt] (if you want to see this more annoying solution go to the bottom of this code)
but in the loop we need to start from 2 and go forwards since we want to start from the smallest problem (except n = 1) and move up
*/
int main(){
    cin >> N >> a >> b;
    while(a != 0 && b != 0){ // the number of edges (M) is not given, only til we reach 0 0 is when the program stops taking input
        adj[b].push_back(a); // reverse the edge to go backwards and solve the sub problem
        cin >> a >> b; 
    } // dp[i] number of ways to reach node i from node 1
    dp[1] = 1; // base case: there is one way to reach node 1
    for(int i = 2; i <= N; i++){ // goes through the nodes in a forward fashion (PROBLEM GUARANTEES that for every edge, the smaller hill points to the bigger hill. that's why we can loop from 2 to N without using BFS or some algo)
        for(int nxt : adj[i]){ // for each neighbour of node i
            dp[i] += dp[nxt]; // since the neighbour leads to the current node, you are adding the number of ways from the neighbour node to the current node
        }
    }
    cout << dp[N] << endl; // final answer is the number of ways to reach node N
}

/*
funny way to also solve this problem (solving it without reversing edges) -> topo sort to figure out ordering + dp
the following is Assisted with basic coding tools that works when submitted
#include <bits/stdc++.h>
using namespace std;
const int MM = 1e4+3;
int N, dp[MM], inDeg[MM];
vector<int> adj[MM];
queue<int> q;
int main() {
    cin >> N;
    int u, v;
    while (cin >> u >> v && u && v) {
        adj[u].push_back(v); // Forward edges (no reversing)
        inDeg[v]++;         // Track dependencies
    }
    dp[1] = 1;  // Base case: Start at node 1
    // Step 1: Topological Sort
    for (int i = 1; i <= N; i++) 
        if (inDeg[i] == 0) q.push(i);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        // Step 2: Process neighbors
        for (int v : adj[u]) {
            dp[v] += dp[u];  // Count paths from u → v
            if (--inDeg[v] == 0) q.push(v); // Add to queue when all dependencies are done
        }
    }
    cout << dp[N] << endl; // Final result: ways to reach N
}
*/
