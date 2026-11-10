#include "Matrix.h"
#include <string>
using namespace std;

//SUPPORTING FUNCTIONS FOR MATRIX PROCESSING 


void initMatrix(vector<vector<int>>& m1, int d) 
//PRE: Accepts a 2D Vector & valid integer for dimension
//POST: Initializes m1 to 0s;
//Creates a matrix of the same dimensions and fills it with zeros
//Pseudocode Aided using common development resources
/*
 * Procedure initializeMatrix(m1: 2D vector of integers, d: integer)
    m1.resize(d) // Resize the outer dimension of m1 to d
    For i = 0 to d - 1 do
        m1[i].resize(d) // Resize each row of m1 to d

        For j = 0 to d - 1 do
            m1[i][j] = 0 // Set each element of m1 to 0
        End For
    End For
End Procedure
 */
{
    m1.resize(d);
    for (int i = 0; i < d; ++i) {
        m1.at(i).resize(d);
    }
    for (int i = 0; i < d; i++) {
        for (int j = 0; j < d; j++) {
            m1.at(i).at(j) = 0;
            }
        }
}

//Did not use this function
/*
bool isDigit(string str)
//PRE: Accepts a string
//POST: returns '1' if all numeric, 0 otherwise
{
    std::cout << "CODE THIS\n";
    return true;
}
*/

vector<vector<int>> multMatrix(vector<vector<int>> m1, vector<vector<int>> m2, int d)
//PRE: Accepts 2 2-D square vectors & their dimension
//POST: returns the matrix of these vectors multiplied
// Already built. Performs matrix multiplication.
{
    vector<vector<int>> newT;
    initMatrix(newT, d);
    for (int i = 0; i < d; i++) {
        for (int j = 0; j < d; j++) {
            newT[i][j] = 0;
            for (int k = 0; k < d; k++) {
                newT[i][j] += m1[i][k] * m2[k][j];
            }
        }
    }
    return newT;
}

bool reflexive(vector<vector<int>>& m1, int d) 
//PRE: Accepts a 2-D Vector & valid integer dimension
//POST: returns '1' if all entries on the diagonal are '1', 0 otherwise
//Loops through rows in first loop
//Then loops through columns in second loop
//Checks to see if the diagonals are not 1
{
    for (int i = 0; i < d; i++) {
        if (m1.at(i).at(i) != 1) {
            return 0;
        }
    }
    return 1;
}

bool symmetric(vector<vector<int>>& m1, int d)
//PRE: Accepts a 2-D Vector & valid integer dimension
//POST: returns '0' if it finds values do not match on opposite sides of the diagonal match, 1 otherwise
//Loops through rows in first loop
//Then loops through columns in second loop
//Checks to see if a specific row and column in the matrix and the corresponding row and column on the opposite side is different
{
    for (int i = 0; i < d; i++) {
        for (int j = 0; j < d; j++) {
            if (m1.at(i).at(j) != m1.at(j).at(i)) {
                return 0;
            }
        }
    }
    return 1;
}

 
bool transitive(vector<vector<int>> m1, vector<vector<int>> p, int d)
//PRE:  Accepts a 2-D vector (m1), a second 2-D vector that is m1*m1, and the dimensions of these vectors (they are equal)
//POST: returns '1' if the vector is transitive, 0 if not
//      A matrix is NOT transitive if there is value in the squared matrix that is non-zero, but is 0 in original
//          (m1[i][j] == 0 && p[i][j] != 0)
//
//Loops through rows in first loop
//Then loops through columns in second loop
//Checks to see if the row and column in the original matrix is zero and if the corresponding row and column in the squared matrix is nonzero
{
    for (int i = 0; i < d; i++) {
        for (int j = 0; j < d; j++) {
            if ((m1.at(i).at(j) == 0) && (p.at(i).at(j) != 0)) {
                return 0;
            }
        }
    }
    return 1;
}

