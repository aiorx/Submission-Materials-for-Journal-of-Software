//
//  1-test-driven-development.cpp
//  cpp-challenges
//
//  Created by Albany Patriawan on 7/23/24.
//

#include "1-test-driven-development.hpp"

void tdd::runTests() {
    vector<string> names;
    names.push_back("AlbanyPatriawan12");
    names.push_back("GamerTag12");
    names.push_back("Rammy4");
    vector<string> result = sortNames(names);
    
    assert(result[0] == "Rammy4");
    assert(result[1] == "AlbanyPatriawan12");
    assert(result[2] == "GamerTag12");
    
}
// Gets the index that separates the alphabetical chars at the start from the digits at the end
int getDivider(const std::string& n) {
    for (int i = n.size()-1; i >= 0; i --) {
        if (isalpha(n[i])) {
            return i + 1;
        }
    }
    throw "Expected string to contain an alphabetic character";
}

bool compareNames(string n1, string n2) {
    // Get the indices that separate the alphabetical chars at the start from the digits at the end
    int divider1 = getDivider(n1);
    int divider2 = getDivider(n2);
    
    // Extract numbers
    int num1 = stoi(n1.substr(divider1));
    int num2 = stoi(n2.substr(divider2));
    
    // Compare by numbers
    if (num2 == num1) {
        // Compare by alphabetical names
        // Extract alphabetical names and compare them
        string name1 = n1.substr(0, divider1);
        string name2 = n2.substr(0, divider2);
        
        return name1 <= name2;
    }
    
    // Name with smaller number goes first
    return num1 < num2;
}

/*
 (Assisted with basic coding tools)
 Problem:
   Write a C++ program that sorts a list of names in the format "NameNumber", where Name is a string of letters and Number is an integer appended at the end of the string. The names should be sorted by the integer number first, and then by the Name in ascending order.
 
   Input:
         "AlbanyPatriawan12"
         "GamerTag12"
         "Rammy4"
 
   Output:
         "Rammy4"
         "Albany Patriawan12"
         "GamerTag12"
*/

vector<string> tdd::sortNames(vector<string> names) {
    sort(names.begin(), names.end(), compareNames);
    return names;
};
