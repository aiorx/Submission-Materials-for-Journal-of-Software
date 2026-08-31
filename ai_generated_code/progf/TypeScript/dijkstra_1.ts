// Getting a bit of help on the implementation side Adapted from standard coding samples on this one

type Point = {row: number; col: number};

type NodeKey = string;

type Node = Point & {
  isStart?: boolean;
  isEnd?: boolean;
  transitions: Record<NodeKey, number>;
};

export type Graph = Record<NodeKey, Node>;

export class PriorityQueue<T> {
  private heap: {value: T; priority: number}[] = [];

  enqueue(value: T, priority: number) {
    this.heap.push({value, priority});
    this.heap.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.heap.shift()?.value;
  }

  isEmpty() {
    return this.heap.length === 0;
  }
}

export function dijkstra(graph: Graph, start: string, end: string): number {
  const distances: Record<string, number> = {};
  const priorityQueue = new PriorityQueue<string>();
  const visited = new Set<string>();

  Object.keys(graph).forEach((key) => (distances[key] = Infinity));
  distances[start] = 0;

  priorityQueue.enqueue(start, 0);

  while (!priorityQueue.isEmpty()) {
    const currentNode = priorityQueue.dequeue()!;
    if (visited.has(currentNode)) continue;
    visited.add(currentNode);

    if (currentNode === end) return distances[end]; // Found path

    Object.entries(graph[currentNode].transitions).forEach(([neighbor, cost]) => {
      const newDistance = distances[currentNode] + cost;

      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        priorityQueue.enqueue(neighbor, newDistance);
      }
    });
  }
  return Infinity;
}
