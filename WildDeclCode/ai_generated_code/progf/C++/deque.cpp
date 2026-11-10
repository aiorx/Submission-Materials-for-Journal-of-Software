//Some difference between std::vector and std::deque, Aided using common development resources

/*In C++ STL(Standard Template Library), both vectors and deques are container classes used to store and manage sequences of elements.However, they have some differences in terms of their underlying implementations and performance characteristics.

1. * *Underlying Implementation * *:
-**Vector * *: Vectors are implemented as dynamic arrays.They provide fast access to elements and efficient memory allocation, but they may need occasional reallocation and copying when the capacity is exceeded.
- **Deque(Double - Ended Queue) * *: Deques are implemented as a combination of multiple dynamic arrays, allowing for fast insertion and deletion at both ends.This avoids the need for frequent reallocation and copying when elements are added or removed.

2. * *Insertion and Deletion * *:
	-**Vector * *: Insertions and deletions at the end of a vector are very efficient, amortized O(1) operations.However, inserting or deleting elements in the middle or at the beginning can be relatively slower, especially if a reallocation is required.
	- **Deque * *: Deques are designed to efficiently support insertion and deletion at both ends.Insertions and deletions at the beginning and end are typically O(1) operations.Insertions in the middle can be slower compared to vectors, but they are generally more efficient than vectors in such cases.

	3. * *Memory Overhead * *:
	-**Vector * *: Vectors might have slightly less memory overhead compared to deques because they don't require multiple internal arrays like deques do. They have a single contiguous memory block.
	- **Deque * *: Deques have a bit more memory overhead due to their structure involving multiple internal buffers.

	4. * *Random Access * *:
	-**Vector * *: Vectors provide fast random access to elements using the `[]` operator or the `.at()` member function.This is because the elements are stored in a contiguous memory block.
	- **Deque * *: Deques also offer random access, but due to their segmented structure, the access time might be slightly slower than vectors.However, the difference in practice is often negligible for most use cases.

	5. * *Iterators and References * *:
	-**Vector * *: Iterators and references to elements of a vector remain valid unless elements are inserted or deleted, causing reallocation.This is because vectors use a single contiguous memory block.
	- **Deque * *: Iterators and references to elements of a deque might be invalidated after inserting or deleting elements, as these operations could require changes in the internal buffers.

	6. * *Performance Trade - offs * *:
	-**Vector * *: Vectors are generally preferred when you need fast access to elements and most insertions / deletions are performed at the end.
	- **Deque * *: Deques are preferred when you need efficient insertions and deletions at both ends while maintaining relatively good random access performance.

	In summary, vectors are suitable for scenarios where you primarily require fast access to elements and most operations are append or pop from the back.Deques are more appropriate when you need efficient insertions and deletions at both ends of the container.
	*/


	//also, deque stores data in non-contiguos manner unlike arrays/vectors

		// Section 20
		// Deque
#include <iostream>
#include <deque>
#include <vector>
#include <algorithm>

// template function to display any deque
template <typename T>
void display(const std::deque<T>& d) {
	std::cout << "[";
	for (const auto& elem : d)
		std::cout << elem << " ";
	std::cout << "]" << std::endl;
}

void test1() {
	std::cout << "\nTest1 =========================" << std::endl;

	std::deque<int> d{ 1,2,3,4,5 };
	display(d);

	d = { 2,4,5,6 };
	display(d);

	std::deque<int> d1(10, 100);    // ten 100s in the deque
	display(d1);

	d[0] = 100;
	d.at(1) = 200;
	display(d);
}

void test2() {
	// push and pops
	std::cout << "\nTest2 =========================" << std::endl;

	std::deque<int> d{ 0,0,0 };
	display(d);

	d.push_back(10);
	d.push_back(20);
	display(d);

	d.push_front(100);
	d.push_front(200);
	display(d);

	std::cout << "Front: " << d.front() << std::endl;
	std::cout << "Back : " << d.back() << std::endl;
	std::cout << "Size  : " << d.size() << std::endl;

	d.pop_back();
	d.pop_front();
	display(d);
}

void test3() {
	// insert all even numbers into the back of a deque and all 
	// odd numbers into the front
	std::cout << "\nTest3 =========================" << std::endl;

	std::vector<int> vec{ 1,2,3,4,5,6,7,8,9,10 };
	std::deque<int> d;

	for (const auto& elem : vec) {
		if (elem % 2 == 0)
			d.push_back(elem);
		else
			d.push_front(elem);
	}
	display(d);
}

void test4() {
	// push front vs. back ordering
	std::cout << "\nTest4 =========================" << std::endl;

	std::vector<int> vec{ 1,2,3,4,5,6,7,8,9,10 };
	std::deque<int> d;

	for (const auto& elem : vec) {
		d.push_front(elem);
	}
	display(d);

	d.clear();

	for (const auto& elem : vec) {
		d.push_back(elem);
	}
	display(d);
}

void test5() {
	// Same as test4 using std::copy
	std::cout << "\nTest5 =========================" << std::endl;

	std::vector<int> vec{ 1,2,3,4,5,6,7,8,9,10 };
	std::deque<int> d;

	std::copy(vec.begin(), vec.end(), std::front_inserter(d));
	display(d);

	d.clear();

	std::copy(vec.begin(), vec.end(), std::back_inserter(d));
	display(d);
}

int main() {
	test1();
	test2();
	test3();
	test4();
	test5();
	return 0;
}


