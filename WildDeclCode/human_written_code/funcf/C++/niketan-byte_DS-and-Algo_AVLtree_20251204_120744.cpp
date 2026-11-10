```cpp
int getBalance(node *root)
{
	return height(root->left) - height(root->right);
}
```