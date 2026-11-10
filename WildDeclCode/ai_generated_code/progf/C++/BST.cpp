// Written with routine coding tools-3.5

#include <iostream>

// 이진 탐색 트리의 노드 구조체 정의
struct Node {
    int data;
    Node* left;
    Node* right;

    Node(int val) : data(val), left(nullptr), right(nullptr) {}
};

class BinarySearchTree {
public:
    BinarySearchTree() : root(nullptr) {}

    // 노드 삽입
    void insert(int value) {
        root = insertRecursive(root, value);
    }

    // 노드 삭제
    void remove(int value) {
        root = removeRecursive(root, value);
    }

    // 최대값 찾기
    int findMax() {
        if (root == nullptr)
            return -1; // 트리가 비어있을 경우
        Node* current = root;
        while (current->right != nullptr)
            current = current->right;
        return current->data;
    }

    // 최소값 찾기
    int findMin() {
        if (root == nullptr)
            return -1; // 트리가 비어있을 경우
        Node* current = root;
        while (current->left != nullptr)
            current = current->left;
        return current->data;
    }

private:
    Node* root;

    // 노드 삽입의 재귀적 구현
    Node* insertRecursive(Node* current, int value) {
        if (current == nullptr)
            return new Node(value);

        if (value < current->data)
            current->left = insertRecursive(current->left, value);
        else if (value > current->data)
            current->right = insertRecursive(current->right, value);

        return current;
    }

    // 노드 삭제의 재귀적 구현
    Node* removeRecursive(Node* current, int value) {
        if (current == nullptr)
            return current;

        if (value < current->data)
            current->left = removeRecursive(current->left, value);
        else if (value > current->data)
            current->right = removeRecursive(current->right, value);
        else {
            // 삭제할 노드를 찾았을 경우
            if (current->left == nullptr) {
                Node* temp = current->right;
                delete current;
                return temp;
            } else if (current->right == nullptr) {
                Node* temp = current->left;
                delete current;
                return temp;
            }

            // 두 자식이 있는 경우, 오른쪽 서브트리의 최소값으로 대체
            current->data = findMinValue(current->right);
            current->right = removeRecursive(current->right, current->data);
        }
        return current;
    }

    // 서브트리에서 최소값 찾기
    int findMinValue(Node* node) {
        int minValue = node->data;
        while (node->left != nullptr) {
            minValue = node->left->data;
            node = node->left;
        }
        return minValue;
    }
};

int main() {
    BinarySearchTree bst;

    bst.insert(50);
    bst.insert(30);
    bst.insert(70);
    bst.insert(20);

    bst.insert(40);
    bst.insert(60);
    bst.insert(80);

    std::cout << "최댓값: " << bst.findMax() << std::endl; // 80
    std::cout << "최소값: " << bst.findMin() << std::endl; // 20

    bst.remove(50);
    std::cout << u"50 삭제 후, 최대값: " << bst.findMax() << std::endl; // 80

    return 0;
}

