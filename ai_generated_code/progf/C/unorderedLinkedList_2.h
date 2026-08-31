#ifndef H_UnorderedLinkedList
#define H_UnorderedLinkedList  

#include "linkedList.h"
#include <chrono>
#include <ctime>

using namespace std; 

template <class Type> 
class unorderedLinkedList: public linkedListType<Type>
{
    /* Note: I had to add this-> to every instance of first, last, and count in this header file to get rid of numerious errors.*/
public:
    bool search(const Type& searchItem) const;
      //Function to determine whether searchItem is in the list.
      //Postcondition: Returns true if searchItem is in the 
      //               list, otherwise the value false is 
      //               returned.

    void insertFirst(const Type& newItem);
      //Function to insert newItem at the beginning of the list.
      //Postcondition: first points to the new list, newItem is
      //               inserted at the beginning of the list,
      //               last points to the last node in the  
      //               list, and count is incremented by 1.

    void insertLast(const Type& newItem);
      //Function to insert newItem at the end of the list.
      //Postcondition: first points to the new list, newItem 
      //               is inserted at the end of the list,
      //               last points to the last node in the 
      //               list, and count is incremented by 1.

    void deleteNode(const Type& deleteItem);
      //Function to delete deleteItem from the list.
      //Postcondition: If found, the node containing 
      //               deleteItem is deleted from the list.
      //               first points to the first node, last
      //               points to the last node of the updated 
      //               list, and count is decremented by 1.

    /* All functions after this were Assisted with basic coding tools utilzing the linkedList.h and unorderedLinkedList.h header files. Changes were made to the functions to ensure timestamping of sorts */
private:
    nodeType<Type>* merge(nodeType<Type>* left, nodeType<Type>* right);
     // Recursive function to merge the two halves of the linked list together

    void split(nodeType<Type>* source, nodeType<Type>** frontRef, nodeType<Type>** backRef);
     // Function that splits the linked list into two halves

    nodeType<Type>* mergeSortHelper(nodeType<Type>* head);
     // Recursive function that operates on the head of the linked list, recursively splitting the entire linked list like a binary search, then merging them back together.

public:

    void mergeSort();
     // Function that goes through the entire linked list and sorts the list, setting up first and last pointers along the way.

    void selectionSort();
     // This function finds the smallest element in the unsorted part of the list and swaps it with the first element of the unsorted part over and over again until completion.

}; 


template <class Type>
bool unorderedLinkedList<Type>::
                   search(const Type& searchItem) const
{
    nodeType<Type> *current; //pointer to traverse the list
    bool found = false;
    
    current = this->first; //set current to point to the first 
                     //node in the list

    while (current != nullptr && !found)    //search the list
        if (current->info == searchItem) //searchItem is found
            found = true;
        else
            current = current->link; //make current point to
                                     //the next node
    return found; 
}//end search

template <class Type>
void unorderedLinkedList<Type>::insertFirst(const Type& newItem)
{
    nodeType<Type> *newNode; //pointer to create the new node

    newNode = new nodeType<Type>; //create the new node

    newNode->info = newItem;    //store the new item in the node
    newNode->link = this->first;      //insert newNode before first
    this->first = newNode;            //make first point to the
                                //actual first node
    this->count++;                    //increment count

    if (this->last == nullptr)   //if the list was empty, newNode is also 
                        //the last node in the list
        this->last = newNode;
}//end insertFirst

template <class Type>
void unorderedLinkedList<Type>::insertLast(const Type& newItem)
{
    nodeType<Type> *newNode; //pointer to create the new node

    newNode = new nodeType<Type>; //create the new node

    newNode->info = newItem;  //store the new item in the node
    newNode->link = nullptr;     //set the link field of newNode
                              //to nullptr

    if (this->first == nullptr)  //if the list is empty, newNode is 
                        //both the first and last node
    {
        this->first = newNode;
        this->last = newNode;
        this->count++;        //increment count
    }
    else    //the list is not empty, insert newNode after last
    {
        this->last->link = newNode; //insert newNode after last
        this->last = newNode; //make last point to the actual 
                        //last node in the list
        this->count++;        //increment count
    }
}//end insertLast


template <class Type>
void unorderedLinkedList<Type>::deleteNode(const Type& deleteItem)
{
    nodeType<Type> *current; //pointer to traverse the list
    nodeType<Type> *trailCurrent; //pointer just before current
    bool found;

    if (this->first == nullptr)    //Case 1; the list is empty. 
        cout << "Cannot delete from an empty list."
             << endl;
    else
    {
        if (this->first->info == deleteItem) //Case 2 
        {
            current = this->first;
            this->first = this->first->link;
            this->count--;
            if (this->first == nullptr)    //the list has only one node
                this->last = nullptr;
            delete current;
        }
        else //search the list for the node with the given info
        {
            found = false;
            trailCurrent = this->first;  //set trailCurrent to point
                                   //to the first node
            current = this->first->link; //set current to point to 
                                   //the second node

            while (current != nullptr && !found)
            {
                if (current->info != deleteItem) 
                {
                    trailCurrent = current;
                    current = current-> link;
                }
                else
                    found = true;
            }//end while

            if (found) //Case 3; if found, delete the node
            {
                trailCurrent->link = current->link;
                this->count--;

                if (this->last == current)   //node to be deleted 
                                       //was the last node
                    this->last = trailCurrent; //update the value 
                                         //of last
                delete current;  //delete the node from the list
            }
            else
                cout << "The item to be deleted is not in "
                     << "the list." << endl;
        }//end else
    }//end else
}//end deleteNode

