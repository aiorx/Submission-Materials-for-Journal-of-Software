/**
*
* milestone5.cpp : This file contains the 'main' function. Program execution begins and ends there.
*
* 09/23/24 - Designed via basic programming aids with prompt "write C++ program reads and parses the file: milestone5_config.json"
*            The file: "milestones5_config.json" is in the following format:
*
                {
                    "Milestone5": [
                        {
                            "files": [
                                {
                                    "inputFile": "milestone5.json",
                                    "outputFile": "generatedOutputFile.txt",
                                    "errorLogFile":"logFile.txt"
                                }
                            ],
                            "defaultVariables": [
                                {
                                    "FIFOListSize": 5,
                                    "hashTableSize": 101
                                }
                            ]
                        }
                    ]
                }
            and where the inputFile has the following format:
                {
                    "hashTable": [
                        {
                            "testCase1": [
                                {
                            "isEmpty": {}
                        },
                        {
                            "add": {"key" : 20, "fullName" : "John Doe2", "address" : "1234 Log St", "city" : "Oakland", "state" : "CA", "zip" : "12345"}
                        },
                          ...
                        ]
                      }
                    ]
                }

1/10/2025 - modified by H. Hui; added separate files, DEFINE and comments
1/13/2025 - modified by H. Hui; moved DoublyLinkedList print methods to main as functions; added code to remove oldest nodes from hash table and FIFO list, if FIFOSize limit was exceeded
1/14/2025 - modified by H. Hui; modified print functions, so that it would print name, address, city, state and zip fields from the FIFO list

*/
#define _CRT_SECURE_NO_WARNINGS
#define CONFIG_FILE "milestone5_config.json"

#include <iostream>
#include <fstream>
#include <string>

#include "json.hpp"
#include "cache_manager.h"

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
* processTestCase
*
* function to proocess test cases, based upon test data in json format
*
* @param    cacheManager    cacheManager to test
* @param    testCaseName    test name
* @param    testCaseArray   test array
*
* @return                   nothing, but output is sent to console and written to output file
*/
void processTestCase(CacheManager* cacheManager, const std::string& testCaseName, const json& testCaseArray) {
    logToFileAndConsole("\nProcessing " + testCaseName + ":\n\n");

    for (size_t i = 0; i < testCaseArray.size(); ++i) {
        const json& entry = testCaseArray[i];

        for (json::const_iterator it = entry.begin(); it != entry.end(); ++it) {
            const std::string& actionName = it.key();
            const json& details = it.value();

            if (actionName == "isEmpty") {
                bool result = cacheManager->isEmpty();
                logToFileAndConsole("isEmpty: " + std::to_string(result));
            }
            else if (actionName == "contains") {
                int key = details["key"];
                bool result = cacheManager->contains(key);
                logToFileAndConsole("contains(" + std::to_string(key) + "): " + std::to_string(result));
            }
            else if (actionName == "getSize") {
                int result = cacheManager->getSize();
                logToFileAndConsole("getSize: " + std::to_string(result));
            }
            else if (actionName == "add") {
                int key = details["key"];
                DllNode* newDllNode = new DllNode(key, details["fullName"], details["address"], details["city"], details["state"], details["zip"]);
                cacheManager->add(key, newDllNode);
                logToFileAndConsole("add key to cacheManager: " + std::to_string(key));
            }
            else if (actionName == "remove") {
                int key = details["key"];
                cacheManager->remove(key);
                logToFileAndConsole("remove key: " + std::to_string(key) + " from cacheManager");
            }
            else if (actionName == "clear") {
                cacheManager->clear();
                logToFileAndConsole("clear cacheManager: ");
            }
            else if (actionName == "printInOrder") {
                bool ascending = true;
                std::string value = details["ascending"];
                if (value == "true") {
                    logToFileAndConsole("sort ascending cacheManager");
                }
                else {
                    ascending = false;
                    logToFileAndConsole("sort descending cacheManager");
                }

                cacheManager->sort(ascending);
            }
            else if (actionName == "printRange") {
                int lowValue = details["low"];
                int highValue = details["high"];

                logToFileAndConsole("printRange with low: " + std::to_string(lowValue) + " and high: " + std::to_string(highValue));
                cacheManager->printRange(lowValue, highValue);
            }
        }


    }

}

/**
*
* main
*
* main function which does the following:
*   read config file for input file, output file, error file, hash table size and FIFO size
*   create a hash table
*   for each of the test case
*       process test cases - display results to console and write to output file
*       print out the hash table
*       clear out hash table
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
    std::string inputFilePath = config["Milestone5"][0]["files"][0]["inputFile"];
    std::string outputFilePath = config["Milestone5"][0]["files"][0]["outputFile"];
    std::string errorFilePath = config["Milestone5"][0]["files"][0]["errorLogFile"];

    // Retrieve hash table size from the config file
    int HASH_SIZE = config["Milestone5"][0]["defaultVariables"][0]["hashTableSize"];

    // Retrieve FIFO list size from the config file
    int FIFO_SIZE = config["Milestone5"][0]["defaultVariables"][0]["FIFOListSize"];

    // create the cache manager
    CacheManager* cacheManager = new CacheManager(FIFO_SIZE, HASH_SIZE);

    // Load the JSON file
    std::ifstream inputFile(inputFilePath);
    if (!inputFile.is_open()) {
        std::cerr << "Failed to open the file: " << inputFilePath << ".\n";
        return 1;
    }

    // Open up the outfile and set the output file path using the setter
    //
    // Treating output file differently than input and config files because it's used in other files
    setOutFile(outputFilePath);

    // Get the output file
    std::ofstream& outFile = getOutFile();

    json data;
    inputFile >> data;

    // Process the test cases in the json file
    for (size_t i = 0; i < data["cacheManager"].size(); ++i) {
        const json& testCase = data["cacheManager"][i];
        for (json::const_iterator it = testCase.begin(); it != testCase.end(); ++it) {
            const std::string& testCaseName = it.key();
            const json& testCaseArray = it.value();
            processTestCase(cacheManager, testCaseName, testCaseArray);

            // print out the cache
            cacheManager->printCache();

            // print ascending cache
            cacheManager->sort(true);

            // print descending
            cacheManager->sort(false);

            // clear cache manager out for the next test case
            cacheManager->clear();
        }
    }

    // Close files
    configFile.close();
    inputFile.close();
    outFile.close();

    logToFileAndConsole("\n\nEnd of unit tests");
    return 0;
}
