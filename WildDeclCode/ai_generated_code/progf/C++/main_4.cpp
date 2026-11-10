/* Program Name: main.cpp
*  Author: Kyle Ingersoll
*  Date last updated: 11/23/2024
*  Purpose: To create a recursive function that takes a parameter of a nonnegative integer and generates a pattern of stars. 
*           This program also prompts the user to enter the number of lines in the pattern and uses the recursive function to generate the pattern.
*/

#include <iostream>

// global constant 
const int RECURSIVEFUNCTIONNUMBEROFLINESLIMIT = 1000;

// function prototype
void recursiveStarPattern(int n);

int main()
{
    // initialize variables
    int numberOfLines;

    // prompt users to enter a nonnegative integer
    std::cout << "Enter the number of lines you want to see in the star pattern. Enter a nonnegative integer that is below 1000 to get your result, and a negative integer or above 1000 to end the program." << std::endl;
    std::cin >> numberOfLines;
    std::cout << std::endl;

    while ((numberOfLines >= 0) && (numberOfLines < RECURSIVEFUNCTIONNUMBEROFLINESLIMIT)) {
        if (!(std::cin)) {
            // clear buffer 
            std::cin.clear();
            std::cin.ignore(200, '\n');

            // prompt user on what is happening and set number of lines to 0
            std::cerr << "You did not enter in a integer, so setting user input to 0." << std::endl;
            numberOfLines = 0;
        }
        // begin recursive function
        recursiveStarPattern(numberOfLines);

        // prompt users to enter a nonnegative integer
        std::cout << "Enter the number of lines you want to see in the star pattern. Enter a nonnegative integer that is below 1000 to get your result, and a negative integer or above " << RECURSIVEFUNCTIONNUMBEROFLINESLIMIT << " to end the program." << std::endl;
        std::cin >> numberOfLines;
        std::cout << std::endl;
    }

    // end program normally
    return 0;
}

/* This recursive function takes an input of a nonnegative integer n and returns a star pattern going from n to 1 stars per line, and then from 1 to n stars per line.
*  Aided using common development resources. 
*/
void recursiveStarPattern(int n) {
   
    // Base case: if n is 0, return
    if (n == 0) {
        return;
    }

    // Print stars for the current row
    for (int i = 0; i < n; i++) {
        std::cout << "*";
    }
    std::cout << std::endl;

    // Recursive call for the decreasing pattern
    recursiveStarPattern(n - 1);

    // Print stars for the current row again (increasing pattern)
    for (int i = 0; i < n; i++) {
        std::cout << "*";
    }
    std::cout << std::endl;
    
}