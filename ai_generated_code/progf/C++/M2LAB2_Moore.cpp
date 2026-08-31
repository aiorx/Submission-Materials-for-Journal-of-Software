//M2LAB2 - Name and Birthday Compatibility
//CSC 134
//Formed using common GitHub development resources + James Moore
//2/14/2025

/*
What i asked the AI to do: 
I asked the AI to create a write me a program that will ask the user for their first name.
then ask for their birthday in dd/mm/yyyy format. If they type the format wrong, it will 
let them know and ask them to retype it. Then it will ask for the first name of someone 
that’s close to them. followed by their birthday again making sure the formats the same. 
Then the program will take each letter of their name and find the number value example a=1 b=2 c=3 
and so on then add them all together as a variable. Then it will take the numbers from their 
birthday and add those together example 02/01/1991 will be 02 + 01 + 1991 then adds the sum 
to the sum of the sum of the name. The program will set that as a total. Then it will do the 
same thing with the other person’s name and birthday. It will then take the biggest total and 
subtract the other total to get the difference and store it as difference. it will then print 
"Your value is (total) " then print " The other persons value is ( Total ) " replacing total 
with their totals. Finally print “the closer the totals the closer the relationship is”."
*/


#include <iostream>
#include <string>
#include <cctype>
#include <cmath>

using namespace std;

int getNameValue(const string& name) {
    int value = 0;
    for (char c : name) {
        if (isalpha(c)) {
            value += tolower(c) - 'a' + 1;
        }
    }
    return value;
}

int getBirthdayValue(const string& birthday) {
    int value = 0;
    string part;
    for (char c : birthday) {
        if (isdigit(c)) {
            part += c;
        } else if (c == '/') {
            value += stoi(part);
            part.clear();
        }
    }
    if (!part.empty()) {
        value += stoi(part);
    }
    return value;
}

bool isValidDate(const string& date) {
    if (date.length() != 10) return false;
    if (date[2] != '/' || date[5] != '/') return false;
    for (int i = 0; i < date.length(); ++i) {
        if (i != 2 && i != 5 && !isdigit(date[i])) return false;
    }
    return true;
}

int main() {
    // Declare variables to store user inputs
    string firstName, closePersonName, birthday, closePersonBirthday;

    // Prompt user for their first name
    cout << "Please enter your first name: ";
    cin >> firstName;

    // Prompt user for their birthday until a valid date is entered
    while (true) {
        cout << "Please enter your birthday (dd/mm/yyyy): ";
        cin >> birthday;
        if (isValidDate(birthday)) break;
        cout << "Invalid date format. Please try again." << endl;
    }

    // Prompt user for the first name of someone close to them
    cout << "Please enter the first name of someone close to you: ";
    cin >> closePersonName;

    // Prompt user for the close person's birthday until a valid date is entered
    while (true) {
        cout << "Please enter their birthday (dd/mm/yyyy): ";
        cin >> closePersonBirthday;
        if (isValidDate(closePersonBirthday)) break;
        cout << "Invalid date format. Please try again." << endl;
    }

    // Calculate the name and birthday values for the user
    int yourNameValue = getNameValue(firstName);
    int yourBirthdayValue = getBirthdayValue(birthday);
    int yourTotal = yourNameValue + yourBirthdayValue;

    // Calculate the name and birthday values for the close person
    int closePersonNameValue = getNameValue(closePersonName);
    int closePersonBirthdayValue = getBirthdayValue(closePersonBirthday);
    int closePersonTotal = closePersonNameValue + closePersonBirthdayValue;

    // Calculate the difference between the two totals
    int difference = abs(yourTotal - closePersonTotal);

    // Output the results
    cout << "Your value is " << yourTotal << endl;
    cout << "The other person's value is " << closePersonTotal << endl;
    cout << "The difference is " << difference << endl;
    cout << "The closer the totals, the closer the realationship." << endl;

    return 0;
}