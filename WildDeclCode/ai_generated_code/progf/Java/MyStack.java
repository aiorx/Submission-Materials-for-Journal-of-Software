package Lab_5.activity.MyStack;

// This code is Aided with basic GitHub coding tools to fix the compile error without any modification on July 31, 2024.
// The code is not tested and may not work as expected.
// Please use it at your own risk.

public class MyStack<T> {
    private int maxSize;
    private int top;
    private T[] stackArray;

    public MyStack(int size) {
        this.maxSize = size;
        this.stackArray = (T[]) new Object[maxSize];
        this.top = -1;
    }

    public void push(T element) {
        if (isFull()) {
            System.out.println("Stack is full.");
            return;
        }

        stackArray[++top] = element;
    }

    public T pop() {
        if (isEmpty()) {
            System.out.println("Stack is empty.");
            return null;
        }

        return stackArray[top--];
    }

    public T peek() {
        if (isEmpty()) {
            System.out.println("Stack is empty.");
            return null;
        }

        return stackArray[top];
    }

    public boolean isEmpty() {
        return top == -1;
    }

    public boolean isFull() {
        return top == maxSize - 1;
    }

    public int size() {
        return top + 1;
    }

    public void display() {
        for (int i = 0; i <= top; i++) {
            System.out.print(stackArray[i] + " ");
        }
        System.out.println();
    }

    public void clear() {
        top = -1;
    }

    public void reverse() {
        T[] temp = (T[]) new Object[maxSize];
        int i = 0;
        while (!isEmpty()) {
            temp[i++] = pop();
        }

        stackArray = temp;
        top = i - 1;
    }

    public void sort() {
        T[] temp = (T[]) new Object[maxSize];
        int i = 0;
        while (!isEmpty()) {
            T element = pop();
            while (!isEmpty() && (Integer) element < (Integer) stackArray[top]) {
                temp[i++] = pop();
            }
            push(element);
        }

        while (i >= 0) {
            push(temp[--i]);
        }
    }

    public void insertAtBottom(T element) {
        if (isEmpty()) {
            push(element);
            return;
        }

        T temp = pop();
        insertAtBottom(element);
        push(temp);
    }

    public void reverseRecursively() {
        if (isEmpty()) {
            return;
        }

        T temp = pop();
        reverseRecursively();
        insertAtBottom(temp);
    }

    public void sortRecursively() {
        if (isEmpty()) {
            return;
        }

        T temp = pop();
        sortRecursively();
        insertInSortedOrder(temp);
    }

    public void insertInSortedOrder(T element) {
        if (isEmpty() || (Integer) element >= (Integer) stackArray[top]) {
            push(element);
            return;
        }

        T temp = pop();
        insertInSortedOrder(element);
        push(temp);
    }

    public void displayRecursively() {
        if (isEmpty()) {
            return;
        }

        T temp = pop();
        displayRecursively();
        System.out.print(temp + " ");
        push(temp);
    }

    public void clearRecursively() {
        if (isEmpty()) {
            return;
        }

        pop();
        clearRecursively();
    }

    public void reverseRecursivelyDriver() {
        reverseRecursively();
        display();
    }
}