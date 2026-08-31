```js
vis.data.nodes.forEach(node => node.neighbors = []);
vis.data.links.forEach(link => {
  const source = typeof link.source === "object" ? link.source : vis.data.nodes.find(n => n.id === link.source);
  const target = typeof link.target === "object" ? link.target : vis.data.nodes.find(n => n.id === link.target);
  source.neighbors.push(target);
  target.neighbors.push(source);
});
```