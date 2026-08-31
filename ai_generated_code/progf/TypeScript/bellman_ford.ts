/*

    Bellman-Ford Algorithm

    The Bellman-Ford algorithm is an algorithm that computes shortest paths from a single source vertex to all of the other vertices in a weighted digraph. It is slower than Dijkstra's algorithm for the same problem, but more versatile, as it is capable of handling graphs in which some of the edge weights are negative numbers.

    In Real Life:
        1. Routing Algorithms: Bellman-Ford is used by routing protocols to compute the shortest path between the source and destination nodes.

    Description and comments Crafted with standard coding tools and github copilot
 */

function bellmanFord(graph:  {vertices: string[], edges: {u: string, v: string, w: number}[]}, source: string): number[]
{
    // Initialization
    const sIndex = graph.vertices.indexOf(source);
    let distances: any[]  = new Array(graph.vertices.length).fill(Infinity);
    distances[sIndex] = 0;

    // Relaxation
    for(const edge of graph.edges){
        const uIndex = graph.vertices.indexOf(edge.u);
        const vIndex = graph.vertices.indexOf(edge.v);
        const currentDistance = distances[uIndex] + edge.w;
        distances[vIndex] = distances[vIndex] > currentDistance ? currentDistance : distances[vIndex];
    }

    // Negative weight cycle detection
    for(const edge of graph.edges){
        if(distances[graph.vertices.indexOf(edge.v)] > distances[graph.vertices.indexOf(edge.u)] + edge.w && distances[graph.vertices.indexOf(edge.v)] !== Infinity){
            console.log("Negative weight cycle detected. Bellman-Ford cannot be applied.");
            return [];
        }
    }

    return distances;
}

const graph = {
    vertices: ["A", "B", "C", "D", "E"],
    edges: [
        { u: "A", v: "B", w: 4 },
        { u: "A", v: "C", w: 2 },
        { u: "B", v: "C", w: 3 },
        { u: "B", v: "D", w: 2 },
        { u: "B", v: "E", w: 3 },
    ],
}

console.log(bellmanFord(graph, "A")); // [0, 4, 2, 6, 7]