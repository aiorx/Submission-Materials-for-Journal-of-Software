#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
#include "graph.h"


void printPath(int* parent, int vertex) {
    if (parent[vertex] == -1) {
        printf("%d", vertex);
        return;
    }
    printPath(parent, parent[vertex]);
    printf(" -> %d", vertex);
}


void displayResult(int* parent, int start, int end, int distance) {
    printf("Dijkstra: Shortest path from %d to %d: [", start, end);
    if (distance == INT_MAX) {
        printf("No path found");
    }
    else {
        printPath(parent, end);
        printf("] (Distance: %d)", distance);
    }
    printf("\n");
}

//help taken Derived using common development resources
void dijkstra(Graph* graph, int start, int end) {
    int V = graph->V;
    int* dist = malloc(V * sizeof(int));
    int* visited = malloc(V * sizeof(int));
    int* parent = malloc(V * sizeof(int));

    for (int i = 0; i < V; i++) {
        dist[i] = INT_MAX;
        visited[i] = 0;
        parent[i] = -1;
    }

    dist[start] = 0;

    for (int i = 0; i < V - 1; i++) {
        int minDist = INT_MAX, u = -1;
        for (int j = 0; j < V; j++) {
            if (!visited[j] && dist[j] < minDist) {
                minDist = dist[j];
                u = j;
            }
        }

        if (u == -1) break;

        visited[u] = 1;

        EdgeNodePtr current = graph->edges[u].head;
        while (current != NULL) {
            int v = current->edge.to_vertex;
            int weight = current->edge.weight;
            if (!visited[v] && dist[u] != INT_MAX && dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                parent[v] = u;
            }
            current = current->next;
        }
    }

    displayResult(parent, start, end, dist[end]);

    free(dist);
    free(visited);
    free(parent);
}
