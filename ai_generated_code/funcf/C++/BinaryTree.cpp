```cpp
void printTree(TreeNode<T>* root, int space = 0, int indent = 6) {
    // Base case
    if (root == nullptr)
        return;

    // Increase distance between levels
    space += indent;

    // Process right child first
    printTree(root->right, space);

    // Print current node after space count
    cout << endl;
    cout << setw(space) << root->data << "\n";

    // Process left child
    printTree(root->left, space);
}
```