/**
*
* milestone2.cpp : This file contains the 'main' function. Program execution begins and ends there.
*
* 09/23/24 - Formed using common development resources with prompt "write C++ program reads and parses the file: milestone2.json"
*            The file: "milestones2.json" is in the following format:
* {
    "doublyLinkedList": [
        {"testCase1": [
                {"insertAtHead": 100},
                {"insertAtTail": 10},
                {"insertAtTail": 20}
            ],
.
.
.
        {"testCase6": [
                {"insertAtHead": 30},
                {"insertAtTail": 40},
                {"insertAtTail": 50},
                {"insertAtTail": 60},
                {"insertAtHead": 1000},
                {"deleteTailNode": 0}
            ]
        }
    ]
}
*/

#include <iostream>
#include <fstream>
#include <string>
#include "json.hpp"                                                     // Include the JSON library for parsing
#include "DoublyLinkedList.hpp"

using json = nlohmann::json;                                            // Create an alias for the json type

/**
* main
* 
* main kicks off the processing for milestone2
* 
* @param none
*/
int main() {
    // open the input file and exit if not found
    std::ifstream inputFile("milestone2.json");
    if (!inputFile.is_open()) {
        std::cerr << "Could not open the file!" << std::endl;
        return -1;
    }

    // Read the entire file content into a string and then close the file
    std::string jsonInput((std::istreambuf_iterator<char>(inputFile)),
        std::istreambuf_iterator<char>());
    inputFile.close();

    // parse the JSON string into a json object
    json j = json::parse(jsonInput);

    // create the DoublyLinkedList
    DoublyLinkedList* dll = new DoublyLinkedList();

    // for each test case from the parsed JSON file
    for (const auto& testCase : j["doublyLinkedList"][0].items()) {
        // print out the name of the testcase
        std::cout << "Running " << testCase.key() << ":\n";

        // for each operation
        //   for each operation item
        //     get the operation name
        //     get the value as an integer
        //     execute the operation on the doubly linked list
        for (const auto& operation : testCase.value()) {
            for (const auto& op : operation.items()) {
                std::string opName = op.key();
                int value = op.value().get<int>();

                if (opName == "insertAtHead") {
                    Node* newNode = new Node(value);
                    dll->insertAtHead(newNode);
                }
                else if (opName == "insertAtTail") {
                    Node* newNode = new Node(value);
                    dll->insertAtTail(newNode);
                }
                else if (opName == "deleteNode") {
                    Node* existingNode = dll->findNode(value);
                    dll->deleteNode(existingNode);
                }
                else if (opName == "moveToHead") {
                    Node* existingNode = dll->findNode(value);
                    dll->moveToHead(existingNode);
                }
                else if (opName == "moveToTail") {
                    Node* existingNode = dll->findNode(value);
                    dll->moveToTail(existingNode);
                }
                else if (opName == "deleteHeadNode") {
                    dll->deleteHeadNode();
                }
                else if (opName == "deleteTailNode") {
                    dll->deleteTailNode();
                }
            }
        }

        // print out the list
        IntVector* result = dll->toVector();
        std::cout << "List contents in order:" << std::endl;
        for (size_t i = 0; i < result->size(); ++i) {
            int value = result->at(i);
            std::cout << value << " ";
        }
        std::cout << std::endl;

        // print out in reverse order
        IntVector* reverseResult = dll->toReverseVector();
        std::cout << "List contents in reverse order:  " << std::endl;
        for (size_t i = 0; i < reverseResult->size(); ++i) {
            int value = reverseResult->at(i);
            std::cout << value << " ";
        }
        std::cout << "\n\n";


        dll->deleteList();
    }

    return 0;
}