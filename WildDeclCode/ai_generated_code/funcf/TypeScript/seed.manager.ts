```typescript
private static printNode(node: SeedNode, isLast: boolean, prefix: string = ''): void {
    const connector = isLast ? '└── ' : '├── ';

    if (node.isFile) {
        pp.info(`${prefix}${connector}${node.index} - ${node.name}`);
    } else {
        let newPrefix: string;
        if (node.name === '.') {
            pp.info(`${prefix}${node.name}`);
            newPrefix = prefix + (isLast ? '' : '│');
        } else {
            pp.info(`${prefix}${connector}${Colors.orange(node.name)}`);
            newPrefix = prefix + (isLast ? '    ' : '│   ');
        }
        const children = Array.from(node.children?.values() || []);
        children.forEach((child, index) => {
            const isLastChild = index === children.length - 1;
            this.printNode(child, isLastChild, newPrefix);
        });
    }
}
```