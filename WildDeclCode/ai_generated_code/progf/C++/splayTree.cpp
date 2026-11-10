// Name: Diya Goyal
// Roll no: 102215255
// Question: Write a program for Splay tree having functions for the following operations:
// Insert an element (no duplicates are allowed),
// Delete an element (existing as well as non-existing),            
// Finding and deleting a minimum element,                
// Finding and deleting a maximum element,                
// Traverse the Splay tree (in-order, pre- order, and post-order),        
// Splaying (Either bottom-up approach or top-down approach), 
// Right rotation, and Left rotation.
// Acknowledgement: took help from GitHub Copilot 
#include <iostream>
#include <memory>
using namespace std;

struct Node {
    int data;
    Node* left;
    Node* right;
    Node(int val) : data(val), left(nullptr), right(nullptr) {}
};

class SplayTree {
private:
    Node* root;

    void rotateLeft(Node*& x) {
        Node* y = x->right;
        x->right = y->left;
        y->left = x;
        x = y;
    }

    void rotateRight(Node*& x) {
        Node* y = x->left;
        x->left = y->right;
        y->right = x;
        x = y;
    }

    void splay(Node*& root, int key) {
        if (!root) return;
        Node head(0), *LeftTreeMax = &head;
        Node tail(0), *RightTreeMin = &tail;
        Node* current = root;
        while (true) {
            if (key < current->data) {
                if (!current->left) break;
                if (key < current->left->data) {
                    rotateRight(current);
                    if (!current->left) break;
                }
                RightTreeMin->left = current;
                RightTreeMin = current;
                current = current->left;
                RightTreeMin->left = nullptr;
            } else if (key > current->data) {
                if (!current->right) break;
                if (key > current->right->data) {
                    rotateLeft(current);
                    if (!current->right) break;
                }
                LeftTreeMax->right = current;
                LeftTreeMax = current;
                current = current->right;
                LeftTreeMax->right = nullptr;
            } else {
                break;
            }
        }
        LeftTreeMax->right = current->left;
        RightTreeMin->left = current->right;
        current->left = head.right;
        current->right = tail.left;
        root = current;
    }

    Node* insertNode(Node* root, int key) {
        if (!root) return new Node(key);
        if (key < root->data) {
            root->left = insertNode(root->left, key);
        } else if (key > root->data) {
            root->right = insertNode(root->right, key);
        }
        return root;
    }

    Node* findMin(Node* node) {
        if (!node) return nullptr;
        while (node->left) node = node->left;
        return node;
    }

    Node* findMax(Node* node) {
        if (!node) return nullptr;
        while (node->right) node = node->right;
        return node;
    }

    Node* removeRoot(Node* root) {
        if (!root->left) {
            Node* temp = root->right;
            delete root;
            return temp;
        }
        if (!root->right) {
            Node* temp = root->left;
            delete root;
            return temp;
        }
        Node* temp = root;
        Node* newRoot = root->left;
        splay(newRoot, findMax(root->left)->data);
        newRoot->right = temp->right;
        delete temp;
        return newRoot;
    }

    void inorderTraversal(Node* node) {
        if (!node) return;
        inorderTraversal(node->left);
        cout << node->data << " ";
        inorderTraversal(node->right);
    }

    void preorderTraversal(Node* node) {
        if (!node) return;
        cout << node->data << " ";
        preorderTraversal(node->left);
        preorderTraversal(node->right);
    }

    void postorderTraversal(Node* node) {
        if (!node) return;
        postorderTraversal(node->left);
        postorderTraversal(node->right);
        cout << node->data << " ";
    }

public:
    SplayTree() : root(nullptr) {}

    void insert(int key) {
        if (!root) {
            root = new Node(key);
            return;
        }
        splay(root, key);
        if (root->data == key) return;
        root = insertNode(root, key);
        splay(root, key);
    }

    void deleteKey(int key) {
        if (!root) return;
        splay(root, key);
        if (root->data != key) return;
        root = removeRoot(root);
    }

    void deleteMin() {
        if (!root) return;
        Node* m = findMin(root);
        if (!m) return;
        int key = m->data;
        deleteKey(key);
    }

    void deleteMax() {
        if (!root) return;
        Node* m = findMax(root);
        if (!m) return;
        int key = m->data;
        deleteKey(key);
    }

    void splayKey(int key) {
        splay(root, key);
    }

    void inorder() {
        inorderTraversal(root);
        cout << endl;
    }

    void preorder() {
        preorderTraversal(root);
        cout << endl;
    }

    void postorder() {
        postorderTraversal(root);
        cout << endl;
    }
};

int main() {
    SplayTree st;
    st.insert(50);
    st.insert(30);
    st.insert(70);
    st.insert(20);
    st.insert(40);
    st.insert(60);
    st.insert(80);

    cout << "Inorder: ";   st.inorder();
    cout << "Preorder: ";  st.preorder();
    cout << "Postorder: "; st.postorder();

    st.deleteKey(30);
    cout << "\nAfter deleting 30:\nInorder: ";
    st.inorder();

    st.deleteMin();
    cout << "\nAfter deleting min:\nInorder: ";
    st.inorder();

    st.deleteMax();
    cout << "\nAfter deleting max:\nInorder: ";
    st.inorder();
    cout << endl;

    return 0;
}