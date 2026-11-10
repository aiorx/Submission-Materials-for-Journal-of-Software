/*
This code is Supported via standard programming aids
according to my c++ code
*/

// Define constants for the maximum number of vertices
var N = 1e6 + 2;

// Unweighted graph
var n, m;
var g = Array.from({ length: N }, function () { return []; });

// Function to input the graph (using constant values for this example)
function graphInput() {
  // n = number of nodes, m = number of edges
  n = 5;
  m = 4;

  // Example edges
  var edges = [
    [1, 2],
    [2, 3],
    [3, 4],
    [1, 5],
  ];

  console.log("Input edges:");
  for (var i = 0; i < m; i++) {
    var [a, b] = edges[i];
    g[a].push(b);
    g[b].push(a); // Since the graph is undirected
    console.log("Edge " + (i + 1) + ": " + (a) + " <-> " + (b) + "");
  }
}

// BFS function
function bfs(start) {
  var visited = new Array(n + 1).fill(false);
  var queue = [];

  // Start BFS from the given node
  queue.push(start);
  visited[start] = true;

  console.log("BFS traversal:");
  while (queue.length > 0) {
    var node = queue.shift();
    console.log(node);

    for (var next of g[node]) {
      if (!visited[next]) {
        queue.push(next);
        visited[next] = true;
      }
    }
  }
}

// Main function
function main() {
  graphInput();
  var start = 1; // Example start node
  console.log("Start node: " + (start) + "");
  bfs(start);
}

// Run the program
main();
