```python
def inorder_traversal_r(root):
    # create an inner helper function
    def helper(root, result):
        # if root exists
        if root:
            # call helper on the left of the root, passing the result list along
            helper(root.left, result)
            # append roots value to the result list
            result.append(root.val)
            # call the helper on the right of the root, passing the result list along
            helper(root.right, result)
    result = []
    helper(root, result)
    return result
```