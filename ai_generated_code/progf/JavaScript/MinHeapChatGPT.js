/***************************************************************************
 * Problem No. : 
 * Problem Name: Implement a min heap given an initial array
 * Date        : June 25, 2023
 * Author      : @codingbro
 *
 * meta        : tag-heap
 ***************************************************************************/

/**
 * This MinHeap class is Composed with basic coding tools,
 *  I can just use my own MinHeap class (customized from ChatGPT)
 *  to satisfy the LeetCode problem goals. 
 *  That'd be good enough.
 */
class MinHeapChatGPT {
    constructor() {
        this.heap = [];
    }

    // Helper function to swap two elements in the heap
    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    // Helper function to maintain the heap property starting from index i
    heapify(i) {
        const n = this.heap.length;
        let temp = this.heap[i];
        let childIndex;

        for (; i * 2 < n; i = childIndex) {
            childIndex = i * 2;

            // Choose the smaller of the two (left, right) children
            if (childIndex != n - 1 && this.heap[childIndex][1] > this.heap[childIndex + 1][1]) {
                childIndex++;
            }

            if (temp[1] > this.heap[childIndex][1]) {
                this.heap[i] = this.heap[childIndex];
            } else {
                break;
            }
        }

        this.heap[i] = temp;
    }

    // Build a heap from an array of [number, frequency] pairs
    buildHeap(array) {
        this.heap = array.slice();
        const n = this.heap.length;

        // Start from the last non-leaf node and heapify each node in reverse order
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            this.heapify(i);
        }
    }

    // Remove the minimum element from the heap
    removeMin() {
        if (this.isEmpty()) {
            return undefined;
        }

        const min = this.heap[0];
        const last = this.heap.pop();

        if (this.heap.length > 0) {
            this.heap[0] = last;
            this.heapify(0);
        }

        return min;
    }

    // Get the minimum element from the heap without removing it
    peek() {
        return this.heap[0];
    }

    // Get the size of the heap
    size() {
        return this.heap.length;
    }

    // Check if the heap is empty
    isEmpty() {
        return this.heap.length === 0;
    }
}

function createMinHeapFromFrequencyMap(freqMap) {
    const array = Array.from(freqMap);
    const minHeap = new MinHeapChatGPT();
    minHeap.buildHeap(array);
    return minHeap;
}