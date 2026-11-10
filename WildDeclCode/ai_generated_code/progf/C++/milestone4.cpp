/**
*
* @author - Hugh Hui
* @file milestone4.cpp -  This file contains the 'main' function.

12/30/2024 - Designed via basic programming aids with prompt "write C++ program reads and parses the file: milestone4_config.json"
*            The file: "milestones4_config.json" is in the following format:
                {
                    "Milestone4": [
                        {
                            "files": [
                                {
                                    "inputFile": "milestone4.json",
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
2/1/2025 - H. Hui added doxygen formatted comments
*/

#include <iostream>
#include <fstream>
#include <string>
#include "json.hpp"
#include "milestone4.h"
#include "binary_search_tree.h"

using json = nlohmann::json;
#define CONFIG_FILE "milestone4_config.json"

// Global variable to be used for logging output
std::ofstream _outFile;

/**
 * @brief Returns a reference to the output file stream.
 *
 * This function provides access to the output file used for logging.
 *
 * @return Reference to the output file stream.
 */
std::ofstream& getOutFile() {
    return _outFile;
}

/**
 * @brief Sets the path and opens the output file for logging.
 *
 * This function sets the path to the output file and opens it for writing.
 * If the file is already open, it will be closed before opening the new file.
 *
 * @param filePath The path to the output file.
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
 * @param message The message to log.
 */
void logToFileAndConsole(const std::string& message) {
    // Get the output file
    std::ofstream& outFile = getOutFile();

    std::cout << message << std::endl;  // Print to console 
    outFile << message << std::endl;  // Write to file
}

/**
 * @brief Processes test cases from the JSON input.
 *
 * This function processes each test case from the JSON object by executing
 * actions such as adding/removing keys from the binary search tree, checking
 * tree properties, and logging results.
 *
 * @param bst The BinarySearchTree object to modify.
 * @param actions The JSON array of actions to process.
 */
void processTestCase(BinarySearchTree& bst, const json& actions) {
    // Get the output file
    std::ofstream& outFile = getOutFile();

    // Iterate over the actions in the cacheManager array
    for (const auto& actionGroup : actions) {
        // For each "testCase" object in actionGroup
        for (const auto& actionSet : actionGroup.items()) {
            // Log the action group being processed
            logToFileAndConsole("\n\nProcessing actions for: " + actionSet.key());

            // actionSet.value() is the list of actions under this test case
            const auto& actions = actionSet.value();

            // Process each action within the test case
            for (const auto& action : actions) {
                // Loop through each item in the action and process the operation (add, remove, isEmpty, etc.)
                for (auto& [key, value] : action.items()) {
                    if (key == "add") {
                        int key = value["key"];
                        bst.addToTree(key);
                        logToFileAndConsole("Added key: " + std::to_string(key));
                    }
                    else if (key == "remove") {
                        int key = value["key"];
                        if (bst.removeNode(key)) {
                            logToFileAndConsole("Removed key: " + std::to_string(key));
                        }
                        else {
                            logToFileAndConsole("Failed to remove key: " + std::to_string(key));
                        }
                    }
                    else if (key == "getNumberOfItems") {
                        logToFileAndConsole("Count of Tree nodes is: " + std::to_string(bst.getNumberOfTreeNodes()));
                    }
                    else if (key == "contains") {
                        int key = value["key"];
                        if (bst.contains(key)) {
                            logToFileAndConsole("TRUE, following key is in the tree: " + std::to_string(key));
                        }
                        else {
                            logToFileAndConsole("FALSE, following key is NOT in the tree: " + std::to_string(key));
                        }
                    }
                    else if (key == "isEmpty") {
                        bool empty = bst.isEmpty();
                        logToFileAndConsole("Tree is empty: " + std::string(empty ? "Yes" : "No"));
                    }
                    else if (key == "clear") {
                        bst = BinarySearchTree();  // Reset the tree
                        logToFileAndConsole("Tree cleared.");
                    }
                }
            }

            logToFileAndConsole("Height of Tree is: " + std::to_string(bst.getHeightOfTree()));
            logToFileAndConsole("Count of Tree nodes is: " + std::to_string(bst.getNumberOfTreeNodes()));
            logToFileAndConsole("Listed on the next line is the Root node");
            bst.printNodeFromTree(bst.getRoot());
            bst.printBreadthFirst();
            bst.printDepthFirst();
            bst.printInOrder();
            bst.printPostOrder();
            bst.printPreOrder();
            bst.clear();
        }
    }
}

/**
 * @brief Main function of the program.
 *
 * The main function handles the following tasks:
 * - Loads the configuration file and extracts necessary parameters (input file,
 *   output file, etc.).
 * - Opens the output file for logging.
 * - Processes each test case by reading the corresponding input file and executing
 *   actions on the BinarySearchTree.
 * - Logs results to both console and output files.
 *
 * @return Returns 0 on successful execution or 1 if an error occurs.
 */
int main() {
    // Load CONFIG_FILE and handle errors if it's missing or invalid
    std::ifstream configFile(CONFIG_FILE);

    if (!configFile) {
        std::string configString(CONFIG_FILE);
        std::cerr << "Error: Configuration file not found: " + configString << std::endl;
        return 1;  // Exit the program if the config file can't be opened
    }

    json config;
    configFile >> config;

    auto& milestone4 = config["Milestone4"];
    for (const auto& milestone : milestone4) {
        for (const auto& fileConfig : milestone["files"]) {
            std::string inputFile = fileConfig["inputFile"];
            std::string outputFile = fileConfig["outputFile"];
            std::string errorLogFile = fileConfig["errorLogFile"];

            std::cout << "inputFile: " << inputFile << std::endl;
            std::cout << "outputFile: " << outputFile << std::endl;
            std::cout << "errorLogFile: " << errorLogFile << std::endl;

            // Open up the outfile and set the output file path using the setter
            setOutFile(outputFile);

            // Log to the file and console
            logToFileAndConsole("Testing out global.");

            // Open the error log file for writing
            std::ofstream errorFile(errorLogFile);

            // Open input file 
            std::ifstream file(inputFile);
            if (!file) {
                std::cerr << "Error opening input file!" << std::endl;
                return 1;
            }

            // Open the input test file
            std::ifstream testFile(inputFile);

            json testCases;
            testFile >> testCases;

            BinarySearchTree bst;

            // Process the actions from the test cases
            processTestCase(bst, testCases["cacheManager"]);
        }
    }

    return 0;
}
