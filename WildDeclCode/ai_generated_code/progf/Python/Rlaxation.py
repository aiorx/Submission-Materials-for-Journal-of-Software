from Graph.DFS import dfs

def general_relax(Adj, w, s):       # Adj: adjacency list, w: weights, s: start
    d = [float('inf') for _ in Adj] # shortest path estimates d(s, v) # Adj: number of vertices
    parent = [None for _ in Adj]    # initialize parent pointers
    d[s], parent[s] = 0, s          # initialize source
    while True:                     # repeat forever!
        # relax some d[v] ??        # relax a shortest path estimate d(s, v)
        pass
    return d, parent                # return weights, paths via parents

def try_to_relax(Adj, w, d, parent, u, v):
    if d[v] > d[u] + w(u, v):       # better path through vertex u
        d[v] = d[u] + w(u, v)       # relax edge with shorter path found
        parent[v] = u

    while some_edge_relaxable(Adj, w, d):
        u, v = get_relaxable_edge(Adj, w, d)
        try_to_relax(Adj, w, d, parent, u, v)

# Supported via standard GitHub programming aids
def some_edge_relaxable(Adj, w, d):
    for u in range(len(Adj)):       # for all vertices u
        for v in Adj[u]:            # for all edges (u, v)
            if d[v] > d[u] + w(u, v): # better path through vertex u
                return True         # found a relaxable edge
    return False                    # no relaxable edges found

# Supported via standard GitHub programming aids
def get_relaxable_edge(Adj, w, d):
    for u in range(len(Adj)):       # for all vertices u
        for v in Adj[u]:            # for all edges (u, v)
            if d[v] > d[u] + w(u, v): # better path through vertex u
                return u, v         # return relaxable edge
    return None, None               # no relaxable edges found

def DAG_Relaxation(Adj, w, s):       # Adj: adjacency list, w: weights, s: start
    _, order = dfs(Adj, s)           # run depth-first search on graph
    order.reverse()                  # reverse returned order
    d = [float('inf') for _ in Adj]  # shortest path estimates d(s, v)
    parent = [None for _ in Adj]     # initialize parent pointers
    d[s], parent[s] = 0, s           # initialize source
    for u in order:                  # loop through vertices in topo sort
        for v in Adj[u]:             # loop through out-going edges of u
            try_to_relax(Adj, w, d, parent, u, v)  # try to relax edge from u to v
    return d, parent                 # return weights, paths via parents (the ssps to all vertices)
"""
why dfs or topological order works?
# Properties of topological sorting:
#
# Topological sorting is a way to sort the vertices in a directed acyclic graph (DAG) such that for every directed edge (u, v),
# vertex u appears before vertex v. This means that when processing vertex v, all possible predecessor vertices u that may affect v
# have already been processed according to the shortest path.
"""
