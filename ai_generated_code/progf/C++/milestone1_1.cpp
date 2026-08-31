/**
*
* @author - Hugh Hui
* @file milestone1.cpp -  This file contains the 'main' function.
  @brief Main driver to execute operations on a doubly linked list based on JSON input.

12/30/2024 - Crafted with standard coding tools with prompt "write C++ program reads and parses the file: milestone1_config.json"
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
1/14/2025 - modified by H. Hui; modified print, so that it would display to console and write to file; added comments

*/

#include <iostream>
#include <fstream>
#include "json.hpp"
#include "doubly_linked_list.h"

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
std::ofstream& getOutFile() {
    return _outFile;
}


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
void setOutFile(const std::string& filePath) {
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
 * @brief Logs a message to both the console and the output file.
 *
 * This helper function prints a message to the console and writes the same
 * message to the output file.
 *
 * @param message The message to log
 */
void logToFileAndConsole(std::string message) {
    // Get the output file
    std::ofstream& outFile = getOutFile();

    std::cout << message << std::endl;  // Print to console 
    outFile << message << std::endl;  // Write to file
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
* @return           nothing, but output is sent to console and written to output file
*/
void processTestCases(DoublyLinkedList& dll, const json& testCases) {
    logToFileAndConsole("\nProcessing commands:\n");

    // Loop over each test case
    for (auto& testCase : testCases.items()) {
        logToFileAndConsole("\nProcessing " + testCase.key() + "\n");

        // Loop over each operation in the test case
        for (auto& operation : testCase.value()) {
            if (operation.contains("isEmpty")) {
                logToFileAndConsole("Calling isEmpty().");
                bool result = dll.isEmpty();
                logToFileAndConsole("isEmpty returned: " + std::to_string(result));
            }
            else if (operation.contains("insertAtHead")) {
                int key = operation["insertAtHead"];
                logToFileAndConsole("Calling insertAtHead(" + std::to_string(key) + ").");
                dll.insertAtHead(key);
                logToFileAndConsole("Successfully inserted at head: " + std::to_string(key));
            }
            else if (operation.contains("insertAtTail")) {
                int key = operation["insertAtTail"];
                logToFileAndConsole("Calling insertAtTail(" + std::to_string(key) + ").");
                dll.insertAtTail(key);
                logToFileAndConsole("Successfully inserted at tail: " + std::to_string(key));
            }
            else if (operation.contains("remove")) {
                int key = operation["remove"];
                logToFileAndConsole("Calling remove(" + std::to_string(key) + ")");
                dll.remove(key);
                logToFileAndConsole("Successfully removed: " + std::to_string(key));
            }
            else if (operation.contains("removeHeaderNode")) {
                logToFileAndConsole("Calling removeHeaderNode()");
                dll.removeHeaderNode();
                logToFileAndConsole("Successfully called removeHeaderNode.");
            }
            else if (operation.contains("removeTailNode")) {
                logToFileAndConsole("Calling removeTailNode()");
                dll.removeTailNode();
                logToFileAndConsole("Successfully called removeHeaderNode.");
            }
            else if (operation.contains("moveNodeToHead")) {
                int key = operation["moveNodeToHead"];
                logToFileAndConsole("Calling moveNodeToHead(" + std::to_string(key) + ")");
                dll.moveNodeToHead(key);
                logToFileAndConsole("Successfully moved node to head: " + std::to_string(key));
            }
            else if (operation.contains("moveNodeToTail")) {
                int key = operation["moveNodeToTail"];
                logToFileAndConsole("Calling moveNodeToTail(" + std::to_string(key) + ")");
                dll.moveNodeToTail(key);
                logToFileAndConsole("Successfully moved node to tail: " + std::to_string(key));
            }
            else if (operation.contains("printList")) {
                dll.printList();
            }
            else if (operation.contains("reversePrintList")) {
                dll.reversePrintList();
            }
            else if (operation.contains("clear")) {
                dll.clear();
            }
        }

        logToFileAndConsole("\nSuccessfully processed: " + testCase.key());

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
    std::string outputFilePath = config["Milestone1"][0]["files"][0]["outputFile"];

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
    // Treating output file differently than input and config files because it's used in other files
    setOutFile(outputFilePath);

    // Get the output file
    std::ofstream& outFile = getOutFile();

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