/* All functions below were generated through ChatGPT, utilizing linkedList.h and unorderedLinkedList.h as resources. I changed the Merge Sort and Selection Sort to include timestamping to compare their efficiency. */
template <class Type>
nodeType<Type>* unorderedLinkedList<Type>::merge(nodeType<Type>* left, nodeType<Type>* right) {
    if (!left) return right;
    if (!right) return left;

    nodeType<Type>* result = nullptr;
    if (left->info <= right->info) {
        result = left;
        result->link = merge(left->link, right);
    }
    else {
        result = right;
        result->link = merge(left, right->link);
    }
    return result;
}

template <class Type>
void unorderedLinkedList<Type>::split(nodeType<Type>* source, nodeType<Type>** frontRef, nodeType<Type>** backRef) {
    nodeType<Type>* fast = source->link;
    nodeType<Type>* slow = source;

    while (fast) {
        fast = fast->link;
        if (fast) {
            slow = slow->link;
            fast = fast->link;
        }
    }

    *frontRef = source;
    *backRef = slow->link;
    slow->link = nullptr;
}

template <class Type>
nodeType<Type>* unorderedLinkedList<Type>::mergeSortHelper(nodeType<Type>* head) {
    if (!head || !head->link)
        return head;

    nodeType<Type>* left = nullptr;
    nodeType<Type>* right = nullptr;

    split(head, &left, &right);

    left = mergeSortHelper(left);
    right = mergeSortHelper(right);

    return merge(left, right);
}

template <class Type>
void unorderedLinkedList<Type>::mergeSort() {
    // initialize beginning time of Merge Sort
    auto beginningTimeNow = std::chrono::system_clock::now();
    auto beginningTimeDuration = beginningTimeNow.time_since_epoch();
    auto beginningTimeMilliseconds = std::chrono::duration_cast<std::chrono::milliseconds>(
        beginningTimeDuration)
        .count();

    // ChatGPT generated function begins
    this->first = mergeSortHelper(this->first);

    // Re-adjust the last pointer
    nodeType<Type>* temp = this->first;
    while (temp && temp->link) {
        temp = temp->link;
    }
    this->last = temp;
    // ChatGPT generated function ends
   
     // initialize ending time of Merge Sort
    auto endingTimeNow = std::chrono::system_clock::now();
    auto endingTimeDuration = endingTimeNow.time_since_epoch();
    auto endingTimeMilliseconds = std::chrono::duration_cast<std::chrono::milliseconds>(
        endingTimeDuration)
        .count();

    // output beginning and end times of Merge Sort as well as the difference between them
    std::cout << "Beginning time in milliseconds of Merge Sort is: " << beginningTimeMilliseconds << std::endl;
    std::cout << "Ending time in milliseconds of Merge Sort is: " << endingTimeMilliseconds << std::endl;
    std::cout << "Time the Merge Sort took in milliseconds: " << (endingTimeMilliseconds - beginningTimeMilliseconds) << std::endl;
}

template <class Type>
void unorderedLinkedList<Type>::selectionSort() {

    // initialize beginning time of Selection Sort
    auto beginningTimeNow = std::chrono::system_clock::now();
    auto beginningTimeDuration = beginningTimeNow.time_since_epoch();
    auto beginningTimeMilliseconds = std::chrono::duration_cast<std::chrono::milliseconds>(
        beginningTimeDuration)
        .count();

    // ChatGPT generated function begins
    if (!this->first || !this->first->link)
        return;

    nodeType<Type>* current = this->first;
    while (current) {
        nodeType<Type>* minNode = current;
        nodeType<Type>* search = current->link;

        // Find the smallest node
        while (search) {
            if (search->info < minNode->info)
                minNode = search;
            search = search->link;
        }

        // Swap data
        if (minNode != current) {
            Type temp = current->info;
            current->info = minNode->info;
            minNode->info = temp;
        }

        current = current->link;
    }
    // ChatGPT generated function ends
    
    // initialize ending time of Selection Sort
    auto endingTimeNow = std::chrono::system_clock::now();
    auto endingTimeDuration = endingTimeNow.time_since_epoch();
    auto endingTimeMilliseconds = std::chrono::duration_cast<std::chrono::milliseconds>(
        endingTimeDuration)
        .count();

    // output beginning and end times of Selection Sort as well as the difference between them
    std::cout << "Beginning time in milliseconds of Selection Sort is: " << beginningTimeMilliseconds << std::endl;
    std::cout << "Ending time in milliseconds of Selection Sort is: " << endingTimeMilliseconds << std::endl;
    std::cout << "Time the Selection Sort took in milliseconds: " << (endingTimeMilliseconds - beginningTimeMilliseconds) << std::endl;
}

#endif
