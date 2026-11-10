```cpp
void createGraph() {
    scanf("%d %d %d %d", &N, &M, &C1, &C2);
    for(int i = 0; i < N; i ++) scanf("%d", &teamNum[i]);
    int a, b, w;
    for(int i = 0; i < M; i ++) {
        scanf("%d %d %d", &a, &b, &w);
        Adj[a].push_back(GNode(b, w));
        Adj[b].push_back(GNode(a, w));
    }
}
```