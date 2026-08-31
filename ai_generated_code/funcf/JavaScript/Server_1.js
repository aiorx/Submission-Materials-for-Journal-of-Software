```javascript
const deepCopyFileTree = (nodes) => { //thanks chatgpt
    return nodes.map(node => {
        if (node.type === 'folder') {
            return { ...node, children: deepCopyFileTree(node.children) };
        } else {
            // For file nodes, create a new object and copy the rawFile explicitly
            return { ...node, rawFile: node.rawFile };
        }
    });
};
```