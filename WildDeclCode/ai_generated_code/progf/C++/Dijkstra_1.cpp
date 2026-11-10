// Produced via common programming aids-3.5

#include <iostream>
#include <vector>
#include <queue>
#include <limits>

using namespace std;

const int INF = numeric_limits<int>::max(); // 무한대를 나타내는 상수

struct Edge {
    int to;
    int weight;
    Edge(int t, int w) : to(t), weight(w) {}
};

vector<vector<Edge>> graph; // 그래프의 인접 리스트
vector<int> dist; // 시작 노드로부터의 최단 거리를 저장할 배열

void Dijkstra(int start) {
    int numNodes = graph.size();
    dist.assign(numNodes, INF); // 모든 노드의 거리를 무한대로 초기화
    dist[start] = 0; // 시작 노드의 거리를 0으로 설정

    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq; // 우선 순위 큐

    pq.push({0, start}); // 시작 노드를 우선 순위 큐에 추가

    while (!pq.empty()) {
        int curNode = pq.top().second;
        int curDist = pq.top().first;
        pq.pop();

        // 현재 노드를 기준으로 인접한 모든 노드를 탐색
        for (const Edge& edge : graph[curNode]) {
            int to = edge.to;
            int weight = edge.weight;

            // 현재 노드를 통해 다른 노드로 가는 거리가 더 짧다면 업데이트
            if (curDist + weight < dist[to]) {
                dist[to] = curDist + weight;
                pq.push({dist[to], to});
            }
        }
    }
}

int main() {
    int numNodes = 6; // 노드의 수
    graph.resize(numNodes);

    // 간선 추가 (노드, 가중치)
    graph[0].push_back(Edge(1, 2));
    graph[0].push_back(Edge(2, 4));
    graph[1].push_back(Edge(2, 1));
    graph[1].push_back(Edge(3, 7));
    graph[2].push_back(Edge(4, 3));
    graph[3].push_back(Edge(5, 1));
    graph[4].push_back(Edge(5, 5));

    int startNode = 0; // 시작 노드

    Dijkstra(startNode);

    // 시작 노드로부터 모든 노드까지의 최단 거리 출력
    for (int i = 0; i < numNodes; i++) {
        cout << "최단 거리 " << startNode << "에서 " << i << "까지: " << dist[i] << endl;
    }

    return 0;
}
