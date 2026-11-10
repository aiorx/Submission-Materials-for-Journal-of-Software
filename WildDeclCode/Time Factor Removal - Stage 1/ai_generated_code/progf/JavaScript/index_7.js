//Linked List 

//Note : All the code are Assisted using common GitHub development aids, i am just testing the code and understanding the logic , i dont know dsa 

//Implement a Node class to represent and element in a linked list with properties value and next

class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

//Implement a LinkedList class with methods to add a node to the end , remove a node from the end and display all the node 

class LinkedList {
    constructor(value) {
        this.head = {
            value: value,
            next: null
        }
        this.tail = this.head;
        this.length = 1;
    }

    append(value) {
        var newNode = new Node(value);
        this.tail.next = newNode;
        this.tail = newNode;
        this.length++;
        return this;
    }

    prepend(value) {
        var newNode = new Node(value);
        newNode.next = this.head;
        this.head = newNode;
        this.length++;
        return this;
    }

    insert(index, value) {
        if (index >= this.length) {
            return this.append(value);
        }
        var newNode = new Node(value);
        var leader = this.traverseToIndex(index - 1);
        var holdingPointer = leader.next;
        leader.next = newNode;
        newNode.next = holdingPointer;
        this.length++;
        return this;
    }

    remove(index) {
        var leader = this.traverseToIndex(index - 1);
        var unwantedNode = leader.next;
        leader.next = unwantedNode.next;
        this.length--;
        return this;
    }

    traverseToIndex(index) {
        var counter = 0;
        var currentNode = this.head;
        while (counter !== index) {
            currentNode = currentNode.next;
            counter++;
        }
        return currentNode;
    }

    printList() {
        var array = [];
        var currentNode = this.head;
        while (currentNode !== null) {
            array.push(currentNode.value);
            currentNode = currentNode.next;
        }
        return array;
    }
}


//Stack

//Implement a Stack class with methods push ,pop and peek

class Stack {
    constructor() {
        this.array = [];
    }

    push(value) {
        this.array.push(value);
        return this;
    }

    pop() {
        this.array.pop();
        return this;
    }

    peek() {
        return this.array[this.array.length - 1];
    }
}

//Use the stack class to reverse a string by pusing all characters of a string into a stack and then poping them out

function reverseString(str) {
    var stack = new Stack();
    for (var i = 0; i < str.length; i++) {
        stack.push(str[i]);
    }
    var reversed = '';
    for (var i = 0; i < str.length; i++) {
        reversed += stack.pop().peek();
    }
    return reversed;
}


//Queue

//Implement a Queue class with methods enqueue ,dequeue and peek

class Queue {
    constructor() {
        this.array = [];
    }

    enqueue(value) {
        this.array.push(value);
        return this;
    }

    dequeue() {
        this.array.shift();
        return this;
    }

    peek() {
        return this.array[0];
    }
}


//Binary Search Tree

//Implement a TreeNode class to represent a node in a binary tree with properties value ,left and right

class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

//Implement a BinarySearchTree class with methods insert ,lookup and remove

class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(value) {
        var newNode = new TreeNode(value);
        if (this.root === null) {
            this.root = newNode;
            return this;
        }
        var currentNode = this.root;
        while (true) {
            if (value < currentNode.value) {
                if (!currentNode.left) {
                    currentNode.left = newNode;
                    return this;
                }
                currentNode = currentNode.left;
            } else {
                if (!currentNode.right) {
                    currentNode.right = newNode;
                    return this;
                }
                currentNode = currentNode.right;
            }
        }
    }

    lookup(value) {
        var currentNode = this.root;
        while (currentNode) {
            if (value < currentNode.value) {
                currentNode = currentNode.left;
            } else if (value > currentNode.value) {
                currentNode = currentNode.right;
            } else if (value === currentNode.value) {
                return currentNode;
            }
        }
        return null;
    }

    remove(value) {
        if (!this.root) {
            return null;
        }
        var currentNode = this.root;
        var parentNode = null;
        while (currentNode) {
            if (value < currentNode.value) {
                parentNode = currentNode;
                currentNode = currentNode.left;
            } else if (value > currentNode.value) {
                parentNode = currentNode;
                currentNode = currentNode.right;
            } else if (value === currentNode.value) {
                if (currentNode.right === null) {
                    if (parentNode === null) {
                        this.root = currentNode.left;
                    } else {
                        if (currentNode.value < parentNode.value) {
                            parentNode.left = currentNode.left;
                        } else if (currentNode.value > parentNode.value) {
                            parentNode.right = currentNode.left;
                        }
                    }
                } else if (currentNode.right.left === null) {
                    currentNode.right.left = currentNode.left;
                    if (parentNode === null) {
                        this.root = currentNode.right;
                    } else {
                        if (currentNode.value < parentNode.value) {
                            parentNode.left = currentNode.right;
                        } else if (currentNode.value > parentNode.value) {
                            parentNode.right = currentNode.right;
                        }
                    }
                } else {
                    var leftMost = currentNode.right.left;
                    var leftMostParent = currentNode.right;
                    while (leftMost.left !== null) {
                        leftMostParent = leftMost;
                        leftMost = leftMost.left;
                    }
                    leftMostParent.left = leftMost.right;
                    leftMost.left = currentNode.left;
                    leftMost.right = currentNode.right;
                    if (parentNode === null) {
                        this.root = leftMost;
                    } else {
                        if (currentNode.value < parentNode.value) {
                            parentNode.left = leftMost;
                        } else if (currentNode.value > parentNode.value) {
                            parentNode.right = leftMost;
                        }
                    }
                }
                return this;
            }
        }
    }
}
    
