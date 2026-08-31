/**
*
* @author - Hugh Hui
* @file milestone1.cpp -  This file contains the 'main' function.

12/30/2024 - Designed via basic programming aids with prompt "write C++ program reads and parses
the file: milestone1_config.json"
*            The file: "milestones1_config.json" is in the following format:
                {
                    "Milestone1": [
                        {
                            "files": [
                                {
                                    "inputFile": "milestone1.json",
                                    "outputFile": "generatedOutputFile.txt",
                                    "errorLogFile":"logFile.txt"
                                }
                            ],
                            "defaultVariables": [
                                {
                                    "FIFOListSize": 5,
                                    "hashTableSize": 11
                                }
                            ]
                        }
                    ]
                }
            and where the inputFile has the following format:
                {
                    "DoublyLinkedList": [
                       {
                        "testCase1": [
                          {
                            "isEmpty": {}
                          },
                          {
                            "insertAtHead": 50
                          },
                          ...
                        ]
                      }
                    ]
                }

1/9/2025 - modified by H. Hui; added separate files, DEFINE and comments
1/14/2025 - modified by H. Hui; modified print, so that it would display to
console and write to file; added comments

*/

#include "doubly_linked_list.h"
#include "generate_output.h"
#include "json.hpp"
#include <fstream>
#include <iostream>

#define CONFIG_FILE "milestone1_config.json"
using json = nlohmann::json;

// Global variable to be used for logging output
std::ofstream _outFile;

/**
 *
 * getOutFile
 *
 * function to return pointer to outFile
 *
 * @param        none
 *
 * @return       pointer to output file
 */
std::ofstream &getOutFile() { return _outFile; }

/**
 *
 * setOutFile
 *
 * function to set path and open output file
 *
 * @param filePath       the path to output file
 *
 * @return               nothing
 */
void setOutFile(const std::string &filePath) {
  // Close the current file if it's already open
  if (_outFile.is_open()) {
    _outFile.close();
  }

  // Open the new file
  _outFile.open(filePath);
  if (!_outFile.is_open()) {
    std::cerr << "Failed to open file: " << filePath << std::endl;
  }
}

/**
 *
 * processTestCases
 *
 * function to proocess test cases, based upon test data in json format
 *
 * @param dll        dll to process
 * @param testcases  list of test cases to process
 *
 * @return           nothing, but output is sent to console and written to
 * output file
 */
void processTestCases(DoublyLinkedList &dll, const json &testCases) {
  // Get the output file
  std::ofstream &outFile = getOutFile();

  // Loop over each test case
  for (auto &testCase : testCases.items()) {
    std::cout << "Processing " << testCase.key() << ":\n";
    outFile << "Processing " << testCase.key() << ":\n";

    // Loop over each operation in the test case
    for (auto &operation : testCase.value()) {
      if (operation.contains("isEmpty")) {
        std::cout << "isEmpty: " << (dll.isEmpty() ? "True" : "False")
                  << std::endl;
        outFile << "isEmpty: " << (dll.isEmpty() ? "True" : "False")
                << std::endl;
      } else if (operation.contains("insertAtHead")) {
        dll.insertAtHead(operation["insertAtHead"]);
        std::cout << "Inserted at head: " << operation["insertAtHead"]
                  << std::endl;
        outFile << "Inserted at head: " << operation["insertAtHead"]
                << std::endl;
      } else if (operation.contains("insertAtTail")) {
        dll.insertAtTail(operation["insertAtTail"]);
        std::cout << "Inserted at tail: " << operation["insertAtTail"]
                  << std::endl;
        outFile << "Inserted at tail: " << operation["insertAtTail"]
                << std::endl;
      } else if (operation.contains("remove")) {
        dll.remove(operation["remove"]);
        std::cout << "Removed: " << operation["remove"] << std::endl;
        outFile << "Removed: " << operation["remove"] << std::endl;
      } else if (operation.contains("removeHeaderNode")) {
        dll.removeHeaderNode();
        std::cout << "Removed header node" << std::endl;
        outFile << "Removed header node" << std::endl;
      } else if (operation.contains("removeTailNode")) {
        dll.removeTailNode();
        std::cout << "Removed tail node" << std::endl;
        outFile << "Removed tail node" << std::endl;
      } else if (operation.contains("moveNodeToHead")) {
        dll.moveNodeToHead(operation["moveNodeToHead"]);
        std::cout << "Moved node to head: " << operation["moveNodeToHead"]
                  << std::endl;
        outFile << "Moved node to head: " << operation["moveNodeToHead"]
                << std::endl;
      } else if (operation.contains("moveNodeToTail")) {
        dll.moveNodeToTail(operation["moveNodeToTail"]);
        std::cout << "Moved node to tail: " << operation["moveNodeToTail"]
                  << std::endl;
        outFile << "Moved node to tail: " << operation["moveNodeToTail"]
                << std::endl;
      }
    }

    // Print the doubly linked list after processing the test case
    std::cout << "List after " << testCase.key() << ":\n";
    outFile << "List after " << testCase.key() << ":\n";
    printList(dll);

    // Reverse print the doubly linked list after processing the test case
    std::cout << "Reverse List after " << testCase.key() << ":\n";
    outFile << "Reverse List after " << testCase.key() << ":\n";
    reversePrintList(dll);

    // Clear the list before processing the next test case
    dll.clear();
  }
}

/**
 *
 * main
 *
 * main function which does the following:
 *   read config file for input file and output file
 *   create a doublyLinkedList
 *   process test cases - display results to console and write to output file
 *
 * @param    none
 *
 * @return   nothing, but output is written to console and files
 */
int main() {
  // Load the config file
  std::ifstream configFile(CONFIG_FILE);
  if (!configFile.is_open()) {
    std::cerr << "Error opening config file!" << std::endl;
    return 1;
  }

  json config;
  configFile >> config;

  // Retrieve file paths from the config
  std::string inputFilePath = config["Milestone1"][0]["files"][0]["inputFile"];
  std::string outputFilePath =
      config["Milestone1"][0]["files"][0]["outputFile"];

  // Open the input file containing test cases
  std::ifstream inputFile(inputFilePath);
  if (!inputFile.is_open()) {
    std::cerr << "Error opening input file!" << std::endl;
    return 1;
  }

  json testCases;
  inputFile >> testCases;

  // Open up the outfile and set the output file path using the setter
  //
  // Treating output file differently than input and config files because it's
  // used in other files
  setOutFile(outputFilePath);

  // Get the output file
  std::ofstream &outFile = getOutFile();

  // Create the doubly linked list
  DoublyLinkedList dll;

  // Process test cases and write output to the output file
  processTestCases(dll, testCases["DoublyLinkedList"][0]);

  // Close files
  configFile.close();
  inputFile.close();
  outFile.close();

  return 0;
}
