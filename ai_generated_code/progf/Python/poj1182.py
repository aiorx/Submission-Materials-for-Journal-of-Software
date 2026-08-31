# this script is translated version of poj1182.hs done Assisted using common GitHub development aids

class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.size = [1] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)

        if root_x == root_y:
            return False

        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
            self.size[root_y] += self.size[root_x]
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
            self.size[root_x] += self.size[root_y]
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
            self.size[root_x] += self.size[root_y]

        return True


def solve(n, k, queries):
    uf = UnionFind(n * 3)
    ans = 0

    for query in queries:
        t, x, y = query

        if x > n or y > n:
            ans += 1
            continue

        if t == 1:
            if uf.find(x) == uf.find(y + n) or uf.find(x) == uf.find(y + 2 * n):
                ans += 1
            else:
                uf.union(x, y)
                uf.union(x + n, y + n)
                uf.union(x + 2 * n, y + 2 * n)
        else:
            if uf.find(x) == uf.find(y) or uf.find(x) == uf.find(y + 2 * n):
                ans += 1
            else:
                uf.union(x, y + n)
                uf.union(x + n, y + 2 * n)
                uf.union(x + 2 * n, y)

    return ans


if __name__ == "__main__":
    n, k = map(int, input().split())
    queries = []

    for _ in range(k):
        t, x, y = map(int, input().split())
        queries.append((t, x, y))

    result = solve(n, k, queries)
    print(result)
