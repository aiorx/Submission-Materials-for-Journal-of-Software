/*
*   C implementation of Kahn's algorithm
*   Penned via standard programming aids-4o mini
*
*   --- Prompt: Please provide a C implementation to find a topological ordering of a directed acyclic graph
*
*   --- ChatGPT Output:
*
*   Certainly! 
*   To find a topological ordering of a Directed Acyclic Graph (DAG) in C, you can use Kahn's Algorithm or Depth-First Search (DFS) based algorithm. 
*   Below is a C implementation using Kahn's Algorithm, which is often simpler to understand and implement. 
*   Kahn's Algorithm uses an in-degree array to keep track of the number of incoming edges to each vertex and a queue to process vertices with zero in-degree.
*
*   Here's a complete C implementation for finding a topological ordering using Kahn's Algorithm:
*
*   [code]
*
*   Explanation:
*
*   1. Graph Representation: The graph is represented using an adjacency matrix `adjMatrix`, where `adjMatrix[i][j]` is `1` if there's an edge from vertex `i` to vertex `j`.
*   2. In-Degree Calculation: Calculate the in-degrees for each vertex. The in-degree of a vertex is the number of edges directed towards it.
*   3. Queue Initialization: Enqueue all vertices with in-degree of 0 (no incoming edges).
*   4. Process Queue: Dequeue a vertex, print it, and reduce the in-degrees of its adjacent vertices. Enqueue any adjacent vertex that now has an in-degree of 0.
*   5. Cycle Detection: If the number of vertices processed is less than the total number of vertices, a cycle exists in the graph.
*
*   This implementation assumes that the graph has a maximum of 100 vertices. 
*   Adjust `MAX_VERTICES` as needed for larger graphs. 
*   The graph should be a DAG for the topological sort to be valid; otherwise, the algorithm will detect the cycle.
*/

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_VERTICES 1000

// A structure to represent a graph
typedef struct {
    int numVertices;
    int adjMatrix[MAX_VERTICES][MAX_VERTICES];
} Graph;

// Function to create a graph with a given number of vertices
void initializeGraph(Graph *g, int vertices) {
    g->numVertices = vertices;
    int i = 0, j = 0;
    for (i = 0; i < vertices; i++) {
        for (j = 0; j < vertices; j++) {
            g->adjMatrix[i][j] = 0;
        }
    }
}

// Function to add an edge to the graph
void addEdge(Graph *g, int src, int dest) {
    g->adjMatrix[src][dest] = 1;
}

// Function to perform topological sort using Kahn's Algorithm
void topologicalSort(Graph *g) {
    int inDegree[MAX_VERTICES] = {0};
    int queue[MAX_VERTICES];
    int front = 0, rear = 0;
    
    // Calculate in-degrees of all vertices
    int i = 0, j = 0;
    for (i = 0; i < g->numVertices; i++) {
        for (j = 0; j < g->numVertices; j++) {
            if (g->adjMatrix[j][i] == 1) {
                inDegree[i]++;
            }
        }
    }
    
    // Enqueue all vertices with in-degree 0
    i = 0;
    for (i = 0; i < g->numVertices; i++) {
        if (inDegree[i] == 0) {
            queue[rear++] = i;
        }
    }
    
    // Initialize count of visited vertices
    int visitedCount = 0;
    
    while (front != rear) {
        int u = queue[front++];
        
        printf("%d ", u);
        
        // Decrease the in-degree of all adjacent vertices
        int v = 0;
        for (v = 0; v < g->numVertices; v++) {
            if (g->adjMatrix[u][v] == 1) {
                inDegree[v]--;
                
                // If in-degree becomes 0, enqueue it
                if (inDegree[v] == 0) {
                    queue[rear++] = v;
                }
            }
        }
        
        visitedCount++;
    }
    
    // Check if there was a cycle in the graph
    if (visitedCount != g->numVertices) {
        printf("\nThe graph contains a cycle\n");
    } else {
        printf("\nTopological sort completed\n");
    }
}

/*
// Main function to demonstrate the usage
int main() {
    Graph g;
    int vertices = 6;  // Number of vertices in the graph
    
    initializeGraph(&g, vertices);
    
    // Adding edges to the graph
    addEdge(&g, 5, 2);
    addEdge(&g, 5, 0);
    addEdge(&g, 4, 0);
    addEdge(&g, 4, 1);
    addEdge(&g, 2, 3);
    addEdge(&g, 3, 1);
    
    printf("Topological Sort of the given graph:\n");
    topologicalSort(&g);
    
    return 0;
}
*/