vector<vector<int>> transitiveClosure(vector<vector<int>> matrix, int d) {
    //Used CHATGPT to help build this section
    // Used CHATGPT to help create pseudocode
    /*
     * Create a copy of the input matrix and store it in a new matrix current
Create a new matrix Total and initialize it to all zeros using the initMatrix function

For each element (i, j) in the matrices current and Total:
    Add the corresponding elements from current to Total

For each power k from 1 to d - 1:
    Multiply the current matrix by the input matrix and store the result in current
    For each element (i, j) in the matrices current and Total:
        Add the corresponding elements from current to Total

    Output a newline
    Output "The result of the matrix to the power of " concatenated with k+1 and " is" and a newline
    Call printVector function to print the current matrix
    Output a newline

Output "The transitive closure is: "
Call printVector function to print the Total matrix
Return Total

     */
    vector<vector<int>> current = matrix;
    vector<vector<int>> Total;
    initMatrix(Total, d);
    for (int i = 0; i < d; i++) {
        for (int j = 0; j < d; j++) {
            Total.at(i).at(j) += current.at(i).at(j);
        }
    }
    for (int k = 1; k < d; k++) {
        current = multMatrix(current, matrix, d);
        for (int i = 0; i < d; i++) {
            for (int j = 0; j < d; j++) {
                Total.at(i).at(j) += current.at(i).at(j);
                }
            }
        cout << endl;
        cout << "The result of the matrix to the power of " << k+1 << " is" << endl;
        printVector(current, d);
        cout << endl;
        }
    cout << "The transitive closure is: " << endl;
    printVector(Total, d);
    return Total;
}

//FUNCTION DEFINITIONS

int loadMatrix(ifstream& inFile, vector<vector<int>>& m1, int& d, int& n)
//PRE:  pass input file opened and verified in main, a 2-D matrix (may not be cleared), 
//      the dimension of the new matrix, and current matrix number 
//POST: if the matrix is good (contains only 0s and 1s) - m1 is loaded and d & n are reset, returns a 1
//      if not good, it returns -1

//Psuedocode Aided using common development resources
/*
 * Output "\n\n***************************************************\n"
Output "\nPROCESSING MATRIX: " concatenated with n and "\n"
Output "\n\n***************************************************\n"
Read a line from inFile and store it in the variable line
Create an istringstream object iss and initialize it with the line

Initialize variables row to 0 and column to 0

Try:
    While there are more inputs in iss:
        Read the next input into the variable input
        Convert input to an integer and store it in the variable num using stoi function

        If num is equal to 0 or num is equal to 1:
            Assign num to the element at row and column in matrix m1
            Increment column by 1

            If column is greater than d - 1:
                Set column to 0
                Increment row by 1

        Else:
            Output "Input is not 0 or 1"
            Return -1

    Return 1

Catch any exceptions:
    Output "Input invalid for matrix invalid stoi argument"
    Return -1

 */
{
    cout << "\n\n***************************************************\n" << endl;
    cout << "\nPROCESSING MATRIX: " << n << "\n" << endl;
    cout << "\n\n***************************************************\n" << endl;
    string line;
    getline(inFile, line);
    istringstream iss(line);
    int row = 0;
    int column = 0;
    try {
        string input;
        while (iss >> input) { // CHATGPT suggestion
            int num = stoi(input);
            if ((num == 0) || (num == 1)) {
                m1.at(row).at(column) = num;
                column++;
                if (column > d-1) {
                    column = 0;
                    row++;
                }
            } else {
                cout << "Input is not 0 or 1" << endl;
                return -1;
            }
        }
        return 1;
    }
    catch (...) {
        cout << "Input invalid for matrix invalid stoi argument" << endl;
        return -1;
    }
}

void printVector(vector<vector<int>> m1, int d) {
    // Prints out all the numbers in the matrices
    //Loops through rows in first loop
    //Then loops through columns in second loop
    //Prints out number at specific row and column
    for (int i = 0; i < d; i++) {
        for (int j = 0; j < d; j++) {
            cout << m1.at(i).at(j) << "\t";
        }
        cout << endl;
    }
    return;
}

