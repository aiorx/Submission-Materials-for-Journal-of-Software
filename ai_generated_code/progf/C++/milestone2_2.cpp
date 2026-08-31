/**
*
* milestone2.cpp : This file contains the 'main' function. Program execution begins and ends there.
*
* 09/23/24 - Formed using common development resources with prompt "write C++ program reads and parses the file: milestone2_config.json"
*            The file: "milestones2_config.json" is in the following format:
*
                {
                    "Milestone2": [
                        {
                            "files": [
                                {
                                    "inputFile": "milestone2.json",
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

*/
#define _CRT_SECURE_NO_WARNINGS
#define CONFIG_FILE "milestone2_config.json"

#include <iostream>
#include <fstream>
#include <string>

#include "json.hpp"
#include "hash_table.h"

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
std::ofstream &getOutFile()
{
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
void setOutFile(const std::string &filePath)
{
    // Close the current file if it's already open
    if (_outFile.is_open())
    {
        _outFile.close();
    }

    // Open the new file
    _outFile.open(filePath);
    if (!_outFile.is_open())
    {
        std::cerr << "Failed to open file: " << filePath << std::endl;
    }
}

/**
 *
 * processTestCase
 *
 * function to proocess test cases, based upon test data in json format
 *
 * @param hashTable      the hashtable to store testcase values
 * @param testCaseName   the case name from json
 * @param testCaseArray  the case array from json
 *
 * @return: nothing, but output is sent to console and written to output file
 */
void processTestCase(HashTable *hashTable, const std::string &testCaseName, const json &testCaseArray)
{
    // Get the output file
    std::ofstream &outFile = getOutFile();

    std::cout << "Processing " << testCaseName << ":\n\n";
    outFile << "Processing " << testCaseName << ":\n\n";

    for (size_t i = 0; i < testCaseArray.size(); ++i)
    {
        const json &entry = testCaseArray[i];

        for (json::const_iterator it = entry.begin(); it != entry.end(); ++it)
        {
            const std::string &actionName = it.key();
            const json &details = it.value();

            if (actionName == "isEmpty")
            {
                bool result = hashTable->isEmpty();
                std::cout << "isEmpty: " << result << std::endl;
                outFile << "isEmpty: " << result << std::endl;
            }
            else if (actionName == "contains")
            {
                int key = details["key"];
                bool result = hashTable->contains(key);
                std::cout << "contains(" << key << "): " << result << std::endl;
                outFile << "contains(" << key << "): " << result << std::endl;
            }
            else if (actionName == "getNumberOfItems")
            {
                int result = hashTable->getNumberOfItems();
                std::cout << "getNumberOfItems: " << result << std::endl;
                outFile << "getNumberOfItems: " << result << std::endl;
            }
            else if (actionName == "add")
            {
                HashNode *newNode = new HashNode(details["key"], details["fullName"], details["address"], details["city"], details["state"], details["zip"]);
                hashTable->add(details["key"], newNode);
                std::cout << "add key: " << details["key"] << "\n";
                outFile << "add key: " << details["key"] << std::endl;
            }
            else if (actionName == "remove")
            {
                int key = details["key"];
                hashTable->remove(details["key"]);
                std::cout << "remove key: " << details["key"] << "\n";
                outFile << "remove key: " << details["key"] << std::endl;
            }
            else if (actionName == "clear")
            {
                hashTable->clear();
                std::cout << "clear hash table" << "\n";
                outFile << "clear hash table" << std::endl;
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
 * @param        none
 *
 * @return       nothing, but output is written to error file path
 */
int main()
{
    // Load the config file
    std::ifstream configFile(CONFIG_FILE);
    if (!configFile.is_open())
    {
        std::cerr << "Error opening config file!" << std::endl;
        return 1;
    }

    json config;
    configFile >> config;

    // Retrieve file paths from the config
    std::string inputFilePath = config["Milestone2"][0]["files"][0]["inputFile"];
    std::string outputFilePath = config["Milestone2"][0]["files"][0]["outputFile"];
    std::string errorFilePath = config["Milestone2"][0]["files"][0]["errorLogFile"];

    // Retrieve hash table size from the config
    int HASH_SIZE = config["Milestone2"][0]["defaultVariables"][0]["hashTableSize"];

    // create the hash table
    HashTable *hashTable = new HashTable(HASH_SIZE);

    // Load the JSON file
    std::ifstream inputFile(inputFilePath);
    if (!inputFile.is_open())
    {
        std::cerr << "Failed to open the file: " << inputFilePath << ".\n";
        return 1;
    }

    // Open up the outfile and set the output file path using the setter
    //
    // Treating output file differently than input and config files because it's used in other files
    setOutFile(outputFilePath);

    // Get the output file
    std::ofstream &outFile = getOutFile();

    json data;
    inputFile >> data;

    // Process the test cases in the json file
    for (size_t i = 0; i < data["hashTable"].size(); ++i)
    {
        const json &testCase = data["hashTable"][i];
        for (json::const_iterator it = testCase.begin(); it != testCase.end(); ++it)
        {
            const std::string &testCaseName = it.key();
            const json &testCaseArray = it.value();
            processTestCase(hashTable, testCaseName, testCaseArray);

            // print out the table
            std::cout << "\nPrinting the hash table:\n";
            hashTable->printTable();

            // clear hashTable out for the next test case
            hashTable->clear();
        }
    }

    // Close files
    configFile.close();
    inputFile.close();
    outFile.close();

    return 0;
}
