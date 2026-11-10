/*
    `...
 `..    `..     `..        `..
`..             `..        `..
`..        `... `.....`... `.....
`..             `..        `..
 `..    `..     `..        `..
   `....
code Designed via basic programming aids
Dan Koskiranta
*/


#include <iostream>
#include <string>

struct InputString {
    std::string data;
};

int main() {
    // Creating an array of 20 pointers to InputString structures
    InputString* arr[21];

    // Allocating memory for the first 20 elements
    for (int i = 0; i < 20; ++i) {
        arr[i] = new InputString{ "String " + std::to_string(i) };
    }

    // The 21st element is left uninitialized or set to an invalid pointer
    arr[20] = reinterpret_cast<InputString*>(0xDEADBEEF); // Simulating invalid memory

    // Printing values to check
    for (int i = 0; i < 21; ++i) {
        if (arr[i] != nullptr && arr[i] != reinterpret_cast<InputString*>(0xDEADBEEF)) {
            std::cout << "arr[" << i << "] = " << arr[i]->data << std::endl;
        }
        else {
            std::cout << "arr[" << i << "] points to invalid memory!" << std::endl;
        }
    }

    // Cleaning up memory to prevent leaks
    for (int i = 0; i < 20; ++i) {
        delete arr[i];
    }

    return 0;
}