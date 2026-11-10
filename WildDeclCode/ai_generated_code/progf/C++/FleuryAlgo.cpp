#include <iostream>
#include <vector>
#include <list>
#include <map>
#include <unordered_map>
#include <algorithm>

using namespace std;


// This code is Composed with basic coding tools! (Hence no guarantte of curretness)
// Here's the algorithm print the Eulerian Path on the graph.
// Only apply if the path would be an Eulerian one.

class Graph {
    int V;                                // Number of vertices
    unordered_map<int, list<int>> adj;    // Adjacency list representation

public:
    Graph(int V) : V(V) {}

    void addEdge(int u, int v) {
        adj[u].push_back(v);
        adj[v].push_back(u);              // Since the graph is undirected
    }

    void removeEdge(int u, int v) {
        adj[u].remove(v);
        adj[v].remove(u);
    }

    bool isBridge(int u, int v) {
        int beforeDFS = dfsCount(u);

        removeEdge(u, v);
        int afterDFS = dfsCount(u);

        addEdge(u, v);                    // Restore the edge after checking

        return afterDFS < beforeDFS;      // If removing the edge reduces reachability
    }

    // void printEulerPathOrCircuit(int start) {
    //     int edgeCount = 0;
    //     for (auto &i : adj)
    //         edgeCount += i.second.size();
    //     edgeCount /= 2; // Count edges correctly for undirected graph

    //     int current = start;

    //     while (edgeCount > 0) {
    //         list<int> temp(adj[current].begin(), adj[current].end());
    //         for (int next : temp) {
    //             if (!isBridge(current, next) || adj[current].size() == 1) {
    //                 cout << current << " -> " << next << endl;
    //                 removeEdge(current, next);
    //                 current = next;
    //                 --edgeCount;
    //                 break;
    //             }
    //         }
    //     }
    // }

    void printEulerPathOrCircuit(int start) {
        int edgeCount = 0;
        for (auto &i : adj)
            edgeCount += i.second.size();
        edgeCount /= 2;                   // Total edges in an undirected graph

        int current = start;
        for (int i = 0; i < edgeCount; ++i) {
            for (auto it = adj[current].begin(); it != adj[current].end(); ++it) {
                int next = *it;
                if (!isBridge(current, next) || adj[current].size() == 1) {
                    cout << current << " -> " << next << endl;
                    removeEdge(current, next);
                    current = next;
                    break;
                }
            }
        }
    }

    int dfsCount(int start) {
        vector<bool> visited(V, false);
        return dfsHelper(start, visited);
    }

private:
    int dfsHelper(int u, vector<bool> &visited) {
        visited[u] = true;
        int count = 1;

        for (auto &v : adj[u])
            if (!visited[v])
                count += dfsHelper(v, visited);

        return count;
    }
};

int main() {
    // Example graph
    int V = 4; // Number of vertices
    Graph g(V);

    // Add edges to create an Eulerian path/circuit
    g.addEdge(0, 1);
    g.addEdge(1, 2);
    g.addEdge(2, 3);
    g.addEdge(3, 0);
    // g.addEdge(3, 4); // would become a non-eulerian path.

    // Start point for the Eulerian path (use an odd-degree vertex if one exists)
    int start = 0;
    cout << "Eulerian Path or Circuit:" << endl;
    g.printEulerPathOrCircuit(start);

    return 0;
}
