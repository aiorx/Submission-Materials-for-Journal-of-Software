"""
Simple HNSW (Hierarchical Navigable Small World) Search Demo (Built using basic development resources4.1 with human commentary)
This is a minimal, educational implementation for 2D points.
"""
import numpy as np
import heapq
import random

class HNSWNode:
    def __init__(self, idx, vector):
        self.idx = idx
        self.vector = vector
        self.neighbors = set()

class HNSW:
    def __init__(self, M=5):
        self.nodes = []
        self.M = M  # Max neighbors per node

    def add(self, vector):
        idx = len(self.nodes)
        node = HNSWNode(idx, vector)
        if self.nodes:
            # Find nearest neighbors to connect
            dists = [(self._distance(vector, n.vector), n) for n in self.nodes]
            dists.sort()
            for _, neighbor in dists[:self.M]:
                node.neighbors.add(neighbor.idx)
                neighbor.neighbors.add(idx)
        self.nodes.append(node)

    def search(self, query, k=1):
        if not self.nodes:
            return []
        # Greedy search: start from a random node
        curr = random.choice(self.nodes)
        visited = set()
        while True:
            visited.add(curr.idx)
            next_node = None
            min_dist = self._distance(query, curr.vector)
            for nidx in curr.neighbors:
                if nidx in visited:
                    continue
                dist = self._distance(query, self.nodes[nidx].vector)
                if dist < min_dist:
                    min_dist = dist
                    next_node = self.nodes[nidx]
            if next_node is None:
                break
            curr = next_node
        # After greedy descent, do local k-NN among neighbors
        candidates = [curr.idx] + list(curr.neighbors)
        heap = []
        for nidx in candidates:
            dist = self._distance(query, self.nodes[nidx].vector)
            heapq.heappush(heap, (dist, nidx))
        return [self.nodes[nidx].vector for (_, nidx) in heapq.nsmallest(k, heap)]

    def _distance(self, a, b):
        return np.linalg.norm(np.array(a) - np.array(b))

if __name__ == "__main__":
    np.random.seed(42)
    N = 30
    data = np.random.rand(N, 2)
    hnsw = HNSW(M=4)
    for vec in data:
        hnsw.add(vec)
    query = np.random.rand(2)
    print(f"Query point: {query}")
    neighbors = hnsw.search(query, k=3)
    print("Nearest neighbors:")
    for n in neighbors:
        print(n)