void processMatrix(vector<vector<int>>& matrix, int& dim, int n)
//PRE:  pass a valid 2-D matrix, the dimension of the matrix, and current matrix number 
//POST: will print if the matrix is reflexive, symmetric, transitive using functions above

//Pseudocode inspired and Aided using common development resources
//Code was inspired by CHATGPT and adapted for use
/*
 * // Output the current matrix
Output "The current matrix is:"
Call printVector(matrix, dim)
Output a newline

// Check if the matrix is reflexive
If reflexive(matrix, dim) equals 1:
    Output "The matrix is reflexive"
Else:
    Output "The matrix is not reflexive"

// Check if the matrix is symmetric
If symmetric(matrix, dim) equals 1:
    Output "The matrix is symmetric"
Else:
    Output "The matrix is not symmetric"

// Check if the matrix is transitive
If transitive(matrix, multMatrix(matrix, matrix, dim), dim) equals 1:
    Output "The matrix is transitive"
Else:
    Output "The matrix is not transitive"

Output a newline

// Compute the transitive closure matrix
transitiveClosureMatrix = transitiveClosure(matrix, dim)

// Prompt the user to check routes
Output "Would you like to check routes? (Y if so): "
Input user_again

// While the user wants to check routes
While user_again equals 'Y':
    Output a newline
    Output "Great! Enter values between 0 and " concatenated with dim - 1 and ':' and a newline
    Output "Enter the starting value: "
    Input starting_value
    Output "Enter the ending value: "
    Input ending_value

    // Check if there is a path between the starting and ending values
    If transitiveClosureMatrix[starting_value][ending_value] is not equal to 0:
        Output "There is a path between " concatenated with starting_value and " and " concatenated with ending_value and '!' and a newline
    Else:
        Output "There is not a path between " concatenated with starting_value and " and " concatenated with ending_value and '!' and a newline

    Output a newline
    Output "Would you like to try again (Y): "
    Input user_again

Output a newline

 */
{
    cout << "The current matrix is: " << endl;
    printVector(matrix, dim);
    cout << endl;
    //Checks Reflexive property
    if (reflexive(matrix, dim) == 1) {
        cout << "The matrix is reflexive" << endl;
    }
    else {
        cout << "The matrix is not reflexive" << endl;
    }
    //Checks symmetric property
    if (symmetric(matrix, dim) == 1) {
        cout << "The matrix is symmetric" << endl;
    }
    else {
        cout << "The matrix is not symmetric" << endl;
    }
    //Checks transitive property
    if (transitive(matrix, multMatrix(matrix, matrix, dim), dim) == 1) {
        cout << "The matrix is transitive" << endl;
    }
    else {
        cout << "The matrix is not transitive" << endl;
    }
    cout << endl;
    vector<vector<int>> transitiveClosureMatrix = transitiveClosure(matrix, dim);
    char user_again;
    // Verify path
    cout << "Would you like to check routes? (Y if so): ";
    cin >> user_again;
    while (user_again == 'Y') {
        cout << endl;
        cout << "Great! Enter values between 0 and " << dim - 1 << ':' << endl;
        cout << "Enter values between 0 and " << dim - 1 << ':' << endl;
        int starting_value;
        cout << "Enter the starting value: ";
        cin >> starting_value;
        int ending_value;
        cout << "Enter the ending value: ";
        cin >> ending_value;
        if (transitiveClosureMatrix.at(starting_value).at(ending_value) != 0) {
            cout << "There is a path between " << starting_value << " and " << ending_value << '!' << endl;
        } else {
            cout << "There is not a path between " << starting_value << " and " << ending_value << '!' << endl;
        }
        cout << endl;
        cout << "Would you like to try again (Y): ";
        cin >> user_again;
    }
    cout << endl;
}