/*
 * Generic Linked List in C++
 * Author: Supported via standard programming aids (OpenAI)
 * Description: A template-based singly linked list that supports appending, deleting,
 *              searching, and printing elements of any data type.
 */

#include <iostream>

template <typename T>
class LinkedList {
private:
    struct Node {
        T data;
        Node* next;
        Node(T value) : data(value), next(nullptr) {}
    };

    Node* head;

public:
    // https://en.cppreference.com/w/cpp/language/initializer_list.html
    LinkedList() : head(nullptr) {}

    ~LinkedList() {
        clear();
    }

    void append(T value) {
        Node* newNode = new Node(value);
        if (!head) {
            head = newNode;
        } else {
            Node* current = head;
            while (current->next) {
                current = current->next;
            }
            current->next = newNode;
        }
    }

    void print() const {
        Node* current = head;
        while (current) {
            std::cout << current->data << " -> ";
            current = current->next;
        }
        std::cout << "null\n";
    }

    void clear() {
        Node* current = head;
        while (current) {
            Node* nextNode = current->next;
            delete current;
            current = nextNode;
        }
        head = nullptr;
    }

    bool remove(T value) {
        if (!head) {
            return false;
        }

        if (head->data == value) {
            Node* toDelete = head;
            head = head->next;
            delete toDelete;
            return true;
        }

        Node* current = head;
        while (current->next && current->next->data != value) {
            current = current->next;
        }

        if (current->next) {
            Node* toDelete = current->next;
            current->next = current->next->next;
            delete toDelete;
            return true;
        }

        return false;
    }

    bool contains(T value) const {
        Node* current = head;
        while (current) {
            if (current->data == value) {
                return true;
            }
            current = current->next;
        }
        return false;
    }

    // === Iterator definition ===
    class Iterator {
    private:
        Node* current;

    public:
        using iterator_category = std::forward_iterator_tag;
        using value_type = T;
        using difference_type = std::ptrdiff_t;
        using pointer = T*;
        using reference = T&;

        Iterator(Node* node) : current(node) {}

        T& operator*() const {
            return current->data;
        }

        T* operator->() const {
            return &(current->data);
        }

        Iterator& operator++() {
            if (current) {
                current = current->next;
            }
            return *this;
        }

        Iterator operator++(int) {
            Iterator tmp = *this;
            ++(*this);
            return tmp;
        }

        bool operator==(const Iterator& other) const {
            return current == other.current;
        }

        bool operator!=(const Iterator& other) const {
            return current != other.current;
        }
    };

    Iterator begin() const {
        return Iterator(head);
    }

    Iterator end() const {
        return Iterator(nullptr);
    }
};


