```cpp
TreeNode* Build(int& position, string str) {
    char current = str[position++];                     //当前字符
    if (current== '#') {                                //返回空树
        return NULL;
    }
    TreeNode* root = new TreeNode(current);             //创建新节点
    root -> leftChild = Build(position, str);           //创建左子树
    root -> rightChild = Build(position, str);          //创建右子树
    return root;
}
```