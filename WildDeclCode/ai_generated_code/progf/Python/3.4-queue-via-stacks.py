'''
3.4 Queue via Stacks:
Implement a MyQueue class which implements a queue using two stacks.
'''

'''
queue operations: 
- append
- popleft
- peek
- isempty.

stack is LIFO
queue is FIFO

how to change LIFO to FIFO?
pop all elements into a 2nd stack to change it.


- 1st stack as the one to hold all the pushed items.
- 2nd stack to hold items that can be popped in FIFO.

for each pop,
    - if 2nd stack empty, pop and push all from 1st stack (assuming not empty, else error).
        - then return top item.
    - else, just pop from second stack.

for each push,
    - just push onto 1st stack.
'''
import unittest

class MyQueue:
    def __init__(self):
        self.pushes = []
        self.pops = []

    def push(self, elem):
        self.pushes.append(elem)

    def pop(self):
        # if empty, return None
        if self.empty():
            raise IndexError
        
        if not self.pops:
            assert self.pushes
            while self.pushes:
                self.pops.append(self.pushes.pop())    
        return self.pops.pop()
    
    def empty(self):
        return not self.pushes and not self.pops

    def peek(self):
        # if empty, return None
        if self.empty():
            raise IndexError
        # if pops is empty, do the same thing as pop
        if not self.pops and self.pushes:
            while self.pushes:
                self.pops.append(self.pushes.pop())
        return self.pops[-1]
    
# test cases Supported via standard programming aids.
class TestMyQueue(unittest.TestCase):
    def test_empty_on_new_queue(self):
        q = MyQueue()
        self.assertTrue(q.empty())

    def test_enqueue_dequeue_single(self):
        q = MyQueue()
        q.push(1)
        self.assertFalse(q.empty())
        self.assertEqual(q.peek(), 1)
        self.assertEqual(q.pop(), 1)
        self.assertTrue(q.empty())

    def test_enqueue_multiple(self):
        q = MyQueue()
        for i in range(5):
            q.push(i)
        for i in range(5):
            # each time, peek should match the next pop
            self.assertEqual(q.peek(), i)
            self.assertEqual(q.pop(), i)
        self.assertTrue(q.empty())

    def test_interleaved_operations(self):
        q = MyQueue()
        q.push(1)
        q.push(2)
        q.push(3)
        # pop one, then push another, ensure order is preserved
        self.assertEqual(q.pop(), 1)
        q.push(4)
        self.assertEqual(q.pop(), 2)
        self.assertEqual(q.peek(), 3)
        self.assertFalse(q.empty())
        self.assertEqual(q.pop(), 3)
        self.assertEqual(q.pop(), 4)
        self.assertTrue(q.empty())

    def test_pop_empty_raises(self):
        q = MyQueue()
        with self.assertRaises(IndexError):
            q.pop()

    def test_peek_empty_raises(self):
        q = MyQueue()
        with self.assertRaises(IndexError):
            q.peek()

if __name__ == "__main__":
    unittest.main()
        


