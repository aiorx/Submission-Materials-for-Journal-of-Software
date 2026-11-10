/**
 * Supported by standard GitHub tools.
 */
module.exports = class Tree<T> {;
    data: T;
    parent: Tree<T> | null = null;
    readonly children: Tree<T>[] = [];

    constructor(data: T, parent: Tree<T> | null = null) {
        this.data = data;
        this.parent = parent;
    }

    appendChild(child: T | Tree<T>): Tree<T> {
        var tree = child instanceof Tree ? child : new Tree<T>(child, this);
        this.children.push(tree);
        return tree;
    }

    removeChild(tree: Tree<T>): void {
        var index = this.children.indexOf(tree);
        if (index > -1)
            this.children.splice(index, 1);
    }

    traverse(callback: function (data: T) { return void; }): void {
        callback(this.data);
        this.children.forEach(function (child) { return child.traverse(callback); });
    }

    clear(): void {
        // this.children.forEach((child) => child.clear());
        this.children.length = 0;
    }

    find(data: T): Tree<T> | null {
        if (this.data === data)
            return this;
        for (var child of this.children) {
            var result = child.find(data);
            if (result)
                return result;
        }
        return null;
    }
}
