```cpp
int heightOfTree(node *root){
	if(root == NULL)
		return 0;
	int leftHeight = heightOfTree(root->left);
	int rightHeight = heightOfTree(root->right);
	return max(leftHeight, rightHeight) + 1;
}
```