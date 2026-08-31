"""
Problem Link: https://leetcode.com/problems/symmetric-tree/description/

Description: Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).


Approach 1. Recursive
Two trees are a mirror reflection of each other if:
    1. Their two roots have the same value.
    2. The right subtree of each tree is a mirror reflection of the left subtree of the other tree.

    Time & Space Complexity: O(n)
    

Approach 2. Iterative (using queue, similar with BFS)
    - Each time, two nodes are extracted and their values are compared. 
    - Right and left children of the two nodes are inserted in the queue in opposite order.
    ... until the queue is empty or the tree is not symmetric

    Time & Space Complexity: O(n)

    """
import unittest

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def isSymmetric(self, root):
        def dfs(left, right):
            # Base case
            if not left and not right:
                return True
            elif not left or not right:
                return False
            elif left.val != right.val:
                return False
            return dfs(left.left, right.right) and dfs(left.right, right.left)


        return dfs(root.left, root.right) if root else True


    def isSymmetric2(self, root):
        q = [root, root]
        while q:
            tree1 = q.pop(0)
            tree2 = q.pop(0)

            if tree1 is None and tree2 is None:
                continue
            if tree1 is None or tree2 is None:
                return False
            if tree1.val != tree2.val:
                return False
            
            q.append(tree1.left)
            q.append(tree2.right)
            q.append(tree1.right)
            q.append(tree2.left)
        return True



#####################################
# Testing function Built using basic development resources #
#####################################

class TestIsSymmetric(unittest.TestCase):

    def test_symmetric_tree(self):
        # Constructing a symmetric tree:
        #       1
        #      / \
        #     2   2
        #    / \ / \
        #   3  4 4  3
        node1 = TreeNode(1)
        node2 = TreeNode(2)
        node3 = TreeNode(2)
        node4 = TreeNode(3)
        node5 = TreeNode(4)
        node6 = TreeNode(4)
        node7 = TreeNode(3)
        
        node1.left = node2
        node1.right = node3
        node2.left = node4
        node2.right = node5
        node3.left = node6
        node3.right = node7

        sol = Solution()
        self.assertTrue(sol.isSymmetric(node1))

    def test_asymmetric_tree(self):
        # Constructing an asymmetric tree:
        #       1
        #      / \
        #     2   2
        #      \   \
        #       3   3
        node1 = TreeNode(1)
        node2 = TreeNode(2)
        node3 = TreeNode(2)
        node4 = TreeNode(3)
        node5 = TreeNode(3)
        
        node1.left = node2
        node1.right = node3
        node2.right = node4
        node3.right = node5

        sol = Solution()
        self.assertFalse(sol.isSymmetric(node1))

if __name__ == "__main__":
    unittest.main()